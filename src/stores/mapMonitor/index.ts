import { action, observable, computed, toJS } from "mobx";
import api from "services";
import { Park, Factory, PMCode, PMValue, AlarmInfo, AllParkData, PollutionData, SiteData } from "../../type";
import * as mapv from "mapv";
import { _ } from "utils/lodash";
import { utils } from "../../utils/index";
import moment from "moment";
import { store } from "../index";
import { message, notification } from "antd";
//@ts-ignore
const kriging = window.kriging;

export class MapMonitorStore {
  //@ts-ignore
  @observable map: BMap.Map = null;
  @observable center = { lng: 120.983642, lat: 31.36556 };
  @observable zoom = 16;
  @observable polygonPath = [];
  @observable compamys = [];
  @observable offset = {
    width: 0,
    height: -20,
  };

  @action.bound
  async init() {
    await this.loadPark();
    await this.loadFactories({});
    await this.loadPmCodes({});
    this.loadParkData();
  }

  @observable currentTabKey = "";
  @observable currentPark = "0";
  @observable currentFactory = "0";
  @observable currentPmCode = "0";

  @action.bound
  selectTab(key: string) {
    this.currentTabKey = key;
    this.clearOverlay();
  }

  @computed
  get curentFactorData() {
    return this.factories.find((i) => i.id == this.currentFactory);
  }

  @computed
  get currentPmCodeData() {
    return this.pmcodes.find((i) => i.pmCode == this.currentPmCode);
  }

  @computed
  get currentParkData() {
    return this.parks.find((i) => i.id === this.currentPark);
  }

  @observable parks: Array<Park> = [];
  @observable factories: Array<Factory> = [];
  @observable pmcodes: Array<PMCode> = [];
  @observable pmValues: Array<PMValue> = [];
  @observable curOverlays = [] as Array<any>;

  @observable alarms: Array<AlarmInfo> = [];
  @observable curParkData: Array<AllParkData> = [];
  @action.bound
  async loadAlarms() {
    const result = await api.MapMonitor.getUncheckedAlarmInformation();
    this.alarms = result.data;
  }

  @action.bound
  async doConfirmAlarmInfoById(data: { alarmId: string; isFromPopup?: number }) {
    const result = await api.MapMonitor.confirmAlarmInfoById(data);
    if (result) {
      message.success("处理成功");
      // this.loadAlarms();
    }
  }

  @action.bound
  async selectPark(parkId) {
    this.currentPark = parkId;
    await this.loadFactories({ parkId });
    await this.loadPmCodes({});
    await this.loadParkData();
  }

  @action.bound
  async selectParkAndLoadPmcode(parkId) {
    await this.selectPark(parkId);
    const res = await api.MapMonitor.getPmCodeListByParkId({ parkId });
    if (res.data) {
      this.pmcodes = res.data;
      this.checkPmcode();
    }
  }

  @action.bound
  checkPmcode() {
    if (this.pmcodes[0]?.pmCode) {
      this.currentPmCode = this.pmcodes[0].pmCode;
    } else {
      this.currentPmCode = "0";
    }
  }

  @observable curSiteId = null;
  @observable siteData: SiteData | null = null;

  @action.bound
  async setCurrentRuntimeSite(siteId) {
    this.siteData = null;
    this.curSiteId = siteId;
    const res = await api.MapMonitor.getSiteMonitorDataById({ siteId });
    if (res.data) {
      this.siteData = res.data;
    }
  }

  @action.bound
  selectFactory(factoryId) {
    this.currentFactory = factoryId;
    this.loadPmCodes({ factoryId });
  }

  @action.bound
  async selectPmcode(pmCode) {
    this.currentPmCode = pmCode;
    this.loadParkData();
  }

  @action.bound
  async loadParkData({ parkId, pmCode }: { parkId: string; pmCode?: string } = { parkId: this.currentPark, pmCode: this.currentPmCode }) {
    // if (this.map) { this.map.clearOverlays() }
    const result = await api.MapMonitor.getMapInfoByPmCodeAndParkId({ parkId, pmCode: this.currentPmCode });
    if (result.data) {
      this.curParkData = result.data;
      this.updateMap();
    }
  }

  @action.bound
  async loadPark() {
    const [parkRes] = await Promise.all([api.MapMonitor.getParkList()]);
    if (parkRes?.data) {
      this.parks = parkRes.data;
      if (this.parks[0]?.id) {
        this.currentPark = this.parks[0].id;
      } else {
        this.currentPark = "0";
      }
    }

    // this.factories = factoryRes.data;
    // this.pmcodes = pmCodesRes.data;
    // this.currentPmCode = this.pmcodes[0].pmCode;
  }
  @action.bound
  async loadSitePmValueList() {
    const result = await api.MapMonitor.getSitePmValueList({ pmCode: this.currentPmCode, parkId: this.currentPark, factoryId: this.currentFactory });
    this.pmValues = result.data;
  }

