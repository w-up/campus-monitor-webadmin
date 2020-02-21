import React from "react";
import { useObserver } from "mobx-react-lite";

export const ReportPage = () => {
  return useObserver(() => <div>ReportPage</div>);
};
