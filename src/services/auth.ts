/*
 * @Descripttion:
 * @Author: shenchuanrun
 * @Date: 2020-03-04 17:29:45
 * @LastEditors: shenchuanrun
 * @LastEditTime: 2020-03-04 17:43:52
 */
import { POST, GET } from "../utils/request";

export default {
  login(data: { username: string; password: string }) {
    return POST("/login", data);
  },
  getAuthUser() {
    return GET("/get");
  },

  editPassword(data: {newPassword: string; password: string}) {
    return POST("/user/updatePassword", data);
  }
};
