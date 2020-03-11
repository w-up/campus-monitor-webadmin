import { GET, POST } from "../utils/request";

export default {
  getAllPMTypeAndCode() {
    return GET("/pm-code/getAllPMTypeAndCode");
  }
};
