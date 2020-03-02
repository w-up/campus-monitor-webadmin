import React from "react";
import {useObserver} from "mobx-react-lite";
import {TimeDisplay} from "./TimeDisplay";
import {LocationDisplay} from "./LocationDisplay";


export const ScreenTop = () => {
  return useObserver(() => (
    <div className="flex flex-row header-bg h-20 text-white">
      <TimeDisplay/>
      <div className="flex-1 text-2xl font-bold text-center">
        污染源实时监测公共驾驶舱
      </div>
      <LocationDisplay/>
    </div>
  ));
};
