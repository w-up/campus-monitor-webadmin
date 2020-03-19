import { observable, action } from "mobx";
import api from "services";
import { PMCode } from "../type";
import { globalConfig } from "../config";
export class ConfigStore {
  @observable baiduMapApiKey = "WR0KNr4UYumtXNOM9clX1Il6hHNngdTu";

  @observable pmTypes: { [key: string]: { id: string; label: string } } = {};
  @observable pmCodes: { [key: string]: PMCode[] } = {};
  @observable allPmCodes: Array<PMCode> = [];

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
}
