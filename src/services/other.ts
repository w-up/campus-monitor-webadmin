import { GET, POST } from "../utils/request";

export default {
  setSelectedPark(data: { parkId: number }) {
    return POST("/selected-park-or-factory/setSelectedPark", data);
  },
  addConcernSite(data: { parkId: number; siteIds: number[] }) {
    return POST("/user-site-concern-rel/addConcernSite", data);
  },
  getWeather(data: { city: string }) {
    return GET("/weather/getWeather", data);
  },
  setSelectedFactory(data: { factoryId: string }) {
    return POST("/selected-park-or-factory/setSelectedFactory", data);
  }
};
