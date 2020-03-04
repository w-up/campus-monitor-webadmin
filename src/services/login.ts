/*
 * @Descripttion: 
 * @Author: shenchuanrun
 * @Date: 2020-03-04 17:29:45
 * @LastEditors: shenchuanrun
 * @LastEditTime: 2020-03-04 17:43:52
 */
import { POST } from "../utils/request";

export default{
  login(data: { username: string, password: string }) {
    return POST('/login', data)
  }
}
