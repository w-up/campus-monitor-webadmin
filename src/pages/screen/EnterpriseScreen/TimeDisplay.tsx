import React, {useEffect, useState} from 'react';
import {useObserver} from "mobx-react-lite";
import { Moment } from "../../../utils/moment-util";

export const TimeDisplay = () => {

  const [time, setTime] = useState(Moment().format('h:mm:ss'));
  const [day, setDay] = useState(Moment().format('LL') + Moment().format('dddd'));

  useEffect(() => {
    setInterval(() => {
      setTime(Moment().format('h:mm:ss'));
      setDay(Moment().format('LL') + Moment().format('dddd'))
    }, 1000);
  });

  return useObserver(() => (
      <div className="leading-5 flex-1 flex items-end">
        <div className="head-left">
          <img alt="clock-icon" src="/images/clock-icon.png" className="w-5 ml-5 float-left"/>
          <span className="text-lg m-2">{time}</span>
          <span className="text-sm ml-2"> {day}</span>
        </div>
      </div>
    )
  );
}

