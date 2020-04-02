import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class DataView {
  @observable loading: boolean = false;

  @action.bound
  async submitCheck(param) {
    Object.keys(param).forEach(key => {
      if (!param[key]) {
        delete param[key];
      }
    });
    this.loading = true;
    try {
      await POST('/dataAdd/check', param);
    } catch {

    }
    this.loading = false;

  }

}
