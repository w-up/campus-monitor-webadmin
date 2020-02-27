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
      <div style={{"lineHeight": "65px"}}>
        <img src="/images/clock-icon.png" style={{"float": "left", "margin": "20px 0 0 0"}}/>
        <span className="showTime">{time}</span>
        <span className="showWeek">{day}</span>
      </div>
    )
  );
}

