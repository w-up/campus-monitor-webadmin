import { action, observable } from "mobx";
import { GET, POST } from "../utils/request";
import Mock, { Random } from 'mockjs';
import moment from 'moment';

export class Report {
  
  @observable loading: boolean = false;
  @observable parkList: any = [];
  @observable companyList: any = [];
  @observable pmList: any = [];
  
  @action.bound
  async getParkList() {
    this.loading = true;
    try {
      const { data }: any = await GET('/park/getAllParks', {});
      this.parkList = data;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getCompanyList() {
    this.loading = true;
    try {
      const { data }: any = await GET('/company/getAllCompany', {});
      this.companyList = data;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getAllPMTypeAndCode() {
    this.loading = true;
    try {
      const { data }: any = await GET('/pm-code/getAllPMTypeAndCode', {});
      this.pmList = data.results;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getStatisReport(param) {
    this.loading = true;
    param.collectDate = moment(param.collectDate).format('YYYY-MM-DD HH:mm:ss');
    try {
      const { data }: any = await POST('/device-data-history/getStatisReport', param);
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async exportStatisReport(param) {
    this.loading = true;
    param.collectDate = moment(param.collectDate).format('YYYY-MM-DD HH:mm:ss');
    try {
      const { headers, data }: any = await POST('/device-data-history/exportStatisReport', param);
      const type = headers['content-type']
      const file = new Blob([data], { type });
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.xls');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {

    }
    this.loading = false;
  }

}
