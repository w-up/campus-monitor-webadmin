import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { Map, APILoader, Label, CustomOverlay, Marker } from "@uiw/react-baidu-map";
import { useStore } from "../../stores/index";
import blueArrow from "../../assets/img/arrow-blue.png";
import { _ } from "utils/lodash";
import { utils } from "../../utils/index";
import { PolarRadialChart } from "../../components/PolarRadialChart";
import { IPolygon } from '../../components/Polygon/index';

export const DynamicSourceMap = () => {
  const { config, dynamicSource } = useStore();

  useEffect(() => {
    return () => {
      //@ts-ignore
      dynamicSource.map = null;
    };
  }, []);
  return useObserver(() => (
    <APILoader akay={config.baiduMapApiKey}>
      <Map
        onTilesLoaded={dynamicSource.onMapUpdate}
        onClick={dynamicSource.onMapClick}
        zoom={dynamicSource.zoom}
        center={dynamicSource.center}
        enableScrollWheelZoom
        onZoomEnd={(e) => (dynamicSource.zoom = e.target.getZoom())}
      >
        {dynamicSource.curParkData?.map((park, index) => (
          <IPolygon updateable path={utils.array.formatToLatLngShort(park.parkPoints)} key={index} strokeColor="#00FF66" strokeStyle="dashed" strokeWeight={2} fillColor={""}></IPolygon>
        ))}
        {dynamicSource.curParkData?.map((park) =>
          park.factoryDatas?.map((item, index) => (
            <IPolygon updateable path={utils.array.formatToLatLngShort(item.factoryPoints)} key={index} strokeStyle="solid" fillColor="#FFD800" strokeColor="#FFD800" strokeWeight={2}></IPolygon>
          ))
        )}
        {dynamicSource.curParkData?.map((park) =>
          park.factoryDatas?.map((item) => {
            if (!item.factoryPoints) return;
            return (
              <Label
                offset={dynamicSource.offset}
                content={item.factoryName}
                key={item.factoryName}
                position={utils.obj.formatLatLngShort(item.factoryPoints[0])}
                //@ts-ignore
                style={{ color: "white", fontSize: "12px", backgroundColor: "#0072FF", borderColor: "#0EFCFF" }}
                item={item.factoryName}
              ></Label>
            );
          })
        )}
        {dynamicSource.curParkData?.map((park) =>
          park.siteDatas?.map((item, index) => (
            <CustomOverlay position={{ lng: Number(item.gpsX), lat: Number(item.gpsY) }} key={index} visiable={dynamicSource.zoom > 17}>
              <div>
                {Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../assets/red.png")} />
                ) : (
                  <img style={{ maxWidth: "40px", height: "40px" }} src={require("../../assets/green.png")} />
                )}
                <div className="number">{item.collectValue || 0}</div>
              </div>
            </CustomOverlay>
          ))
        )}

        {dynamicSource.computeType == "1" &&
          dynamicSource.curDynamicSourceContribution?.valueList?.map(
            (item, index) => (
              <CustomOverlay position={{ lng: Number(item.lng), lat: Number(item.lat) }} key={index}>
                {console.log(item)}
                <img src={require("../../assets/img/arrow-blue.png")} style={{ transform: `rotate(${item.angle}deg)`, maxWidth: "15px", height: "88px" }}></img>
              </CustomOverlay>
            )
            // <Marker position={{ lng: Number(item.lng), lat: Number(item.lat) }} key={index} rotation={90} icon={new BMap.Icon(require("../../assets/img/arrow-blue.png"), new BMap.Size(31, 176))} />
          )}

        {dynamicSource.computeType == "2" &&
          dynamicSource.curDynamicSourceWindRose?.valueList?.map((item, index) => (
            <CustomOverlay position={{ lng: Number(item.lng), lat: Number(item.lat) }} key={index}>
              <div style={{ background: "rgba(32,26,68,0.7)", padding: "10px" }}>
                <PolarRadialChart />
              </div>
            </CustomOverlay>
          ))}

        {dynamicSource.computeType == "3" &&
          dynamicSource.curDynamicSourceTraceSource?.valueList?.map((item, index) => (
            <CustomOverlay position={{ lng: Number(item.lng), lat: Number(item.lat) }} key={index}>
              <div className="flex items-center">
                <img style={{ maxWidth: "60px", height: "60px" }} src={require("../../assets/img/point-red.png")} />
                <div style={{ color: "red", fontSize: "12px", width: "100px" }}>
                  <div>位置{index}</div>
                  <div>{item.value}ppm</div>
                </div>
              </div>
            </CustomOverlay>
          ))}
      </Map>
    </APILoader>
  ));
};
