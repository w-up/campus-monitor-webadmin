import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Polygon, Label, CustomOverlay, Marker } from "@uiw/react-baidu-map";
import { useStore } from "../../stores/index";
import { utils } from "../../utils/index";

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
      <Map onTilesLoaded={mapMonitor.onMapUpdate} zoom={mapMonitor.zoom} center={mapMonitor.center} enableScrollWheelZoom onZoomEnd={e => (mapMonitor.zoom = e.target.getZoom())}>
        {mapMonitor.curParkData?.map((park, index) => (
          <Polygon path={utils.array.formatToLatLngShort(park.parkPoints)} key={index} strokeColor="#00FF66" strokeStyle="dashed" strokeWeight={2} fillColor={""}></Polygon>
        ))}
        {mapMonitor.compamys.map((item, index) => (
          <Polygon path={item} key={index} strokeStyle="dashed" fillColor="#FFD800" strokeColor="#FFD800" strokeWeight={2}></Polygon>
        ))}

        {mapMonitor.compname.map((item, index) => (
          <Label
            offset={mapMonitor.offset}
            content={item.name}
            key={item.name}
            position={item.position}
            //@ts-ignore
            style={{ color: "white", fontSize: "12px", backgroundColor: "#0072FF", borderColor: "#0EFCFF" }}
            item={item.name}
          ></Label>
        ))}
        {mapMonitor.curParkData?.map(park =>
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
      </Map>
    </APILoader>
  ));
};
