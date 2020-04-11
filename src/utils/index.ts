import { _ } from "./lodash";
import { globalConfig } from "../config";

export const utils = {
  number: {
    toPrecision(val: any, precision = 3) {
      if (!val) return 0;
      return Number(val).toPrecision(precision).replace("e+", "*10^");
    },
  },
  img: {
    getImageUrl(path: string) {
      if (!path) return;
      if (path.startsWith("data:image")) return path;
      return `${globalConfig.apiEndpoint}/${path}`;
    },
  },
  obj: {
    formatLatLngShort(i) {
      if (!i) {
        return {
          lat: 0,
          lng: 0,
        };
      }
      return {
        lat: i.latitude,
        lng: i.longitude,
      };
    },
  },
  array: {
    formatToLatLngLong(arr) {
      if (!arr) return [];
      return arr.map((i) => ({
        latitude: i.lat,
        longitude: i.lng,
      }));
    },
    formatToLatLngShort(arr) {
      if (!arr) return;
      return arr.map(utils.obj.formatLatLngShort);
    },
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
    },
  },
};
