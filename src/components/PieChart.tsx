import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";

export const PieChart = (props: { showLegend?: boolean; pieRadius?: string; center?: string[] }) => {
  console.log(props);
  const mapRef = React.useRef<any>();
  const store = useLocalStore(
    (p: typeof props) => ({
      options: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: p.showLegend,
          orient: "vertical",
          bottom: "0",
          left: "40%",
          data: ["A化工", "B化工", "C化工", "D化工", "其他"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: p.pieRadius,
            center: p.center,
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "A化工" },
              { value: 310, name: "B化工" },
              { value: 234, name: "C化工" },
              { value: 135, name: "D化工" },
              { value: 1548, name: "其他" }
            ],
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
      }
    }),
    props
  );
  return useObserver(() => (
    <div className="mt-4">
      <ReactEcharts ref={mapRef} option={store.options} style={{ width: "100%", height: "350px" }} />
    </div>
  ));
};

PieChart.defaultProps = {
  showLegend: true,
  pieRadius: "55%",
  center: ["50%", "30%"]
};
