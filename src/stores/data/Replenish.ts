import { action, observable } from "mobx";
import { GET, POST, FORM_POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class Replenish {
  @observable loading: boolean = false;

  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable deviceList: any = [];
  @observable addDeviceList: any = [];
  @observable pmList: any = [];
  
  @action.bound
  async getCheckDataList() {
    this.loading = true;

    try {
      const { data }: any = await POST('/dataAdd/getDataAddByPageBySelf', {});

    } catch {

    }

    this.loading = false;
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
  async getDevice(siteId) {
    try {
      const { data }: any = await GET('/dataAdd/getDevice', { siteId });
      this.deviceList = data;
    } catch {

    }
    
  }

  @action.bound
  async getAddDevice() {
    try {
      const { data }: any = await GET('/dataAdd/getAddDevice', {});
      this.addDeviceList = data || [];
    } catch {

    }
    
  }

  @action.bound
  async getPm(deviceCode) {
    try {
      const deviceId = this.deviceList.find(item => item.deviceCode === deviceCode).id;
      const { data }: any = await GET('/dataAdd/getPm', { deviceId });
      this.pmList = data;
    } catch {

    }
  }

  @action.bound
  async insertData(param) {
    param.collectDate = moment(param.collectDate).format('YYYY-MM-DD HH:mm:ss');

    param.list = Object.keys(param.pmList).filter(key => param.pmList[key]).map(key => ({
      pmCode: key,
      pmUnit: this.pmList.find(v => v.pmCode === key).pmUnit,
      collectValue: param.pmList[key],
    }));
    param.list = JSON.stringify(param.list);
    delete param.pmList;

    const imagefile: any = document.querySelector('#file');
    if (imagefile.files.length > 0) {
      param.pic = imagefile.files[0];
    }

    let formData = new FormData();

    Object.keys(param).forEach(key => {
      formData.append(key, param[key]);
    });

    await FORM_POST('/dataAdd/insert', formData);

  }

}
