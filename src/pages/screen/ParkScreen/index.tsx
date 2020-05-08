import React, { useRef } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { ParkScreenMap } from "./Map";
import { ParkScreen24HourChart } from "./left/24HourChart";
import { Icon } from "antd";
import { ScreenTop } from "./top/ScreenTop";
import { SewageWaterTable } from "./right/SewageWaterTable";
import { WasteGasTable } from "./right/WasteGasTable";
import { MonitorParamForm } from "./left/MonitorParamForm";
import { FocusStationTable } from "./left/FocusStationTable";
import { TopTenMonitorTable } from "./left/TopTenMonitorTable";
import { useEffect } from "react";
import { useStore } from "../../../stores/index";

export const ParkScreenPage = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null);
  const {
    config: { sysParams },
    screen: { parkScreenMap },
  } = useStore();

  const store = useLocalStore(() => ({
    parkTimer: null as any,
    setUpTimer() {
      if (this.setUpTimer) clearInterval(this.parkTimer);
      this.parkTimer = setInterval(() => {
        parkScreenMap.reload();
      }, Math.max(Number(sysParams.qyjsc_refresh_period.paramValue), 1) * 1000 * 60);
    },
    clearTimer() {
      clearInterval(this.parkTimer);
    },
  }));

  useEffect(() => {
    parkScreenMap.init();
    store.setUpTimer();
    return () => {
      store.clearTimer();
    };
  }, []);

  return useObserver(() => (
    <div className="p-4 parkScreen">
      <div className="pb-4 pl-2 cursor-pointer" style={{ color: "#0DACF2" }} onClick={() => fullScreenRef.current?.requestFullscreen()}>
        <Icon className="text-3xl font-black" type="fullscreen" />
        <span className="ml-2">全屏展示</span>
      </div>
      <div ref={fullScreenRef} className="flex flex-col w-full h-full p-4" style={{ backgroundColor: "#061630" }}>
        <ScreenTop />
        <div className="screenContent flex-1 flex mt-4" style={{ height: "calc(100vh - 210px)" }}>
          <div className="leftContent flex w-9/12 p-4">
            <span className="corner cornerTl" />
            <span className="corner cornerTr" />
            <span className="corner cornerBl" />
            <span className="corner cornerBr" />
            <div className="w-1/3">
              <MonitorParamForm />
              <FocusStationTable />
              <TopTenMonitorTable />
            </div>
            <div className="w-2/3">
              <ParkScreenMap />
              <div className="my-4 p-2 px-6 mapExplain flex flex-row">
                <div className="w-1/3" />
                <div className="flex flex-row w-2/3 screen-text-color-2 justify-between">
                  <div>
                    <div className="factoryAreaYellow" />
                    工厂区域
                  </div>
                  <div>
                    <div className="lineGreen" />
                    园区
                  </div>
                  <div>
                    <div className="blockNormal" />
                    正常值
                  </div>
                  <div>
                    <div className="redOver" />
                    超标值
                  </div>
                </div>
              </div>
              <div className="text-white shape-bg">
                {parkScreenMap.currentSite?.siteName} {parkScreenMap.currentPmCode !== "0" && `-${parkScreenMap.currentPmCode}`}
              </div>
              <ParkScreen24HourChart />
            </div>
          </div>
          <div className="w-3/12 pl-4">
            <div className="rightContent">
              <span className="corner cornerTl" />
              <span className="corner cornerTr" />
              <span className="corner cornerBl" />
              <span className="corner cornerBr" />
              <SewageWaterTable />
              <WasteGasTable />
            </div>
          </div>
        </div>
        <div className="copyright fixed bottom-0 w-full text-center pb-1" style={{color:"#88a8c5"}}>版权所有: 武汉三藏科技有限责任公司</div>
      </div>
    </div>
  ));
};
