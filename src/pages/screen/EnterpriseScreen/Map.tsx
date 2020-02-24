import React, { useEffect } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import style from "../../../common/mapStyle";
import { ComplexCustomOverlay } from "./customOverlay";
import { constant } from "../../../common/constants";

//@ts-ignore
const BMapGL = window.BMapGL;

export const EnterpriseMap = () => {
  const store = useLocalStore(() => ({
    map: null as any,
    center: new BMapGL.Point(116.384405, 39.9001),
    zoom: 20,
    heading: 50.5,
    tilt: 53,
    overlays: [] as any,
    activeFlag: true,
    lists: constant.EnterpriseScreenListData as any,
    curIndex: 0,
    addpoints(index: number) {
      var myCompOverlay;
      for (let x in this.overlays) {
        this.map.removeOverlay(this.overlays[x]);
      }
      this.curIndex = index;
      this.overlays = [];
      for (let x in this.lists) {
        myCompOverlay = new ComplexCustomOverlay(new BMapGL.Point(this.lists[x].position[0], this.lists[x].position[1]), this.lists[x], x, this);
        this.overlays.push(myCompOverlay);
        this.map.addOverlay(myCompOverlay);
      }
    }
  }));
  useEffect(() => {
    store.map = new BMapGL.Map("allmap", {
      style: { styleJson: style }
    }); // 创建Map实例
    store.map.centerAndZoom(store.center, 20); // 初始化地图,设置中心点坐标和地图级别
    store.map.setHeading(store.heading); //俯视角度
    store.map.setTilt(store.tilt); //旋转角度
    let SW = new BMapGL.Point(116.38179, 39.900146);
    let NE = new BMapGL.Point(116.384451, 39.901146);

    let groundOverlayOptions = {
      opacity: 1,
      displayOnMinLevel: 10,
      displayOnMaxLevel: 25
    };

    // 初始化GroundOverlay
    let groundOverlay = new BMapGL.GroundOverlay(new BMapGL.Bounds(SW, NE), groundOverlayOptions);
    groundOverlay.setImageURL("https://lanhu.oss-cn-beijing.aliyuncs.com/ps23ab282a19d8effb-a4e4-48b5-98dd-2e7d611be405");
    store.map.addOverlay(groundOverlay); //添加图片覆盖物
    // bus.$on("changeBottomIndex", store.addpoints)
    store.addpoints(0); //添加站点覆盖物
  }, [store]);
  return useObserver(() => (
    <div style={{ width: "100%", height: "100%" }}>
      <div id="allmap" style={{ width: "46vw", height: "46vh" }} />
    </div>
  ));
};
