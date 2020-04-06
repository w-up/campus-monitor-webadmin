import React, { useImperativeHandle } from "react";
import { OverlayProps } from "@uiw/react-baidu-map/lib/esm/common/map";
import usePolygon from "./usePolygon";

export interface PolygonProps extends BMap.PolygonOptions, BMap.PolygonEvents, OverlayProps {
  /**
   * 设置折线的点数组
   */
  path: BMap.Point[];
  updateable?: boolean;
}

export const IPolygon = React.forwardRef<PolygonProps & { polygon?: BMap.Polygon }, PolygonProps>((props, ref) => {
  const { polygon, reloadPath } = usePolygon(props);

  if (props.updateable) {
    reloadPath();
  }
  useImperativeHandle(ref, () => ({ ...props, polygon }), [polygon]);
  return null;
});
