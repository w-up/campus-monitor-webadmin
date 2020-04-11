import { useState, useEffect, useMemo } from "react";
import { useEnableProperties, useProperties, useVisiable, useEventProperties } from "@uiw/react-baidu-map/lib/esm/common/hooks";
import { PolygonProps } from "@uiw/react-baidu-map/lib/esm/Polygon/index";

export interface UsePolygon extends PolygonProps {}

export default (props = {} as UsePolygon) => {
  const { map, strokeColor, path, fillColor, strokeWeight, strokeOpacity, fillOpacity, strokeStyle, enableMassClear, enableEditing, enableClicking } = props;
  const [polygon, setPolygon] = useState<BMap.Polygon>();

  const opts = { strokeColor, fillColor, strokeWeight, strokeOpacity, fillOpacity, strokeStyle, enableMassClear, enableEditing, enableClicking };
  useMemo(() => {
    if (map && !polygon) {
      const points = (path || []).map(item => new BMap.Point(item.lng, item.lat));
      const instance = new BMap.Polygon(points, opts);
      map.addOverlay(instance);
      setPolygon(instance);
    }
  }, [map, props.path, polygon]);

  const reloadPath = () => {
    if (path && polygon) {
      const points = path.map(item => new BMap.Point(item.lng, item.lat));
      polygon.setPath(points);
    }
  };
  // useEffect(() => {
  //   return () => {
  //     if(map && polygon){
  //       map.removeOverlay(polygon)
  //     }
  //   }
  // }, [])

  useVisiable(polygon!, props);
  useEventProperties<BMap.Polygon, UsePolygon>(polygon!, props, ["Click", "DoubleClick", "MouseDown", "MouseUp", "MouseOut", "MouseOver", "Remove", "LineUpdate"]);
  useEnableProperties<BMap.Polygon, UsePolygon>(polygon!, props, ["Editing", "MassClear"]);
  // PositionAt
  useProperties<BMap.Polygon, PolygonProps>(polygon!, props, ["StrokeColor", "StrokeOpacity", "FillColor", "FillOpacity", "StrokeWeight", "StrokeStyle"]);

  return {
    polygon,
    setPolygon,
    path,
    reloadPath
  };
};
