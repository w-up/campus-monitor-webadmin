import React from "react";
import { useObserver } from "mobx-react-lite";

export const RuntimeDataPage = () => {
  return useObserver(() => <div>RuntimeDataPage</div>);
};
