import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class Rank {
  @observable loading: boolean = false;

  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable dataSource: any = [];

  @observable option1: any = {
    tooltip: {
      trigger: 'axis'
    },
    backgroundColor: '#f0f0f0',
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'value',
        boundaryGap: [0, 0.01]
      }
    ],
    yAxis: [
      {
        type: 'category',
        // data: ['A化工', 'B化工', 'C化工', 'D化工', 'E化工', 'F化工']
      }
    ],
    series: [
      {
        // name: '2011年',
        type: 'bar',
        // data: [18203, 23489, 29034, 104970, 131744, 630230]
      },
    ]
  };

  @observable option2: any = {
    legend: {
      orient: 'horizontal',
      x: 'center',
      y: 'bottom',
      // data: ['行业1', '行业2', '行业3']
    },
    backgroundColor: '#f0f0f0',
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: {
          show: true,
          type: ['pie', 'funnel']
        },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    calculable: false,
    series: [
      {
        name: '贡献率',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, 140],
  
        funnelAlign: 'right',
        max: 1548,
  
        itemStyle: {
          normal: {
            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            }
          }
        },
        // data: [
        //   { value: 335, name: '行业1' },
        //   { value: 679, name: '行业2' },
        //   { value: 1548, name: '行业3' }
        // ]
      }
    ]
  };


  @action.bound
  async getAllSitesTree() {
    this.loading = true;
    try {
      const { data }: any = await GET('/device-site/getAllSitesTreeAndPMTypeLogin', {});
      this.parkTree = data.pfsList;
      this.ptList = data.ptList;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getStatisRank(param) {
    this.loading = true;
    param.endTime = moment(param.endTime).format('YYYY-MM-DD HH:mm:ss');

    try {
      const { data }: any = await POST('/device-data-history/getStatisRank', { ...param });
      this.dataSource = data;
      this.option1.yAxis[0].data = data.map(item => item.areaName);
      this.option1.series[0].data = data.map(item => item.sumValue);
      this.option2.legend.data = data.map(item => item.areaName);
      this.option2.series[0].data = data.map(item => ({ value: item.sumValue, name: item.areaName }));
    } catch {

    }

    this.loading = false;
  }
}
