import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";

export class RuntimeData {
  @observable loading: boolean = false;
  @observable query: any = {
    current: 1,
    pageSize: 10
  };
  @observable parkTree: any = [];
  @observable ptList: any = [];


  @action.bound
  async getAllSitesTree() {
    this.loading = true;
    try {
      const { data }: any = await GET('/device-site/getAllSitesTreeAndPMTypeLogin', {});
      this.parkTree = data.pfsList;
      this.ptList = data.ptList;
    } catch {

    }

    this.loading = false;

  }

  @action.bound
  async queryDatas(param) {
    this.loading = true;

    try {
      const { data }: any = await POST('/device-data/getAllPMDataBySitesAndPMs', {
        ...param,
        current: this.query.current,
        pageNo: this.query.current,
        pageSize: this.query.pageSize,
        size: this.query.pageSize,
      });
    } catch {

    }
    
    this.loading = false;
  }
}
