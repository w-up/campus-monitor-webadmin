import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";

export class RuntimeData {
  @observable loading: boolean = false;
  @observable query: any = {
    current: 1,
    pageSize: 10,
    size: 10,
  };
  @observable total: number = 0;

  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable columns: any = [];
  @observable dataList: any = [];

  @action.bound
  async getAllSitesTree() {
    this.loading = true;
    try {
      const { data }: any = await GET("/device-site/getAllSitesTreeAndPMTypeLogin", {});
      if (data) {
        this.parkTree = data.pfsList || [];
        this.ptList = data.ptList || [];
      }
    } catch {}
    this.loading = false;
  }

  @action.bound
  paginationChange(page, pageSize) {
    this.query = {
      ...this.query,
      current: page,
      pageSize,
    };
    this.queryDatas(this.query);
  }

  @action.bound
  async queryDatas(param: any = {}) {
    this.loading = true;

    delete param.ptId;
    delete param.factoryId;
    delete param.parkId;

    Object.keys(param).forEach((key) => {
      if (param[key] === "" || param[key].length === 0) {
        delete param[key];
        delete this.query[key];
      }
    });

    this.query = {
      ...this.query,
      ...param,
    };

    try {
      const { data }: any = await POST("/device-data/getAllPMDataBySitesAndPMs", this.query);
      this.columns = data.titles.map((item, index) => {
        const config = { ...item, width: 150, key: item.titleKey, dataIndex: item.titleKey };
        if (index === 0) {
          config.fixed = "left";
          config.width = 150;
        }
        return config;
      });
      this.dataList = data.dataList.records.map((item, index) => ({ ...item, key: index }));

      this.total = data.dataList.total;
      this.query.size = data.dataList.size;
      this.query.current = data.dataList.current;
    } catch {}

    this.loading = false;
  }
}
