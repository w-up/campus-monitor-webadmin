import { _ } from "./lodash";
import { globalConfig } from "../config";

export const utils = {
  img: {
    getImageUrl(path: string) {
      if (path.startsWith("data:image")) return path;
      return `${globalConfig.apiEndpoint}/${path}`;
    }
  },
  obj: {
    formatLatLngShort(i) {
      return {
        lat: i.latitude,
        lng: i.longitude
      };
    }
  },
  array: {
    formatLatLngLong(arr) {
      if (!arr) return [];
      return arr.map(i => ({
        latitude: i.lat,
        longitude: i.lng
      }));
    },
    formatLatLngShort(arr) {
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
    }
  }
};
