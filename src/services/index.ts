/*
 * @Descripttion: 
 * @Author: shenchuanrun
 * @Date: 2020-03-03 14:18:27
 * @LastEditors: shenchuanrun
 * @LastEditTime: 2020-03-04 17:55:02
 */
// import { CompanyService } from "./company";
import LoginService from "./login";

export default {
  // company: new CompanyService(),
  ...LoginService
};
