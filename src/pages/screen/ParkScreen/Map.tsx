import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Label, CustomOverlay } from "@uiw/react-baidu-map";
import { useStore } from "../../../stores/index";
import "./Map.css";
import { utils } from "../../../utils/index";
import { IPolygon } from "../../../components/Polygon/index";
import { ILabel } from "../../../components/Label/index";

export const ParkScreenMap = () => {
  const {
    config,
    screen: { parkScreenMap },
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
        <Map onTilesLoaded={parkScreenMap.onMapUpdate} enableScrollWheelZoom onZoomEnd={(e) => (parkScreenMap.zoom = e.target.getZoom())}>
          <IPolygon
            visiable={parkScreenMap.allParkMapData.parkPoints?.length > 0}
            updateable
            path={utils.array.formatToLatLngShort(parkScreenMap.allParkMapData.parkPoints)}
            strokeColor="#00FF66"
            strokeStyle="dashed"
            strokeWeight={2}
            fillColor=""
          ></IPolygon>
          {parkScreenMap.allParkMapData?.factoryDatas?.map((item, index) => {
            // if (!item.factoryPoints) return;
            return (
              <IPolygon
                updateable
                visiable={!!item.factoryPoints}
                path={utils.array.formatToLatLngShort(item.factoryPoints)}
                key={`IPolygon-${index}`}
                strokeStyle="solid"
                fillColor="#FFD800"
                strokeColor="#FFD800"
                strokeWeight={2}
              ></IPolygon>
            );
          })}
          {parkScreenMap.allParkMapData?.factoryDatas?.map((item, index) => {
            // if (!item.factoryPoints) return;
            return (
              <ILabel
                offset={parkScreenMap.offset}
                visiable={!!item.factoryPoints}
                content={`<div style="border-radius: 20px; border: 1px solid #0EFCFF;">${item.averageValue || 0}</div> ${item.factoryName}`}
                key={index}
                position={utils.obj.formatLatLngShort(item.factoryPoints ? item.factoryPoints[0] : [])}
                //@ts-ignore
                style={{ color: "white", fontSize: "12px", backgroundColor: "#0072FF", borderColor: "#0EFCFF" }}
                item={item.factoryName}
              ></ILabel>
            );
          })}
          {parkScreenMap.allParkMapData?.siteDatas?.map((item, index) => (
            <CustomOverlay position={{ lng: Number(item.gpsX), lat: Number(item.gpsY) }} key={index} visiable={parkScreenMap.zoom > 17}>
              <div>
                {Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../../assets/red.png")} />
                ) : (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../../assets/green.png")} />
                )}
                {item.collectValue && <div className="number">{item.collectValue}</div>}
              </div>
            </CustomOverlay>
          ))}
        </Map>
      </APILoader>
    </div>
  ));
};
