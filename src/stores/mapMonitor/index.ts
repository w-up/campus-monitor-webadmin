import { action, observable } from "mobx";
import api from "services";
import { store } from "../index";
import { Park, Factory, PMCode, PMValue } from "../../type";
import { CanvasOverlay } from "./canvasOverlay";
import * as mapv from "mapv";
import times from "lodash/times";
import { _ } from "utils/lodash";
//@ts-ignore
const kriging = window.kriging;

export class MapMonitorStore {
  //@ts-ignore
  @observable map: BMap.Map = null;
  @observable center = { lng: 120.983642, lat: 31.36556 };
  @observable zoom = 16;
  @observable polygonPath = [
    { lng: 120.990022, lat: 31.3717 },
    { lng: 120.970045, lat: 31.3702 },
    { lng: 120.981034, lat: 31.3616 }
  ];
  @observable compamys = [
    [
      { lng: 120.985022, lat: 31.3687 },
      { lng: 120.985022, lat: 31.3681 },
      { lng: 120.985612, lat: 31.3681 },
      { lng: 120.985612, lat: 31.3687 }
    ],
    [
      { lng: 120.983022, lat: 31.3657 },
      { lng: 120.983022, lat: 31.3651 },
      { lng: 120.983612, lat: 31.3651 },
      { lng: 120.983612, lat: 31.3657 }
    ],
    [
      { lng: 120.980022, lat: 31.3657 },
      { lng: 120.980022, lat: 31.3651 },
      { lng: 120.980612, lat: 31.3651 },
      { lng: 120.980612, lat: 31.3657 }
    ],
    [
      { lng: 120.980022, lat: 31.3687 },
      { lng: 120.980022, lat: 31.3681 },
      { lng: 120.980612, lat: 31.3681 },
      { lng: 120.980612, lat: 31.3687 }
    ]
  ];
  @observable offset = {
    width: 0,
    height: -20
  };
  @observable pointsc = [
    { position: { lng: 120.985072, lat: 31.3681 }, mapPos: { left: "376px", top: "157px" }, number: 123 },
    { position: { lng: 120.985622, lat: 31.3683 }, mapPos: { left: "392px", top: "150px" }, number: 23 },
    { position: { lng: 120.985642, lat: 31.3682 }, mapPos: { left: "392px", top: "153px" }, number: 12 },
    { position: { lng: 120.983022, lat: 31.3659 }, mapPos: { left: "319px", top: "228px" }, number: 23 },
    { position: { lng: 120.983032, lat: 31.36556 }, mapPos: { left: "320px", top: "239px" }, number: 12 },
    { position: { lng: 120.983642, lat: 31.36513 }, mapPos: { left: "337px", top: "253px" }, number: 34 },
    { position: { lng: 120.983612, lat: 31.36523 }, mapPos: { left: "336px", top: "250px" }, number: 23 },
    { position: { lng: 120.980092, lat: 31.36588 }, mapPos: { left: "238px", top: "229px" }, number: 34 },
    { position: { lng: 120.980022, lat: 31.36543 }, mapPos: { left: "236px", top: "243px" }, number: 23 },
    { position: { lng: 120.980632, lat: 31.3653 }, mapPos: { left: "253px", top: "247px" }, number: 12 },
    { position: { lng: 120.980642, lat: 31.3654 }, mapPos: { left: "253px", top: "244px" }, number: 23 },
    { position: { lng: 120.980072, lat: 31.36865 }, mapPos: { left: "237px", top: "139px" }, number: 43 },
    { position: { lng: 120.980022, lat: 31.36856 }, mapPos: { left: "236px", top: "142px" }, number: 11 },
    { position: { lng: 120.980682, lat: 31.36813 }, mapPos: { left: "254px", top: "156px" }, number: 22 }
  ];
  @observable compname = [
    { position: { lng: 120.985022, lat: 31.3687 }, name: "化工西北" },
    { position: { lng: 120.983022, lat: 31.3657 }, name: "长润发" },
    { position: { lng: 120.980022, lat: 31.3657 }, name: "群力化工" }
  ];

