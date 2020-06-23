import { action, observable, computed, toJS } from "mobx";
import { ComplexCustomOverlay } from "../../pages/screen/EnterpriseScreen/customOverlay";
import api from "services";
import { SitlePMData, DailySewage } from "../../type";
import { _ } from "utils/lodash";
import { message, notification } from "antd";
import style from "../../common/mapStyle";
import auth from "services/auth";
import { store } from "../index";
import { result } from "lodash";

//@ts-ignore
const BMapGL = window.BMapGL;

export class EnterpriseScreenMapStore {
  @observable map: any = null;
  @observable center = new BMapGL.Point(116.384405, 39.9001);
  @observable zoom = 20;
  @observable heading = 50.5;
  @observable tilt = 53;
  overlays = [] as any;
  @observable activeFlag = true;
  @observable curSiteIndex = 0;

  @computed
  get curSiteData() {
    return this.SiteRuntimePmDate[this.curSiteIndex];
  }

  playTimer?: any;

  @action.bound
  async init() {
    this.boxDisplay = false;
    await Promise.all([this.loadAllFactory(), this.loadMapConfig(), this.loadAllPmCode(), this.loadSiteRuntimePmData(), this.loadDailySewage(), this.loadDailyGas(), this.loadHoursSewage()]);
  }

  @action.bound
  async reload() {
    if (!store.auth.token) return;
    this.dailySewage = {
      pms: [],
      dates: [],
    };
    this.curSiteRuntimeData = [];
    this.HoursSewage = {
      pms: [],
      dates: [],
    };
    this.dailyGas = [];
    this.init();
  }

  // 设置
  @observable boxDisplay = false;
  @action.bound
  toggleBox(value?: boolean) {
    this.boxDisplay = value ? value : !this.boxDisplay;
  }

  // 图表数据相关
  @observable SiteRuntimePmDate: Array<SitlePMData> = [];
  @computed
  get SiteRuntimePmDateForMap() {
    return this.SiteRuntimePmDate.map((v, i) => ({
      text: v.siteName,
      // update: "15:30:30",
      position: new BMapGL.Point(v.longitude, v.latitude),
      children: v.pmInfos
        ?.filter((i) => Number(i.collectValue) > 0)
        .map((pmInfo) => ({
          name: pmInfo.pmName,
          value: pmInfo.collectValue,
          unit: pmInfo.unit,
          limit: pmInfo.limit,
          collectDate: pmInfo.collectDate,
        })),
    }));
  }
  @action.bound
  async loadSiteRuntimePmData() {
    const result = await api.DeviceData.getAllPMDataLogin();
    this.SiteRuntimePmDate = result.data.sites || [];
    this.addpoints({ index: 0, update: true });
  }

  @observable HoursSewage: {
    pms: Array<DailySewage>;
    dates: Array<string>;
  } = {
    pms: [],
    dates: [],
  };
  @action.bound
  async loadHoursSewage() {
    const result = await api.DeviceData.getAllPM24HourDatasLogin({ pmType: 2 });
    let HoursSewage: EnterpriseScreenMapStore["HoursSewage"] = {
      pms: _.get(result, "data.pms", []) || [],
      dates: [],
    };
    if (HoursSewage.pms.length > 0) {
      HoursSewage.dates = HoursSewage.pms[0].datas.map((i) => i.time);
    }
    this.HoursSewage = HoursSewage;
  }

  @observable dailySewage: {
    pms: Array<DailySewage>;
    dates: Array<string>;
  } = {
    pms: [],
    dates: [],
  };
  @action.bound
  async loadDailySewage() {
    // const result = await api.DeviceData.get24HourDatas();
    const result = await api.DeviceData.getAllPM7DayDatasLogin({ pmType: 2 });
    let dailySewage: EnterpriseScreenMapStore["dailySewage"] = {
      pms: _.get(result, "data.pms", []) || [],
      dates: [],
    };
    if (dailySewage.pms.length > 0) {
      dailySewage.dates = dailySewage.pms[0].datas.map((i) => i.time);
    }
    this.dailySewage = dailySewage;
  }

  @observable dailyGas: Array<{
    pmCode: string;
    pmName: string;
    upperLimit: number;
    unit: string;
    sites: Array<{
      siteId: string;
      siteName: string;
      datas: Array<{
        collectValue: number;
        collectValueDe: string;
        collectValueIn: string;
        unit: string;
        time: string;
      }>;
    }>;
  }> = [];
  @action.bound
  async loadDailyGas() {
    const result = await api.DeviceData.getAllSitesPM7DayDatasByFactoryId({ pmType: 1 });
    this.dailyGas = result.data.pms || [];
  }

  // 厂区相关
  @observable allfactoriy: Array<{
    factoryId: string;
    factoryName: string;
    select: boolean;
  }> = [];
  @observable currentFactory = "";

  get currentFactoryData() {
    return this.allfactoriy.find((i) => i.factoryId == this.currentFactory);
  }

  @action.bound
  async loadAllFactory() {
    const res = await api.Factory.getAllFactoryLogin();
    if (res?.data) {
      this.allfactoriy = res.data;
      this.allfactoriy.forEach((i) => {
        if (i.select) {
          this.currentFactory = i.factoryId;
        }
      });
    }
  }

  @action.bound
  async selectFactory(factoryId) {
    this.currentFactory = factoryId;
  }

  @action.bound
  async saveSelectedFactory() {
    await api.Other.setSelectedFactory({ factoryId: this.currentFactory });
    notification.success({ message: "更新成功" });
    this.toggleBox();
    this.reload();
  }

