import React from "react";
import { useObserver } from "mobx-react-lite";
import { EnterpriseMap } from "./Map";
import { EnterpriseScreenGasChart } from "./GasChart";
import {TimeDisplay} from "./timeDisplay";

export const EnterpriseScreenPage = () => {
  return useObserver(() => (
    <div className="w-full h-full" style={{ backgroundColor: "#0d1b28", color: "#fff" }}>
      <TimeDisplay/>
      <div style={{ width: "46vw", height: "46vh" }}>
        <EnterpriseMap />
      </div>
      <div style={{ width: "23vw", height: "34vh" }}>
        <EnterpriseScreenGasChart />
      </div>
    </div>
  ));
};
