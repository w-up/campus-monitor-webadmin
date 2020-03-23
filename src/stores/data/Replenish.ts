import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";

export class Replenish {
  @observable loading: boolean = false;
  @observable parksAndFactories: any = [];

  @action.bound
  async getCheckDataList() {
    this.loading = true;

    try {
      const { data }: any = await POST('/dataAdd/getDataAddByPageBySelf', {});

    } catch {

    }

    this.loading = false;
  }

  @action.bound
  async getAllParksAndFactories() {
    this.loading = true;
    try {
      const { data }: any = await GET('/park/getAllParksAndFactories', {});
      this.parksAndFactories = data.parks;
    } catch {

    }
    
    this.loading = false;
  }

}
