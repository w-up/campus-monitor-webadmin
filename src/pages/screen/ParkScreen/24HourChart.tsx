import React, { useEffect, useRef } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";

export const ParkScreen24HourChart = () => {
  const chartRef = useRef(null);
  const store = useLocalStore(() => ({
    option: {
      //   标题配置
      title: {
        text: "24小时排放趋势图",
        textStyle: {
          color: "#88A8C5FF",
          fontSize: "16",
          fontWeight: "normal"
        },
        x: "center",
        y: "10px",
        padding: [5, 20]
      },
      // 提示配置
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(38,95,163,0.6)",
        padding: 10,
        textStyle: {
          color: "#04F9CC",
          fontSize: 10
        },
        alwaysShowContent: {
          show: true
        },
        formatter: (params: any, ticket: any, callback: any) => {
          var showHtm = [] as any;
          for (var i = 0; i < params.length; i++) {
            var list = {} as any;
            //x轴名称
            var name = params[i].seriesName;
            //名称
            var text = params[i].axisValue;
            //值
            var value = params[i].data;
            list.name = name;
            list.value = value;
            showHtm.push(list);
          }
          return `<div style="color: #04F9CC;text-align:left;line-height:20px">${text}</div>
            <div style="color:#88A8C5;text-align:left;font-size:10px;padding:5px;margin-top:5px;">
              <div style="display:flex;align-items: center;">
                <div style="margin-right:10px;width:10px;height:1px;border:1px solid #1089E7;background:#1089E7"></div>
                <div>${showHtm[0].name}</div>
                <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px">${showHtm[0].value.toFixed(1)}</div>
              </div>
            </div>`;
        }
      },
      grid: {
        top: "25%",
        left: "5%",
        right: "5%",
        bottom: "0%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        axisLabel: {
          textStyle: {
            color: "#04f9cc",
            fontSize: "10"
          }
        },
        data: ["12/01", "12/02", "12/03", "12/04", "12/05", "12/06", "12/07"]
      },
      yAxis: {
        name: "(mg/m³)",
        nameTextStyle: { color: "rgba(136,168,197,0.5)", align: "center", verticalAlign: "middle", padding: [5, 0, 15, 20] },
        type: "value",
        min: 0,
        max: 3,
        splitNumber: 3,
        axisLabel: {
          textStyle: {
            color: "#04f9cc",
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
      series: [
        {
          name: "TVOCS",
          type: "line",
          data: [1.2, 1.6, 1.8, 1.92, 2.02, 2.22, 1.89],
          itemStyle: {
            normal: {
              color: "#00FF1D", //改变折线点的颜色
              lineStyle: {
                color: "#00FFA6" //改变折线颜色
              }
            }
          },
          markLine: {
            symbol: "none",
            lineStyle: {
              normal: {
                type: "solid",
                color: "#FF9000"
              }
            },
            data: [
              {
                name: "预警值",
                yAxis: 2.5
              }
            ]
          },
          symbol: "circle", //设定为实心点
          symbolSize: 6 //设定实心点的大小
        }
      ]
    }
  }));
  return useObserver(() => (
    <div style={{ height: "40%" }}>
      <ReactEcharts ref={chartRef} option={store.option} style={{ width: "100%", height: "100%" }} />
    </div>
  ));
};
