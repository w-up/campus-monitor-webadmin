import React, { useRef } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { EnterpriseMap } from "./center/Map";
import { EnterpriseScreenGasChart } from "./left/GasChart";
import { Header } from "./top/Header";
import { Button } from "antd";
import {GasTable} from "./left/GasTable";
import {GasTableDynamic} from "./right/GasTableDynamic";

export const EnterpriseScreenPage = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null);

  return useObserver(() => (
    <div ref={fullScreenRef} className="w-full h-full pl-4 pr-4" style={{ backgroundColor: "#061630" }}>
      <Header />
      <div className="flex mt-4">
        <div>
          <GasTable/>
        </div>
        <div className="flex-1 pl-4 pr-4">
          <EnterpriseMap />
        </div>
        <div>
          <GasTableDynamic/>
        </div>
      </div>
      <div style={{ width: "23vw", height: "34vh" }}>
        <EnterpriseScreenGasChart />
      </div>
      <Button onClick={() => fullScreenRef.current?.requestFullscreen()}>全屏</Button>
    </div>
  ));
};
