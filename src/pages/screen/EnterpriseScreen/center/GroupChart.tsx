import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { useStore } from "../../../../stores/index";
import { useEffect } from "react";
import { _ } from "../../../../utils/lodash";
import { Icon, Tabs } from "antd";
import { constant } from "common/constants";

export const EnterpriseScreenGroupChart = () => {
  const {
    screen: { enterpriseScreenMap }
  } = useStore();
  const mapRef = React.useRef<any>();

  const store = useLocalStore(() => ({
    dataIndex: 0,
    get dataIndexMax() {
      return enterpriseScreenMap.curSiteRuntimeData[0]?.datas.length;
    },
    get options() {
      return {
        //   标题配置
        title: {
          text: "",
          textStyle: {
            color: "#88A8C5FF",
            fontSize: "14",
            fontWeight: "normal"
          },
          x: "center",
          y: "20px",
          padding: [5, 20]
        },
        // 提示配置
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(38,95,163,0.6)",
          padding: 10,
          textStyle: {
            color: "#88A8C5",
            fontSize: 10
          },
          alwaysShowContent: {
            show: true
          },
          formatter: (params: any, ticket: any, callback: any) => {
            let showHtml = "";
            for (var i = 0; i < params.length; i++) {
              var list = {} as any;
              //x轴名称
              var name = params[i].seriesName;
              //名称
              var text = params[i].axisValue;
              //值
              var value = params[i].data;
              showHtml += `
            <div style="display:flex;align-items: center;">
            <div style="margin-right:10px;width:10px;height:1px;border:1px solid ${constant.seriesColors[i]};background:${constant.seriesColors[i]}"></div>
            <div>${name}</div>
            <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px">${value ? value + "*10¹mg/L" : ""}</div>
          </div>
          `;
            }
            return `<div style="color: #04F9CC;text-align:left;line-height:20px">${text} 日均</div>
            <div style="color:#88A8C5;text-align:left;font-size:10px;background:rgba(11,36,69,0.6);padding:5px;border-radius:5px;margin-top:5px;">
            ${showHtml}
            </div>
          </div>`;
          }
        },
        // 上册图列配置
        legend: {
          data: enterpriseScreenMap.curSiteRuntimeData.map(i => i.pmName),
          textStyle: {
            fontSize: 10,
            color: "#88A8C5" // 图例文字颜色
          }
          // y:"-10px",
        },
        grid: {
          top: "25%",
          left: "4%",
          right: "2%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {
            textStyle: {
              color: "rgba(136,168,197,0.5)",
              fontSize: "10"
            }
          },
          data: enterpriseScreenMap.curSiteRuntimeData[0]?.datas.map(i => i.time)
        },
        yAxis: {
          name: "（mg/m³）",
          nameTextStyle: {
            color: "rgba(136,168,197,0.5)",
            align: "center",
            verticalAlign: "middle",
            padding: [5, 0, 15, 20]
          },
          type: "value",
          // min: 1,
          // max: 100,
          splitNumber: 3,
          axisLabel: {
            textStyle: {
              color: "rgba(136,168,197,0.5)",
              fontSize: "10"
            }
          },
          //   分割线
          splitLine: {
            lineStyle: {
              color: "rgba(101,198,231,0.2)"
            }
          },
          //   刻度线
          axisLine: {
            show: false
          }
        },
        series: enterpriseScreenMap.curSiteRuntimeData.map((item, index) => ({
          name: item.pmName,
          type: "line",
          data: item.datas.map(i => i.collectValue),
          itemStyle: {
            normal: {
              color: constant.seriesColors[index], //改变折线点的颜色
              lineStyle: {
                color: constant.seriesColors[index] //改变折线颜色
              }
            }
          },
          symbol: "circle", //设定为实心点
          symbolSize: 6 //设定实心点的大小
        }))
      };
    }
  }));

  useEffect(() => {
    setInterval(() => {
      store.dataIndex >= store.dataIndexMax ? (store.dataIndex = 0) : store.dataIndex++;

      const mapInst = mapRef.current?.getEchartsInstance();
      if (mapInst) {
        mapInst.dispatchAction({
          type: "showTip",
          seriesIndex: 0, // 显示第几个serindexes
          dataIndex: store.dataIndex // 显示第几个数据
          // position: ["45%", "10%"]
        });
      }
    }, 1000);
  }, []);
  return useObserver(() => (
    <div className="screenCenterTable mt-4 pb-4">
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

      <ReactEcharts ref={mapRef} option={store.options} style={{ width: "100%" }} className="react_for_echarts" />
    </div>
  ));
};
