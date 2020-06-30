import { _ } from "./lodash";
import { globalConfig } from "../config";

export const utils = {
  number: {
    digitCount: num => String( Math.floor( Math.abs(num) ) ).length -1,
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
  colors: {
    getPollutionColor(val) {
      if (val <= 50) {
        return { r: 0, g: 228, b: 0 };
      }
      if (val <= 100) {
        return { r: 255, g: 255, b: 0 };
      }
      if (val <= 150) {
        return { r: 255, g: 126, b: 0 };
      }
      if (val <= 200) {
        return { r: 255, g: 0, b: 0 };
      }
      if (val <= 300) {
        return { r: 153, g: 0, b: 76 };
      }
      return { r: 126, g: 0, b: 35 };
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
