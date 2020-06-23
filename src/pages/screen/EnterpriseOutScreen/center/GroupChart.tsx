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
    screen: { enterpriseOutScreenMap: enterpriseScreenMap },
  } = useStore();

  return useObserver(() => (
    <div className="screenCenterTable mt-4 pb-4 flex-1">
      <div style={{ marginTop: 40 }}>{enterpriseScreenMap.curSiteRuntimeData.length > 0 && <LineChart animate datas={enterpriseScreenMap.curSiteRuntimeData}></LineChart>}</div>
    </div>
  ));
};
