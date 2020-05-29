import { useLocalStore, useObserver } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Moment } from "../../../../utils/moment-util";
import { ScreenTopSetting } from "./ScreenTopSetting";
import axios from "axios";

export const ScreenTop = () => {
  const [time, setTime] = useState(Moment().format("HH:mm:ss"));
  const [day, setDay] = useState(Moment().format("LL") + Moment().format("dddd"));

  useEffect(() => {
    setInterval(() => {
      setTime(Moment().format("HH:mm:ss"));
      setDay(Moment().format("LL") + Moment().format("dddd"));
    }, 1000);
  });

  const store = useLocalStore(() => ({
    city: "",
    weather: "",
    temp: "",
    air: "",
    aqi: "",
    parent_city: "",
    airColor(aqi) {
      if (aqi <= 50) {
        return "#0CE400";
      } else if (aqi <= 100) {
        return "#FFD800";
      } else if (aqi <= 150) {
        return "#FF8001";
      } else if (aqi <= 200) {
        return "#F90005";
      } else if (aqi <= 300) {
        return "#81007C";
      }
      return "#7C0101";
    },
    async heWeatherApiReq(url) {
      const weatherAuthKey = "ae504974b0b040abbcec277de5cecdd4";
      const result = await axios.get(url + "?location=auto_ip&key=" + weatherAuthKey);
      if (result && result.data && result.data.HeWeather6.length > 0) {
        const weatherInfo = result.data.HeWeather6[0];
        return weatherInfo;
      }
      return;
    },
    async weatherBasic() {
      const res = await this.heWeatherApiReq("https://free-api.heweather.net/s6/weather/now");
      if (res) {
        this.city = res.basic.location;
        this.parent_city = res.basic.parent_city;
        this.temp = res.now.tmp;
        this.weather = res.now.cond_txt;
      }
    },
    async airInfo() {
      const res = await this.heWeatherApiReq("https://free-api.heweather.net/s6/air/now");
      if (res) {
        this.air = res.air_now_city.qlty;
        this.aqi = res.air_now_city.aqi;
      }
    },
  }));

  useEffect(() => {
    axios.defaults.withCredentials = false;
    store.weatherBasic();
    store.airInfo();
  }, []);

  return useObserver(() => (
    <div className="flex flex-row parkScreenTop text-white">
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
        <div className="city">{store.parent_city}</div>
        <div className="weather flex flex-row">
          <div className="weather-img">
            <img src="/images/qing.png" />
          </div>
          <div>
            <div className="font-bold text-sm">{store.temp}℃</div>
            <div className="text-xs">{store.weather}</div>
            <div className="wr text-xs">
              <span style={{ color: store.airColor(store.aqi) }}>{store.air}</span>
            </div>
          </div>
        </div>
        <div className="area">{store.city}</div>
      </div>
    </div>
  ));
};
