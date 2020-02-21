import React from "react";
import { useObserver } from "mobx-react-lite";

export const MyEnterprisePage = () => {
  return useObserver(() => <div>MyEnterprisePage</div>);
};
