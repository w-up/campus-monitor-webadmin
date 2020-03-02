import React, {useRef} from "react";
import {useObserver} from "mobx-react-lite";
import {EnterpriseMap} from "./center/Map";
import {EnterpriseScreenGasChart} from "./left/GasChart";
import {Icon, Layout} from "antd";
import {FullscreenOutline} from '@ant-design/icons';
import {GasTable} from "./left/GasTable";
import {SewageTableDynamic} from "./right/SewageTableDynamic";
import {EnterpriseScreenGroupChart} from "./center/GroupChart";
import {Sewage24HourChart} from "./right/Sewage24HourChart";
import {SewageDailyChart} from "./right/SewageDailyChart";
import {ScreenTop} from "./top/ScreenTop";

export const EnterpriseScreenPage = () => {
  const fullScreenRef = useRef<HTMLDivElement>(null);

  // @ts-ignore
  return useObserver(() => (
    <div className="p-4" style={{ background: "#1E2538", borderTop: "1px solid rgb(0, 177, 255)" }}>
      <div className="text-white pb-4 pl-2" style={{color:"#0DACF2"}} onClick={() => fullScreenRef.current?.requestFullscreen()}>
        <Icon className="text-3xl font-black" type="fullscreen"/>
        <span className="ml-2">全屏展示</span>
      </div>
      <div ref={fullScreenRef} className="w-full h-full pl-4 pr-4" style={{backgroundColor: "#061630"}}>
        <ScreenTop/>
        <div className="flex mt-4">
          <div>
            <GasTable/>
            <EnterpriseScreenGasChart/>
          </div>
          <div className="flex-1 pl-4 pr-4">
            <EnterpriseMap/>
            <EnterpriseScreenGroupChart/>
          </div>
          <div>
            <SewageTableDynamic/>
            <Sewage24HourChart/>
            <SewageDailyChart/>
          </div>
        </div>
      </div>
    </div>
  ));
};
