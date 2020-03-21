import { action, observable, computed } from "mobx";
import api from "services";
import { Park, Factory, PMCode, PMValue, AlarmInfo, AllParkData, PollutionData } from "../../type";
import * as mapv from "mapv";
import { _ } from "utils/lodash";
import { utils } from "../../utils/index";
import moment from "moment";
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
  @observable currentPark = "0";
  @observable currentFactory = "0";
  @observable currentPmCode = "";

  @action.bound
  selectTab(key: string) {
    this.currentTabKey = key;
    this.clearOverlay();
  }

  @computed
  get curentFactorData() {
    return this.factories.find(i => i.id == this.currentFactory);
  }

  @computed
  get currentPmCodeData() {
    return this.pmcodes.find(i => i.pmCode == this.currentPmCode);
  }

  @observable parks: Array<Park> = [];
  @observable factories: Array<Factory> = [];
  @observable pmcodes: Array<PMCode> = [];
  @observable pmValues: Array<PMValue> = [];
  @observable curOverlays = [] as Array<any>;

  @observable alarms: Array<AlarmInfo> = [];
  @observable curParkData: AllParkData = {
    parkId: "",
    parkName: "",
    parkPoints: [],
    siteDatas: [],
    factoryDatas: []
  };
  @action.bound
  async loadAlarms() {
    const result = await api.MapMonitor.getUncheckedAlarmInformation();
    this.alarms = result.data;
  }

  @action.bound
  async doConfirmAlarmInfoById(alarmId) {
    const result = await api.MapMonitor.confirmAlarmInfoById({ alarmId: alarmId });
    if (result) {
      this.loadAlarms();
    }
  }

  @action.bound
  selectPark(parkId) {
    this.currentPark = parkId;
    if (parkId !== "0") {
      this.loadFactories({ parkId });
      this.loadParkData();
    }
  }

  @action.bound
  selectFactory(factoryId) {
    this.currentFactory = factoryId;
    if (factoryId !== "0") {
      this.loadPmCodes({ factoryId });
    }
  }

  @action.bound
  async selectPmcode(pmCode) {
    this.currentPmCode = pmCode;
    this.loadParkData();
  }

  @action.bound
  async loadParkData({ parkId, pmCode }: { parkId?: string; pmCode?: string } = { parkId: this.currentPark, pmCode: this.currentPmCode }) {
    const result = await api.MapMonitor.getMapInfoByPmCodeAndParkId({ parkId: Number(parkId), pmCode: this.currentPmCode });
    if (result.data) {
      this.curParkData = result.data;
      this.updateMap();
    }
  }

  @action.bound
  async loadPark() {
    const result = await api.MapMonitor.getParkList();
    this.parks = result.data;
    this.loadParkData();
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
  clearOverlay() {
    this.curOverlays.map(i => {
      if (i.destroy) {
        i.destroy();
      }
    });
  }

  // 污染分布
  @observable polltionDatas: Array<PollutionData> = [];
  @action.bound
  async loadPollition({ parkId, pmCode, timeStart, timeEnd }) {
    const res = await api.MapMonitor.getPollutantDistributionByPmCode({
      parkId,
      pmCode,
      timeStart: moment(timeStart).format("YYYY-MM-DD HH"),
      timeEnd: moment(timeEnd).format("YYYY-MM-DD HH")
    });
    this.polltionDatas = res.data;
    this.fillPollution();
  }

  @action.bound
  fillPollution() {
    this.clearOverlay();
    let data = [] as any;

    this.polltionDatas.forEach((i, index) => {
      if (index % 4) return;
      _.times(20, () => {
        data.push({
          geometry: {
            type: "Point",
            coordinates: [Number(i.longitude) - 0.0005 + Math.random() * 0.001, Number(i.latitude) - 0.0005 + Math.random() * 0.001]
          },
          count: 9999 * Math.random(),
          time: 1
        });
      });
    });
    const mapvLayer = new mapv.baiduMapLayer(this.map, new mapv.DataSet(data), {
      size: 20,
      gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
      max: 9999,
      // range: [0, 100], // 过滤显示数据范围
      // minOpacity: 0.2, // 热力图透明度
      // maxOpacity: 0.8,
      draw: "heatmap"
    });
    this.curOverlays.push(mapvLayer);
  }

  @action.bound
  draw() {
    this.pointsc.forEach((item, index) => {
      const pixel = this.map.pointToOverlayPixel(new BMap.Point(item.position.lng, item.position.lat));
      this.pointsc[index].mapPos.left = pixel.x - 15 + "px";
      this.pointsc[index].mapPos.top = pixel.y - 15 + "px";
    });
  }

  @action.bound
  updateMap() {
    if (!this.map) return;
    let mapViewObj = this.map.getViewport(utils.array.formatToLatLngShort(this.curParkData.parkPoints), {});
    this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom);
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.currentTarget;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });

      // this.fillPollution();
    } else {
      this.draw();
    }
  }
}
