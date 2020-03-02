import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import style from "../../../../common/mapStyle";
import { useStore } from "../../../../stores";

//@ts-ignore
const BMapGL = window.BMapGL;

export const EnterpriseMap = () => {
  const {
    screen: { enterpriseScreenMap: mapStore }
  } = useStore();
  useEffect(() => {
    mapStore.map = new BMapGL.Map("allmap", {
      style: { styleJson: style }
    }); // 创建Map实例

    mapStore.map.centerAndZoom(mapStore.center, mapStore.zoom); // 初始化地图,设置中心点坐标和地图级别
    mapStore.map.setHeading(mapStore.heading); //俯视角度
    mapStore.map.setTilt(mapStore.tilt); //旋转角度
    let SW = new BMapGL.Point(116.38179, 39.900146);
    let NE = new BMapGL.Point(116.384451, 39.901146);

    let groundOverlayOptions = {
      opacity: 1,
      displayOnMinLevel: 10,
      displayOnMaxLevel: 20
    };

    // 初始化GroundOverlay
    let groundOverlay = new BMapGL.GroundOverlay(new BMapGL.Bounds(SW, NE), groundOverlayOptions);
    groundOverlay.setImageURL("https://lanhu.oss-cn-beijing.aliyuncs.com/ps23ab282a19d8effb-a4e4-48b5-98dd-2e7d611be405");
    mapStore.map.addOverlay(groundOverlay); //添加图片覆盖物
    // bus.$on("changeBottomIndex", mapStore.addpoints)
    mapStore.addpoints(0); //添加站点覆盖物
    return () => {
      mapStore.map = null;
    };
  }, [mapStore]);
  return useObserver(() => (
    <div className="py-4" style={{background:"#6076AD"}}>
      <div id="allmap" style={{ height: "50vh" }} />
    </div>
  ));
};
