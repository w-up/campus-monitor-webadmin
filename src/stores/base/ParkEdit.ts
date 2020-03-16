import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";

export class ParkEdit {
  @observable scope: Array<any> = [];
  @observable loading: boolean = false;
  

  @action.bound
  async onSubmit(param) {
    this.loading = true;
    if (!param.id) {
      await POST('/park/addPark', param);
    } else {
      await POST('/park/editPark', param);
    }
    this.loading = false;
  }

  @action.bound
  updateMapPoints(map) {
    this.scope = map.polygon.paths[0].map((item, index) => ({
      key: index,
      scopeName: `点${index + 1}`,
      latitude: item.lat,
      longitude: item.lng,
    }));
  }

}
