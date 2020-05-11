import { action, observable, computed } from "mobx";
import api from "services";
import { message } from "antd";
import { allSiteRes, Tree, ConcernSiteData, AllParkData, PMValue, PMCode } from "../../type";
import { _ } from "utils/lodash";
import * as geolib from "geolib";
import { utils } from "../../utils/index";
import { store } from "../index";

export class ParkScreenMapStore {
  //@ts-ignore
  @observable map: BMap.Map = null;
  @observable center = { lng: 120.983642, lat: 31.36556 };
  @observable zoom = 16;
  @observable polygonPath = [
    { lng: 120.990022, lat: 31.3717 },
    { lng: 120.970045, lat: 31.3702 },
    { lng: 120.981034, lat: 31.3616 },
  ];
  @observable compamys = [
    [
      { lng: 120.985022, lat: 31.3687 },
      { lng: 120.985022, lat: 31.3681 },
      { lng: 120.985612, lat: 31.3681 },
      { lng: 120.985612, lat: 31.3687 },
    ],
    [
      { lng: 120.983022, lat: 31.3657 },
      { lng: 120.983022, lat: 31.3651 },
      { lng: 120.983612, lat: 31.3651 },
      { lng: 120.983612, lat: 31.3657 },
    ],
    [
      { lng: 120.980022, lat: 31.3657 },
      { lng: 120.980022, lat: 31.3651 },
      { lng: 120.980612, lat: 31.3651 },
      { lng: 120.980612, lat: 31.3657 },
    ],
    [
      { lng: 120.980022, lat: 31.3687 },
      { lng: 120.980022, lat: 31.3681 },
      { lng: 120.980612, lat: 31.3681 },
      { lng: 120.980612, lat: 31.3687 },
    ],
  ];
  @observable offset = {
    width: 0,
    height: -20,
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
    { position: { lng: 120.980682, lat: 31.36813 }, mapPos: { left: "254px", top: "156px" }, number: 22 },
  ];
  @observable compname = [
    { position: { lng: 120.985022, lat: 31.3687 }, name: "化工西北" },
    { position: { lng: 120.983022, lat: 31.3657 }, name: "长润发" },
    { position: { lng: 120.980022, lat: 31.3657 }, name: "群力化工" },
  ];
  @observable gasData = [] as any;
  @observable waterData = [] as any;
  @observable allSites: Tree = [];
  @observable allParks: Array<{
    id: string;
    parkNo: string;
    parkName: string;
    remark: string;
    selected: boolean;
  }> = [] as any;

  @computed
  get curSelectedPark() {
    return this.allParks.find((i) => i.selected);
  }

  // 初始化
  @action.bound
  async init() {
    const [{ data: gasData }, { data: waterData }, allSiteResult, { data: allParks }] = await Promise.all([
      api.DeviceData.getFactoryPMByParkId({ type: "1" }),
      api.DeviceData.getFactoryPMByParkId({ type: "2" }),
      api.DeviceSite.getAllSitesByParkId(),
      api.Park.getAllParksSelect(),
      this.loadPmCode(),
    ]);

    if (this.currentPmCode) {
      this.loadConcernSiteData(this.currentPmCode);
    }

    const _allSite: allSiteRes = allSiteResult.data || [];
    const allSites = _allSite?.map((i) => ({
      title: i.companyName,
      key: `company-${i.companyId}`,
      children: i.factorys
        ? i.factorys.map((factory) => ({
            key: `factory-${factory.factoryId}`,
            title: factory.factoryName,
            children: factory.sites
              ? factory.sites.map((site) => ({
                  key: site.siteId,
                  title: site.siteName,
                  selected: site.concern,
                }))
              : [],
          }))
        : [],
    }));

    Object.assign(this, {
      gasData,
      waterData,
      allSites,
      allParks,
    });
    let selectedSites: string[] = [];
    this.allSites.forEach((park) => {
      park.children?.forEach((factory) => {
        factory.children?.forEach((i) => {
          if (i.selected) {
            selectedSites.push(i.key);
          }
        });
      });
    });
    this.selectedSites = selectedSites;
    allParks.forEach((i) => {
      if (i.selected) {
        this.currentPark = i.id;
      }
    });
  }

  @observable pmTypes: { [key: string]: { id: string; label: string } } = {};
  @observable pmCodes: { [key: string]: PMCode[] } = {};
  @observable allPmCodes: Array<PMCode> = [];

  // pmcode
  @action.bound
  async loadPmCode() {
    const result = await api.PmCode.getAllPMTypeAndCode();
    const pmTypes = {};
    const pmCodes = {};
    let allPmCodes = [] as any;
    if (result && result.data) {
      result.data.results.forEach((i) => {
        const { id, label, pms } = i;
        pmTypes[id] = { id, label };
        pmCodes[id] = pms;
        allPmCodes = [...allPmCodes, ...pms];
      });
      this.pmCodes = pmCodes;
      this.pmTypes = pmTypes;
      this.allPmCodes = allPmCodes;
      this.currentPmType = Object.values(this.pmTypes)[0].id;
      this.currentPmCode = this.currentPmcodes[0]?.pmCode;

      this.loadConcernSiteData(this.currentPmCode);
    }
  }

