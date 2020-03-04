import React, {useRef} from "react";
import { useObserver } from "mobx-react-lite";
import { ParkScreenMap } from "./Map";
import { ParkScreen24HourChart } from "./left/24HourChart";
import {Icon} from "antd";
import {ScreenTop} from "./top/ScreenTop";
import {SewageWaterTable} from "./right/SewageWaterTable";
import {WasteGasTable} from "./right/WasteGasTable";

export const ParkScreenPage = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null);

  return useObserver(() => (
    <div className="p-4 parkScreen">
      <div className="text-white pb-4 pl-2 cursor-pointer" style={{color:"#0DACF2"}} onClick={() => fullScreenRef.current?.requestFullscreen()}>
        <Icon className="text-3xl font-black" type="fullscreen"/>
        <span className="ml-2">全屏展示</span>
      </div>
      <div ref={fullScreenRef} className="flex flex-col w-full h-full p-4" style={{backgroundColor: "#061630"}}>
        <ScreenTop/>
        <div className="screenContent flex-1 flex mt-4">
          <div className="leftContent flex w-9/12 p-4">
            <span className="corner cornerTl"></span>
            <span className="corner cornerTr"></span>
            <span className="corner cornerBl"></span>
            <span className="corner cornerBr"></span>
            <div className="" style={{ width: "34%" }}></div>
            <div style={{ width: "65%" }}>
              <ParkScreenMap />
              <ParkScreen24HourChart />
            </div>
          </div>
          <div className="w-3/12 pl-4">
            <div className="rightContent">
              <span className="corner cornerTl"></span>
              <span className="corner cornerTr"></span>
              <span className="corner cornerBl"></span>
              <span className="corner cornerBr"></span>
              <SewageWaterTable/>
              <WasteGasTable/>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
};
