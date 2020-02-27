import React from "react";
import { useObserver } from "mobx-react-lite";
import { EnterpriseMap } from "./Map";
import { EnterpriseScreenGasChart } from "./GasChart";
import {Header} from "./header";

export const EnterpriseScreenPage = () => {
  return useObserver(() => (
    <div className="w-full h-full" style={{ backgroundColor: "#0d1b28"}}>
      <Header/>
      <div style={{ width: "46vw", height: "46vh", margin: "0 auto" }}>
        <EnterpriseMap />
      </div>
      <div style={{ width: "23vw", height: "34vh" }}>
        <EnterpriseScreenGasChart />
      </div>
    </div>
  ));
};
