import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Label, CustomOverlay } from "@uiw/react-baidu-map";
import { useStore } from "../../stores/index";
import { utils } from "../../utils/index";
import { IPolygon } from "../../components/Polygon/index";
import { ILabel } from "../../components/Label/index";

export const MapMonitorMap = () => {
  const { config, mapMonitor } = useStore();

  useEffect(() => {
    return () => {
      //@ts-ignore
      mapMonitor.map = null;
    };
  }, []);

  return useObserver(() => (
    <APILoader akay={config.baiduMapApiKey}>
      <Map onTilesLoaded={mapMonitor.onMapUpdate} zoom={mapMonitor.zoom} center={mapMonitor.center} enableScrollWheelZoom onZoomEnd={(e) => (mapMonitor.zoom = e.target.getZoom())}>
        {mapMonitor.curParkData?.map((park, index) => {
          // if (!park.parkPoints) return;
          return (
            <IPolygon
              updateable
              path={utils.array.formatToLatLngShort(park.parkPoints)}
              key={park.parkName}
              strokeColor="#00FF66"
              strokeStyle="dashed"
              strokeWeight={2}
              fillOpacity={1}
              fillColor={""}
            ></IPolygon>
          );
        })}
        {mapMonitor.curParkData?.map((park) =>
          park.factoryDatas?.map((item, index) => {
            // if (!item.factoryPoints) return;
            return (
              <IPolygon
                updateable
                visiable={mapMonitor.currentTabKey != "2"}
                path={utils.array.formatToLatLngShort(item.factoryPoints)}
                key={index}
                strokeStyle="solid"
                fillColor="#FFD800"
                strokeColor="#FFD800"
                strokeWeight={2}
              />
            );
          })
        )}
        {mapMonitor.curParkData?.map((park) =>
          park.factoryDatas?.map((item) => {
            if (!item.factoryPoints) return;
            return (
              <ILabel
                offset={mapMonitor.offset}
                content={item.factoryName}
                key={item.factoryName}
                position={utils.obj.formatLatLngShort(item.factoryPoints[0])}
                //@ts-ignore
                style={{ color: "white", fontSize: "12px", backgroundColor: "#0072FF", borderColor: "#0EFCFF" }}
                item={item.factoryName}
              />
            );
          })
        )}
        {mapMonitor.curParkData?.map((park) =>
          park.siteDatas?.map((item, index) => (
            <CustomOverlay position={{ lng: Number(item.gpsX), lat: Number(item.gpsY) }} key={index} visiable={mapMonitor.zoom > 17}>
              <div onClick={(e) => mapMonitor.setCurrentRuntimeSite(item.siteId)}>
                {Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../assets/red.png")} />
                ) : (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../assets/green.png")} />
                )}
                {item.collectValue && <div className="number">{item.collectValue}</div>}
              </div>
            </CustomOverlay>
          ))
        )}
      </Map>
    </APILoader>
  ));
};
