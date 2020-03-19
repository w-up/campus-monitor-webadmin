import { action, observable, computed } from "mobx";
import { ComplexCustomOverlay } from "../../pages/screen/EnterpriseScreen/customOverlay";
import api from "services";
import { SitlePMData, DailySewage } from "../../type";
import keyBy from "lodash/keyBy";
import { _ } from "utils/lodash";
import { message, notification } from "antd";
import { store } from "../index";
import style from "../../common/mapStyle";
import ExampleMap from "../../assets/img/ps23ab282a19d8effb-a4e4-48b5-98dd-2e7d611be405.png";
import { utils } from "../../utils/index";

//@ts-ignore
const BMapGL = window.BMapGL;

export class EnterpriseScreenMapStore {
  @observable map: any = null;
  @observable center = new BMapGL.Point(116.384405, 39.9001);
  @observable zoom = 20;
  @observable heading = 50.5;
  @observable tilt = 53;
  @observable overlays = [] as any;
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
    await Promise.all([this.loadAllFactory(), this.loadMapConfig(), this.loadAllPmCode()]);
    await this.loadSiteRuntimePmData();
    await this.loadDailySewage();
    await this.loadDailyGas();
    await this.loadHoursSewage();
  }

  @action.bound
  async reload() {
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
      children: v.pmInfos.map(pmInfo => ({
        name: pmInfo.pmName,
        value: pmInfo.collectValue + pmInfo.unit,
        limit: pmInfo.limit
      }))
    }));
  }
  @action.bound
  async loadSiteRuntimePmData() {
    const result = await api.DeviceData.getAllPMDataLogin();
    this.SiteRuntimePmDate = result.data.sites || [];
  }

  @observable HoursSewage: {
    pms: Array<DailySewage>;
    dates: Array<string>;
  } = {
    pms: [],
    dates: []
  };
  @action.bound
  async loadHoursSewage() {
    const result = await api.DeviceData.getAllPM24HourDatasLogin({ pmType: 2 });
    let HoursSewage: EnterpriseScreenMapStore["HoursSewage"] = {
      pms: _.get(result, "data.pms", []) || [],
      dates: []
    };
    if (HoursSewage.pms.length > 0) {
      HoursSewage.dates = HoursSewage.pms[0].datas.map(i => i.time);
    }
    this.HoursSewage = HoursSewage;
  }

  @observable dailySewage: {
    pms: Array<DailySewage>;
    dates: Array<string>;
  } = {
    pms: [],
    dates: []
  };
  @action.bound
  async loadDailySewage() {
    // const result = await api.DeviceData.get24HourDatas();
    const result = await api.DeviceData.getAllPM7DayDatasLogin({ pmType: 2 });
    let dailySewage: EnterpriseScreenMapStore["dailySewage"] = {
      pms: _.get(result, "data.pms", []) || [],
      dates: []
    };
    if (dailySewage.pms.length > 0) {
      dailySewage.dates = dailySewage.pms[0].datas.map(i => i.time);
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
    return this.allfactoriy.find(i => i.factoryId == this.currentFactory);
  }

  @action.bound
  async loadAllFactory() {
    const result = await api.Factory.getAllFactoryLogin();
    this.allfactoriy = result.data;
    this.allfactoriy.forEach(i => {
      if (i.select) {
        this.currentFactory = i.factoryId;
      }
    });
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
    gas: []
  };

  @observable selectedPmCodes = [];
  @action.bound
  async loadAllPmCode() {
    const result = await api.DevicePM.getAllPMsByFactoryId();
    this.allPmCode = result.data || {};
    const selectedPmCodes = [] as any;
    Object.values(this.allPmCode).forEach(datas => {
      datas?.forEach(i => {
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
    zoom: 15
  };
  @action.bound
  async loadMapConfig() {
    const result = await api.MapConfig.getMapConfigLogin();
    this.curMapConfig = result.data;
    this.updateMap({
      center: new BMapGL.Point(this.curMapConfig.longitude, this.curMapConfig.latitude),
      heading: this.curMapConfig.highAngle,
      zoom: this.curMapConfig.zoom,
      tilt: this.curMapConfig.rotationAngle
    });
  }

  @action.bound
  async saveMapConfig() {
    const { highAngle, latitude, longitude, rotationAngle, zoom, pic } = this.curMapConfig;
    const result = await api.MapConfig.updateMapConfig(
      //@ts-ignore
      _.pickBy({
        highAngle,
        latitude,
        longitude,
        rotationAngle,
        zoom,
        pic
      })
    );
    this.reload();
  }

  // 地图相关
  @action.bound
  initMap() {
    this.map = new BMapGL.Map("allmap", {
      style: { styleJson: style }
    }); // 创建Map实例
    this.map.disableDragging();
    this.map.disableScrollWheelZoom();
    this.updateMap();
  }

  @action.bound
  updateMap(data: Partial<EnterpriseScreenMapStore> = {}) {
    if (data) {
      Object.assign(this, data);
    }
    console.log(this);

    this.map.centerAndZoom(this.center, this.zoom); // 初始化地图,设置中心点坐标和地图级别
    this.map.setHeading(this.heading); //俯视角度
    this.map.setTilt(this.tilt); //旋转角度

    setTimeout(() => {
      if (!this.map) return;
      this.addpoints(0); //添加站点覆盖物
      this.play();
    }, 100);

    // setTimeout(() => {
    //   if (!this.map) return;

    //   // @observable center = new BMapGL.Point(116.384405, 39.9001)
    //   // let SW = new BMapGL.Point(116.38179 , 39.900146);
    //   let SW = new BMapGL.Point(Number(this.curMapConfig.longitude) - 0.002615, Number(this.curMapConfig.latitude) + 0.000046);
    //   let NE = new BMapGL.Point(Number(this.curMapConfig.longitude) + 0.00005, Number(this.curMapConfig.latitude) + 0.001046);
    //   // let NE = new BMapGL.Point(116.384451, 39.901146);
    //   console.log({ SW, NE }, this.curSiteData);
    //   let groundOverlayOptions = {
    //     displayOnMinLevel: 1,
    //     displayOnMaxLevel: 999,
    //     imageURL: utils.img.getImageUrl(this.curMapConfig.picUrl)
    //   };
    //   // const bound = this.map.getBounds();
    //   // console.log(bound);
    //   // 初始化GroundOverlay
    //   let groundOverlay = new BMapGL.GroundOverlay(new BMapGL.Bounds(SW, NE), groundOverlayOptions);
    //   this.map.addOverlay(groundOverlay); //添加图片覆盖物
    // }, 1000);
  }

  @action.bound
  addpoints(index: number) {
    if (!this.map) return;
    for (let x in this.overlays) {
      this.map.removeOverlay(this.overlays[x]);
    }
    this.curSiteIndex = index;
    this.overlays = [];
    this.SiteRuntimePmDateForMap.forEach((v, i) => {
      const myCompOverlay = new ComplexCustomOverlay(v.position, v, i, this);
      this.overlays.push(myCompOverlay);
      this.map.addOverlay(myCompOverlay);
    });
  }

  @action.bound
  play() {
    clearInterval(this.playTimer);
    this.playTimer = setInterval(() => {
      this.addpoints(this.curSiteIndex >= this.SiteRuntimePmDateForMap.length - 1 ? 0 : this.curSiteIndex + 1);
    }, 5000);
  }
}
