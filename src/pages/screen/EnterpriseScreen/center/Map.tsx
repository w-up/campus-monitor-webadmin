import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import { utils } from "../../../../utils/index";

//@ts-ignore
const BMapGL = window.BMapGL;

export const EnterpriseMap = () => {
  const {
    screen: { enterpriseScreenMap },
  } = useStore();
  useEffect(() => {
    enterpriseScreenMap.initMap();

    return () => {
      enterpriseScreenMap.map = null;
    };
  }, []);

  return useObserver(() => (
    <div className="relative" style={{ background: "#0F1B35" }}>
      <span className="corner cornerTl" />
      <span className="corner cornerTr" />
      <span className="corner cornerBl" />
      <span className="corner cornerBr" />
      <div style={{ height: "40vh" }}>
        <div id="allmap" style={{ height: "40vh", width: "100%" }} />
        <img className="groundImg" style={{ height: "40vh" }} src={utils.img.getImageUrl(enterpriseScreenMap?.curMapConfig?.picUrl)} />
      </div>
      <div className="my-4 p-2 px-6 mapExplain flex flex-row">
        <div className="primary-text-dark w-2/3">当前厂区：{enterpriseScreenMap.currentFactoryData?.factoryName}</div>
        <div className="flex flex-row w-1/3 screen-text-color-2 justify-end">
          <div>
            <div className="blockNormal" />
            正常值
          </div>
          <div className="ml-4">
            <div className="redOver" />
            超标值
          </div>
        </div>
      </div>
    </div>
  ));
};
