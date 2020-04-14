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
    this.scope = [];
    this.loading = false;
  }

  @action.bound
  addScope() {
    this.scope = [ ...this.scope, { scopeName: `点${this.scope.length + 1}`, longitude: '', latitude: '' } ];
  }

  @action.bound
  setScope(scope) {
    this.scope = scope;
  }

  @action.bound
  scopeNameInput(value, index) {
    this.scope[index].scopeName = value;
  }

  @action.bound
  longitudeInput(value, index) {
    this.scope[index].longitude = value;
  }

  @action.bound
  latitudeInput(value, index) {
    this.scope[index].latitude = value;
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
