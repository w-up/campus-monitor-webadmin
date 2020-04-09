import { action, observable } from "mobx";
import moment from 'moment';
import { message } from "antd";
import { GET, POST } from "../../../utils/request";

export class UserEdit {

  @observable loading: boolean = false;
  @observable roles: any = [];
  @observable companyList: any = [];
  @observable parkList: any = [];

  @action.bound
  async getALlRoles() {
    const { data }: any = await GET('/role/getAllRoles', {});
    this.roles = data;
  }

  @action.bound
  async getAllCompany() {
    const { data }: any = await GET('/company/getAllCompany', {});
    this.companyList = data;
  }

  @action.bound
  async getAllParks() {
    const { data }: any = await GET('/park/getAllParks', {});
    this.parkList = data;
  }

  @action.bound
  async doSaveUser(param) {
    if (!param.id) {
      await POST('/user/addUser', param);
    } else {
      await POST('/user/updateUser', param);
    }
  }

}
