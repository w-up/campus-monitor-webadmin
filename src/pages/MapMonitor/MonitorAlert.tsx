import React from "react";
import { useObserver } from "mobx-react-lite";
import { useEffect } from "react";
import { Icon } from "antd";
import { useStore } from "../../stores";
import { AlertItem } from "../../components/AlertItem";
import { Scrollbars } from "react-custom-scrollbars";

export const MonitorAlert = () => {
  const { mapMonitor } = useStore();

  useEffect(() => {
    mapMonitor.loadAlarms();
  }, []);

  return useObserver(() => (
    <div className="text-white px-4 pb-4">
      <div className="text-lg text-white mb-4 flex items-center">
        <Icon type="caret-right" theme="filled" className="primary-text-color" />
        <span className="ml-2">告警信息</span>
      </div>
      <Scrollbars style={{ height: "100vh" }}>
      {mapMonitor.alarms.map((item) => {
        return <AlertItem item={item}></AlertItem>;
      })}
      </Scrollbars>
    </div>
  ));
};
