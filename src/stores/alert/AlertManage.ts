import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class AlertManage {
  @observable loading: boolean = false;

  @observable parkTree: any = [];
  @observable ptList: any = [];

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
  async getList(param) {
    this.loading = true;
    param.startTime = moment(param.timeRange[0]).format('YYYY-MM-DD HH:mm:ss');
    param.endTime = moment(param.timeRange[1]).format('YYYY-MM-DD HH:mm:ss');

    try {
      if (param.warnType == 1) {
        this.tableData[0].query = {
          ...this.tableData[0].query,
          ...param,
        }
        const { data }: any = await POST('/warn-pm/getPmWarnListPage', this.tableData[0].query);
        debugger

      } else if (param.warnType == 2) {
        this.tableData[1].query = {
          ...this.tableData[1].query,
          ...param,
        }
        const { data }: any = await POST('/warn-pm/getPmWarnListPage', this.tableData[1].query);
        debugger
        
      } else if (param.warnType == 3) {
        this.tableData[2].query = {
          ...this.tableData[2].query,
          ...param,
        }
        const { data }: any = await POST('/warn-device/getDeviceWarnListPage', this.tableData[2].query);
        debugger

      }

    } catch {

    }

    this.loading = false;
  }

}
