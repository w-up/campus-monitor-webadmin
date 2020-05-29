import React, { useEffect } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { Icon } from "antd";
import axios from "axios";

export const LocationDisplay = () => {
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
        var BMap = window.BMap;
        var geolocation = new BMap.Geolocation();
        var gc = new BMap.Geocoder();
        const that = this;
        geolocation.getCurrentPosition(function (r) {
          //@ts-ignore
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var pt = r.point;
            gc.getLocation(pt, function (rs) {
              var addComp = rs.addressComponents;
              var province = addComp.province;
              var city = addComp.city;
              var area = addComp.district;
              that.parent_city = city;
              that.city = area;
            });
          }
        });
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
    <div className="leading-5 flex items-end w-1/4 pr-4">
      <div className="head-right text-center font-bold flex flex-row justify-end items-center">
        <div className="px-2 flex flex-row">
          <Icon style={{ marginTop: 4, marginRight: 4 }} type="environment" theme="filled" />
          <div>{store.parent_city}</div>
          <span className="ml-4">{store.city}</span>
        </div>
        <div className="px-2 text-white px-6 py-1 rounded mx-2" style={{ background: store.airColor(store.aqi) }}>
          {store.air}
        </div>
        <div>
          <img src="/images/qing.png" />
        </div>
        <div className="mx-2">
          <div className="font-bold text-sm">{store.temp}℃</div>
          <div className="text-xs">{store.weather}</div>
        </div>
      </div>
    </div>
  ));
};
