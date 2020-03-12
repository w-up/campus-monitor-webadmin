import React, {useEffect, useState} from 'react';
import {useObserver} from "mobx-react-lite";
import { Moment } from "../../../../utils/moment-util";
import {Icon} from "antd";

export const TimeDisplay = () => {

  const [time, setTime] = useState(Moment().format('h:mm:ss'));
  const [day, setDay] = useState(Moment().format('LL') + ' ' +Moment().format('dddd'));

  useEffect(() => {
    setInterval(() => {
      setTime(Moment().format('h:mm:ss'));
      setDay(Moment().format('LL') + ' ' + Moment().format('dddd'))
    }, 1000);
  });

  return useObserver(() => (
      <div className="leading-5 flex-1 flex items-end ml-4">
        <div className="head-left font-bold">
          <Icon className="ml-5 float-left" style={{fontSize:20}} type="clock-circle" theme="filled" />
          <span className="text-lg m-2">{time}</span>
          <span className="text-sm ml-2">{day}</span>
        </div>
      </div>
    )
  );
}

