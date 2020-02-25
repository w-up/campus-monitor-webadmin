import React from "react";
import { useObserver } from "mobx-react-lite";
import { ParkScreenMap } from "./Map";

export const ParkScreenPage = () => {
  return useObserver(() => (
    <div className="w-full h-full">
      <div style={{ width: "46vw", height: "46vh" }}>
        <ParkScreenMap />
      </div>
    </div>
  ));
};
