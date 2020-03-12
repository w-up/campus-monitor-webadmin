import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";

export class ParkEdit {
  @observable parkName: string = '';
  @observable parkNo: string = '';
  @observable parkStatus: number = 1;
  @observable remark: string = '';
  @observable scope: Array<any> = [];
  @observable scopeType: string = 'location';
  

  @action.bound
  async onSubmit(param) {
    await POST('/park/addPark', param);
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
