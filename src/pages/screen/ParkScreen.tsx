import React from "react";
import { useObserver } from "mobx-react-lite";

export const ParkScreenPage = () => {
  return useObserver(() => <div>ParkScreenPage</div>);
};
