import { action, observable } from "mobx";

export class AuthStore {
  @observable token = window.localStorage.getItem("token");

  @action.bound
  onLogin(data: Partial<AuthStore>) {
    Object.assign(this, data);
  }
}
