import React, {createRef, useRef} from "react";
import {useObserver, useLocalStore} from "mobx-react-lite";
import ReactEcharts from "echarts-for-react";
import {CarouselProvider, Dot, DotGroup, Slide, Slider} from "pure-react-carousel";
import {useEffect} from "react";
import {constant} from "../../../../common/constants";
import {utils} from "../../../../utils/index";
import {_} from "../../../../utils/lodash";

export const EnterpriseScreenGasChart = () => {
  const store = useLocalStore(() => ({
    dataIndex: 0,
    dataIndexMax: 6,
    listtotal: [
      {
        name: "非甲烷中经",
        date: ["12/01", "12/02", "12/03", "12/04", "12/05", "12/06", "12/07"],
        series: [
          {name: "东南角", data: [1.2, 1.6, 1.8, 1.92, 2.02, 2.22, 1.89]},
          {name: "东北角", data: [1.2, 1.5, 1.8, 2.0, 1.8, 1.6, 1.3]},
          {name: "西南角", data: [1.2, 1.8, 1.5, 1.2, 1.5, 1.2, 1.6]},
          {name: "西北角", data: [0.8, 1.2, 1.0, 1.3, 1.5, 2.0, 1.8]}
        ]
      },
      {
        name: "TVOC",
        date: ["12/01", "12/02", "12/03", "12/04", "12/05", "12/06", "12/07"],
        series: [
          {name: "东南角", data: [1.2, 1.6, 1.8, 1.92, 2.02, 2.22, 1.89]},
          {name: "东北角", data: [1.2, 1.5, 1.8, 2.0, 1.8, 1.6, 1.3]},
          {name: "西南角", data: [1.2, 1.8, 1.5, 1.2, 1.5, 1.2, 1.6]},
          {name: "西北角", data: [0.8, 1.2, 1.0, 1.3, 1.5, 2.0, 1.8]}
        ]
      },
      {
        name: "苯",
        date: ["12/01", "12/02", "12/03", "12/04", "12/05", "12/06", "12/07"],
        series: [
          {name: "东南角", data: [1.2, 1.6, 1.8, 1.92, 2.02, 2.22, 1.89]},
          {name: "东北角", data: [1.2, 1.5, 1.8, 2.0, 1.8, 1.6, 1.3]},
          {name: "西南角", data: [1.2, 1.8, 1.5, 1.2, 1.5, 1.2, 1.6]},
          {name: "西北角", data: [0.8, 1.2, 1.0, 1.3, 1.5, 2.0, 1.8]}
        ]
      },
      {
        name: "甲苯",
        date: ["12/01", "12/02", "12/03", "12/04", "12/05", "12/06", "12/07"],
        series: [
          {name: "东南角", data: [1.2, 1.6, 1.8, 1.92, 2.02, 2.22, 1.89]},
          {name: "东北角", data: [1.2, 1.5, 1.8, 2.0, 1.8, 1.6, 1.3]},
          {name: "西南角", data: [1.2, 1.8, 1.5, 1.2, 1.5, 1.2, 1.6]},
          {name: "西北角", data: [0.8, 1.2, 1.0, 1.3, 1.5, 2.0, 1.8]}
        ]
      }
    ]
  }));
  const elementsRef = useRef(store.listtotal.map(() => createRef<any>()));

  useEffect(() => {
    setInterval(() => {
      store.dataIndex >= store.dataIndexMax ? (store.dataIndex = 0) : store.dataIndex++;
      elementsRef.current.forEach((item, index) => {
        const inst = item.current?.getEchartsInstance();
        if (inst) {
          inst.dispatchAction({
            type: "showTip",
            seriesIndex: 0, // 显示第几个serindexes
            dataIndex: store.dataIndex // 显示第几个数据
            // position: ["45%", "10%"]
          });
        }
      });
    }, 1000);
  }, []);

  return useObserver(() => (
    <div className="screenTable mt-4" style={{height: "377px"}}>
      <div className="tableTitle flex justify-between items-center">
        <img src="/images/left.png" className="img"/>
        <div>气体日均排放浓度趋势图</div>
        <img src="/images/right1.png" className="img"/>
      </div>
      <CarouselProvider naturalSlideWidth={100} isPlaying naturalSlideHeight={80} interval={5000}
                        totalSlides={store.listtotal.length}>
        <Slider>
          {store.listtotal.map((item, index) => {
            return (
              <Slide index={index} key={index}>
                <ReactEcharts
                  //@ts-ignore
                  ref={elementsRef.current[index]}
                  option={makeOption({name: item.name, series: item.series, date: item.date})}
                  style={{marginTop: "20px", padding: "10px", height: "260px", width: "100%"}}
                  className="react_for_echarts"
                />
              </Slide>
            );
          })}
        </Slider>
        <DotGroup className="text-center">
          {store.listtotal.map((item, index) => (
            <Dot slide={index} key={index} className="text-white sliderDotButton" children={""}/>
          ))}
        </DotGroup>
      </CarouselProvider>
    </div>
  ));
};

