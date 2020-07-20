import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

export const ColumnLineChart = () => {
  const mapRef = React.useRef<any>();
  const store = useLocalStore(() => ({
    options: {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      legend: {
        data: ["排放量", "平均浓度"],
        textStyle: {
          fontSize: 10,
          color: "white", // 图例文字颜色
        },
      },
      xAxis: [
        {
          type: "category",
          data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
          axisPointer: {
            type: "shadow",
          },
          axisLabel: {
            textStyle: {
              color: "white",
              fontSize: "10",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "排放量",
          min: 0,
          max: 250,
          interval: 50,
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
          axisLabel: {
            textStyle: {
              color: "white",
              fontSize: "10",
            },
          },
          splitLine: {
            show: false,
          },
        },
        {
          type: "value",
          name: "温度",
          min: 0,
          max: 25,
          interval: 5,
          axisLine: {
            lineStyle: {
              color: "white",
            },
          },
          axisLabel: {
            textStyle: {
              color: "white",
              fontSize: "10",
            },
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: "排放量",
          type: "bar",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#459cbd", // 0% 处的颜色
                },
                {
                  offset: 0.5,
                  color: "#376ddb", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#5929d3", // 100% 处的颜色
                },
              ]),
            },
          },
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        },
        {
          name: "平均浓度",
          type: "line",
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: "#FE7B43", //改变折线点的颜色
              lineStyle: {
                color: "#FE7B43", //改变折线颜色
              },
            },
          },
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
        },
      ],
    },
  }));
  return useObserver(() => (
    <div className="mt-4">
      <ReactEcharts ref={mapRef} option={store.options} style={{ width: "100%", height: "240px" }} />
    </div>
  ));
};
