import React from "react";
import { useObserver } from "mobx-react-lite";

export const EnterprisePage = () => {
  return useObserver(() => <div>EnterprisePage</div>);
};
