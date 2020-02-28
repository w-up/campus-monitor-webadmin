import React, { useRef } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { EnterpriseMap } from "./Map";
import { EnterpriseScreenGasChart } from "./GasChart";
import { Header } from "./Header";
import { Button } from "antd";

export const EnterpriseScreenPage = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null);

  return useObserver(() => (
    <div ref={fullScreenRef} className="w-full h-full" style={{ backgroundColor: "#0d1b28" }}>
      <Header />
      <div style={{ width: "46vw", height: "46vh", margin: "0 auto" }}>
        <EnterpriseMap />
      </div>
      <div style={{ width: "23vw", height: "34vh" }}>
        <EnterpriseScreenGasChart />
      </div>
      <Button onClick={() => fullScreenRef.current?.requestFullscreen()}>全屏</Button>
    </div>
  ));
};
