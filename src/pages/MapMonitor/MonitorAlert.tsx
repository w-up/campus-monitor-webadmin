import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { useEffect } from "react";
import api from "services";
import { Button, Icon } from "antd";
import Card from "antd/lib/card";
import { Col, Row } from "antd/lib/grid";
import { useStore } from "../../stores";
import { AlertItem } from "../../components/AlertItem";

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

      {mapMonitor.alarms.map((item) => {
        return <AlertItem item={item} onClick={(item) => mapMonitor.doConfirmAlarmInfoById(item.id)}></AlertItem>;
      })}
    </div>
  ));
};
