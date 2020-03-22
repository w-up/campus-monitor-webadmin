import { action, observable } from "mobx";
import moment from 'moment';
import { message } from "antd";
import { GET, POST } from "../../../utils/request";

export class RoleEdit {

  @observable loading: boolean = false;
  @observable perms: any = [];
  @observable companyList: any = [];
  @observable parkList: any = [];


  @action.bound
  async getAllPerms() {
    this.loading = true;
    try {
      const { data }: any = await GET('/perm/getAllPerms', {});
      const transformList = list => list.map(v => ({ ...v, title: v.label, key: v.id, children: v.children.length > 0 ? transformList(v.children) : [] }));
      this.perms = transformList(data);
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async doSaveRole(param) {
    this.loading = true;
    try {
      if (!param.id) {
        await POST('/role/addRole', param);
      } else {
        await POST('/role/updateRole', param);
      }
    } catch {

    }
    this.loading = false;
  }

}
