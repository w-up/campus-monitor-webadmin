import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";

export const Template = () => {
  const store = useLocalStore(() => ({
    count: 0,
    addCount() {
      this.count += 1;
    }
  }));
  return useObserver(() => <div onClick={store.addCount}>Template: {store.count}</div>);
};
