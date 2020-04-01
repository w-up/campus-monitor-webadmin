import { observable, action } from "mobx";
import { store } from "./index";

export class RootStore {
  @action.bound
  init() {
    if (store.auth.token) {
      store.auth.getAuthUser();
      store.config.loadSysConfig();
    }
  }
}
