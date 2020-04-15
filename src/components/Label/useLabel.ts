import { useMemo, useState, useEffect } from "react";
import { useEnableProperties, useProperties, useVisiable, useEventProperties } from "@uiw/react-baidu-map/lib/esm/common/hooks";

export default (props = {} as any) => {
  const [label, setLabel] = useState<BMap.Label>();
  const { map, offset, style, content, position, enableMassClear } = props;

  useMemo(() => {
    if (!BMap || !map) return;
    if (!label) {
      const opts = { offset, position, enableMassClear };
      const instance = new BMap.Label(content || "", opts);
      instance.setStyle({ ...style });
      map.addOverlay(instance);
      setLabel(instance);
    }
  }, [map]);

  useEffect(() => {
    return () => {
      if (map && label) {
        map.removeOverlay(label);
      }
    };
  }, []);

  useVisiable(label!, props);
  useEventProperties<BMap.Label, any>(label!, props, ["Click", "DblClick", "MouseDo", "MouseUp", "MouseOout", "MouseO", "Remove", "RightClick"]);
  useProperties<BMap.Label, any>(label!, props, ["Style", "Content", "Position", "Offset", "Title", "ZIndex"]);
  useEnableProperties<BMap.Label, any>(label!, props, ["MassClear"]);

  return {
    label,
    setLabel,
  };
};
