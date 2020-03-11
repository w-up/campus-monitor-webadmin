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

Axios.defaults.withCredentials = true;

let http = Axios.create({
  baseURL: process.env.NODE_ENV == "development" ? "http://5un8z6.natappfree.cc/" : "",
  timeout: 60 * 1000
});

http.interceptors.request.use(async config => {
  if (!config.headers["Authrization"]) {
    config.headers["Authrization"] = `Bearer ${store.auth.token}`;
  }
  return config;
});

http.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.msg !== "success") {
      message.error(res.msg);
      return Promise.reject(response);
    } else {
      return res;
    }
  },
  error => {
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
