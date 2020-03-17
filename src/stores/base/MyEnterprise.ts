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
  @observable parkList: any = [];

  @observable loading: boolean = false;
  @observable treeData: Array<any> = [];
  @observable selectedEnterprise: any = {};
  @observable enterpriseInfo: any = {};
  @observable factoryInfo: any = {
    scope: [],
  };
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
  async onTreeItemSelect(selectedKeys) {
    this.loading = true;
    console.log('selectedKeys', selectedKeys);
    this.treeData.some(item => {
      if (item.id === selectedKeys[0]) {
        this.selectedEnterprise = item;
        return true;
      }
      return false;
    });
    await this.getCompanyInfo();
    this.loading = false;
  }

  @action.bound
  async doSubmitEnterpriseInfo(param) {
    this.loading = true;
    param = {
      ...param,
      registerDate: moment(param.registerDate).format('YYYY-MM-DD HH:mm:ss'),
      businessPeriodStart: moment(param.businessPeriodStart).format('YYYY-MM-DD HH:mm:ss'),
      businessPeriodEnd: moment(param.businessPeriodEnd).format('YYYY-MM-DD HH:mm:ss'),
    }
    
    await POST(`/company-business-info/editCompanyBusinessInfo?companyId=${param.companyId}`, param);
    this.loading = false;
  }

  @action
  async getCompanyNatureType() {
    const { data }: any = await GET(`/dict-data/getDictDataByCode?typeCode=company_nature`, {});
    console.log('type', data)
    this.companyNatureType = data;
  }

  @action
  async getIndustryType() {
    this.loading = true;
    let { data }: any = await GET(`/dict-data/getDictDataByCode`, { typeCode: 'industry_category' });
    data = data.map(v => ({ ...v, value: v.id, label: v.dictName }));

    for (let i = 0; i < data.length; i++) {
      const { data: innerData }: any = await GET(`/dict-data/getDictDataByCode`, { typeCode: data[i].dictCode });
      data[i].children = innerData.map(k => ({ ...k, value: k.id, label: k.dictName }));
    }

    this.industryType = data;
    console.log(data);
    this.loading = false;
  }
  

  @action
  async getTree() {
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
  }

  @action.bound
  async getCompanyInfo() {
    if (this.selectedEnterprise.id) {
      const { data }: any = await GET('/company-business-info/getCompanyBusinessInfoById', { companyId: this.selectedEnterprise.id });
      this.enterpriseInfo = data || {};
    }
  }

  @action.bound
  async getParkList() {
    const { data }: any = await GET('/park/getAllParks', {});
    this.parkList = data;
  }

  @action.bound
  async saveFactory(param) {
    this.loading = true;

    if (!param.id) {
      const { data }: any = await POST('/factory/addFactory', param);
    } else {
      const { data }: any = await POST('/factory/editFactory', param);
    }

    this.loading = false;
  }

  @action.bound
  addScope() {
    this.factoryInfo.scope = [ ...this.factoryInfo.scope, { scopeName: `点${this.factoryInfo.scope.length + 1}`, longitude: '', latitude: '' } ];
  }

  @action.bound
  setScope(scope) {
    this.factoryInfo.scope = scope;
  }

  @action.bound
  scopeNameInput(value, index) {
    this.factoryInfo.scope[index].scopeName = value;
  }

  @action.bound
  longitudeInput(value, index) {
    this.factoryInfo.scope[index].longitude = value;
  }

  @action.bound
  latitudeInput(value, index) {
    this.factoryInfo.scope[index].latitude = value;
  }

}
