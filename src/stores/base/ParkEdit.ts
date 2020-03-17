import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";

export class ParkEdit {
  @observable scope: Array<
    Partial<{
      id: string;
      key: number;
      parkId: string;
      scopeName: string;
      longitude: number | string;
      latitude: number | string;
      scopeOrder: null;
    }>
  > = [];
  @observable loading: boolean = false;

  @action.bound
  async onSubmit(param) {
    this.loading = true;
    if (!param.id) {
      await POST("/park/addPark", param);
    } else {
      await POST("/park/editPark", param);
    }
    this.loading = false;
  }

  @action.bound
  updateMapPoints() {
    console.log(store.map.drawMap.polygon.paths);
    this.scope = store.map.drawMap.polygon.paths[0].map((item, index) => ({
      key: index,
      scopeName: `点${index + 1}`,
      latitude: item.lat,
      longitude: item.lng
    }));
  }
}
