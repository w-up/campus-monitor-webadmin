import React, {useEffect, useState} from 'react';
import {useObserver} from "mobx-react-lite";
import { Moment } from "../../../utils/moment-util";

export const TimeDisplay = () => {

  const [time, setTime] = useState(Moment().format('LTS'));
  const [day, setDay] = useState(Moment().format('LL') + Moment().format('dddd'));

  useEffect(() => {
    setInterval(() => {
      setTime(Moment().format('LTS'));
      setDay(Moment().format('LL') + Moment().format('dddd'))
    }, 1000);
  });

  // render will know everything!
  return useObserver(() => (
      <div className="leading-5 text-white">
        <img src="/images/clock-icon.png" className="w-5 ml-5 float-left"/>
        <span className="text-lg m-2">{time}</span>
        <span className="text-sm ml-2">{day}</span>
      </div>
    )
  );
}

