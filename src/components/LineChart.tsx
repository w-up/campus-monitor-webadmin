import React from "react";
import { useObserver, useLocalStore, observer } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { constant } from "../common/constants";
import { utils } from "utils";
import { DailySewage } from "../type";
import { useEffect, useMemo } from "react";

export const LineChart = (props: { datas: Array<DailySewage>; animate?: boolean; precision?: boolean }) => {
  const mapRef = React.useRef<any>();
  const store = useLocalStore(() => ({
    dataIndex: 0,
    get maxDataIndex() {
      return props.datas[0]?.datas.length;
    },
    get options() {
      return {
        props,
        //   标题配置
        title: {
          text: "",
          textStyle: {
            color: "#88A8C5FF",
            fontSize: "18",
            fontWeight: "bold",
          },
          x: "center",
          y: "20px",
          padding: [5, 20],
        },
        // 提示配置
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(38,95,163,0.6)",
          padding: 10,
          textStyle: {
            color: "#88A8C5",
            fontSize: 18,
            fontWeight: "bold",
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
              var { value, valueIn, value, limit, unit } = params[i].data;

              if (value > 0) {
                showHtml += `
            <div style="display:flex;align-items: center;font-size:18px;font-weight:bold;">
            <div style="margin-right:10px;width:10px;height:1px;border:1px solid ${constant.seriesColors[i]};background:${constant.seriesColors[i]}"></div>
            <div>${name}</div>
            <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px; ${limit && value > limit ? "color:red;" : ""}">${
                  props.precision ? (value ? `${value}*${valueIn} ${unit}` : "") : value || ""
                }</div>
          </div>
          `;
              }
            }
            return `<div style="color: #04F9CC;text-align:left;line-height:20px;font-size:18px;font-weight:bold">${text} 日均</div>
            <div style="color:#88A8C5;text-align:left;font-size:14px;background:rgba(11,36,69,0.6);padding:5px;border-radius:5px;margin-top:5px;">
            ${showHtml}
            </div>
          </div>`;
          },
        },
        // 上册图列配置
        legend: {
          data: props.datas.map((i) => i.pmName),
          textStyle: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#88A8C5", // 图例文字颜色
          },
          // y:"-10px",
        },
        grid: {
          top: "20%",
          left: "4%",
          right: "2%",
          bottom: "0%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            textStyle: {
              color: "rgba(136,168,197,0.5)",
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          data: props.datas[0]?.datas?.map((i) => i.time),
        },
        yAxis: {
          // name: "（mg/m³）",
          nameTextStyle: {
            color: "rgba(136,168,197,0.5)",
            align: "center",
            verticalAlign: "middle",
            padding: [5, 0, 10, 20],
          },
          type: "value",
          // min: 0,
          // max: 10,
          splitNumber: 3,
          axisLabel: {
            textStyle: {
              color: "rgba(136,168,197,0.5)",
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          //   分割线
          splitLine: {
            lineStyle: {
              color: "rgba(101,198,231,0.2)",
            },
          },
          //   刻度线
          axisLine: {
            show: false,
          },
        },
        series: props.datas.map((item, index) => ({
          name: item.pmName,
          type: "line",
          data: item.datas?.map((i) => {
            const isUpperlimit = item.upperLimit && i.collectValue > item.upperLimit;

            return {
              symbolSize: isUpperlimit ? 12 : 0,
              value: i.collectValue,
              valueIn: i.collectValueIn,
              limit: item.upperLimit,
              unit: i.unit,
              itemStyle: {
                normal: {
                  color: isUpperlimit ? "red" : constant.seriesColors[index],
                },
              },
            };
          }),
          markLine: {
            symbol: "none",
            lineStyle: {
              normal: {
                type: "solid",
                color: "red",
              },
            },
            // data: [
            //   {
            //     name: "预警值",
            //     yAxis: item.upperLimit || 0,
            //   },
            // ],
          },
          itemStyle: {
            normal: {
              color: constant.seriesColors[index], //改变折线点的颜色
              lineStyle: {
                color: constant.seriesColors[index], //改变折线颜色
              },
            },
          },
          symbol: "circle", //设定为实心点
          // symbolSize: 6, //设定实心点的大小
        })),
      };
    },
  }));
  useEffect(() => {
    if (props.animate) {
      setInterval(() => {
        store.dataIndex >= store.maxDataIndex ? (store.dataIndex = 0) : store.dataIndex++;
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
    }
  }, []);
  return useObserver(() => (
    <div>
      <ReactEcharts ref={mapRef} option={store.options} style={{ width: "100%", height: "252px" }} />
    </div>
  ));
};