  async loadFactories({ parkId = this.currentPark }: { parkId?: any }) {
    console.log({ parkId });
    const result = await api.MapMonitor.getFactoryList({
      parkId,
    });
    if (result?.data) {
      this.factories = result.data;
      if (this.factories[0]?.id) {
        this.currentFactory = this.factories[0].id;
      } else {
        this.currentFactory = "0";
      }
    }
  }

  async loadPmCodes({ factoryId = this.currentFactory }: { factoryId?: any }) {
    const res = await api.MapMonitor.getPmCodeList({
      parkId: this.currentPark,
      factoryId,
    });
    if (res) {
      this.pmcodes = res.data;
      this.checkPmcode();
    }
  }

  @action.bound
  clearOverlay() {
    this.curOverlays.map((i) => {
      if (i.destroy) {
        i.destroy();
      }
    });
  }

  // 污染分布
  @observable polltionDatas: PollutionData = {
    center: [],
    colors: [],
    coord: [],
    lats: [],
    lngs: [],
    times: [],
    values: [],
  };
  @observable currentTime = 0;
  @observable mapvLayer = null as any;
  @action.bound
  async loadPollition({ timeStart, timeEnd }) {
    const res = await api.MapMonitor.getPollutantDistributionByPmCode({
      parkId: this.currentPark,
      pmCode: this.currentPmCode,
      timeStart: moment(timeStart).format("YYYY-MM-DD HH"),
      timeEnd: moment(timeEnd).format("YYYY-MM-DD HH"),
    });
    if (res.data?.times) {
      this.polltionDatas = res.data;
      setTimeout(() => {
        this.setCurrentTime(0);
      }, 1000);
    }
  }

  @observable playPollutionTimer = 0 as any;
  @action.bound
  togglePlayPollution(val?: boolean) {
    if (this.playPollutionTimer || val == false) {
      clearInterval(this.playPollutionTimer);
      return (this.playPollutionTimer = 0);
    }

    this.playPollutionTimer = setInterval(() => {
      this.setCurrentTime(this.currentTime + 1);
    }, 1000);
  }

  @action.bound
  setCurrentTime(val: number, opt?: { stop: boolean }) {
    if (val >= this.polltionDatas.times.length) {
      this.currentTime = 0;
    } else {
      this.currentTime = val;
    }
    if (opt?.stop) {
      this.togglePlayPollution(false);
    }
    this.fillPollution();
  }

  @computed
  get maxTime() {
    return this.polltionDatas.times?.length;
  }

  @action.bound
  fillPollution() {
    this.clearOverlay();
    if (!this.polltionDatas) return;
    const { center, colors, coord, lats, lngs, times, values } = toJS(this.polltionDatas);
    console.log(coord);
    store.map.krigingMap.trainAndReDrawKriging({ coord, lats: lats[this.currentTime], lngs: lngs[this.currentTime], values: values[this.currentTime], colors: colors[this.currentTime] });
  }

  @action.bound
  draw() {
    // this.pointsc.forEach((item, index) => {
    //   const pixel = this.map.pointToOverlayPixel(new BMap.Point(item.position.lng, item.position.lat));
    //   this.pointsc[index].mapPos.left = pixel.x - 15 + "px";
    //   this.pointsc[index].mapPos.top = pixel.y - 15 + "px";
    // });
  }

  @action.bound
  updateMap() {
    const [curParkdata] = this.curParkData;
    if (this.map) {
      if (!curParkdata) return;
      let mapViewObj = this.map.getViewport(utils.array.formatToLatLngShort(curParkdata.parkPoints), {});
      this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom);
    }
    const krigingMap = store.map.krigingMap;
    if (krigingMap.map && curParkdata) {
      const center = this.currentParkData?.center;
      if (!center) return;
      krigingMap.handleParkChange({ parkCenter: center });
      krigingMap.renderSite();
      // let coord: any = [[]];
      // let lngs: any = [];
      // let lats: any = [];
      // curParkdata.parkPoints.forEach((i) => {
      //   coord[0].push([Number(i.longitude), Number(i.latitude)]);
      //   lngs.push(Number(i.longitude));
      //   lats.push(Number(i.latitude));
      // });
      // console.log({ coord, lngs, lats });
      // krigingMap.trainAndReDrawKriging({
      //   coord,
      //   lats,
      //   lngs,
      //   values: [0, 100, 200, 400],
      // });
    }
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.currentTarget;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });
      console.log(123);

      // this.fillPollution();
      this.updateMap();
    } else {
      // this.draw();
    }
  }
}
