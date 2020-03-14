import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { useEffect } from "react";
import { utils } from "../../../../utils/index";
import { _ } from "../../../../utils/lodash";
import { constant } from "../../../../common/constants";
import { useStore } from "../../../../stores/index";
import { EnterpriseScreenMapStore } from "../../../../stores/screen/EnterpriseScreenMapStore";

export const Sewage24HourChart = () => {
  const mapRef = React.useRef<any>();

  const {
    screen: { enterpriseScreenMap }
  } = useStore();

  const store = useLocalStore(() => ({
    options: {
      name: "",
      dataIndex: 0,
      date: ["12/01", "12/02", "12/03", "12/04", "12/05", "12/06", "12/07", "12/08", "12/09", "12/10", "12/11", "12/12", "12/13", "12/14"],
      series: [
        {
          name: "COD",
          data: [1.2, 1.6, 1.8, 1.92, 2.02, 2.22, 1.89, 1.2, 1.6, 1.8, 1.92, 2.02, 2.22, 1.89]
        },
        { name: "氨氮", data: [1.2, 1.5, 1.8, 2.0, 1.8, 1.6, 1.3, 1.2, 1.5, 1.8, 2.0, 1.8, 1.6, 1.3] },
        { name: "PH", data: [1.2, 1.8, 1.5, 1.2, 1.5, 1.2, 1.6, 1.2, 1.8, 1.5, 1.2, 1.5, 1.2, 1.6] },
        { name: "流量", data: [0.8, 1.2, 1.0, 1.3, 1.5, 2.0, 1.8, 0.8, 1.2, 1.0, 1.3, 1.5, 2.0, 1.8] }
      ]
    }
  }));
  useEffect(() => {
    setInterval(() => {
      store.options.dataIndex >= enterpriseScreenMap.HoursSewage.dates.length ? (store.options.dataIndex = 0) : store.options.dataIndex++;

      const mapInst = mapRef.current?.getEchartsInstance();
      if (mapInst) {
        mapInst.dispatchAction({
          type: "showTip",
          seriesIndex: 0, // 显示第几个serindexes
          dataIndex: store.options.dataIndex >= 6 ? 6 : store.options.dataIndex, // 显示第几个数据
          position: ["45%", "10%"]
        });
      }
    }, 1000);
  }, []);
  return useObserver(() => (
    <div className="screenTable mt-4" style={{ height: "252px" }}>
      <div className="tableTitle flex justify-between items-center">
        <img src="/images/left.png" className="img" />
        <div>污水排放浓度24小时趋势图</div>
        <img src="/images/right1.png" className="img" />
      </div>
      <ReactEcharts ref={mapRef} option={makeOption({ data: enterpriseScreenMap.HoursSewage, dataIndex: store.options.dataIndex })} style={{ width: "100%", height: "180px" }} />
    </div>
  ));
};

export const makeOption = ({ data, dataIndex }: { data: EnterpriseScreenMapStore["HoursSewage"]; dataIndex: number }) => {
  const option = {
    title: {
      text: "",
      textStyle: {
        color: "#88A8C5FF",
        fontSize: "14",
        fontWeight: "normal"
      },
      x: "center",
      y: "20px",
      padding: [5, 10]
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
        show: false
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
            <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px">${value.toFixed(1) + "*10¹mg/L"}</div>
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
      data: data.pms.map(i => i.pmName),
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
      boundaryGap: true,
      axisLabel: {
        textStyle: {
          color: "rgba(136,168,197,0.5)",
          fontSize: "10"
        }
      },
      data: utils.array.sliceArray(data.dates, dataIndex, data.dates.length)
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
      // min: 0,
      // max: 3,
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
    series: data.pms.map((item, index) => ({
      name: item.pmName,
      data: utils.array.sliceArray(
        item.datas.map(i => i.collectValue),
        dataIndex,
        item.datas.length
      ),
      type: "line",
      itemStyle: {
        normal: {
          color: constant.seriesColors[index], //改变折线点的颜色
          lineStyle: {
            color: constant.seriesColors[index] //改变折线颜色
          }
        }
      },

      symbol: "circle", //设定为实心点
      symbolSize: 2 //设定实心点的大小,
    }))
  };
  return option;
};
