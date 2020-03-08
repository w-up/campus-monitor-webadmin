import React from "react";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {TimeDisplay} from "./TimeDisplay";
import {LocationDisplay} from "./LocationDisplay";
import {Icon} from "antd";
import {SettingBox} from "./SettingBox";


export const ScreenTop = () => {

  const store = useLocalStore(() => ({
    boxDisplay: false,
    toggleSettingBox: () => {
      store.boxDisplay = !store.boxDisplay;
    },
  }));

  return useObserver(() => (
    <div className="flex flex-row header-bg h-20 text-white relative">
      <TimeDisplay/>
      <div className="primary-text-color relative flex-1 text-2xl font-bold text-center">
        <span className="screenTitleGradient">污染源实时监测公共驾驶舱</span>
        <Icon onClick={() => store.toggleSettingBox()} className="settingIcon text-lg absolute ml-8 cursor-pointer z-50" type="setting" theme="filled"/>
        <SettingBox boxDisplay={store.boxDisplay} toggle={store.toggleSettingBox}/>
      </div>
      <LocationDisplay/>
    </div>
  ));
};
