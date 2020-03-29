import { action, observable, computed } from "mobx";
import * as geolib from "geolib";
import { utils } from "../../utils/index";
import api from "services";
import { Factory, PMCode, AllParkData, Park, DynamicSourceData } from "../../type";

export class DynamicSourceStore {
  //@ts-ignore
  @observable map: BMap.Map = null;
  @observable center = { lng: 120.983642, lat: 31.36556 };
  @observable zoom = 17;
  @observable computeType: "1" | "2" | "3" = "1";

  @computed
  get polyCenter(): ReturnType<typeof geolib.getCenterOfBounds> {
    //@ts-ignore
    const result = geolib.getCenterOfBounds(utils.array.formatToLatLngLong(this.polygonPath));
    return result;
  }
  @observable offset = {
    width: 0,
    height: -20
  };

  //init
  @action.bound
  async init() {
    await Promise.all([this.loadPark(), this.loadParkData()]);
  }

  @observable curPoint = {
    lng: 0,
    lat: 0
  };

  @observable currentPark = "0";
  @observable currentTabKey = "";
  @observable currentFactory = "0";
  @observable currentPmCode = "0";

  @observable parks: Array<Park> = [];
  @observable factories: Array<Factory> = [];
  @observable pmcodes: Array<PMCode> = [];
  @observable curParkData: Array<AllParkData> = [];

  @action.bound
  async loadPark() {
    const [parkRes, factoryRes, pmCodesRes] = await Promise.all([api.MapMonitor.getParkList(), api.MapMonitor.getFactoryListAll(), api.MapMonitor.getPmCodeListAll()]);
    this.parks = parkRes.data;
    this.factories = factoryRes.data;
    this.pmcodes = pmCodesRes.data;
    this.currentPmCode = this.pmcodes[0].pmCode;
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
  selectPark(parkId) {
    this.currentPark = parkId;
    if (parkId !== "0") {
      this.loadParkData();
    }
  }

  @action.bound
  async selectPmcode(pmCode) {
    this.currentPmCode = pmCode;
    this.loadParkData();
  }

  // 计算数据
  @observable DynamicSourceContribution: {
    index: number;
    data: Array<DynamicSourceData>;
    timer: any;
  } = {
    index: 0,
    data: [],
    timer: 0
  };
  @observable DynamicSourceWindRose: {
    index: number;
    data: Array<DynamicSourceData>;
    timer: any;
  } = {
    index: 0,
    data: [],
    timer: 0
  };
  @observable DynamicSourceTraceSource: {
    index: number;
    data: Array<DynamicSourceData>;
    timer: any;
  } = {
    index: 0,
    data: [],
    timer: 0
  };

  @computed
  get curDynamicSourceContribution() {
    return this.DynamicSourceContribution.data[this.DynamicSourceContribution.index];
  }
  @computed
  get curDynamicSourceWindRose() {
    return this.DynamicSourceWindRose.data[this.DynamicSourceTraceSource.index];
  }
  @computed
  get curDynamicSourceTraceSource() {
    return this.DynamicSourceTraceSource.data[this.DynamicSourceTraceSource.index];
  }

  @observable playPollutionTimer = 0 as any;
  @action.bound
  toggleTimer(opt: { target: { data: Array<any>; index: number; timer: any }; val?: boolean }) {
    if (opt.target.timer || opt.val == false) {
      clearInterval(opt.target.timer);
      return (opt.target.timer = 0);
    }

    opt.target.timer = setInterval(() => {
      this.setCurrentTime({ ...opt, val: opt.target.index + 1 });
    }, 1000);
  }

  @action.bound
  setCurrentTime(opt: { stop?: boolean; val: number; target: { data: Array<any>; index: number; timer: any } }) {
    if (opt.val >= opt.target.data.length) {
      opt.target.index = 0;
    } else {
      opt.target.index = opt.val;
    }
    if (opt.stop) {
      this.toggleTimer({ ...opt, val: false });
    }
  }

  // 绘制相关
  @observable arrows = [] as any;
  @observable arrowLine = [] as any;

  @action.bound
  fillArrow() {
    this.arrows.forEach(i => this.map.removeOverlay(i));
    this.arrowLine.forEach(i => this.map.removeOverlay(i));
  }

  @action.bound
  updateMap() {
    if (!this.map || !this.curParkData[0]) return;
    let mapViewObj = this.map.getViewport(utils.array.formatToLatLngShort(this.curParkData[0].parkPoints), {});
    this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom);
  }

  addArrow(polyline, length, angleValue) {
    //繪制箭頭的函數
    var linePoint = polyline.getPath(); //線的坐標串
    var arrowCount = linePoint.length;
    for (var i = 1; i < arrowCount; i++) {
      //在拐點處繪制箭頭
      var pixelStart = this.map.pointToPixel(linePoint[i - 1]);
      var pixelEnd = this.map.pointToPixel(linePoint[i]);
      var angle = angleValue; //箭頭和主線的夾角
      var r = length; // r/Math.sin(angle)代表箭頭長度
      var delta = 0; //主線斜率，垂直時無斜率
      var param = 0; //代碼簡潔考慮
      var pixelTemX, pixelTemY; //臨時點坐標
      var pixelX, pixelY, pixelX1, pixelY1; //箭頭兩個點
      if (pixelEnd.x - pixelStart.x == 0) {
        //斜率不存在是時
        pixelTemX = pixelEnd.x;
        if (pixelEnd.y > pixelStart.y) {
          pixelTemY = pixelEnd.y - r;
        } else {
          pixelTemY = pixelEnd.y + r;
        }
        //已知直角三角形兩個點坐標及其中一個角，求另外一個點坐標算法
        pixelX = pixelTemX - r * Math.tan(angle);
        pixelX1 = pixelTemX + r * Math.tan(angle);
        pixelY = pixelY1 = pixelTemY;
      } //斜率存在時
      else {
        delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
        param = Math.sqrt(delta * delta + 1);

        if (pixelEnd.x - pixelStart.x < 0) {
          //第二、三象限
          pixelTemX = pixelEnd.x + r / param;
          pixelTemY = pixelEnd.y + (delta * r) / param;
        } //第一、四象限
        else {
          pixelTemX = pixelEnd.x - r / param;
          pixelTemY = pixelEnd.y - (delta * r) / param;
        }
        //已知直角三角形兩個點坐標及其中一個角，求另外一個點坐標算法
        pixelX = pixelTemX + (Math.tan(angle) * r * delta) / param;
        pixelY = pixelTemY - (Math.tan(angle) * r) / param;

        pixelX1 = pixelTemX - (Math.tan(angle) * r * delta) / param;
        pixelY1 = pixelTemY + (Math.tan(angle) * r) / param;
      }
      var pointArrow = this.map.pixelToPoint(new BMap.Pixel(pixelX, pixelY));
      var pointArrow1 = this.map.pixelToPoint(new BMap.Pixel(pixelX1, pixelY1));
      var Arrow = new BMap.Polyline([pointArrow, linePoint[i], pointArrow1], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1 });
      this.map.addOverlay(Arrow);
      this.arrows.push(Arrow);
    }
  }

  @action.bound
  onMapClick(e) {
    const point = e.point;
    this.curPoint = point;
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.target;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });
    } else {
      // this.fillArrow();
    }
  }
}
