import { _ } from "./lodash";

export const utils = {
  array: {
    scrollArray(arr: any[]) {
      const a = arr.shift();
      arr.push(a);
      return arr;
    }
  }
};
