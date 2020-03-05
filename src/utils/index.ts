import { _ } from "./lodash";

export const utils = {
  array: {
    scrollArray(arr: any[]) {
      const a = arr.shift();
      arr.push(a);
      return arr;
    },
    sliceArray(arr: any, curIndex: number, count: number) {
      const left = curIndex - count + 1;
      const right = arr.length - curIndex;
      if (left < 0) {
        return arr.slice(0, count);
      } else if (right <= 0) {
        return arr.slice(arr.length - count, arr.length);
      }
      return arr.slice(left, left + count);
    }
  }
};
