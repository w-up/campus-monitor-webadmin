import React, {Component, useEffect, useState} from 'react';
import moment from "moment";
import {useObserver} from "mobx-react-lite";

moment.locale('zh-cn');

export const TimeDisplay = () => {

  const [time, setTime] = useState(moment().format('LTS'));
  const [day, setDay] = useState(moment().format('LL') + moment().format('dddd'));

  useEffect(() => {
    setInterval(() => {
      setTime(moment().format('LTS'));
      setDay(moment().format('LL') + moment().format('dddd'))
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

