import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from 'moment';

export class Comparison {
  @observable loading: boolean = false;

  @observable parkTree: any = [];
  @observable ptList: any = [];

  @observable option1: any = {
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
        name: '',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, 80],
  
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
      },
      {
        name: '',
        type: 'pie',
        radius: [100, 140],
  
        funnelAlign: 'left',
        max: 1048,
  
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
        //   { value: 335, name: '已选行业' },
        //   { value: 310, name: '其他行业' },
        // ]
      }
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
      name: '',
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
  async getStatisAnalisis(param) {
    this.loading = true;
    param.collectDate = moment(param.collectDate).format('YYYY-MM-DD HH:mm:ss');

    try {
      const { data }: any = await POST('/device-data-history/getStatisAnalisis', { ...param });
      const { professionData, factoryData, trendData } = data;
      this.option1.legend.data = professionData.map(item => item.areaName);
      this.option1.series[0].data = professionData.map(item => ({ name: item.areaName, value: item.sumValue }));
      // this.option1.series[1].data = professionData.map(item => ({ name: item.areaName, value: item.sumValue }));

      this.option2.legend.data = factoryData.map(item => item.areaName);
      this.option2.series[0].data = factoryData.map(item => ({ name: item.areaName, value: item.sumValue }));
      
    } catch {

    }

    this.loading = false;
  }
}
