import React, { useRef } from "react";
import { useObserver } from "mobx-react-lite";
import { EnterpriseMap } from "./center/Map";
import { EnterpriseScreenGasChart } from "./left/GasChart";
import { Icon } from "antd";
import { GasTable } from "./left/GasTable";
import { SewageTableDynamic } from "./right/SewageTableDynamic";
import { EnterpriseScreenGroupChart } from "./center/GroupChart";
import { Sewage24HourChart } from "./right/Sewage24HourChart";
import { SewageDailyChart } from "./right/SewageDailyChart";
import { ScreenTop } from "./top/ScreenTop";
import { useEffect } from "react";
import { useStore } from "../../../stores/index";

export const EnterpriseScreenPage = () => {
  const {
    screen: { enterpriseScreenMap }
  } = useStore();
  const fullScreenRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    enterpriseScreenMap.init();
  }, []);

  return useObserver(() => (
    <div className="p-4 screenPage">
      <div className="text-white pb-4 pl-2 cursor-pointer" style={{ color: "#0DACF2" }} onClick={() => fullScreenRef.current?.requestFullscreen()}>
        <Icon className="text-3xl font-black" type="fullscreen" />
        <span className="ml-2">全屏展示</span>
      </div>
      <div ref={fullScreenRef} className="flex flex-col w-full h-full pb-4" style={{ backgroundColor: "#061630", height: "calc(100vh)" }}>
        <ScreenTop />
        <div className="pb-4 flex-1" style={{ backgroundColor: "#061630" }}>
          <div className="flex mt-4 justify-between">
            <div className="w-1/4 pl-4">
              <GasTable />
              <EnterpriseScreenGasChart />
            </div>
            <div className="w-2/4 pl-4 pr-4 flex flex-col">
              <EnterpriseMap />
              <EnterpriseScreenGroupChart />
            </div>
            <div className="w-1/4 pr-4 flex flex-col items-end">
              <SewageTableDynamic />
              <Sewage24HourChart />
              <SewageDailyChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
};
