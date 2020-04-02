import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class AlertSetting {
  @observable loading: boolean = false;

  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable typeList: any = [];
  @observable pollutionPmList: any = [];

  @observable tableData: any = [
    {
      query: {
        current: 1,
        pageSize: 10,
        size: 10,
      },
      total: 0,
      dataSource: [],
    },
    {
      query: {
        current: 1,
        pageSize: 10,
        size: 10,
      },
      total: 0,
      dataSource: [],
    },
    {
      query: {
        current: 1,
        pageSize: 10,
        size: 10,
      },
      total: 0,
      dataSource: [],
    },
  ];

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

    try {
      const { data }: any = await POST('/warn-pm-config/addPmWarnConfig', param);
      debugger

    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getDeviceConfig() {
    this.loading = true;
    try {
      const { data }: any = await GET('/warn-device-config/getWarnDeviceConfig', { current: 1, size: 9999 });
      debugger
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
  async getList(param) {
    this.loading = true;

    try {
      
      const { data }: any = await POST('/warn-pm-config/getPmWarnConfigListPage', param);
      debugger
      
    } catch {

    }

    this.loading = false;
  }

}
