import { GET, POST } from "../utils/request";

export default {
  getMapConfigLogin() {
    return GET("/map-config/getMapConfigLogin");
  }
};
