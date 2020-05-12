import React, { createRef, useRef } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { useEffect } from "react";
import { constant } from "../../../../common/constants";
import { _ } from "../../../../utils/lodash";
import { useStore } from "../../../../stores/index";
import { EnterpriseScreenMapStore } from "../../../../stores/screen/EnterpriseScreenMapStore";
import { utils } from "utils";

export const EnterpriseScreenGasChart = () => {
  const {
    screen: { enterpriseScreenMap },
  } = useStore();

  const store = useLocalStore(() => ({
    dataIndex: 0,
    dataIndexMax: 6,
  }));
  const elementsRef = useRef(_.range(1, 10).map(() => createRef<any>()));

  useEffect(() => {
    setInterval(() => {
      store.dataIndex >= store.dataIndexMax ? (store.dataIndex = 0) : store.dataIndex++;

      elementsRef.current.forEach((item, index) => {
        const inst = item.current?.getEchartsInstance();
        if (inst) {
          inst.dispatchAction({
            type: "showTip",
            seriesIndex: 0, // 显示第几个serindexes
            dataIndex: store.dataIndex, // 显示第几个数据
            // position: ["45%", "10%"]
          });
        }
      });
    }, 1000);
  }, []);

  return useObserver(() => (
    <div className="screenTable mt-4" style={{ minHeight: 280, height: 377 }}>
      <div className="tableTitle flex justify-between items-center">
        <img src="/images/left.png" className="img" />
        <div>气体日均排放浓度趋势图</div>
        <img src="/images/right1.png" className="img" />
      </div>
      <CarouselProvider naturalSlideWidth={100} isPlaying naturalSlideHeight={66} interval={10000} totalSlides={enterpriseScreenMap.dailyGas.length}>
        <Slider style={{ height: 307 }}>
          {enterpriseScreenMap.dailyGas.map((item, index) => {
            return (
              <Slide index={index} key={index}>
                <ReactEcharts
                  //@ts-ignore
                  ref={elementsRef.current[index]}
                  option={makeOption(item)}
                  style={{ padding: "10px 10px 0 10px", width: "100%", height: "280px" }}
                  className="react_for_echarts"
                />
              </Slide>
            );
          })}
        </Slider>
        <DotGroup className="text-center">
          {enterpriseScreenMap.dailyGas.map((item, index) => (
            <Dot slide={index} key={index} className="text-white sliderDotButton" children={""} />
          ))}
        </DotGroup>
      </CarouselProvider>
    </div>
  ));
};

export const makeOption = (site: EnterpriseScreenMapStore["dailyGas"][0]) => {
  const option = {
    title: {
      text: site.pmName,
      textStyle: {
        color: "rgba(4,248,204,0.8)",
        fontSize: "14",
      },
      padding: [20, 20, 5, 20],
      margin: [20, 0],
      backgroundColor: "rgba(8,46,66,0.5)",
      borderColor: "rgba(8,46,66,0.5)",
      borderWidth: 1,
      top: -15,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(38,95,163,0.6);",
      padding: 10,
      textStyle: {
        color: "#88A8C5",
        fontSize: 10,
      },
      alwaysShowContent: {
        show: true,
      },
      formatter(params: any, ticket: any, callback: any) {
        let showHtml = "";
        for (var i = 0; i < params.length; i++) {
          var list = {} as any;
          //x轴名称
          var name = params[i].seriesName;
          //名称
          var text = params[i].axisValue;
          //值
          var { valueRaw, valueIn, value, limit, unit } = params[i].data;

          if (Number(valueRaw) > 0) {
            showHtml += `
            <div style="display:flex;align-items: center">
            <div style="margin-right:10px;width:10px;height:1px;border:1px solid ${constant.seriesColors[i]};background:${constant.seriesColors[i]}"></div>
            <div>${name}</div>
            <div style="color:#04F9CC;text-align:right;display:inline-block;margin-left:15px;${limit && valueRaw > limit ? "color:red;" : ""}">${value || ""}</div>
          </div>
          `;
          }
        }
        return `<div class="tableFloat text-left primary-text-dark">
                    <div>${text} 日均</div>
                    <div class="primary-text-dark">${option.title.text}</div>
                    <div class="primary-red">日均值上限：${limit || ""}</div>
                    <div style="color:#88A8C5;font-size:10px;background:rgba(11,36,69,0.6);padding:5px;border-radius:5px;margin-top:5px;">
                    ${showHtml}
            </div></div></div>`;
      },
    },
    // 上册图列配置
    legend: [
      {
        data: site.sites.map((i) => i.siteName),
        x: "right",
        textStyle: {
          color: "#88A8C5",
          fontSize: 12,
        },
        icon: "rect",
        y: 0,
        itemHeight: 2,
        itemWidth: 20,
      },
    ],
    grid: {
      top: "25%",
      left: "5%",
      right: "2%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      axisLabel: {
        textStyle: {
          color: "rgba(136,168,197,0.5)",
          fontSize: "10",
        },
      },
      data: site.sites[0].datas.map((i) => i.time),
    },
    yAxis: {
      name: "日均值",
      type: "value",
      min: 0,
      max: 10,
      splitNumber: 3,
      nameTextStyle: {
        color: "rgba(136,168,197,0.5)",
        align: "center",
        verticalAlign: "middle",
        padding: [10, 0, 20, 0],
      },
      nameGap: 15,
      axisLabel: {
        textStyle: {
          color: "rgba(136,168,197,0.5)",
          fontSize: "10",
        },
        margin: 8,
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
    series: [
      ...site.sites.map((item, index) => ({
        name: item.siteName,
        data: item.datas.map((i) => ({
          symbolSize: i.collectValue > site.upperLimit ? 12 : 0,
          value: i.collectValueDe ? Number(i.collectValueDe) : null,
          valueRaw: i.collectValue,
          valueIn: i.collectValueIn,
          limit: site.upperLimit,
          unit: i.unit,
        })),
        type: "line",
        itemStyle: {
          normal: {
            color: constant.seriesColors[index], //改变折线点的颜色
            lineStyle: {
              color: constant.seriesColors[index], //改变折线颜色
            },
          },
        },
        markLine: {
          symbol: "none",
          lineStyle: {
            normal: {
              type: "solid",
              color: "red",
            },
          },
          data: site.upperLimit
            ? [
                {
                  name: "预警值",
                  yAxis: site.upperLimit,
                },
              ]
            : [],
        },
        symbol: "circle", //设定为实心点
        // symbolSize: 2, //设定实心点的大小
      })),
    ],
  };
  return option;
};
