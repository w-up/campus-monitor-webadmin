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
    result.data.results.forEach((i) => {
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
      paramValue: "4",
    },
    yqjsc_refresh_period: {
      paramIntro: "园区驾驶舱刷新频率（单位/分钟）",
      paramValue: "1",
    },
    lxwr_period: {
      paramIntro: "判断连续污染的时间间隔（单位/分钟）",
      paramValue: "3",
    },
    point_size: {
      paramIntro: "污染分布方块大小（20~40）",
      paramValue: "20",
    },
    bottom_color: {
      paramIntro: "污染分布园区填充色（16进制值）",
      paramValue: "#00FF00",
    },
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
      size: 20,
    });
    if (res.data?.records) {
      this.sysParams = _.keyBy(res.data?.records, "paramCode") as any;
    }
  }
}
