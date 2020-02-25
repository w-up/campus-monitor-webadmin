import Axios from "axios";
import { configure } from "axios-hooks";
import useAxios from "axios-hooks";

export const axios = Axios.create({
  baseURL: "http://fynp55.natappfree.cc/"
});

axios.interceptors.request.use(config => {
  return config;
});

axios.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    return Promise.reject(err);
  }
);

configure({ axios });

export { useAxios };
