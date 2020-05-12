import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from "moment";

export class DataAudit {
  @observable loading: boolean = false;

  @observable query: any = {
    current: 1,
    pageSize: 10,
  };
  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable dataSource: any = [];
  @observable total: number = 0;

  @action.bound
  async getSitesList(factoryId) {
    const { data }: any = await POST("/device-site/getSiteListPage", { factoryId, current: 0, size: 9999 });
    debugger;
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
  paginationChange(page, pageSize) {
    this.query = {
      ...this.query,
      current: page,
      pageSize,
    };
    this.getCheckData(this.query);
  }

  @action.bound
  async getCheckData(param: any) {
    Object.keys(param).forEach((key) => {
      if (!param[key]) {
        delete param[key];
        delete this.query[key];
      }
    });

    if (param.timeRange && param.timeRange.length > 0) {
      param.start = moment(param.timeRange[0]).format("YYYY-MM-DD HH:mm:ss");
      param.end = moment(param.timeRange[1]).format("YYYY-MM-DD HH:mm:ss");
    } else {
      delete param.start;
      delete this.query.start;
      delete param.end;
      delete this.query.end;
    }

    this.loading = true;
    this.query = {
      ...this.query,
      ...param,
    };

    const newParam = {
      ...this.query,
      current: this.query.current,
      pageNo: this.query.current,
      pageSize: this.query.pageSize,
      size: this.query.pageSize,
    };

    delete newParam.timeRange;

    try {
      // if (newParam.parkId) {
        const { data }: any = await POST("/dataAdd/getCheckData", newParam);

        this.total = data.total;
        this.query.pageSize = data.size;
        this.query.current = data.current;
        this.dataSource = data.records;
      // }
    } catch {
      this.total = 0;
      this.query.pageSize = 10;
      this.query.current = 1;
      this.dataSource = [];
    }

    this.loading = false;
  }
}
