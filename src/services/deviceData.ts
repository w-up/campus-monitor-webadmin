import { GET, POST } from "../utils/request";

export default {
  getAllPMDataBySitesAndPMs(data: { current: number; pmCodeList: string[]; siteIdList: []; size: number }) {
    return GET("/device-data/getAllPMDataBySitesAndPMs", data);
  },
  getAllPM24HourDatasLogin(data: { pmType: string }) {
    return GET("/device-data-history/getAllPM24HourDatasLogin", data);
  },
  getFactoryPMByParkId(data: { type: string }) {
    return POST("/device-data/getFactoryPMByParkId", data);
  }
};
