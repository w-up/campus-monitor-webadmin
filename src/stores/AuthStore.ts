import { action, observable } from "mobx";
import api from "services";
import { GET } from "../utils/request";

const user = window.localStorage.getItem("user");
const codes = window.localStorage.getItem("codes");

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
  @observable codes: string[] = codes ? JSON.parse(codes) : [];

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
    window.localStorage.setItem("codes", JSON.stringify(codes));

    Object.assign(this, {
      token,
      user,
      codes,
    });
  }

  @action.bound
  async getAuthUser() {
    if (!this.token) return;
    const res = await GET("/getUserInfo");
    if (res.data) {
      const { token, user, codes } = res.data;
      window.localStorage.setItem("user", JSON.stringify(user));
      window.localStorage.setItem("codes", JSON.stringify(codes));
      Object.assign(this, {
        token,
        user,
        codes,
      });
    }
  }

  @action.bound
  async logout() {
    this.token = null;
    window.localStorage.clear();
  }

  @action.bound
  async editPassword(data: { newPassword: string; password: string }) {
    return api.AuthService.editPassword(data);
  }

  @action.bound
  async updateUser(data: { id: number; contact: string }) {
    return api.AuthService.updateContact(data);
  }
}
