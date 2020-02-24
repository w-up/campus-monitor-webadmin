import React from "react";
import { useObserver } from "mobx-react-lite";
import { EnterpriseMap } from "./Map";

export const EnterpriseScreenPage = () => {
  return useObserver(() => (
    <div className="w-full h-full">
      <div style={{ width: "46vw", height: "46vh" }}>
        <EnterpriseMap />
      </div>
    </div>
  ));
};
