import React, { useRef } from "react";
import { useObserver } from "mobx-react-lite";
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
    screen: { parkScreenMap }
  } = useStore();

  useEffect(() => {
    parkScreenMap.loadData();
  }, []);

  return useObserver(() => (
    <div className="p-4 parkScreen">
      <div className="pb-4 pl-2 cursor-pointer" style={{ color: "#0DACF2" }} onClick={() => fullScreenRef.current?.requestFullscreen()}>
        <Icon className="text-3xl font-black" type="fullscreen" />
        <span className="ml-2">全屏展示</span>
      </div>
      <div ref={fullScreenRef} className="flex flex-col w-full h-full p-4" style={{ backgroundColor: "#061630" }}>
        <ScreenTop />
        <div className="screenContent flex-1 flex mt-4">
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
                <div className="primary-text-dark w-1/3">当前园区：A园区</div>
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
      </div>
    </div>
  ));
};