  // 因子相关
  @observable allPmCode: {
    water: Array<{
      pmCode: string;
      pmName: string;
      isSelected: boolean;
    }>;
    gas: Array<{
      pmCode: string;
      pmName: string;
      isSelected: boolean;
    }>;
  } = {
    water: [],
    gas: [],
  };

  @observable selectedPmCodes = [];
  @action.bound
  async loadAllPmCode() {
    const result = await api.DevicePM.getAllPMsByFactoryId();
    this.allPmCode = result.data || {};
    const selectedPmCodes = [] as any;
    Object.values(this.allPmCode).forEach((datas) => {
      datas?.forEach((i) => {
        if (i.isSelected) {
          selectedPmCodes.push(i.pmCode);
        }
      });
    });
    this.selectedPmCodes = selectedPmCodes;
  }

  @action.bound
  async selectPmCode(data) {
    this.selectedPmCodes = data;
  }

  @action.bound
  async saveSelectedPmCodes() {
    await api.DevicePM.setFactorySelectedPM({ pmCodes: this.selectedPmCodes });
    notification.success({ message: "更新成功" });
    this.toggleBox();
    this.reload();
  }

  // 地图设置相关
  @observable curMapConfig = {
    highAngle: 0,
    latitude: 0,
    longitude: 0,
    rotationAngle: 0,
    picUrl: "",
    pic: undefined as FormData | undefined,
    zoom: 15,
  };
  @observable companyLog = "";
  @action.bound
  async loadMapConfig() {
    const result = await api.MapConfig.getMapConfigLogin();
    if (!result || !result.data) return;
    this.curMapConfig = result.data
      ? result.data
      : {
          highAngle: 0,
          latitude: 0,
          longitude: 0,
          rotationAngle: 0,
          picUrl: "",
          pic: undefined as FormData | undefined,
          zoom: 15,
        };
    this.companyLog = result.data.companyLog;
    this.updateMap({
      center: new BMapGL.Point(this.curMapConfig.longitude, this.curMapConfig.latitude),
      heading: this.curMapConfig.highAngle,
      zoom: this.curMapConfig.zoom,
      tilt: this.curMapConfig.rotationAngle,
    });
  }

  @action.bound
  async saveMapConfig() {
    const { highAngle, latitude, longitude, rotationAngle, zoom, pic } = this.curMapConfig;
    const result = await api.MapConfig.updateMapConfig({
      highAngle,
      latitude,
      longitude,
      rotationAngle,
      zoom,
      pic,
    });
    this.reload();
  }

  @action.bound
  async delMapConfig() {
    const result = await api.MapConfig.deleteMapConfig();
    const code = _.get(result, "code", "");
    if (result && code == 20000) {
      this.curMapConfig.picUrl = "";
      // this.reload();
    }
  }

  // 地图相关
  @action.bound
  initMap() {
    this.map = new BMapGL.Map("allmap", {
      style: { styleJson: style },
    }); // 创建Map实例
    this.map.disableDragging();
    this.map.disableScrollWheelZoom();
    console.log(this.map);
    this.map.disableDoubleClickZoom();
    this.map.disablePinchToZoom();
    this.map.disableContinuousZoom();
    this.map.disableDragging();
    this.updateMap();
  }

  @action.bound
  updateMap(data: Partial<EnterpriseScreenMapStore> = {}) {
    if (!this.map) return;
    if (data) {
      Object.assign(this, data);
    }

    this.map.centerAndZoom(this.center, this.zoom); // 初始化地图,设置中心点坐标和地图级别
    this.map.setHeading(this.tilt); //俯视角度
    this.map.setTilt(this.heading); //旋转角度

    setTimeout(() => {
      if (!this.map) return;
      this.addpoints({ index: 0, update: true }); //添加站点覆盖物
      this.play();
    }, 1000);
  }

  @observable curSiteRuntimeData: Array<DailySewage> = [];

  @action.bound
  async addpoints({ index, update }: { index: number; update?: boolean }) {
    if (!this.map) return;

    if (update) {
      const nextSite = this.SiteRuntimePmDate[index];
      if (nextSite) {
        const res = await api.DeviceData.getAllPM24HourDatasBySiteId({ siteId: nextSite.siteId });
        if (res.data?.pms) {
          this.curSiteRuntimeData = res.data.pms.filter((i) => i.datas[0]?.collectValue !== null);
        }
      }
    }
    console.log(this.overlays);
    for (let x in this.overlays) {
      this.map?.removeOverlay(this.overlays[x]);
    }

    this.curSiteIndex = index;
    this.overlays = [];
    this.SiteRuntimePmDateForMap.forEach((v, i) => {
      const myCompOverlay = new ComplexCustomOverlay(v.position, v, i, this, { showDetail: true });
      this.overlays.push(myCompOverlay);
      this.map?.addOverlay(myCompOverlay);
    });
  }

  @action.bound
  play() {
    clearInterval(this.playTimer);
    this.playInterval();
    this.playTimer = setInterval(async () => {
      if (!this.map) clearInterval(this.playTimer);
      this.playInterval();
    }, 10000);
  }

  @action.bound
  playInterval() {
    this.addpoints({
      index: this.curSiteIndex >= this.SiteRuntimePmDateForMap.length - 1 ? 0 : this.curSiteIndex + 1,
      update: true,
    });
  }

  // 设置
  @observable modalVisibility = false;
  @observable modalShowType = 1;
  @action.bound
  toggleModal(type: number, value?: boolean) {
    this.modalVisibility = value ? value : !this.modalVisibility;
    this.modalShowType = type;
  }
}
