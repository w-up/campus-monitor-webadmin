import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class AlertSetting {
  @observable loading: boolean = false;

  @observable typeList: any = [];
  @observable pollutionPmList: any = [];
  @observable companyList: any = [];
  @observable parkList: any = [];
  
  @observable query: any = {
    current: 1,
    pageSize: 10,
    size: 10,
  };
  @observable total: any = 0;
  @observable dataSource: any = [];

  @observable pmQuery: any = {
    current: 1,
    pageSize: 10,
    size: 10,
  };
  @observable pmTotal: any = 0;
  @observable pmDataSource: any = [];

  @action.bound
  paginationChange(page, pageSize) {
    this.query = {
      ...this.query,
      current: page,
      size: pageSize,
      pageSize,
    };
    this.getDeviceConfig(this.query);
  }

  @action.bound
  pmPaginationChange(page, pageSize) {
    this.pmQuery = {
      ...this.pmQuery,
      current: page,
      size: pageSize,
      pageSize,
    };
    this.getList(this.pmQuery);
  }

  @action.bound
  async getAllParks() {
    this.loading = true;
    try {
      const { data }: any = await GET('/park/getAllParks', {});
      this.parkList = data;
    } catch {

    }

    this.loading = false;
  }

  @action.bound
  async deleteWarnDeviceConfig(configId) {
    this.loading = true;
    try {
      await POST('/warn-device-config/deleteWarnDeviceConfig', { configId });
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async deletePmWarn(configId) {
    this.loading = true;
    try {
      await POST('/warn-pm-config/deletePmWarnConfig', { configId });
    } catch {

    }
    this.loading = false;
  }
  

  @action.bound
  async getAllCompany() {
    this.loading = true;
    try {
      const { data }: any = await GET('/company/getAllCompany', {});
      this.companyList = data;
    } catch {

    }

    this.loading = false;
  }

  @action.bound
  async getTypes() {
    this.loading = true;
    try {
      const { data }: any = await GET('/dict-data/getDictDataByCode', { typeCode: 'belong_child_type' });
      this.typeList = data;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async addPmRule(param) {
    this.loading = true;
    param.email = param.email ? 1 : 0;

    Object.keys(param).forEach(key => {
      if (param[key] === '') {
        delete param[key];
      }
    });

    try {
      if (param.id) {
        await POST('/warn-pm-config/updatePmWarnConfig', param);
      } else {
        await POST('/warn-pm-config/addPmWarnConfig', param);
      }
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async editDeviceWarnConfig(param) {

    Object.keys(param).forEach(key => {
      if (param[key] === '') {
        delete param[key];
      }
    });

    this.loading = true;
    param.email = param.email ? 1 : 0;

    try {
      await POST('/warn-device-config/addOrUpdateWarnDeviceConfig', param);
    } catch {

    }

    this.loading = false;
  }
  

  @action.bound
  async getDeviceConfig(param = {}) {
    this.loading = true;

    Object.keys(param).forEach(key => {
      if (param[key] === '') {
        delete param[key];
      }
    });

    this.query = {
      ...this.query,
      ...param,
    }

    try {
      const { data }: any = await POST('/warn-device-config/getWarnDeviceConfig', this.query);
      this.dataSource = data.records;
      this.total = data.total;
      this.query.pageSize = data.size;
      this.query.current = data.current;
    } catch {

    }
    
    this.loading = false;
  }

  @action.bound
  async getAllPms() {
    this.loading = true;
    try {
      const { data }: any = await GET('/pm-code/getAllPollutionPMs', {});
      this.pollutionPmList = data;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getList(param: any = {}) {
    this.loading = true;

    Object.keys(param).forEach(key => {
      if (param[key] === '' || param[key].length === 0) {
        delete param[key];
        delete this.pmQuery[key];
      }
    });

    this.pmQuery = {
      ...this.pmQuery,
      ...param,
    }

    try {
      
      const { data }: any = await POST('/warn-pm-config/getPmWarnConfigListPage', this.pmQuery);
      this.pmDataSource = data.records;
      this.pmTotal = data.total;
      this.pmQuery.pageSize = data.size;
      this.pmQuery.current = data.current;
      
    } catch {

    }

    this.loading = false;
  }

}