  @action.bound
  reload() {
    if (!store.auth.token) return;
    this.init();
  }

  // 监测面板
  @observable currentPmCode = "";
  @observable currentPmType = "";
  @observable _currentPmCode = "";
  @observable _currentPmType = "";
  @observable allConcernSiteData: Array<ConcernSiteData> = [];
  @observable allParkMapData: AllParkData = {
    parkId: "",
    parkName: "",
    parkPoints: [],
    siteDatas: [],
    factoryDatas: [],
  };
  @observable dailyData: {
    siteId: string;
    points: Array<{
      collectValueDe: string;
      collectValueIn: string;
      collectValue: number;
      time: string;
      unit: string;
    }>;
    unit: string;
    upperLimit: string;
  } = {
    siteId: "",
    points: [],
    unit: "",
    upperLimit: "",
  };
  @observable currentSiteId = "";
  @computed
  get currentSite() {
    return this.allParkMapData.siteDatas?.find((i) => i.siteId == this.currentSiteId);
  }

  @computed
  get curPmValue() {
    return this.allPmCodes.find((i) => i.pmCode == this.currentPmCode);
  }
  @computed
  get _curPmValue() {
    return this.allPmCodes.find((i) => i.pmCode == this._currentPmCode);
  }

  @computed
  get currentPmcodes() {
    if (this.currentPmType == "") {
      return this.allPmCodes || [];
    } else {
      return this.pmCodes[this.currentPmType] || [];
    }
  }

  @action.bound
  setCurrentPmCode(currentPmCode: string) {
    this.currentPmCode = currentPmCode;
  }
  @action.bound
  setCurrentPmType(currentPmType: string) {
    this.currentPmType = currentPmType;
  }
  @action.bound
  setCurrentSite(site: string) {
    this.currentSiteId = site;
    this.loadDadilyData();
  }
  @action.bound
  async loadConcernSiteData(pmCode: string) {
    this.currentPmCode = pmCode;
    this._currentPmCode = this.currentPmCode;
    const [convernData, parkMapData] = await Promise.all([api.DeviceData.getConcernSiteData({ pmCode }), api.DeviceData.getParkMapData({ pmCode })]);
    Object.assign(this, {
      allConcernSiteData: convernData.data,
      allParkMapData: parkMapData.data,
    });
    this.updateMap();
    if (this.allParkMapData.siteDatas?.length > 0) {
      this.currentSiteId = this.allParkMapData.siteDatas[0].siteId;
    }
    await this.loadDadilyData();
  }
  @action.bound
  async loadDadilyData() {
    if (!this.currentSiteId) return;
    const result = await api.DeviceData.get24HourDatas({ pmCode: this.currentPmCode, siteId: this.currentSiteId });
    this.dailyData = {
      siteId: "",
      points: [],
      unit: "",
      upperLimit: "",
    };
    if (result.data) {
      this.dailyData = result.data;
    }
  }

  // 设置面板
  @observable boxDisplay = false;
  @action.bound
  toggleBox(value?: boolean) {
    this.boxDisplay = value ? value : !this.boxDisplay;
  }

  //厂区相关
  @observable currentPark = 0;
  @action.bound
  async selectFactory(factoryId) {
    this.currentPark = factoryId;
  }
  @action.bound
  async saveSelectedFactory() {
    await api.Other.setSelectedPark({ parkId: this.currentPark });
    message.success("更新成功");
    this.toggleBox();
    this.reload();
  }

  //站点相关
  @observable selectedSites: string[] = [];
  @action.bound
  async saveSelectedSites(siteIds: string[]) {
    await api.Other.addConcernSite({ parkId: this.currentPark, siteIds });
    message.success("更新成功");
    this.toggleBox();
    this.reload();
  }

  //地图相关
  @action.bound
  draw() {
    // for (let x in this.pointsc) {
    //   const pixel = this.map.pointToOverlayPixel(new BMap.Point(this.pointsc[x].position.lng, this.pointsc[x].position.lat));
    //   this.pointsc[x].mapPos.left = pixel.x - 15 + "px";
    //   this.pointsc[x].mapPos.top = pixel.y - 15 + "px";
    // }
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.target;

      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });
      this.updateMap();
    } else {
      // this.draw();
    }
  }

  @action.bound
  updateMap() {
    if (!this.map || !this.allParkMapData.parkPoints) return;
    let mapViewObj = this.map.getViewport(utils.array.formatToLatLngShort(this.allParkMapData.parkPoints) || [], {});
    this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom);
  }
}
