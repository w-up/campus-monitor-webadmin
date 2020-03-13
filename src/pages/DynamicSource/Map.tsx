import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Polygon, Label, CustomOverlay, Marker } from "@uiw/react-baidu-map";
import { useStore } from "../../stores/index";
import blueArrow from "../../assets/img/arrow-blue.png";
import { _ } from "utils/lodash";
import { utils } from "../../utils/index";
import { PolarRadialChart } from "../../components/PolarRadialChart";

export const DynamicSourceMap = () => {
  const { config, dynamicSource } = useStore();
  const icon = new BMap.Icon(blueArrow, new BMap.Size(92, 30));

  useEffect(() => {
    return () => {
      //@ts-ignore
      dynamicSource.map = null;
    };
  }, []);
  return useObserver(() => (
    <APILoader akay={config.baiduMapApiKey}>
      <Map onTilesLoaded={dynamicSource.onMapUpdate} zoom={dynamicSource.zoom} center={dynamicSource.center} enableScrollWheelZoom onZoomEnd={e => (dynamicSource.zoom = e.target.getZoom())}>
        <Polygon path={dynamicSource.polygonPath} strokeColor="#00FF66" strokeStyle="dashed" strokeWeight={2} fillColor=""></Polygon>
        {dynamicSource.compamys.map((item, index) => (
          <Polygon path={item} key={index} strokeStyle="dashed" fillColor="#FFD800" strokeColor="#FFD800" strokeWeight={2}></Polygon>
        ))}
        {dynamicSource.compname.map((item, index) => (
          <Label
            offset={dynamicSource.offset}
            content={item.name}
            key={item.name}
            position={item.position}
            //@ts-ignore
            style={{ color: "white", fontSize: "12px", backgroundColor: "#0072FF", borderColor: "#0EFCFF" }}
            item={item.name}
          ></Label>
        ))}
        {false && dynamicSource.computeType == "1" && (
          <CustomOverlay paneName="floatPane">
            {dynamicSource.pointsc.map((item, index) => (
              <div key={index} style={{ position: "absolute", left: item.mapPos.left, top: item.mapPos.top, transform: `rotate(${Math.random() * 360}deg)` }}>
                {item.number < 15 ? (
                  <img style={{ maxWidth: "92px", height: "30px" }} src={require("../../assets/img/arrow-blue.png")} />
                ) : (
                  <img style={{ maxWidth: "92px", height: "30px", transform: "rotate(90dge)" }} src={require("../../assets/img/arrow-blue.png")} />
                )}
                <div className="number">{item.number}</div>
              </div>
            ))}
          </CustomOverlay>
        )}

        {dynamicSource.computeType == "2" && dynamicSource.zoom >= 17 && (
          <CustomOverlay paneName="floatPane" position={utils.obj.formatLatLngShort(dynamicSource.polyCenter)}>
            <PolarRadialChart />
          </CustomOverlay>
        )}

        {dynamicSource.computeType == "3" && (
          <CustomOverlay paneName="floatPane">
            {dynamicSource.pointsc.map((item, index) => (
              <div key={index} style={{ position: "absolute", left: item.mapPos.left, top: item.mapPos.top }}>
                {item.number < 15 ? (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../assets/green.png")} />
                ) : (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../assets/red.png")} />
                )}
                <div className="number">{item.number}</div>
              </div>
            ))}
          </CustomOverlay>
        )}
      </Map>
    </APILoader>
  ));
};
