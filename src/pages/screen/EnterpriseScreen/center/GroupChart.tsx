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

export const EnterpriseScreenGroupChart = () => {
  const {
    screen: { enterpriseScreenMap },
  } = useStore();
  const mapRef = React.useRef<any>();

  const store = useLocalStore(() => ({
    dataIndex: 0,
    get dataIndexMax() {
      return enterpriseScreenMap.curSiteRuntimeData[0]?.datas.length;
    },
  }));

  useEffect(() => {
    setInterval(() => {
      store.dataIndex >= store.dataIndexMax ? (store.dataIndex = 0) : store.dataIndex++;

      const mapInst = mapRef.current?.getEchartsInstance();
      if (mapInst) {
        mapInst.dispatchAction({
          type: "showTip",
          seriesIndex: 0, // 显示第几个serindexes
          dataIndex: store.dataIndex, // 显示第几个数据
          // position: ["45%", "10%"]
        });
      }
    }, 1000);
  }, []);
  return useObserver(() => (
    <div className="screenCenterTable mt-4 pb-4 flex-1">
      <Tabs type="card" size="large" activeKey={String(enterpriseScreenMap.curSiteIndex)}>
        {enterpriseScreenMap.SiteRuntimePmDate.map((item, index) => (
          <Tabs.TabPane
            key={String(index)}
            tab={
              <span>
                {enterpriseScreenMap.curSiteIndex == index && <Icon type="environment" theme="filled" />}
                {item.siteName}
              </span>
            }
          ></Tabs.TabPane>
        ))}
      </Tabs>
      {enterpriseScreenMap.curSiteRuntimeData.length > 0 && <LineChart animate datas={enterpriseScreenMap.curSiteRuntimeData}></LineChart>}
    </div>
  ));
};
