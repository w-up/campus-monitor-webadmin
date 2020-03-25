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
        {dynamicSource.curParkData?.map((park, index) => (
          <Polygon path={utils.array.formatToLatLngShort(park.parkPoints)} key={index} strokeColor="#00FF66" strokeStyle="dashed" strokeWeight={2} fillColor={""}></Polygon>
        ))}
        {dynamicSource.curParkData?.map(park =>
          park.factoryDatas?.map((item, index) => (
            <Polygon path={utils.array.formatToLatLngShort(item.factoryPoints)} key={index} strokeStyle="dashed" fillColor="#FFD800" strokeColor="#FFD800" strokeWeight={2}></Polygon>
          ))
        )}
        {dynamicSource.curParkData?.map(park =>
          park.factoryDatas?.map(item => {
            if (!item.factoryPoints) return;
            return (
              <Label
                offset={dynamicSource.offset}
                content={item.factoryName}
                key={item.factoryName}
                position={item.factoryPoints[0]}
                //@ts-ignore
                style={{ color: "white", fontSize: "12px", backgroundColor: "#0072FF", borderColor: "#0EFCFF" }}
                item={item.factoryName}
              ></Label>
            );
          })
        )}
        {dynamicSource.curParkData?.map(park =>
          park.siteDatas?.map((item, index) => (
            <CustomOverlay position={{ lng: Number(item.gpsX), lat: Number(item.gpsY) }} key={index}>
              <div>
                {Number(item.collectValue) > Number(item.limit) ? (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../assets/red.png")} />
                ) : (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../assets/green.png")} />
                )}
                <div className="number">{item.collectValue || 0}</div>
              </div>
            </CustomOverlay>
          ))
        )}

        {false && dynamicSource.computeType == "2" && (
          <CustomOverlay paneName="floatPane" position={utils.obj.formatLatLngShort(dynamicSource.polyCenter)}>
            <PolarRadialChart />
          </CustomOverlay>
        )}
      </Map>
    </APILoader>
  ));
};
