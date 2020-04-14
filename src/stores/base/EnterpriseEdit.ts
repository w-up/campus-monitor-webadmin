import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";

export class EnterpriseEdit {
  @observable loading: boolean = false;

  @action.bound
  async onSubmit(param) {
    if (!param.id) {
      await POST('/company/addCompany', param);
    } else {
      await POST('/company/editCompany', param);
    }
  }

}
