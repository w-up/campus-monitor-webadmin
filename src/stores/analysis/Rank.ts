import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class Rank {
  @observable loading: boolean = false;

  @observable parkTree: any = [];
  @observable ptList: any = [];


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
  async getStatisRank(param) {
    this.loading = true;
    param.endTime = moment(param.endTime).format('YYYY-MM-DD HH:mm:ss');

    try {
      const { data }: any = await POST('/device-data-history/getStatisRank', { ...param });
      debugger

    } catch {

    }

    this.loading = false;
  }
}
