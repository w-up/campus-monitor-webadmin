import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from "moment";

export class Comparison {
  @observable loading: boolean = false;

  @observable parkTree: any = [];
  @observable ptList: any = [];

  @observable option1: any = {
    legend: {
      orient: "horizontal",
      x: "center",
      y: "bottom",
      // data: ['行业1', '行业2', '行业3']
    },
    backgroundColor: "#f0f0f0",
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: {
          show: true,
          type: ["pie", "funnel"],
        },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: false,
    series: [
      {
        name: "",
        type: "pie",
        selectedMode: "single",
        radius: [0, 80],

        funnelAlign: "right",
        max: 1548,

        itemStyle: {
          normal: {
            label: {
              // position: "inner",
              formatter: '{a} {b} \r\n {c} ({d}%)',
            },
            labelLine: {
              show: true,
            },
          },
        },
        // data: [
        //   { value: 335, name: '行业1' },
        //   { value: 679, name: '行业2' },
        //   { value: 1548, name: '行业3' }
        // ]
      },
      {
        name: "",
        type: "pie",
        radius: [100, 140],

        funnelAlign: "left",
        max: 1048,

        itemStyle: {
          normal: {
            label: {
              // position: "inner",
              formatter: '{a} {b} \r\n {c} ({d}%)',
            },
            labelLine: {
              show: true,
            },
          },
        },

        // data: [
        //   { value: 335, name: '已选行业' },
        //   { value: 310, name: '其他行业' },
        // ]
      },
    ],
  };

  @observable option2: any = {
    legend: {
      orient: "horizontal",
      x: "center",
      y: "bottom",
      // data: ['行业1', '行业2', '行业3']
    },
    backgroundColor: "#f0f0f0",
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: {
          show: true,
          type: ["pie", "funnel"],
        },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: false,
    series: [
      {
        name: "",
        type: "pie",
        selectedMode: "single",
        radius: [0, 80],
        funnelAlign: "right",
        max: 1548,

        itemStyle: {
          normal: {
            label: {
              // position: "inner",
              formatter: '{a} {b} \r\n {c} ({d}%)',
            },
            labelLine: {
              show: true,
            },
          },
        },
        // data: [
        //   { value: 335, name: '行业1' },
        //   { value: 679, name: '行业2' },
        //   { value: 1548, name: '行业3' }
        // ]
      },
    ],
  };

  @observable option3: any = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      orient: "horizontal",
      x: "center",
      y: "bottom",
      // data: ["A化工", "B化工", "C化工", "D化工", "E化工"],
    },
    backgroundColor: "#f0f0f0",
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        // data: ["10-24-00", "10-24-06", "10-24-12", "10-24-18", "10-25-00"],
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      // {
      //   name: "A化工",
      //   type: "line",
      //   stack: "总量",
      //   data: [120, 132, 101, 134, 90],
      // },
      // {
      //   name: "B化工",
      //   type: "line",
      //   stack: "总量",
      //   data: [220, 182, 191, 234, 290],
      // },
      // {
      //   name: "C化工",
      //   type: "line",
      //   stack: "总量",
      //   data: [150, 232, 201, 154, 190],
      // },
      // {
      //   name: "D化工",
      //   type: "line",
      //   stack: "总量",
      //   data: [320, 332, 301, 334, 390],
      // },
      // {
      //   name: "E化工",
      //   type: "line",
      //   stack: "总量",
      //   data: [820, 932, 901, 934, 1290],
      // },
    ],
  };

  @action.bound
  async getAllSitesTree() {
    this.loading = true;
    try {
      const { data }: any = await GET("/device-site/getAllSitesTreeAndPMTypeLogin", {});
      if (data) {
        this.parkTree = data.pfsList || [];
        this.ptList = data.ptList || [];
      }
    } catch {}
    this.loading = false;
  }

  @action.bound
  async getStatisAnalisis(param) {
    this.loading = true;
    switch (param.timeCycle) {
      case 1:
        param.collectDate = moment(param.collectDate).format("YYYY-MM-DD");
        break;
      case 2:
        param.collectDate = moment(param.collectDate).format("YYYY-MM");
        break;
      case 3:
        param.collectDate = moment(param.collectDate).format("YYYY");
        break;
    }

    param.pmType = param.ptId;

    try {
      const { data }: any = await POST("/device-data-history/getStatisAnalisis", { ...param });
      const { professionData, factoryData, trendData } = data;
      this.option1.legend.data = professionData.map((item) => item.areaName);
      this.option1.series[0].data = professionData.map((item) => ({ name: item.areaName, value: item.sumValue }));
      // this.option1.series[1].data = professionData.map(item => ({ name: item.areaName, value: item.sumValue }));

      this.option2.legend.data = factoryData.map((item) => item.areaName);
      this.option2.series[0].data = factoryData.map((item) => ({ name: item.areaName, value: item.sumValue }));

      if (trendData) {
        this.option3.legend.data = Object.keys(trendData);
        this.option3.xAxis[0].data = Object.keys(Object.values(trendData)[0] as any);
        this.option3.series = Object.keys(trendData).map(name => {
          const item = {
            name,
            type: "line",
            stack: "总量",
            data: Object.values(trendData[name]),
          }
          return item;
        })
      }
    } catch {}

    this.loading = false;
  }
}
