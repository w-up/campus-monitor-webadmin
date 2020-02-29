import React, { useRef } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { EnterpriseMap } from "./center/Map";
import { EnterpriseScreenGasChart } from "./left/GasChart";
import { Header } from "./top/Header";
import { Button } from "antd";
import { GasTable } from "./left/GasTable";
import { SewageTableDynamic } from "./right/SewageTableDynamic";
import { EnterpriseScreenGroupChart } from "./center/GroupChart";
import { Sewage24HourChart } from "./right/Sewage24HourChart";
import { SewageDailyChart } from "./right/SewageDailyChart";

export const EnterpriseScreenPage = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null);

  return useObserver(() => (
    <div ref={fullScreenRef} className="w-full h-full pl-4 pr-4" style={{ backgroundColor: "#061630" }}>
      <Header />
      <div className="flex mt-4">
        <div>
          <GasTable />
          <EnterpriseScreenGasChart />
        </div>
        <div className="flex-1 pl-4 pr-4">
          <EnterpriseMap />
          <EnterpriseScreenGroupChart />
        </div>
        <div>
          <SewageTableDynamic />
          <Sewage24HourChart />
          <SewageDailyChart />
        </div>
      </div>
      <Button onClick={() => fullScreenRef.current?.requestFullscreen()}>全屏</Button>
    </div>
  ));
};
