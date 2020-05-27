import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { useStore } from "../stores/index";
import { APILoader, Map, Polygon, Control, CustomOverlay } from "@uiw/react-baidu-map";
import { Button, Radio, Input } from "antd";
import { IPolygon } from "./Polygon/index";
import Search from "antd/lib/input/Search";

export const DrawBaiduMap = () => {
  const {
    map: { drawMap },
    config,
  } = useStore();

  useEffect(() => {
    return () => {
      drawMap.reset();
    };
  }, []);
  return useObserver(() => (
    <div className="w-full h-full">
      <APILoader akay={config.baiduMapApiKey}>
        <div style={{ display: "none" }}>{drawMap.count}</div>
        <Map
          onTilesLoaded={drawMap.onMapUpdate}
          onDblClick={drawMap.drawPolygon}
          // onRightClick={drawMap.newPolygon}
          zoom={drawMap.zoom}
          enableScrollWheelZoom
          enableDoubleClickZoom={false}
          onZoomEnd={(e) => (drawMap.zoom = e.target.getZoom())}
        >
          {drawMap.paths.slice().map((item, index) => (
            <IPolygon
              path={item}
              key={index}
              enableEditing={drawMap.editType == "edit"}
              updateable={drawMap.editType == "add"}
              strokeColor="#00FF66"
              strokeStyle="dashed"
              strokeWeight={2}
              onLineUpdate={(e) => {
                if (drawMap.editType === "edit") {
                  const path = e.target.getPath();
                  drawMap.paths[index] = path;
                }
              }}
            />
          ))}
          {drawMap.paths.slice().map((item, index) => {
            return item.map((path, index2) => {
              console.log(123, index);
              return (
                <CustomOverlay key={index} position={{ lng: path.lng, lat: path.lat }}>
                  <div className="point-num" style={{ color: "#00FF66", fontSize: "14px", width: "100px", userSelect: "none", position: "absolute", bottom: "-20px", left: "20px" }}>
                    点{index2}
                  </div>
                </CustomOverlay>
              );
            });
          })}
          {drawMap.editType !== "view" && (
            <Control>
              <div>
                <Search onSearch={drawMap.search} placeholder="请输入关键字" />
                <Radio.Group onChange={drawMap.toggleDrawPolygon} defaultValue="add">
                  <Radio.Button value="add">添加</Radio.Button>
                  <Radio.Button value="edit">修改</Radio.Button>
                </Radio.Group>
              </div>
            </Control>
          )}
        </Map>
      </APILoader>
    </div>
  ));
};
