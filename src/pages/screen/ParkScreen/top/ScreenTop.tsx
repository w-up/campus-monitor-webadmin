import { useObserver } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Moment } from "../../../../utils/moment-util";
import { ScreenTopSetting } from "./ScreenTopSetting";

export const ScreenTop = () => {
  const [time, setTime] = useState(Moment().format("h:mm:ss"));
  const [day, setDay] = useState(Moment().format("LL") + Moment().format("dddd"));

  useEffect(() => {
    setInterval(() => {
      setTime(Moment().format("h:mm:ss"));
      setDay(Moment().format("LL") + Moment().format("dddd"));
    }, 1000);
  });

  return useObserver(() => (
    <div className="flex flex-row parkScreenTop h-20 text-white">
      <div className="head-left">
        <div className="time sm:pt-2 lg:pt-4">
          <div>
            <span className="showWeek font-semibold text-base sm:text-sm">{day}</span>
          </div>
          <div>
            <span className="showTime font-bold text-lg sm:text-base">{time}</span>
          </div>
        </div>
      </div>
      <ScreenTopSetting />
      <div className="head-right flex flex-row justify-around">
        <div className="city">武汉</div>
        <div className="weather flex flex-row">
          <div className="weather-img">
            <img src="/images/qing.png" />
          </div>
          <div>
            <div className="font-bold text-sm">14~20℃</div>
            <div className="text-xs">阴转多云</div>
            <div className="wr text-xs">
              <span>轻度污染</span>
            </div>
          </div>
        </div>
        <div className="area">蔡甸区</div>
      </div>
    </div>
  ));
};
