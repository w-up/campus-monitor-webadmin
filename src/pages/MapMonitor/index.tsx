import React, { useEffect } from "react";
import { useObserver } from "mobx-react-lite";
import "./index.scss";
import { MapMonitorMap } from "./Map";
import { Tabs, Icon } from "antd";
import { RuntimeMonitor } from "./RuntimeMonitor";
import { PollutionDistribution } from "./PollutionDistribution";
import { Trending } from "./Trending";
import { Contribution } from "./Contribution";

export const MapMonitorPage = () => {
  return useObserver(() => (
    <div className="mapmonitor-page flex" style={{ width: "100vw", height: "100%", backgroundColor: "#061630" }}>
      <div style={{ width: "20%" }}>
        <Tabs type="card" size="large" defaultActiveKey="4">
          <Tabs.TabPane key="1" tab={<Icon type="area-chart" />}>
            <RuntimeMonitor />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab={<Icon type="shrink" />}>
            <PollutionDistribution />
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab={<Icon type="bar-chart" />}>
            <Trending />
          </Tabs.TabPane>
          <Tabs.TabPane key="4" tab={<Icon type="pie-chart" theme="filled" />}>
            <Contribution />
          </Tabs.TabPane>
          <Tabs.TabPane key="5" tab={<Icon type="alert" />}></Tabs.TabPane>
        </Tabs>
      </div>
      <div style={{ width: "70%" }}>
        <MapMonitorMap />
      </div>
    </div>
  ));
};
