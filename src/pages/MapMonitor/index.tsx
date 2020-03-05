import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import "./index.scss";
import { MapMonitorMap } from "./Map";
import { Tabs, Icon } from "antd";
import { RuntimeMonitor } from "./RuntimeMonitor";

export const MapMonitorPage = () => {
  return useObserver(() => (
    <div className="mapmonitor-page flex" style={{ width: "100vw", height: "100vh", backgroundColor: "#061630" }}>
      <div style={{ width: "25%" }}>
        <Tabs>
          <Tabs.TabPane key="1" tab={<Icon type="dashboard" />}>
            <RuntimeMonitor />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab={<Icon type="dashboard" />}></Tabs.TabPane>
          <Tabs.TabPane key="3" tab={<Icon type="dashboard" />}></Tabs.TabPane>
          <Tabs.TabPane key="4" tab={<Icon type="dashboard" />}></Tabs.TabPane>
          <Tabs.TabPane key="5" tab={<Icon type="dashboard" />}></Tabs.TabPane>
        </Tabs>
      </div>
      <div style={{ width: "75%" }}>
        <MapMonitorMap />
      </div>
    </div>
  ));
};
