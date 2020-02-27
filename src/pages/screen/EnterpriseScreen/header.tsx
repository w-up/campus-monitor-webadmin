import React from "react";
import {useObserver} from "mobx-react-lite";
import {TimeDisplay} from "./timeDisplay";


export const Header = () => {
  return useObserver(() => (
    <div className="header-bg h-20 text-white">
      <TimeDisplay/>
      <div className="text-2xl font-bold text-center">
        污染源实时监测公共驾驶舱
      </div>
    </div>
  ));
};
