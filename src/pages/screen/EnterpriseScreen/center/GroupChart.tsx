import React from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";

export const EnterpriseScreenGroupChart = () => {

  const titleStore = useLocalStore(() => ({
    titleLists: [
      {active: true, text: '东南角'},
      {active: false, text: '东北角'},
      {active: false, text: '西北角'},
      {active: false, text: '西南角'}
    ]
  }));

  const store = useLocalStore(() => ({
    //   标题配置
    title: {
      text: "24小时排放趋势图",
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
        return `<div style="color: #04F9CC;text-align:left;line-height:20px">${text} 日均</div>
            <div style="color:#88A8C5;text-align:left;font-size:10px;background:rgba(11,36,69,0.6);padding:5px;border-radius:5px;margin-top:5px;">
            <div style="display:flex;align-items: center;"><div style="margin-right:10px;width:10px;height:1px;border:1px solid #1089E7;background:#1089E7"></div><div>${showHtm[0].name}</div>
            <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px">${showHtm[0].value.toFixed(1)}</div></div>
             <div style="display:flex;align-items: center;"><div style="margin-right:10px;width:10px;height:1px;border:1px solid #FE7B43;background:#FE7B43"></div><div>${showHtm[1].name}</div>
             <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px">${showHtm[1].value.toFixed(1)}</div></div>
           <div style="display:flex;align-items: center;"><div style="margin-right:10px;width:10px;height:1px;border:1px solid #12FFEE;background:#12FFEE"></div><div>${showHtm[2].name}</div>
           <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px">${showHtm[2].value.toFixed(1)}</div></div>
            <div style="display:flex;align-items: center;"><div style="margin-right:10px;width:10px;height:1px;border:1px solid #AB90DF;background:#AB90DF"></div><div>${showHtm[3].name}</div>
            <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px">${showHtm[3].value.toFixed(1)}</div></div>
            </div></div>`;
      }
    },
    // 上册图列配置
    legend: {
      data: ["非甲烷总经", "苯乙烯", "H2S", "NH3"],
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
      data: ["12/01", "12/02", "12/03", "12/04", "12/05", "12/06", "12/07"]
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
      min: 0,
      max: 3,
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
    series: [
      {
        name: "非甲烷总经",
        type: "line",
        data: [1.2, 1.6, 1.8, 1.92, 2.02, 2.22, 1.89],
        itemStyle: {
          normal: {
            color: "#1089E7", //改变折线点的颜色
            lineStyle: {
              color: "#1089E7" //改变折线颜色
            }
          }
        },
        symbol: "circle", //设定为实心点
        symbolSize: 6 //设定实心点的大小
      },
      {
        name: "苯乙烯",
        type: "line",
        // stack: "总量",
        data: [1.2, 1.5, 1.8, 2.0, 1.8, 1.6, 1.3],
        itemStyle: {
          normal: {
            color: "#FE7B43", //改变折线点的颜色
            lineStyle: {
              color: "#FE7B43" //改变折线颜色
            }
          }
        },
        symbol: "circle", //设定为实心点
        symbolSize: 6 //设定实心点的大小
      },
      {
        name: "H2S",
        type: "line",
        // stack: "总量",
        data: [1.2, 1.8, 1.5, 1.2, 1.5, 1.2, 1.6],
        itemStyle: {
          normal: {
            color: "#12FFEE", //改变折线点的颜色
            lineStyle: {
              color: "#12FFEE" //改变折线颜色
            }
          }
        },
        symbol: "circle", //设定为实心点
        symbolSize: 6 //设定实心点的大小
      },
      {
        name: "NH3",
        type: "line",
        // stack: "总量",
        data: [0.8, 1.2, 1.0, 1.3, 1.5, 2.0, 1.8],
        itemStyle: {
          normal: {
            color: "#AB90DF", //改变折线点的颜色
            lineStyle: {
              color: "#AB90DF" //改变折线颜色
            }
          }
        },
        symbol: "circle", //设定为实心点
        symbolSize: 6 //设定实心点的大小
      }
    ]
  }));
  return useObserver(() => (
    <div className="screenCenterTable mt-4 pb-4">
      <div className="title">
        <ul>
          {titleStore.titleLists.map((item) => {
            return (
              <li>
                <div className={item.active ? "active t-b-con" : "t-b-con"}>
                  <img src="/images/map2.png"/>
                  {item.text}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <ReactEcharts option={store} style={{width: "100%"}} className="react_for_echarts"/>
    </div>
  ));
};
