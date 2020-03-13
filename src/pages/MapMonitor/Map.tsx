import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Polygon, Label, CustomOverlay } from "@uiw/react-baidu-map";
import { useStore } from "../../stores/index";

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
        <Polygon path={mapMonitor.polygonPath} strokeColor="#00FF66" strokeStyle="dashed" strokeWeight={2} fillColor={mapMonitor.currentTabKey == "2" ? "#00FF66" : ""}></Polygon>
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
        {mapMonitor.zoom > 17 && (
          <CustomOverlay paneName="floatPane">
            {mapMonitor.pointsc.map((item, index) => (
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
