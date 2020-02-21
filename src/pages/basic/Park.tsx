import React from "react";
import { useObserver } from "mobx-react-lite";

export const ParkPage = () => {
  return useObserver(() => <div>ParkPage</div>);
};
