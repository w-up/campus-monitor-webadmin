import React from "react";
import { useObserver } from "mobx-react-lite";
import { DynamicSourceMap } from "./Map";
import { DynamicSourcePanel } from "./Panel";

export const DynamicSourcePage = () => {
  return useObserver(() => (
    <div className="dynamicsource-page flex" style={{ width: "100vw", height: "100vh", backgroundColor: "#061630" }}>
      <div style={{ width: "20%" }}>
        <DynamicSourcePanel />
      </div>
      <div style={{ width: "80%" }}>
        <DynamicSourceMap />
      </div>
    </div>
  ));
};
