import { observable, action } from "mobx";
import { store } from "./index";

export class RootStore {
  @action.bound
  async init() {
    // await store.alert.modal.init();
    if (store.auth.token) {
      await store.auth.getAuthUser();
      await store.config.init();
      await store.ws.init();
    }
  }
}
