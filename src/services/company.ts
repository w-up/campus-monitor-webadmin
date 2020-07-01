/*
 * @Descripttion:
 * @Author: shenchuanrun
 * @Date: 2020-03-03 14:18:27
 * @LastEditors: shenchuanrun
 * @LastEditTime: 2020-03-04 17:51:26
 */
import { GET } from "../utils/request";

export default {
  getCompanyBusinessInfoById(data: { companyId: string }) {
    return GET("/company-business-info/getCompanyBusinessInfoById", data);
  },
  getCompanyLogoById(data: { factoryId: string }) {
    return GET("/company/getCompanyLogoById", data);
  },
};
