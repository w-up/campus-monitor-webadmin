/*
 * @Descripttion:
 * @Author: shenchuanrun
 * @Date: 2020-03-03 14:18:27
 * @LastEditors: shenchuanrun
 * @LastEditTime: 2020-03-04 18:26:22
 */
import Axios from "axios";
import { message } from "antd";
import { store } from "../stores/index";
import { globalConfig } from "../config";

Axios.defaults.withCredentials = true;

let http = Axios.create({
  baseURL: globalConfig.apiEndpoint,
  timeout: 60 * 1000
});

http.interceptors.request.use(async config => {
  if (!config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${store.auth.token}`;
  }
  return config;
});

http.interceptors.response.use(
  response => {
    try {
      const res = response.data;
      if (typeof res !== 'object') {
        return response;
      }

      if (res.msg == "未登录") {
        store.auth.logout();
      }
      if (res.msg !== "success") {
        message.error(res.msg);
        return Promise.reject(response);
      } else {
        return res;
      }
    } catch {
      return response;
    }
    
  },
  error => {
    debugger
    if (error && error.response) {
      message.error(error.response.msg);
    }
    return Promise.reject(error);
  }
);

export function GET(url, paramsOrData?) {
  return http({ method: "GET", url, params: paramsOrData });
}

export function POST(url, paramsOrData?) {
  return http({ method: "POST", url, data: paramsOrData });
}

export default http;
