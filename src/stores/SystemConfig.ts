import { action, observable } from "mobx";
import moment from 'moment';
import { message } from "antd";
import { GET, POST } from "../utils/request";

export class SystemConfig {
  @observable query: any = {
    paramName: '',
    current: 1,
    pageSize: 10
  };
  @observable total: number = 100;
  @observable selectedRowKeys: any = [];
  @observable dataSource: any = [];
  @observable parkList: any = [];

  @observable belongChildTypeList: any = [];

  @observable loading: boolean = false;

  @action.bound
  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
  }

  @action.bound
  handleSearchReset(e) {
    this.query = {
      paramName: '',
      current: 1,
      pageSize: 10,
    }
    this.getSysParamList();
  }

  @action.bound
  handleSearchChange(e) {
    console.log(e)
    this.query = {
      ...this.query,
      paramName: e.target.value,
    }
  }

  @action.bound
  paginationChange(page, pageSize) {
    this.query = {
      ...this.query,
      current: page,
      pageSize,
    };
    this.getSysParamList();
  }

  @action.bound
  async saveParam(param) {
    this.loading = true;
    try {
      await POST('/sys-param/updateSysParam', param);
    } catch {

    }
    this.getSysParamList();
  }

  @action.bound
  async getSysParamList(param = {}) {
    this.loading = true;
    const { data }: any = await POST('/sys-param/getSysParamListPage', {
      current: this.query.current,
      pageNo: this.query.current,
      pageSize: this.query.pageSize,
      paramName: this.query.paramName,
      size: this.query.pageSize,
      ...param,
    });

    this.total = data.total;
    this.query.pageSize = data.size;
    this.query.current = data.current;
    this.dataSource = data.records;

    this.loading = false;
  }

}
