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
    height: -20,
  };

  //init
  @action.bound
  async init() {
    await Promise.all([this.loadPark(), this.loadPmCodes({})]);
    await this.loadParkData();
  }

  @observable curPoint: {
    lng: number | string;
    lat: number | string;
    siteName: null | string;
  } = {
    lng: 0,
    lat: 0,
    siteName: null,
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
    const [parkRes] = await Promise.all([api.MapMonitor.getParkListByUser(), this.loadPmCodes({})]);
    if (parkRes.data) {
      this.parks = parkRes.data;
    }
  }

  async loadPmCodes({ parkId = this.currentPark }: { parkId?: any }) {
    const res = await api.MapMonitor.getPmCodeList({
      factoryId: "0",
      parkId,
    });
    if (res.data) {
      this.pmcodes = res.data;
      if (this.currentPmCode == "0") {
        this.currentPmCode = this.pmcodes[0].pmCode;
      }
    }
  }

  @action.bound
  async loadParkData({ parkId, pmCode }: { parkId: string; pmCode?: string } = { parkId: this.currentPark, pmCode: this.currentPmCode }) {
    const result = await api.MapMonitor.getMapInfoByPmCodeAndParkId({ parkId, pmCode: this.currentPmCode });
    if (result.data) {
      this.curParkData = result.data;
      const site = this.curParkData[0]?.siteDatas[0];
      if (!this.curPoint.siteName && !!site) {
        this.setCurPoint({ lng: Number(site.gpsX), lat: Number(site.gpsY), siteName: "null" });
      }
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
    timer: 0,
  };
  @observable DynamicSourceWindRose: {
    index: number;
    data: Array<{
      datetime: string;
      valueList: Array<{
        device_id: string;
        lat: string;
        lng: string;
        roseData: Array<string>;
      }>;
    }>;
    timer: any;
  } = {
    index: 0,
    data: [],
    timer: 0,
  };
  @observable DynamicSourceTraceSource: {
    index: number;
    data: Array<DynamicSourceData>;
    timer: any;
  } = {
    index: 0,
    data: [],
    timer: 0,
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
    this.arrows.forEach((i) => this.map.removeOverlay(i));
    this.arrowLine.forEach((i) => this.map.removeOverlay(i));
  }

  @action.bound
  updateMap() {
    if (!this.map || !this.curParkData[0]) return;
    let mapViewObj = this.map.getViewport(utils.array.formatToLatLngShort(this.curParkData[0].parkPoints), {});
    this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom);
  }

  @action.bound
  setCurPoint(point: DynamicSourceStore["curPoint"]) {
    this.curPoint = point;
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.target;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });
      this.updateMap();
    } else {
      // this.fillArrow();
    }
  }
}
