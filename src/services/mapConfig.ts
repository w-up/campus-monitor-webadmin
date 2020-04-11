import { GET, POST } from "../utils/request";
import http from "../utils/request";

export default {
  getMapConfigLogin() {
    return GET("/map-config/getMapConfigLogin");
  },
  updateMapConfig(data: { highAngle: number; latitude: number; longitude: number; pic?: FormData; rotationAngle: number; zoom: number }) {
    const { pic, ...other } = data;

    return http({
      url: "/map-config/updateMapConfig",
      method: "POST",
      params: other,
      data: pic
    });
  },
  deleteMapConfig() {
    return POST("/map-config/delMapConfig");
  }
};
