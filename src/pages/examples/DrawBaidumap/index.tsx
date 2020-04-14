import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { useStore } from "../../../stores/index";
import { DrawBaiduMap } from "../../../components/DrawBaiduMap";

export const DrawBaiduMapExample = () => {
  const {
    map: { drawMap },
  } = useStore();
  return useObserver(() => (
    <div className="w-full h-full">
      <div>{JSON.stringify(drawMap.paths)}</div>
      <DrawBaiduMap />
    </div>
  ));
};
