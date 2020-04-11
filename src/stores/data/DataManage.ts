import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";

export class DataManage {
  @observable loading: boolean = false;

  @observable query: any = {
    current: 1,
    pageSize: 10,
  };
  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable dataSource: any = [];
  @observable deviceList: any = [];

  @observable total: number = 0;

  @action.bound
  async getCheckDataList(param) {
    Object.keys(param).forEach((key) => {
      if (!param[key]) {
        delete param[key];
      }
    });
    this.query = {
      ...this.query,
      ...param,
    };
    this.loading = true;

    const newParam = {
      ...this.query,
      current: this.query.current,
      pageNo: this.query.current,
      pageSize: this.query.pageSize,
      size: this.query.pageSize,
    };

    try {
      const { data }: any = await POST("/dataAdd/getDataAddByPageBySelf", newParam);

      this.total = data.total;
      this.query.pageSize = data.size;
      this.query.current = data.current;
      this.dataSource = data.records;
    } catch {}

    this.loading = false;
  }

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
  async getDevice(siteId) {
    try {
      const { data }: any = await GET("/dataAdd/getDevice", { siteId });
      this.deviceList = data;
    } catch {}
  }

  @action.bound
  async deleteById(id) {
    this.loading = true;
    try {
      await POST("/dataAdd/deleteById", { id });
    } catch {}

    this.loading = false;
  }
}
