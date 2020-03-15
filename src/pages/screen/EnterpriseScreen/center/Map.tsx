import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import { useStore } from "../../../../stores";

//@ts-ignore
const BMapGL = window.BMapGL;

export const EnterpriseMap = () => {
  const {
    screen: { enterpriseScreenMap }
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
      <div id="allmap" style={{ height: "40vh" }} />
      <div className="my-4 p-2 px-6 mapExplain flex flex-row">
        <div className="primary-text-dark w-2/3">当前厂区：A厂区</div>
        <div className="flex flex-row w-1/3 screen-text-color-2 justify-between">
          <div>
            <div className="blockNormal" />
            正常值
          </div>
          <div>
            <div className="redOver" />
            超标值
          </div>
        </div>
      </div>
    </div>
  ));
};
