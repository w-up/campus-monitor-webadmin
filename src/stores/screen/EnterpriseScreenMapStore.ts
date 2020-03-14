import { action, observable } from "mobx";
import { ComplexCustomOverlay } from "../../pages/screen/EnterpriseScreen/customOverlay";
import api from "services";
import { SitlePMData, DailySewage } from "../../type";
import keyBy from "lodash/keyBy";
import { _ } from "utils/lodash";
import { message, notification } from "antd";
import { store } from "../index";
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
  @observable curIndex = 0;

  playTimer?: any;

  @action.bound
  async init() {
    await Promise.all([this.loadAllFactory(), this.loadMapConfig(), this.loadAllPmCode()]);
    await this.loadSiteRuntimePmData();
    await this.loadDailySewage();
    await this.loadDailyGas();
    await this.loadHoursSewage();
  }

  @observable boxDisplay = false;
  @action.bound
  toggleBox(value?: boolean) {
    this.boxDisplay = value ? value : !this.boxDisplay;
  }

  @observable SiteRuntimePmDate: Array<SitlePMData> = [];
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
    // const result = await api.DeviceData.get24HourDatas();
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

  @observable allfactoriy: Array<{
    factoryId: string;
    factoryName: string;
    select: boolean;
  }> = [];
  @observable currentFactory = "";

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
    // await api.Other.setSelectedFactory({ factoryId });
    this.currentFactory = factoryId;
  }

  @action.bound
  async saveSelectedFactory() {
    await api.Other.setSelectedFactory({ factoryId: this.currentFactory });
    notification.success({ message: "更新成功" });
    this.toggleBox();
  }

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
      datas.forEach(i => {
        if (i.isSelected) {
          selectedPmCodes.push(i.pmCode);
        }
      });
    });
    console.log(this.allPmCode);
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
  }

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
  }

  @action.bound
  async saveMapConfig() {
    const { highAngle, latitude, longitude, rotationAngle, zoom, pic } = this.curMapConfig;
    const result = await api.MapConfig.updateMapConfig(
      _.pickBy({
        highAngle,
        latitude,
        longitude,
        rotationAngle,
        zoom,
        pic
      })
    );
  }

  @action.bound
  addpoints(index: number) {
    if (!this.map) return;
    for (let x in this.overlays) {
      this.map.removeOverlay(this.overlays[x]);
    }
    this.curIndex = index;
    this.overlays = [];
    for (let x in this.lists) {
      const myCompOverlay = new ComplexCustomOverlay(new BMapGL.Point(this.lists[x].position[0], this.lists[x].position[1]), this.lists[x], x, this);
      this.overlays.push(myCompOverlay);
      this.map.addOverlay(myCompOverlay);
    }
  }

  @action.bound
  play() {
    clearInterval(this.playTimer);
    this.playTimer = setInterval(() => {
      this.addpoints(this.curIndex >= this.lists.length - 1 ? 0 : this.curIndex + 1);
    }, 5000);
  }

  lists = [
    {
      class: "dnj",
      text: "东南角",
      update: "15:30:30",
      position: [116.384405, 39.9001],
      children: [
        { name: "非甲烷总经", value: "111ppm", display: "true" },
        { name: "苯乙烯", value: "200ppm", display: "true" },
        { name: "H2S", value: "111ppm", display: "true" },
        { name: "NH3", value: "111ppm", display: "true" },
        { name: "Test", value: "111ppm", display: "true" }
        // {name:"非甲烷总经",value:"111ppm",display:"true"},
        // {name:"苯乙烯",value:"200ppm",display:"true"},
        // {name:"H2S",value:"111ppm",display:"true"},
        // {name:"NH3",value:"111ppm",display:"true"}
      ]
    },
    {
      class: "dbj",
      text: "东北角",
      update: "15:30:30",
      position: [116.384305, 39.9011],
      children: [
        { name: "非甲烷总经", value: "111ppm", display: "true" },
        { name: "苯乙烯", value: "200ppm", display: "true" },
        { name: "H2S", value: "111ppm", display: "true" },
        { name: "NH3", value: "111ppm", display: "true" },
        { name: "Test", value: "111ppm", display: "true" }
        // {name:"非甲烷总经",value:"111ppm",display:"true"},
        // {name:"苯乙烯",value:"200ppm",display:"true"},
        // {name:"H2S",value:"111ppm",display:"true"},
        // {name:"NH3",value:"111ppm",display:"true"}
      ]
    },
    {
      class: "xbj",
      text: "西北角",
      update: "15:30:30",
      position: [116.383805, 39.9005],
      children: [
        { name: "非甲烷总经", value: "111ppm", display: "true" },
        { name: "苯乙烯", value: "200ppm", display: "true" },
        { name: "H2S", value: "111ppm", display: "true" },
        { name: "NH3", value: "111ppm", display: "true" },
        { name: "Test", value: "111ppm", display: "true" }
        // {name:"非甲烷总经",value:"111ppm",display:"true"},
        // {name:"苯乙烯",value:"200ppm",display:"true"},
        // {name:"H2S",value:"111ppm",display:"true"},
        // {name:"NH3",value:"111ppm",display:"true"}
      ]
    },
    {
      class: "xnj",
      text: "西南角",
      update: "15:30:30",
      position: [116.383305, 39.9001],
      children: [
        { name: "非甲烷总经", value: "111ppm", display: "true" },
        { name: "苯乙烯", value: "200ppm", display: "true" },
        { name: "H2S", value: "111ppm", display: "true" },
        { name: "NH3", value: "111ppm", display: "true" },
        { name: "Test", value: "111ppm", display: "true" }
        // {name:"非甲烷总经",value:"111ppm",display:"true"},
        // {name:"苯乙烯",value:"200ppm",display:"true"},
        // {name:"H2S",value:"111ppm",display:"true"},
        // {name:"NH3",value:"111ppm",display:"true"}
      ]
    }
  ];
}
