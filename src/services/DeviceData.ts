import { GET, POST } from "../utils/request";

export default {
  getAllPMDataBySitesAndPMs(data: { current: number; pmCodeList: string[]; siteIdList: []; size: number }) {
    return GET("/device-data/getAllPMDataBySitesAndPMs", data);
  }
};
