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
import api from "services";

export const EnterpriseScreenPage = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (async () => {
      const result = await api.MapConfig.getMapConfigLogin();
    })();
  }, []);

  return useObserver(() => (
    <div className="p-4 screenPage">
      <div className="text-white pb-4 pl-2 cursor-pointer" style={{ color: "#0DACF2" }} onClick={() => fullScreenRef.current?.requestFullscreen()}>
        <Icon className="text-3xl font-black" type="fullscreen" />
        <span className="ml-2">全屏展示</span>
      </div>
      <div ref={fullScreenRef} className="flex-col w-full h-full" style={{ backgroundColor: "#061630" }}>
        <ScreenTop />
        <div className="px-4">
          <div className="flex-1 flex mt-4">
            <div>
              <GasTable />
              <EnterpriseScreenGasChart />
            </div>
            <div className="flex-1 pl-4 pr-4">
              <EnterpriseMap />
              <EnterpriseScreenGroupChart />
            </div>
            <div className="flex flex-col">
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
