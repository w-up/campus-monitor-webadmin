import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from "moment";

const defaultOption1 = {
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: '25%',
    // right: '20%',
    // top: '20%',
    // bottom: '20%',
  },
  backgroundColor: "#f0f0f0",
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      // dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  xAxis: [
    {
      type: "value",
      boundaryGap: [0, 0.01],
    },
  ],
  yAxis: [
    {
      type: "category",
      // data: ['A化工', 'B化工', 'C化工', 'D化工', 'E化工', 'F化工']
    },
  ],
  series: [
    {
      // name: '2011年',
      type: "bar",
      // data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
  ],
};

const defaultOption2 = {
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
      // dataView: { show: true, readOnly: false },
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
      name: "贡献率",
      type: "pie",
      selectedMode: "single",
      radius: [0, 140],

      funnelAlign: "right",
      max: 1548,

      itemStyle: {
        normal: {
          label: {
            position: "inner",
          },
          labelLine: {
            show: false,
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

const defaultOption3 = {
  tooltip: {
    trigger: "axis",
  },
  grid: {
    left: '25%',
    // right: '20%',
    // top: '20%',
    // bottom: '20%',
  },
  backgroundColor: "#f0f0f0",
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      // dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  xAxis: [
    {
      type: "value",
      boundaryGap: [0, 0.01],
    },
  ],
  yAxis: [
    {
      type: "category",
      // data: ['A化工', 'B化工', 'C化工', 'D化工', 'E化工', 'F化工']
    },
  ],
  series: [
    {
      // name: '2011年',
      type: "bar",
      // data: [18203, 23489, 29034, 104970, 131744, 630230]
    },
  ],
};

const defaultOption4 = {
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
      // dataView: { show: true, readOnly: false },
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
      name: "贡献率",
      type: "pie",
      selectedMode: "single",
      radius: [0, 140],

      funnelAlign: "right",
      max: 1548,

      itemStyle: {
        normal: {
          label: {
            position: "inner",
          },
          labelLine: {
            show: false,
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

export class Rank {
  @observable loading: boolean = false;

  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable dataSource: any = [];
  @observable dataSource2: any = [];

  @observable option1: any = defaultOption1;

  @observable option2: any = defaultOption2;

  @observable option3: any = defaultOption3;

  @observable option4: any = defaultOption4;

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
  async getStatisRank(param) {
    this.loading = true;

    switch (param.timeCycle) {
      case 1:
        param.collectDate = moment(param.collectDate).format('YYYY-MM-DD');
        break;
      case 2:
        param.collectDate = moment(param.collectDate).format('YYYY-MM');
        break;
      case 3:
        param.collectDate = moment(param.collectDate).format('YYYY');
        break;
      case 4:
        param.collectDate = moment(param.collectDate).format('YYYY-WW');
        break;
      case 5:
        param.collectDate = moment(param.collectDate).format('YYYY-Q');
        break;
    }

    param.pmType = param.ptId;
    // delete param.ptId;
    // this.option1 = { ...defaultOption1 };
    // this.option2 = { ...defaultOption2 };
    // this.option3 = { ...defaultOption3 };
    // this.option4 = { ...defaultOption4 };

    let data12: any = [];
    let data34: any = [];

    try {
      ({ data: data12 } = await POST("/device-data-history/getStatisRank", { ...param, detectType: 2 })); // 厂区
    } catch {}

    try {
      ({ data: data34 } = await POST("/device-data-history/getStatisRank", { ...param, detectType: 1 })); // 站点
    } catch {}

    const tmpOption1: any = { ...defaultOption1 };
    const tmpOption2: any = { ...defaultOption2 };
    const tmpOption3: any = { ...defaultOption3 };
    const tmpOption4: any = { ...defaultOption4 };

    this.dataSource = data12;
    tmpOption1.yAxis[0].data = data12.map((item) => item.areaName);
    tmpOption1.series[0].data = data12.map((item) => item.sumValue);
    tmpOption2.legend.data = data12.map((item) => item.areaName);
    tmpOption2.series[0].data = data12.map((item) => ({ value: item.sumValue, name: item.areaName }));

    this.option1 = tmpOption1;
    this.option2 = tmpOption2;

    this.dataSource2 = data34;
    tmpOption3.yAxis[0].data = data34.map((item) => item.areaName);
    tmpOption3.series[0].data = data34.map((item) => item.sumValue);
    tmpOption4.legend.data = data34.map((item) => item.areaName);
    tmpOption4.series[0].data = data34.map((item) => ({ value: item.sumValue, name: item.areaName }));

    this.option3 = tmpOption3;
    this.option4 = tmpOption4;

    this.loading = false;
  }

  @action.bound
  async getStatisAnalisis(param) {
    this.loading = true;

    switch (param.timeCycle) {
      case 1:
        param.collectDate = moment(param.collectDate).format('YYYY-MM-DD');
        break;
      case 2:
        param.collectDate = moment(param.collectDate).format('YYYY-MM');
        break;
      case 3:
        param.collectDate = moment(param.collectDate).format('YYYY');
        break;
      case 4:
        param.collectDate = moment(param.collectDate).format('YYYY-WW');
        break;
      case 5:
        param.collectDate = moment(param.collectDate).format('YYYY-Q');
        break;
    }

    param.pmType = param.ptId;

    try {
      const { data }: any = await POST("/device-data-history/getStatisAnalisis", { ...param });
    } catch {}
    this.loading = false;
  }
}
