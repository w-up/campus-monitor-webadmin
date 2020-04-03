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
  async handleWarn({ warnType, warnId }) {
    this.loading = true;
    try {
      if (warnType === 1 || warnType === 2) {
        await POST('/warn-pm/handlePmWarn', { warnId });
      } else {
        await POST('/warn-device/handleDeviceWarn', { warnId });
      }
    } catch {

    }

    this.loading = false;
  }

  @action.bound
  paginationChange(index, page, pageSize) {
    this.tableData[index].query = {
      ...this.tableData[index].query,
      current: page,
      size: pageSize,
      pageSize,
    }
    this.getList(this.tableData[index].query);
  }

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
  async getList(param: any = {}) {
    this.loading = true;

    Object.keys(param).forEach(key => {
      if (param[key] === '' || param[key].length == 0) {
        delete param[key];
      }
    });
    
    if (param.timeRange) {
      param.startTime = moment(param.timeRange[0]).format('YYYY-MM-DD HH:mm:ss');
      param.endTime = moment(param.timeRange[1]).format('YYYY-MM-DD HH:mm:ss');
    }

    try {
      if (param.warnType == 1) {
        this.tableData[0].query = {
          ...this.tableData[0].query,
          ...param,
        }
        const { data }: any = await POST('/warn-pm/getPmWarnListPage', this.tableData[0].query);
        this.tableData[0].dataSource = data.records;
        this.tableData[0].total = data.total;
        this.tableData[0].query.pageSize = data.size;
        this.tableData[0].query.current = data.current;

      } else if (param.warnType == 2) {
        this.tableData[1].query = {
          ...this.tableData[1].query,
          ...param,
        }
        const { data }: any = await POST('/warn-pm/getPmWarnListPage', this.tableData[1].query);
        this.tableData[1].dataSource = data.records;
        this.tableData[1].total = data.total;
        this.tableData[1].query.pageSize = data.size;
        this.tableData[1].query.current = data.current;
        
      } else if (param.warnType == 3) {
        this.tableData[2].query = {
          ...this.tableData[2].query,
          ...param,
        }
        const { data }: any = await POST('/warn-device/getDeviceWarnListPage', this.tableData[2].query);
        this.tableData[2].dataSource = data.records;
        this.tableData[2].total = data.total;
        this.tableData[2].query.pageSize = data.size;
        this.tableData[2].query.current = data.current;

      }

    } catch {

    }

    this.loading = false;
  }

}
