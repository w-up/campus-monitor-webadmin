import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { useEffect } from "react";
import api from "services";

export const MonitorAlert = () => {
  const store = useLocalStore(() => ({
    alarms: [],
    async loadAlarms() {
      const result = await api.MapMonitor.getUncheckedAlarmInformation();
      console.log(result);
      this.alarms = result.data;
    }
  }));

  useEffect(() => {
    store.loadAlarms();
  }, []);
  return useObserver(() => <div>Template: {JSON.stringify(store.alarms)}</div>);
};
