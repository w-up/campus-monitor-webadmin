import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { useStore } from "../stores/index";
import { APILoader, Map, Polygon, Control } from "@uiw/react-baidu-map";
import { Button, Radio, Input } from "antd";
import { IPolygon } from "./Polygon/index";
import Search from "antd/lib/input/Search";

export const DrawBaiduMap = () => {
  const {
    map: { drawMap },
    config
  } = useStore();

  useEffect(() => {
    return () => {
      drawMap.init();
    };
  }, []);
  return useObserver(() => (
    <div className="w-full h-full">
      <APILoader akay={config.baiduMapApiKey}>
        <Map
          onTilesLoaded={drawMap.onMapUpdate}
          onDblClick={drawMap.drawPolygon}
          onRightClick={drawMap.newPolygon}
          zoom={drawMap.zoom}
          enableScrollWheelZoom
          enableDoubleClickZoom={false}
          onZoomEnd={e => (drawMap.zoom = e.target.getZoom())}
        >
          {drawMap.polygon.paths.slice().map((item, index) => (
            <IPolygon
              path={item}
              key={index}
              enableEditing={drawMap.polygon.editType == "edit"}
              updateable={drawMap.polygon.editType == "add"}
              strokeColor="#00FF66"
              strokeStyle="dashed"
              strokeWeight={2}
              onLineUpdate={e => {
                if (drawMap.polygon.editType === "edit") {
                  const path = e.target.getPath();
                  drawMap.polygon.paths[index] = path;
                }
              }}
            />
          ))}
          <Control>
            <div>
              <Search onSearch={drawMap.search} placeholder="请输入关键字" />
              <Radio.Group onChange={drawMap.toggleDrawPolygon} defaultValue="add">
                <Radio.Button value="add">添加</Radio.Button>
                <Radio.Button value="edit">修改</Radio.Button>
              </Radio.Group>
            </div>
          </Control>
        </Map>
      </APILoader>
    </div>
  ));
};
