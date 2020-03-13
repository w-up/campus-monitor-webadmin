import { GET, POST } from "../utils/request";

export default {
  getMapConfigLogin(data: { parkId: number }) {
    return GET("/map-config/getMapConfigLogin", data);
  },
  updateMapConfig(data: { highAngle: number; latitude: number; longitude: number; pic?: FormData; rotationAngle: number; zoom: number }) {
    return POST("/map-config/updateMapConfig", data);
  }
};
