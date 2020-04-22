import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";

export class Enterprise {
  @observable query: any = {
    companyCode: '',
    current: 1,
    pageSize: 10
  };
  @observable total: number = 100;
  @observable selectedRowKeys: any = [];
  @observable dataSource: any = [];
  @observable loading: boolean = false;

  @action.bound
  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
  }

  @action.bound
  paginationChange(page, pageSize) {
    console.log(page, pageSize);
    this.query = {
      ...this.query,
      current: page,
      pageSize,
    };
    this.getCompanyList();
  }

  @action.bound
  async deleteEnterprise(ids) {
    await POST('/company/deleteCompany', ids);
    await this.getCompanyList();
  }

  @action.bound
  handleSearchSubmit(e) {
    console.log(e)
  }

  @action.bound
  handleSearchChange(e) {
    console.log(e)
    this.query = {
      ...this.query,
      companyCode: e.target.value,
    }
  }

  @action.bound
  handleSearchReset(e) {
    console.log(e)
    this.query = {
      companyCode: '',
      current: 1,
      pageSize: 20,
    }
    this.getCompanyList();
  }
  
  @action.bound
  resetSelectedRowKeys() {
    this.selectedRowKeys = [];
  }

  @action
  async getCompanyList(param = {}) {
    this.loading = true;
    const { data }: any = await POST('/company/getCompanyListPage', {
      current: this.query.current,
      pageNo: this.query.current,
      pageSize: this.query.pageSize,
      companyCode: this.query.companyCode,
      size: this.query.pageSize,
      ...param,
    });
    console.log(data)

    this.total = data.total;
    this.query.pageSize = data.size;
    this.query.current = data.current;
    this.dataSource = data.records;
    this.loading = false;
  }

}
