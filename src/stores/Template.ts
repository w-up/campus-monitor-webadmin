import { observable, action } from "mobx";

export class TemplateStore {
  @observable count = 1;

  @action.bound
  setCount(val: number) {
    this.count = val;
  }
}
