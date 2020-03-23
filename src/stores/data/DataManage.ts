import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";

export class DataManage {
  @observable loading: boolean = false;

  @observable query: any = {
    current: 1,
    pageSize: 10
  };
  @observable dataSource: any = [];
  @observable parksAndFactories: any = [];
  @observable total: number = 0;

  @action.bound
  async getCheckDataList() {
    this.loading = true;

    try {
      const { data }: any = await POST('/dataAdd/getDataAddByPageBySelf', {
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

  @action.bound
  async getAllParksAndFactories() {
    this.loading = true;
    try {
      const { data }: any = await GET('/park/getAllParksAndFactories', {});
      this.parksAndFactories = data.parks;
    } catch {

    }
    
    this.loading = false;
  }

  @action.bound
  async getSitesList(factoryId) {
    const { data }: any = await POST('/device-site/getSiteListPage', { factoryId, current: 0, size: 9999 });
    debugger
  }
}
