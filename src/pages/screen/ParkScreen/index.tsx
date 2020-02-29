import React from "react";
import { useObserver } from "mobx-react-lite";
import { ParkScreenMap } from "./Map";
import { ParkScreen24HourChart } from "./24HourChart";

export const ParkScreenPage = () => {
  return useObserver(() => (
    <div className="w-full h-full" style={{ backgroundColor: "#061630" }}>
      <div className="flex">
        <div className="flex" style={{ width: "70%" }}>
          <div style={{ width: "34%" }}></div>
          <div style={{ width: "65%" }}>
            <ParkScreenMap />
            <ParkScreen24HourChart />
          </div>
        </div>
      </div>
    </div>
  ));
};
