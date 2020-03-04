import { observable, action } from "mobx";

export class DrawMapStore {
  @observable center = { lng: 120.983642, lat: 31.36556 };
  @observable zoom = 17;
  @observable map: any = null;
  @observable overlays = [];
  @observable polygon = {
    paths: [
      [
        { lng: 120.97411996159416, lat: 31.369259853030464 },
        { lng: 120.98989420634938, lat: 31.368519871554376 },
        { lng: 120.9846301360609, lat: 31.361844356051616 },
        { lng: 120.97598843705491, lat: 31.365621554119674 }
      ]
    ] as any[],
    editType: "add" as "add" | "edit"
  };
  @action.bound
  init(data: Partial<DrawMapStore> = {}) {
    Object.assign(this, {
      center: { lng: 120.983642, lat: 31.36556 },
      zoom: 17,
      map: null,
      overlays: [],
      polygon: {
        paths: [
          [
            { lng: 120.97411996159416, lat: 31.369259853030464 },
            { lng: 120.98989420634938, lat: 31.368519871554376 },
            { lng: 120.9846301360609, lat: 31.361844356051616 },
            { lng: 120.97598843705491, lat: 31.365621554119674 }
          ]
        ],
        editing: false
      },
      ...data
    });
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.target;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });
    } else {
    }
  }

  @action.bound
  toggleDrawPolygon(e: any) {
    this.polygon.editType = e.target.value;
  }

  @action.bound
  drawPolygon(e: any) {
    if (this.polygon.editType !== "add") {
      return;
    }
    const { paths } = this.polygon;
    !paths.length && paths.push([]);
    paths[paths.length - 1].push(e.point);
    console.log(e.getPath);
  }

  @action.bound
  newPolygon(e: any) {
    if (this.polygon.editType !== "add") {
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
