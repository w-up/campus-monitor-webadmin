import React, { useEffect, useRef } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { useStore } from "stores";
import echarts from "echarts";

export const ParkScreen24HourChart = () => {
  const chartRef = useRef<any>();

  const {
    screen: { parkScreenMap },
  } = useStore();
  const store = useLocalStore(() => ({
    dataIndex: 0,
    get dataIndexMax() {
      return parkScreenMap.dailyData?.points?.length;
    },
    get option() {
      return {
        //   标题配置
        title: {
          text: "24小时排放趋势图",
          textStyle: {
            // color: "whiteFF",
            fontSize: "16",
            fontWeight: "normal",
          },
          x: "center",
          y: "10px",
          padding: [5, 20],
        },
        // 提示配置
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(38,95,163,0.6)",
          padding: 10,
          textStyle: {
            color: "#04F9CC",
            fontSize: 10,
          },
          alwaysShowContent: {
            show: true,
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
              var { valueRaw, valueIn, value, limit, unit } = params[i].data;
              if (valueRaw > 0) {
                showHtml += `
            <div>${name}</div>
            <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px;${limit && valueRaw > limit ? "color:red;" : ""}">${valueRaw}</div>`;
              }
            }

            return `<div style="color: #04F9CC;text-align:left;line-height:20px">${text}</div>
            <div style="color:white;text-align:left;font-size:14px;padding:5px;margin-top:5px;">
              <div style="display:flex;align-items: center;">
                <div style="margin-right:10px;width:10px;height:1px;border:1px solid #1089E7;background:#1089E7"></div>
                ${showHtml}
              </div>
            </div>`;
          },
        },
        grid: {
          top: "25%",
          left: "5%",
          right: "5%",
          bottom: "0%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            textStyle: {
              color: "#04f9cc",
              fontSize: "10",
            },
          },
          data: parkScreenMap.dailyData.points.map((i) => i.time),
        },
        yAxis: {
          // name: "(mg/m³)",
          nameTextStyle: { color: "white", align: "center", verticalAlign: "middle", padding: [5, 0, 15, 20] },
          type: "value",
          // min: 0,
          // max: 3,
          // splitNumber: 3,
          axisLabel: {
            textStyle: {
              color: "#04f9cc",
              fontSize: "10",
            },
          },
          //   分割线
          splitLine: {
            show: false,
          },
          //   刻度线
          axisLine: {
            show: false,
          },
        },
        series: [
          {
            name: parkScreenMap._curPmValue?.pmName,
            type: "line",
            data: parkScreenMap.dailyData.points.map((i) => ({
              value: i.collectValue,
              valueRaw: i.collectValue,
              valueIn: i.collectValueIn,
              limit: parkScreenMap.dailyData.upperLimit,
              unit: i.unit,
            })),
            itemStyle: {
              normal: {
                color: "#00FF1D", //改变折线点的颜色
                lineStyle: {
                  color: "#00FFA6", //改变折线颜色
                },
              },
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(60,141,124,1)",
                },
                {
                  offset: 1,
                  color: "rgba(60,141,124,0.3)",
                },
              ]),
            },
            markLine: {
              symbol: "none",
              lineStyle: {
                normal: {
                  type: "solid",
                  color: "#b57c2e",
                },
              },
              data: parkScreenMap.dailyData.upperLimit
                ? [
                    {
                      name: "预警值",
                      yAxis: parkScreenMap.dailyData.upperLimit,
                    },
                  ]
                : [],
            },
            symbol: "circle", //设定为实心点
            symbolSize: 6, //设定实心点的大小
          },
        ],
      };
    },
  }));

  useEffect(() => {
    setInterval(() => {
      store.dataIndex >= store.dataIndexMax - 1 ? (store.dataIndex = 0) : store.dataIndex++;
      const chartInst = chartRef.current?.getEchartsInstance();
      if (chartInst) {
        chartInst.dispatchAction({
          type: "showTip",
          seriesIndex: 0, // 显示第几个serindexes
          dataIndex: store.dataIndex, // 显示第几个数据
          // position: ["45%", "10%"]
        });
      }
    }, 1000);
  }, []);

  return useObserver(() => (
    <div style={{ height: "40%" }}>
      {parkScreenMap.dailyData.points.length > 0 ? (
        <ReactEcharts ref={chartRef} option={store.option} style={{ width: "100%", height: "100%" }} />
      ) : (
        <div className="w-full h-full flex justify-center items-center primary-text-color">
          <div style={{ padding: "30px 50px", background: "#284070", borderRadius: "5px" }}>暂无数据</div>
        </div>
      )}
    </div>
  ));
};
