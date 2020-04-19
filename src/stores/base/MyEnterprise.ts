import { action, observable } from "mobx";
import moment from "moment";
import { message } from "antd";
import { GET, POST } from "../../utils/request";
import { store } from "../index";

export class MyEnterprise {
  @observable query: any = {
    companyCode: "",
    current: 1,
    pageSize: 10,
  };
  @observable total: number = 100;
  @observable selectedRowKeys: any = [];
  @observable dataSource: any = [];
  @observable parkList: any = [];

  @observable belongChildTypeList: any = [];

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
  @observable deviceListInfo: any = {
    data: [],
    total: 0,
    pageSize: 10,
    current: 1,
  };
  @observable companyNatureType: Array<any> = [];
  @observable industryType: Array<any> = [];

  @observable deviceSiteInfo: any = {};
  @observable deviceInfo: any = {};

  @action.bound
  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
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
    await POST("/company/deleteCompany", ids);
    // await this.getCompanyList();
  }

  @action.bound
  handleSearchSubmit(e) {
    console.log(e);
  }

  @action.bound
  handleSearchChange(e) {
    console.log(e);
    this.query = {
      ...this.query,
      companyCode: e.target.value,
    };
  }

  @action.bound
  handleSearchReset(e) {
    console.log(e);
    this.query = {
      companyCode: "",
      current: 1,
      pageSize: 20,
    };
  }

  @action.bound
  resetSelectedRowKeys() {
    this.selectedRowKeys = [];
  }

  @action.bound
  async onTreeItemSelect(selectedKeys) {
    console.log("selectedKeys", selectedKeys);
    this.treeData.some((item) => {
      if (item.id === selectedKeys[0]) {
        this.selectedEnterprise = item;
        return true;
      }
      return false;
    });
    await this.getCompanyInfo();
    await this.getFactoryList();
  }

  @action.bound
  async doSubmitEnterpriseInfo(param) {
    param = {
      ...param,
      registerDate: param.registerDate ? moment(param.registerDate).format("YYYY-MM-DD HH:mm:ss") : "",
      businessPeriodStart: param.businessPeriodStart ? moment(param.businessPeriodStart).format("YYYY-MM-DD HH:mm:ss") : "",
      businessPeriodEnd: param.businessPeriodEnd ? moment(param.businessPeriodEnd).format("YYYY-MM-DD HH:mm:ss") : "",
    };

    await POST(`/company-business-info/editCompanyBusinessInfo?companyId=${param.companyId}`, param);
  }

  @action
  async getCompanyNatureType() {
    const { data }: any = await GET(`/dict-data/getDictDataByCode?typeCode=company_category`, {});
    console.log("type", data);
    this.companyNatureType = data;
  }

  @action
  async getIndustryType() {
    let { data }: any = await GET(`/dict-data/getDictDataByCode`, { typeCode: "industry_category" });
    data = data.map((v) => ({ ...v, value: v.id, label: v.dictName }));

    const promiseArr = data.map((_, i) => {
      const p = GET(`/dict-data/getDictDataByCode`, { typeCode: data[i].dictCode }).then(
        ({ data: innerData }) => (data[i].children = innerData.map((k) => ({ ...k, value: k.id, label: k.dictName })))
      );
      return p;
    });

    await Promise.all(promiseArr);

    this.industryType = data;
    console.log(data);
  }

  @action
  async getTree(keyWord = '') {
    const { data }: any = await GET("/company/getCompanyTreeByUserId", { keyWord });

    const transformList = (list) => list.map((v) => ({ ...v, title: v.label, key: v.id, children: v.children.length > 0 ? transformList(v.children) : [] }));

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
      const { data }: any = await GET("/company-business-info/getCompanyBusinessInfoById", { companyId: this.selectedEnterprise.id });
      this.enterpriseInfo = data || {};
    }
  }

  @action.bound
  async getDeviceInfo(deviceCode) {
    const { data }: any = await GET("/device/getDeviceByCode", { deviceCode });
    this.deviceInfo = { ...data };
  }

  @action.bound
  async getBelongChildType() {
    const { data }: any = await GET("/dict-data/getDictDataByCode", { typeCode: "belong_child_type" });
    this.belongChildTypeList = data;
  }

  @action.bound
  setFactoryInfo(data) {
    this.factoryInfo = data;
  }

  @action.bound
  setDeviceInfo(data) {
    this.deviceInfo = data;
  }

  @action.bound
  async getParkList() {
    const { data }: any = await GET("/park/getAllParks", {});
    this.parkList = data;
  }

  @action.bound
  setDeviceSiteInfo(info) {
    this.deviceSiteInfo = { ...info };
  }

  @action.bound
  async getDeviceSiteInfo(siteCode) {
    const { data }: any = await GET("/device-site/getSiteByCode", { siteCode });
    console.log("getDeviceSiteInfo", data);
    if (!data) {
      message.error("获取站点信息失败");
      return;
    }
    this.deviceSiteInfo = { ...this.deviceSiteInfo, ...data };
  }

  @action.bound
  async getDeviceSiteList() {
    const { data }: any = await POST("/device-site/getSiteListPage", { factoryId: this.factoryInfo.id });
    this.deviceSiteListInfo.data = data.records || [];
    this.deviceSiteListInfo.total = data.total;
    this.deviceSiteListInfo.pageSize = data.size;
    this.deviceSiteListInfo.current = data.current;
  }

  @action.bound
  async getDeviceList() {
    const { data }: any = await POST("/device/getDeviceListPage", { siteId: this.deviceSiteInfo.id });
    this.deviceListInfo.data = data.records || [];
    this.deviceListInfo.total = data.total;
    this.deviceListInfo.pageSize = data.size;
    this.deviceSiteListInfo.current = data.current;
  }

  @action.bound
  async getFactoryList() {
    if (this.selectedEnterprise.id) {
      const { data }: any = await POST("/factory/getFactoryListPage", { companyId: this.selectedEnterprise.id });
      this.factoryListInfo.data = data.records || [];
      this.factoryListInfo.total = data.total;
      this.factoryListInfo.pageSize = data.size;
      this.factoryListInfo.current = data.current;
    }
  }

  @action.bound
  async saveFactory(param) {
    if (!param.id) {
      await POST("/factory/addFactory", param);
    } else {
      await POST("/factory/editFactory", param);
    }
    await this.getFactoryList();
  }

  @action.bound
  async addDeviceSite({ factoryId, id }) {
    await POST("/device-site/addFactorySite", { factoryId, siteId: id });
    await this.getDeviceSiteList();
    await this.getTree();
  }

  @action.bound
  async deleteFactory(param) {
    await POST("/factory/deleteFactory", param);
    await this.getFactoryList();
    await this.getTree();
  }

  @action.bound
  async deleteDeviceSite(ids) {
    await POST("/device-site/deleteFactorySite", ids);
    await this.getDeviceSiteList();
    await this.getTree();
  }

  @action.bound
  addScope() {
    if (this.factoryInfo.scope) {
      this.factoryInfo.scope = [...this.factoryInfo.scope, { scopeName: `点${this.factoryInfo.scope.length + 1}`, longitude: "", latitude: "" }];
    } else {
      this.factoryInfo.scope = [{ scopeName: `点1`, longitude: "", latitude: "" }];
    }
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

  @action.bound
  updateMapPoints() {
    console.log(store.map.drawMap.paths);
    this.factoryInfo.scope = store.map.drawMap.paths[0].map((item, index) => ({
      key: index,
      scopeName: `点${index + 1}`,
      latitude: item.lat,
      longitude: item.lng,
    }));
  }
}