export const makeOption = ({name, series, date}: { name: string; series: any[]; date: any[] }) => {
  const option = {
    title: {
      text: name,
      textStyle: {
        color: "rgba(4,248,204,0.8)",
        fontSize: "14"
      },
      padding: [5, 20]
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(38,95,163,0.6);",
      padding: 10,
      textStyle: {
        color: "#88A8C5",
        fontSize: 10
      },
      alwaysShowContent: {
        show: true
      },
      formatter(params: any, ticket: any, callback: any) {
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
        return `<div class="tableFloat text-left primary-text-dark">
                    <div>${text} 日均</div>
                    <div class="primary-text-dark">${option.title.text}</div>
                    <div class="primary-red">日均值上限：2（mg/m³）</div>
                    <div style="color:#88A8C5;font-size:10px;background:rgba(11,36,69,0.6);padding:5px;border-radius:5px;margin-top:5px;">
                    <div class="flex items-center">
                        <div style="margin-right:10px;width:10px;height:1px;border:1px solid #1089E7;background:#1089E7"></div>
                        <div>${showHtm[0].name}</div>
                        <div class="tableFloatNumber">${showHtm[0].value.toFixed(1)}</div>
                    </div>
                    <div class="flex items-center">
                        <div style="margin-right:10px;width:10px;height:1px;border:1px solid #FE7B43;background:#FE7B43"></div>
                        <div>${showHtm[1].name}</div>
                        <div class="tableFloatNumber">${showHtm[1].value.toFixed(1)}</div>
                    </div>
                    <div class="flex items-center">
                        <div style="margin-right:10px;width:10px;height:1px;border:1px solid #12FFEE;background:#12FFEE"></div>
                        <div>${showHtm[2].name}</div>
                        <div class="tableFloatNumber">${showHtm[2].value.toFixed(1)}</div>
                    </div>
                    <div class="flex items-center">
                        <div style="margin-right:10px;width:10px;height:1px;border:1px solid #AB90DF;background:#AB90DF"></div>
                        <div>${showHtm[3].name}</div>
                        <div class="tableFloatNumber">${showHtm[3].value.toFixed(1)}</div>
                    </div>
            </div></div></div>`;
      }
    },
    // 上册图列配置
    legend: [
      {
        data: ["东南角", "东北角"],
        x: "right",
        textStyle: {
          color: "#88A8C5",
          fontSize: 12
        },
        icon: "rect",
        y: 0,
        itemHeight: 2,
        itemWidth: 20
      },
      {
        data: ["西南角", "西北角"],
        x: "right",
        textStyle: {
          color: "#88A8C5",
          fontSize: 12
        },
        icon: "rect",
        y: 20,
        bottom: 10,
        itemHeight: 2,
        itemWidth: 20
      }
    ],
    grid: {
      top: "25%",
      left: "5%",
      right: "2%",
      bottom: "2%",
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
      data: date
    },
    yAxis: {
      name: "日均值（mg/m³）",
      type: "value",
      min: 0,
      // max: 3,
      splitNumber: 3,
      nameTextStyle: {
        color: "rgba(136,168,197,0.5)",
        align: "center",
        verticalAlign: "middle",
        padding: [5, 0, 5, 50]
      },
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
    series: series.map((item, index) => ({
      name: item.name,
      data: item.data,
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
      symbolSize: 2 //设定实心点的大小
    }))
  };
  return option;
};
