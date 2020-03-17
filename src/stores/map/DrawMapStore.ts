import { observable, action } from "mobx";
import { ParkEdit } from "../base/ParkEdit";

export class DrawMapStore {
  @observable center = { lng: 120.983642, lat: 31.36556 };
  @observable zoom = 17;
  @observable map: any = null;
  @observable polygon = {
    paths: [] as Array<Array<{ lng: number; lat: number }>>
  };
  @observable editType = "add" as "view" | "add" | "edit";

  @action.bound
  init(data: Partial<DrawMapStore> = {}) {
    Object.assign(this, { ...data });
    return this;
  }

  @action.bound
  reset(data: Partial<DrawMapStore> = {}) {
    Object.assign(this, {
      map: null,
      polygon: {
        paths: []
      },
      ...data
    });
    return this;
  }

  @action.bound
  getCurLocation() {
    const local = new BMap.LocalCity();
    local.get(result => {
      console.log(result);

      Object.assign(this, {
        center: result.center,
        zoom: result.level
      });
      console.log(this.center);
    });
  }

  @action.bound
  setPaths(paths: DrawMapStore["polygon"]["paths"]) {
    this.polygon.paths = paths;
    console.log(paths);
    if (!this.map) return;
    this.autoCenterAndZoom();
  }

  @action.bound
  setPathsByScope(scope: ParkEdit["scope"]) {
    this.polygon.paths = [scope.map(i => ({ lng: Number(i.longitude), lat: Number(i.latitude) }))];
    if (!this.map) return;
    this.autoCenterAndZoom();
  }

  @action.bound
  autoCenterAndZoom() {
    let mapViewObj = this.map.getViewport(this.polygon.paths[0], {});
    this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom);
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.target;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });
      this.autoCenterAndZoom();
    } else {
    }
  }

  @action.bound
  search(val: string) {
    const local = new BMap.LocalSearch(this.map, {
      renderOptions: { map: this.map, autoViewport: true, selectFirstResult: true, panel: "results" }
    });
    local.search(val);
  }

  @action.bound
  toggleDrawPolygon(e: any) {
    this.editType = e.target.value;
  }

  @action.bound
  drawPolygon(e: any) {
    if (this.editType !== "add") {
      return;
    }
    const { paths } = this.polygon;
    !paths.length && paths.push([]);
    paths[paths.length - 1].push(e.point);
    console.log(e.getPath);
  }

  @action.bound
  newPolygon(e: any) {
    if (this.editType !== "add") {
      return;
    }
    const { paths } = this.polygon;

    if (!paths.length) {
      paths.push([]);
    }
    const path = paths[paths.length - 1];
    path.pop();
    if (path.length) {
      paths.push([]);
    }
  }
}
