import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";

export class RuntimeData {
  @observable loading: boolean = false;
  @observable query: any = {
    current: 1,
    pageSize: 10
  };
  @observable total: number = 0;
  @observable param: any = {};

  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable columns: any = [];
  @observable dataList: any = [];

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
    this.queryDatas(this.param);
  }

  @action.bound
  async queryDatas(param) {
    this.loading = true;
    this.param = { ...param };
    try {
      const { data }: any = await POST('/device-data/getAllPMDataBySitesAndPMs', {
        ...param,
        current: this.query.current,
        pageNo: this.query.current,
        pageSize: this.query.pageSize,
        size: this.query.pageSize,
      });
      this.columns = data.titles.map((item, index) => {
        const config = { ...item, width: 80, key: item.titleKey, dataIndex: item.titleKey };
        if (index === 0) {
          config.fixed = 'left';
          config.width = 150;
        } else if (index === (data.titles.length - 1)) {
          config.fixed = 'right';
          config.width = 200;
        }
        return config;
      });
      this.dataList = data.dataList.records.map((item, index) => ({ ...item, key: index }));

      this.total = data.dataList.total;
      this.query.pageSize = data.dataList.size;
      this.query.current = data.dataList.current;
    } catch {

    }
    
    this.loading = false;
  }
}
