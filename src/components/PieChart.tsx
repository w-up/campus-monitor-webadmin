import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";

export const PieChart = (props: { showLegend?: boolean; pieRadius?: string; center?: string[]; data: Array<{ key: string; value: number | string }> }) => {
  const mapRef = React.useRef<any>();
  const store = useLocalStore(() => ({
    get options() {
      return {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: props.showLegend || true,
          orient: "vertical",
          bottom: "0",
          left: "40%",
          data: props.data.map(i => i.key)
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: props.pieRadius || "55%",
            center: props.center || ["50%", "50%"],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: props.data.map(i => ({ name: i.key, value: i.value })),
            label: {
              normal: {
                formatter: params => {
                  return params.percent + "%";
                },
                position: "inner"
              }
            }
          }
        ]
      };
    }
  }));
  return useObserver(() => (
    <div className="mt-4">
      <ReactEcharts ref={mapRef} option={store.options} style={{ width: "100%", height: "350px" }} />
    </div>
  ));
};
