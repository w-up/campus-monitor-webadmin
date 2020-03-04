import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Polygon, Label, CustomOverlay } from "@uiw/react-baidu-map";
import { useStore } from "../../stores/index";
import "./index.css";

export const DynamicSourcePage = () => {
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
    <div className="flex" style={{ width: "100vw", height: "100vh", backgroundColor: "#061630" }}>
      <div style={{ width: "25%" }}></div>
      <div style={{ width: "75%" }}>
        <APILoader akay={config.baiduMapApiKey}>
          <Map onTilesLoaded={mapStore.onMapUpdate} zoom={mapStore.zoom} center={mapStore.center} enableScrollWheelZoom onZoomEnd={e => (mapStore.zoom = e.target.getZoom())}>
            <Polygon path={mapStore.polygonPath} strokeColor="#00FF66" strokeStyle="dashed" strokeWeight={2} fillColor=""></Polygon>
            {mapStore.compamys.map((item, index) => (
              <Polygon path={item} key={index} strokeStyle="dashed" fillColor="#FFD800" strokeColor="#FFD800" strokeWeight={2}></Polygon>
            ))}
            {mapStore.compname.map((item, index) => (
              <Label
                offset={mapStore.offset}
                content={item.name}
                key={item.name}
                position={item.position}
                //@ts-ignore
                style={{ color: "white", fontSize: "12px", backgroundColor: "#0072FF", borderColor: "#0EFCFF" }}
                item={item.name}
              ></Label>
            ))}
            {mapStore.zoom > 17 && (
              <CustomOverlay paneName="floatPane">
                {mapStore.pointsc.map((item, index) => (
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
      </div>
    </div>
  ));
};
