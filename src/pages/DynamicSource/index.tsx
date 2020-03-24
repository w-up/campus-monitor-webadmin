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
    </div>
  ));
};
