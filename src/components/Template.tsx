import React from "react";
import { useObserver } from "mobx-react-lite";

export const Template = () => {
  return useObserver(() => <div>Template</div>);
};
