import { GET, POST } from "../utils/request";

export default {
  getAllFactoryLogin(data: { parkId: number }) {
    return POST("/factory/getAllFactoryLogin", data);
  }
};
