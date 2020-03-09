import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import style from "../../../../common/mapStyle";
import { useStore } from "../../../../stores";
import ExampleMap from "../../../../assets/img/ps23ab282a19d8effb-a4e4-48b5-98dd-2e7d611be405.png";

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
    groundOverlay.setImageURL(ExampleMap);
    mapStore.map.addOverlay(groundOverlay); //添加图片覆盖物
    // bus.$on("changeBottomIndex", mapStore.addpoints)
    mapStore.addpoints(0); //添加站点覆盖物
    mapStore.play();
    return () => {
      mapStore.map = null;
    };
  }, [mapStore]);

  return useObserver(() => (
    <div className="relative" style={{ background: "#0F1B35" }}>
      <span className="corner cornerTl" />
      <span className="corner cornerTr" />
      <span className="corner cornerBl" />
      <span className="corner cornerBr" />
      <div id="allmap" style={{ height: "40vh" }} />
      <div className="my-4 p-2 px-6 mapExplain flex flex-row">
        <div className="primary-text-dark w-2/3">当前厂区：A厂区</div>
        <div className="flex flex-row w-1/3 screen-text-color-2 justify-between">
          <div>
            <div className="blockNormal" />
            正常值
          </div>
          <div>
            <div className="redOver" />
            超标值
          </div>
        </div>
      </div>
    </div>
  ));
};
