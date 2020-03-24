import { observable, action } from "mobx";
import api from "services";
import { PMCode } from "../type";
import { globalConfig } from "../config";
import { POST } from "../utils/request";
import { _ } from "../utils/lodash";
import { store } from "./index";
export class ConfigStore {
  @observable baiduMapApiKey = "WR0KNr4UYumtXNOM9clX1Il6hHNngdTu";

  @observable pmTypes: { [key: string]: { id: string; label: string } } = {};
  @observable pmCodes: { [key: string]: PMCode[] } = {};
  @observable allPmCodes: Array<PMCode> = [];

  @action.bound
  async init() {
    await Promise.all([this.loadPmCode(), this.loadSysConfig()]);
  }

  @action.bound
  async loadPmCode() {
    const result = await api.PmCode.getAllPMTypeAndCode();
    const pmTypes = {};
    const pmCodes = {};
    let allPmCodes = [] as any;
    result.data.results.forEach(i => {
      const { id, label, pms } = i;
      pmTypes[id] = { id, label };
      pmCodes[id] = pms;
      allPmCodes = [...allPmCodes, ...pms];
    });
    this.pmCodes = pmCodes;
    this.pmTypes = pmTypes;
    this.allPmCodes = allPmCodes;
  }

  @observable sysParams = {
    qyjsc_refresh_period: {
      paramIntro: "企业驾驶舱刷新频率（单位/分钟）",
      paramValue: "4"
    },
    yqjsc_refresh_period: {
      paramIntro: "园区驾驶舱刷新频率（单位/分钟）",
      paramValue: "1"
    },
    lxwr_period: {
      paramIntro: "判断连续污染的时间间隔（单位/分钟）",
      paramValue: "3"
    }
  };

  enterpriseTimer: any = null;
  parkTimer: any = null;

  @action.bound
  async loadSysConfig() {
    clearInterval(this.enterpriseTimer);
    clearInterval(this.parkTimer);

    const res = await POST("/sys-param/getSysParamListPage", {
      current: 1,
      pageNo: 1,
      pageSize: 10,
      paramName: "",
      size: 20
    });
    if (res.data?.records) {
      this.sysParams = _.keyBy(res.data?.records, "paramCode") as any;
    }
    this.enterpriseTimer = setInterval(() => {
      store.screen.enterpriseScreenMap.reload();
    }, Math.max(Number(this.sysParams.qyjsc_refresh_period.paramValue), 1) * 1000 * 60);

    this.parkTimer = setInterval(() => {
      store.screen.parkScreenMap.reload();
    }, Math.max(Number(this.sysParams.yqjsc_refresh_period.paramValue), 1) * 1000 * 60);
  }
}
