/*
 * @Descripttion: 
 * @Author: shenchuanrun
 * @Date: 2020-03-04 18:52:20
 * @LastEditors: shenchuanrun
 * @LastEditTime: 2020-03-04 22:18:51
 */
import { GET, POST } from "../utils/request";

export default{
  getParkList(data: { current: number, pageSize: number, parkName: string }) {
    return GET('/park/getParkListPage', data)
  }
}