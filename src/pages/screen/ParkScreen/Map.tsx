import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Polygon } from "@uiw/react-baidu-map";
import { useStore } from "../../../stores/index";

export const ParkScreenMap = () => {
  const {
    config,
    screen: { parkScreenMap: mapStore }
  } = useStore();

  useEffect(() => {
    return () => {
      //@ts-ignore
      mapStore.map = null;
    };
  }, [mapStore.map]);

  return useObserver(() => (
    <div style={{ width: "100%", height: "50vh" }}>
      <APILoader akay={config.baiduMapApiKey}>
        <Map onTilesLoaded={mapStore.handle} zoom={mapStore.zoom} center={mapStore.center} enableScrollWheelZoom>
          <Polygon path={mapStore.polygonPath} strokeColor="#00FF66" strokeStyle="dashed" strokeWeight={2} fillColor=""></Polygon>
          {mapStore.compamys.map((item, index) => (
            <Polygon path={item} key={index} strokeStyle="dashed" fillColor="#FFD800" strokeColor="#FFD800" strokeWeight={2}></Polygon>
          ))}
        </Map>
      </APILoader>
    </div>
  ));
};
