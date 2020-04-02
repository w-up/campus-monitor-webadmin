import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class DataAudit {
  @observable loading: boolean = false;

  @observable query: any = {
    current: 1,
    pageSize: 10
  };
  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable dataSource: any = [];
  @observable total: number = 0;

  @action.bound
  async getSitesList(factoryId) {
    const { data }: any = await POST('/device-site/getSiteListPage', { factoryId, current: 0, size: 9999 });
    debugger
  }

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
  paginationChange(page, pageSize) {
    this.query = {
      ...this.query,
      current: page,
      pageSize,
    };
    this.getCheckData(this.query);
  }

  @action.bound
  async getCheckData(param) {
    Object.keys(param).forEach(key => {
      if (!param[key]) {
        delete param[key];
      }
    });

    if (param.timeRange) {
      param.start = moment(param.timeRange[0]).format('YYYY-MM-DD HH:mm:ss');
      param.end = moment(param.timeRange[1]).format('YYYY-MM-DD HH:mm:ss');
    }

    delete param.timeRange;

    this.loading = true;
    this.query = {
      ...this.query,
      ...param,
    }

    try {
      const { data }: any = await POST('/dataAdd/getCheckData', {
        ...this.query,
        current: this.query.current,
        pageNo: this.query.current,
        pageSize: this.query.pageSize,
        size: this.query.pageSize,
      });
      
      this.total = data.total;
      this.query.pageSize = data.size;
      this.query.current = data.current;
      this.dataSource = data.records;

    } catch {

    }

    this.loading = false;
  }

}
