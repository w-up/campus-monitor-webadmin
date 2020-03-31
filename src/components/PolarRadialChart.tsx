import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";

export const PolarRadialChart = () => {
  const mapRef = React.useRef<any>();

  const store = useLocalStore(() => ({
    dataIndex: 0,
    dataIndexMax: 6,
    options: {
      angleAxis: {
        axisLine: {
          lineStyle: {
            color: "white"
          }
        },
        axisLabel: {
          textStyle: {
            fontSize: 16,
            color: "#54b468"
          }
        },
        type: "category",
        data: ["NE", "E", "SE", "S", "SW", "W", "NW", "N"]
      },
      radiusAxis: {
        axisLine: {
          lineStyle: {
            color: "white"
          }
        },
        axisLabel: {
          textStyle: {
            fontSize: 10,
            color: "white"
          }
        }
      },
      polar: {},
      series: [
        {
          type: "bar",
          data: [1, 2, 3, 4, 3, 5, 1],
          coordinateSystem: "polar",
          name: "A",
          stack: "a"
        },
        {
          type: "bar",
          data: [2, 4, 6, 1, 3, 2, 1],
          coordinateSystem: "polar",
          name: "B",
          stack: "a"
        },
        {
          type: "bar",
          data: [1, 2, 3, 4, 1, 2, 5],
          coordinateSystem: "polar",
          name: "C",
          stack: "a"
        }
      ]
    }
  }));
  return useObserver(() => (
    <div>
      <ReactEcharts ref={mapRef} option={store.options} style={{ width: "200px", height: "200px" }} />
    </div>
  ));
};
