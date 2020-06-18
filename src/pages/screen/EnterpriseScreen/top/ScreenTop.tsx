import React from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { TimeDisplay } from "./TimeDisplay";
import { LocationDisplay } from "./LocationDisplay";
import { Icon } from "antd";
import { SettingBox } from "./SettingBox";
import { useStore } from "../../../../stores/index";

export const ScreenTop = () => {
  const {
    screen: { enterpriseScreenMap },
  } = useStore();
  return useObserver(() => (
    <div className="flex flex-row header-bg text-white relative screen-top-height">
      <TimeDisplay />
      <div className="primary-text-color relative flex-1 font-bold flex justify-center items-center">
        {enterpriseScreenMap.companyLog && <img src={enterpriseScreenMap.companyLog} className="mr-4" style={{ width: "40px", height: "40px", display: "inline" }} />}
        <span className="screenTitleGradient screen-title-text-size">污染实时监测公共驾驶舱</span>
        <Icon onClick={() => enterpriseScreenMap.toggleBox()} className="text-lg ml-8 cursor-pointer z-50" type="setting" theme="filled" />
        <SettingBox />
      </div>
      <LocationDisplay />
    </div>
  ));
};
