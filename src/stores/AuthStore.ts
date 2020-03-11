import { action, observable } from "mobx";
import api from "services";

export interface User {
  id: string;
  type: number;
  parkOrEnterpriseId: string;
  username: string;
  name: string;
  contact: string;
  pic: any;
  status: number;
  del: number;
}

export class AuthStore {
  @observable token = window.localStorage.getItem("token");
  @observable user: User | undefined = undefined;
  @observable codes: string[] = [];

  @action.bound
  SetData(data: Partial<AuthStore>) {
    Object.assign(this, data);
  }

  @action.bound
  async login(data: { username: string; password: string }) {
    const result = await api.LoginService.login(data);
    const { token, user, codes } = result.data;
    window.localStorage.setItem("token", token);
    Object.assign(this, {
      token,
      user,
      codes
    });
  }

  @action.bound
  async logout() {
    this.token = null;
    window.localStorage.clear();
  }
}
