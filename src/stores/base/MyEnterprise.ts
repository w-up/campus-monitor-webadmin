import { action, observable } from "mobx";
import moment from 'moment';
import { GET, POST } from "../../utils/request";

export class MyEnterprise {
  @observable query: any = {
    companyCode: '',
    current: 1,
    pageSize: 10
  };
  @observable total: number = 100;
  @observable selectedRowKeys: any = [];
  @observable dataSource: any = [];

  @observable loading: boolean = false;
  @observable treeData: Array<any> = [];
  @observable selectedEnterprise: any = {};
  @observable enterpriseInfo: any = {};
  @observable factoryInfo: any = {};
  @observable companyNatureType: Array<any> = [];
  @observable industryType: Array<any> = [];

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
    // this.getCompanyList();
  }

  @action.bound
  async deleteEnterprise(ids) {
    await POST('/company/deleteCompany', ids);
    // await this.getCompanyList();
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
  }
  
  @action.bound
  resetSelectedRowKeys() {
    this.selectedRowKeys = [];
  }

  @action.bound
  onTreeItemSelect(selectedKeys) {
    console.log('selectedKeys', selectedKeys);
    this.treeData.some(item => {
      if (item.id === selectedKeys[0]) {
        this.selectedEnterprise = item;
        return true;
      }
      return false;
    });
  }

  @action.bound
  async doSubmitEnterpriseInfo(param) {
    param = {
      ...param,
      registerDate: moment(param.registerDate).format('YYYY-MM-DD HH:mm:ss'),
      businessPeriodStart: moment(param.businessPeriodStart).format('YYYY-MM-DD HH:mm:ss'),
      businessPeriodEnd: moment(param.businessPeriodEnd).format('YYYY-MM-DD HH:mm:ss'),
    }
    const { data }: any = await POST(`/company-business-info/editCompanyBusinessInfo?companyId=${param.companyId}`, param);

  }

  @action
  async getCompanyNatureType() {
    const { data }: any = await GET(`/dict-data/getDictDataByCode?typeCode=company_nature`, {});
    console.log('type', data)
    this.companyNatureType = data;
  }

  @action
  async getIndustryType() {
    const { data }: any = await GET(`/dict-data/getDictDataByCode?typeCode=industry_type`, {});
    console.log('type', data)
    this.industryType = data;
  }
  

  @action
  async getTree() {
    this.loading = true;
    const { data }: any = await GET('/company/getCompanyTreeByUserId', {});
    console.log(data);

    this.treeData = data.map(item => ({
      ...item,
      title: item.label,
      key: item.id,
    }));
    if (!this.selectedEnterprise.id) {
      this.selectedEnterprise = this.treeData[0];
    }
    await this.getCompanyInfo();
    this.loading = false;
  }

  @action
  async getCompanyInfo() {
    this.loading = true;
    if (this.selectedEnterprise.id) {
      const { data }: any = await GET('/company-business-info/getCompanyBusinessInfoById', { companyId: this.selectedEnterprise.id });
      this.enterpriseInfo = data || {};
    }
    this.loading = false;
  }

}
