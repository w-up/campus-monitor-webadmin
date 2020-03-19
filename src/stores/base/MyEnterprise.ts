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
  @observable factoryListInfo: any = {
    data: [],
    total: 0,
    pageSize: 10,
    current: 1,
  };
  @observable deviceSiteListInfo: any = {
    data: [],
    total: 0,
    pageSize: 10,
    current: 1,
  };
  @observable companyNatureType: Array<any> = [];
  @observable industryType: Array<any> = [];

  @observable deviceSiteInfo: any = {};

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
    await this.getFactoryList();
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

    const promiseArr = data.map((_, i) => {
      const p = GET(`/dict-data/getDictDataByCode`, { typeCode: data[i].dictCode }).then(({ data: innerData }) => data[i].children = innerData.map(k => ({ ...k, value: k.id, label: k.dictName })));
      return p;
    });

    await Promise.all(promiseArr);

    this.industryType = data;
    console.log(data);
    this.loading = false;
  }
  

  @action
  async getTree() {
    const { data }: any = await GET('/company/getCompanyTreeByUserId', {});
    console.log(data);

    const transformList = list => list.map(v => ({ ...v, title: v.label, key: v.id, children: v.children.length > 0 ? transformList(v.children) : [] }));

    this.treeData = transformList(data);
    
    if (!this.selectedEnterprise.id) {
      this.selectedEnterprise = this.treeData[0];
    }
    await this.getCompanyInfo();
    await this.getFactoryList();
  }

  @action.bound
  async getCompanyInfo() {
    if (this.selectedEnterprise.id) {
      const { data }: any = await GET('/company-business-info/getCompanyBusinessInfoById', { companyId: this.selectedEnterprise.id });
      this.enterpriseInfo = data || {};
    }
  }

  @action.bound
  setFactoryInfo(data) {
    this.factoryInfo = data;
  }

  @action.bound
  async getParkList() {
    const { data }: any = await GET('/park/getAllParks', {});
    this.parkList = data;
  }

  @action.bound
  async getDeviceSiteList(factoryId) {
    this.loading = true;
    const { data }: any = await POST('/device-site/getSiteListPage', { factoryId });
    this.deviceSiteListInfo.data = data.records || [];
    this.deviceSiteListInfo.total = data.total;
    this.deviceSiteListInfo.pageSize = data.size;
    this.deviceSiteListInfo.current = data.current;
    this.loading = false;
  }

  @action.bound
  async getFactoryList() {
    if (this.selectedEnterprise.id) {
      const { data }: any = await POST('/factory/getFactoryListPage', { companyId: this.selectedEnterprise.id });
      this.factoryListInfo.data = data.records || [];
      this.factoryListInfo.total = data.total;
      this.factoryListInfo.pageSize = data.size;
      this.factoryListInfo.current = data.current;
    }
  }

  @action.bound
  async saveFactory(param) {
    if (!param.id) {
      await POST('/factory/addFactory', param);
    } else {
      await POST('/factory/editFactory', param);
    }
    await this.getFactoryList();
  }

  @action.bound
  async deleteFactory(param) {
    await POST('/factory/deleteFactory', param);
    await this.getFactoryList();
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
