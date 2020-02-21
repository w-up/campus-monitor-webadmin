import React from "react";
import { useObserver } from "mobx-react-lite";

export const DynamicSourcePage = () => {
  return useObserver(() => <div>DynamicSourcePage</div>);
};
