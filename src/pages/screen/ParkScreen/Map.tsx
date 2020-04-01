import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Polygon, Label, CustomOverlay } from "@uiw/react-baidu-map";
import { useStore } from "../../../stores/index";
import "./Map.css";
import { utils } from "../../../utils/index";

export const ParkScreenMap = () => {
  const {
    config,
    screen: { parkScreenMap }
  } = useStore();

  useEffect(() => {
    return () => {
      //@ts-ignore
      parkScreenMap.map = null;
    };
  }, []);

  return useObserver(() => (
    <div style={{ width: "100%", height: "50vh" }}>
      <APILoader akay={config.baiduMapApiKey}>
        <Map onTilesLoaded={parkScreenMap.onMapUpdate} enableScrollWheelZoom onZoomEnd={e => (parkScreenMap.zoom = e.target.getZoom())}>
          <Polygon
            path={utils.array.formatToLatLngShort(parkScreenMap.allParkMapData.parkPoints)}
            visiable={parkScreenMap.allParkMapData?.parkPoints?.length > 0}
            strokeColor="#00FF66"
            strokeStyle="dashed"
            strokeWeight={2}
            fillColor=""
          ></Polygon>
          {parkScreenMap.allParkMapData?.factoryDatas?.map((item, index) => {
            if (!item.factoryPoints) return;
            return (
              <Polygon path={utils.array.formatToLatLngShort(item.factoryPoints)} key={`polygon-${index}`} strokeStyle="dashed" fillColor="#FFD800" strokeColor="#FFD800" strokeWeight={2}></Polygon>
            );
          })}
          {parkScreenMap.allParkMapData?.factoryDatas?.map((item, index) => {
            if (!item.factoryPoints) return;
            return (
              <Label
                offset={parkScreenMap.offset}
                content={item.factoryName}
                key={index}
                position={utils.obj.formatLatLngShort(item.factoryPoints[0])}
                //@ts-ignore
                style={{ color: "white", fontSize: "12px", backgroundColor: "#0072FF", borderColor: "#0EFCFF" }}
                item={item.factoryName}
              ></Label>
            );
          })}
          {parkScreenMap.allParkMapData?.siteDatas?.map((item, index) => (
            <CustomOverlay position={{ lng: Number(item.gpsX), lat: Number(item.gpsY) }} key={index}>
              <div>
                {Number(item.collectValue) > Number(item.limit) ? (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../../assets/red.png")} />
                ) : (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../../assets/green.png")} />
                )}
                <div className="number">{item.collectValue || 0}</div>
              </div>
            </CustomOverlay>
          ))}
        </Map>
      </APILoader>
    </div>
  ));
};
