import { action, observable } from "mobx";
import api from "services";

const user = window.localStorage.getItem("user");
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
  @observable user: User | null = user ? JSON.parse(user) : null;
  @observable codes: string[] = [];

  @action.bound
  SetData(data: Partial<AuthStore>) {
    Object.assign(this, data);
  }

  @action.bound
  async login(data: { username: string; password: string }) {
    const result = await api.AuthService.login(data);
    const { token, user, codes } = result.data;
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("user", JSON.stringify(user));

    Object.assign(this, {
      token,
      user,
      codes
    });
  }

  @action.bound
  async getAuthUser() {
    if (!this.token) return;
    // const result = await api.AuthService.getAuthUser();
    // window.localStorage.setItem("user", JSON.stringify(user));
    // console.log(result);
  }

  @action.bound
  async logout() {
    this.token = null;
    window.localStorage.clear();
  }
}
