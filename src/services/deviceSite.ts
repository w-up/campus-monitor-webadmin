import { GET, POST } from "../utils/request";

export default {
  getAllSitesByParkId() {
    return GET("/device-site/getAllSitesByParkId");
  }
};
