import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { useStore } from "../../../../stores/index";
import { useEffect } from "react";
import { _ } from "../../../../utils/lodash";
import { Icon, Tabs } from "antd";
import { constant } from "common/constants";
import { utils } from "utils";
import { LineChart } from "components/LineChart";
import { toJS } from "mobx";

export const EnterpriseScreenGroupChart = () => {
  const {
    screen: { enterpriseScreenMap },
  } = useStore();

  return useObserver(() => (
    <div className="screenCenterTable mt-4 pb-4 flex-1">
      <Tabs type="card" size="large" activeKey={String(enterpriseScreenMap.curSiteIndex)} onChange={(e) => enterpriseScreenMap.addpoints({ index: Number(e), update: true })}>
        {enterpriseScreenMap.SiteRuntimePmDate.map((item, index) => (
          <Tabs.TabPane
            key={String(index)}
            tab={
              <span style={{ fontSize: "24px" }}>
                {enterpriseScreenMap.curSiteIndex == index && <Icon type="environment" theme="filled" />}
                {item.siteName}
              </span>
            }
          ></Tabs.TabPane>
        ))}
      </Tabs>
      <div style={{ marginTop: 40 }}>{enterpriseScreenMap.curSiteRuntimeData.length > 0 && <LineChart animate datas={enterpriseScreenMap.curSiteRuntimeData}></LineChart>}</div>
    </div>
  ));
};