  @observable currentTabKey = "";
  @observable currentPark = "all";
  @observable currentFactory = "all";
  @observable currentPmCode = "";

  @observable parks: Array<Park> = [];
  @observable factories: Array<Factory> = [];
  @observable pmcodes: Array<PMCode> = [];
  @observable pmValues: Array<PMValue> = [];

  @action.bound
  selectPark(parkId) {
    this.currentPark = parkId;
    if (parkId !== "all") {
      this.loadFactories({ parkId });
    }
  }

  @action.bound
  selectFactory(factoryId) {
    this.currentFactory = factoryId;
    if (factoryId !== "all") {
      this.loadPmCodes({ factoryId });
    }
  }

  @action.bound
  selectPmcode(pmCode) {
    this.currentPmCode = pmCode;
  }

  @action.bound
  async loadPark() {
    const result = await api.MapMonitor.getParkList();
    this.parks = result.data;
  }
  @action.bound
  async loadSitePmValueList() {
    const result = await api.MapMonitor.getSitePmValueList({ pmCode: this.currentPmCode });
    this.pmValues = result.data;
  }

  async loadFactories({ parkId }: { parkId: any }) {
    const result = await api.MapMonitor.getFactoryList({
      parkId: Number(parkId)
    });
    this.factories = result.data;
  }

  async loadPmCodes({ factoryId }: { factoryId: any }) {
    const result = await api.MapMonitor.getPmCodeList({
      factoryId: Number(factoryId)
    });
    this.pmcodes = result.data;
  }

  @action.bound
  fillPollution() {
    let data = [] as any;
    this.pointsc.forEach((i, index) => {
      if (index % 4) return;
      _.times(20, () => {
        data.push({
          geometry: {
            type: "Point",
            coordinates: [i.position.lng - 0.001 + Math.random() * 0.002, i.position.lat - 0.001 + Math.random() * 0.002]
          },
          count: 50 * Math.random() + i.number / 10,
          time: 100 * Math.random()
        });
      });
    });
    const mapvLayer = new mapv.baiduMapLayer(this.map, new mapv.DataSet(data), {
      size: 13,
      gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
      max: 60,
      // range: [0, 100], // 过滤显示数据范围
      // minOpacity: 0.2, // 热力图透明度
      // maxOpacity: 0.8,
      draw: "heatmap"
    });
  }

  // @action.bound
  // fillKriging() {
  //   let values = [] as any,
  //     lngs = [] as any,
  //     lats = [] as any;
  //   const gridPath = [this.polygonPath.map(i => [i.lng, i.lat])];
  //   this.pointsc.forEach(i => {
  //     values.push(i.number);
  //     lngs.push(i.position.lng);
  //     lats.push(i.position.lat);
  //   });
  //   const params = {
  //     model: "exponential", //'gaussian','spherical',
  //     colors: ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf", "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"]
  //   };
  //   const variogram = kriging.train(values, lngs, lats, params.model, 0, 100);
  //   const grid = kriging.grid(gridPath.slice(), variogram, 100);
  //   let canvas;
  //   const canvasOverlay = new BMap.CanvasLayer({ update });
  //   function update() {
  //     //@ts-ignore
  //     kriging.plot(this.canvas, grid, [100.220276, 200.476929], [10.737915, 100.965698], params.colors);
  //     console.log(variogram);
  //   }
  //   this.map.addOverlay(canvasOverlay);
  // }

  @action.bound
  draw() {
    this.pointsc.forEach((item, index) => {
      const pixel = this.map.pointToOverlayPixel(new BMap.Point(item.position.lng, item.position.lat));
      this.pointsc[index].mapPos.left = pixel.x - 15 + "px";
      this.pointsc[index].mapPos.top = pixel.y - 15 + "px";
    });
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.currentTarget;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });

      this.fillPollution();
    } else {
      this.draw();
    }
  }
}
