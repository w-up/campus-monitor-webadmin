import { GET, POST } from "../utils/request";

export default {
  getAllPMsByFactoryId() {
    return GET("/device-pm-code/getAllPMsByFactoryId");
  },
  setFactorySelectedPM(data: { pmCodes: number[] }) {
    return POST("/device-pm-code/setFactorySelectedPM", data);
  }
};
