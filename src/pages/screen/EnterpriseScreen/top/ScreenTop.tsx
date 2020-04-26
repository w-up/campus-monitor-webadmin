import React from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { TimeDisplay } from "./TimeDisplay";
import { LocationDisplay } from "./LocationDisplay";
import { Icon } from "antd";
import { SettingBox } from "./SettingBox";
import { useStore } from "../../../../stores/index";

export const ScreenTop = () => {
  const {
    screen: { enterpriseScreenMap }
  } = useStore();
  return useObserver(() => (
    <div className="flex flex-row header-bg text-white relative screen-top-height">
      <TimeDisplay />
      <div className="primary-text-color relative flex-1 font-bold text-center">
        <span className="screenTitleGradient screen-title-text-size">污染源实时监测公共驾驶舱</span>
        <Icon onClick={() => enterpriseScreenMap.toggleBox()} className="settingIcon text-lg absolute ml-8 cursor-pointer z-50" type="setting" theme="filled" />
        <SettingBox />
      </div>
      <LocationDisplay />
    </div>
  ));
};
