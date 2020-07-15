import React from "react";
import { useObserver } from "mobx-react-lite";
import { DynamicSourceMap } from "./Map";
import { DynamicSourcePanel } from "./Panel";
import { useEffect } from "react";
import { useStore } from "../../stores/index";

export const DynamicSourcePage = () => {
  const { dynamicSource } = useStore();
  useEffect(() => {
    dynamicSource.init();
  }, []);
  return useObserver(() => (
    <div className="dynamicsource-page flex" style={{ width: "100vw", height: "100vh", backgroundColor: "#061630" }}>
      <div style={{ width: "25%" }}>
        <DynamicSourcePanel />
      </div>
      <div style={{ width: "75%" }}>
        <DynamicSourceMap />
      </div>
      <div className="fixed bottom-0 text-center pb-1" style={{ width: "calc(100% - 200px)", color: "white", zIndex: 9999 }}>
        版权所有: 武汉三藏科技有限责任公司
      </div>
    </div>
  ));
};
