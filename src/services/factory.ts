import { GET, POST } from "../utils/request";

export default {
  getAllFactoryLogin() {
    return GET("/factory/getAllFactoryLogin");
  }
};
