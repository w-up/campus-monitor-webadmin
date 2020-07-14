import { action, observable } from "mobx";
import { GET, POST, FORM_POST } from "../utils/request";
import Mock, { Random } from 'mockjs';
import moment from 'moment';

const DefaultChartOption = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    // orient: 'horizontal',
    // x: 'center',
    // y: 'bottom',
    // data: ['A化工', 'B化工', 'C化工', 'D化工', 'E化工']
  },
  backgroundColor: '#f0f0f0',
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      // dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  calculable: true,
  xAxis: {
    type: 'category',
    boundaryGap: false,
    // data: ['10-24-00', '10-24-06', '10-24-12', '10-24-18', '10-25-00']
  },
  yAxis: {
    type: 'value'
  },
  // series: [
  //   {
  //     name: 'A化工',
  //     type: 'line',
  //     stack: '总量',
  //     data: [120, 132, 101, 134, 90]
  //   },
  //   {
  //     name: 'B化工',
  //     type: 'line',
  //     stack: '总量',
  //     data: [220, 182, 191, 234, 290]
  //   },
  //   {
  //     name: 'C化工',
  //     type: 'line',
  //     stack: '总量',
  //     data: [150, 232, 201, 154, 190]
  //   },
  //   {
  //     name: 'D化工',
  //     type: 'line',
  //     stack: '总量',
  //     data: [320, 332, 301, 334, 390]
  //   },
  //   {
  //     name: 'E化工',
  //     type: 'line',
  //     stack: '总量',
  //     data: [820, 932, 901, 934, 1290]
  //   }
  // ]
};

const defaultYearOption: any = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01]
  },
  yAxis: {
    type: 'category',
    // data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
  },
  series: [
    {
      // name: '2011年',
      type: 'bar',
      // data: [18203, 23489, 29034, 104970, 131744, 630230]
    }
  ]
};

const defaultQuarterOption: any = {
  tooltip: {
    position: 'top',
  },
  visualMap: {
    min: 0,
    // max: 1000,
    calculable: true,
    orient: 'vertical',
    right: '0',
    top: '0'
  },

  calendar: [{
    orient: 'vertical',
    // range: '2020'
  }, {
    left: 300,
    orient: 'vertical',
    // range: '2020'
  }, {
    left: 520,
    orient: 'vertical',
    // range: '2020'
  }],

  series: [{
    type: 'heatmap',
    label: {
      show: false
    },
    coordinateSystem: 'calendar',
    calendarIndex: 0,
    // data: getVirtulData(2020)
  }, {
    type: 'heatmap',
    label: {
      show: false
    },
    coordinateSystem: 'calendar',
    calendarIndex: 1,
    // data: getVirtulData(2020)
  }, {
    type: 'heatmap',
    label: {
      show: false
    },
    coordinateSystem: 'calendar',
    calendarIndex: 2,
    // data: getVirtulData(2020)
  }]
};

const defaultMonthOption: any = {
  tooltip: {
    position: 'top',
  },
  visualMap: {
    min: 0,
    // max: 1000,
    calculable: true,
    orient: 'vertical',
    right: '0',
    top: '0'
  },

  calendar: [{
    orient: 'vertical',
    // range: '2020'
  }],

  series: [{
    type: 'heatmap',
    label: {
      show: false
    },
    coordinateSystem: 'calendar',
    calendarIndex: 0,
    // data: getVirtulData(2020)
  }]
};

const defaultHeatOption: any = {
  tooltip: {
    position: 'top'
  },
  animation: false,
  grid: {
    height: '50%',
    top: '5%'
  },
  xAxis: {
    type: 'category',
    // data: ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
    // '7a', '8a', '9a','10a','11a',
    // '12p', '1p', '2p', '3p', '4p', '5p',
    // '6p', '7p', '8p', '9p', '10p', '11p'],
    splitArea: {
      show: true
    }
  },
  yAxis: {
    type: 'category',
    // data: ['Saturday', 'Friday', 'Thursday',
    // 'Wednesday', 'Tuesday', 'Monday', 'Sunday'],
    splitArea: {
      show: true
    }
  },
  visualMap: {
    min: 0,
    // max: 500,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '5%'
  },
  series: [{
    // name: 'Punch Card',
    type: 'heatmap',
    // data: [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]],
    label: {
      show: false
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
};
export class Report {

  @observable loading: boolean = false;
  @observable parkList: any = [];
  @observable companyList: any = [];
  @observable pmList: any = [];
  @observable tableColumn: any = [];
  @observable tableData: any = [];

  @observable heatOptions: any = [

  ];

  @observable yearOptions: any = [

  ];

  @observable chartOption: any = DefaultChartOption;

  @action.bound
  async getAllCompanyAndPark() {
    this.loading = true;
    try {
      const { data: { parkList, companyList } }: any = await GET('/user/getAllCompanyAndParkSelf', {});
      this.parkList = parkList;
      this.companyList = companyList;
    } catch {

    }

    this.loading = false;
  }

  @action.bound
  async getParkList() {
    this.loading = true;
    try {
      const { data }: any = await GET('/park/getAllParks', {});
      this.parkList = data;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getCompanyList() {
    this.loading = true;
    try {
      const { data }: any = await GET('/company/getAllCompany', {});
      this.companyList = data;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getAllPMTypeAndCode() {
    this.loading = true;
    try {
      const { data }: any = await GET('/pm-code/getAllPMTypeAndCode', {});
      this.pmList = data.results;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async getStatisReport(param) {
    delete param.pmType;
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
    try {
      let data: any = {};
      if (param.timeCycle !== 3) {
        const { data: res }: any = await POST('/device-data-history/getStatisReport', param);
        data = res;
      } else {
        const { data: res }: any = await POST('/device-data-history/getStatisReportByYear', param);
        data = res;
      }

      const { tableHeaderData, tableData, trendData, trendDatas, heatMap, rankData, upperThreshold } = data;
      if (param.timeCycle === 3) {
        const [header, ...innerData] = tableData;
        const column = header.map((title, index) => {
          if (index === 0) {
            return { title, dataIndex: index, key: index, width: 100 };
          }
          return { title, dataIndex: index, key: index, width: 200, children: [
            {
              title: '均值',
              dataIndex: index,
              key: index,
              width: 100,
              render: str => str ? str.split(',')[0] : '',
            },
            {
              title: '峰值',
              dataIndex: index,
              key: index,
              width: 100,
              render: str => str ? str.split(',')[1] : '',
            },
          ] };
        });
        this.tableColumn = column;
        const table: any = [];
        innerData.forEach((item, key) => {
          const obj: any = {};
          obj.key = key;
          item.forEach((val, index) => {
            obj[index] = val;
          });
          table.push(obj);
        });
        this.tableData = table;
      } else {
        const comumn = tableHeaderData.map((title, index) => {
          const col: any = { title, dataIndex: index, key: index, width: 200 };
          if (index === 0) {
            col.width = 200;
            // col.fixed = 'left';
          }
          return col;
        });
        this.tableColumn = comumn;
        const table: any = [];
        tableData.forEach((item, key) => {
          const obj: any = {};
          obj.key = key;
          item.forEach((val, index) => {
            obj[index] = val;
          });
          table.push(obj);
        });
        this.tableData = table;
      }


      this.heatOptions = [];
      this.chartOption = DefaultChartOption;

      // 折线图 天
      if (param.timeCycle === 1 && trendData && trendDatas) {
        this.chartOption.legend.data = Object.keys(trendData);
        // this.chartOption.legend.data = trendDatas.map((v: any) => v.);
        this.chartOption.xAxis.data = Object.keys(Object.values(trendData)[0] as any);
        const series: any = [];
        Object.keys(trendData).forEach(name => {
          const obj: any = { name, type: 'line', stack: '总量' };
          obj.data = Object.values(trendData[name]);
          series.push(obj);
        });
        this.chartOption.series = series;
      }

      // 柱状图 年
      if (param.timeCycle === 3 && rankData) {
        this.yearOptions = [];
        Object.keys(rankData).forEach((item: any) => {
          const option: any = { ...defaultYearOption };
          option.series[0].name = item;
          option.yAxis.data = Object.keys(rankData[item]).map(v => v + '月');
          option.series[0].data = Object.values(rankData[item]);
          this.yearOptions.push(option);
        });
      }

      // 热力图 月
      if (param.timeCycle === 2 && trendData) {
        this.heatOptions = [];
        Object.keys(trendData).forEach((item: any) => {
          const option: any = { ...defaultMonthOption };
          option.series[0].name = item;
          option.calendar[0].range = param.collectDate;
          const headData: any = [];
          Object.keys(trendData[item]).forEach((date) => {
            headData.push([date, trendData[item][date]]);
          });
          option.series[0].data = headData;
          this.heatOptions.push(option);
        });
      }

      // 热力图 周
      if (param.timeCycle === 4 && heatMap) {
        this.heatOptions = [];
        Object.keys(heatMap).forEach((item: any) => {
          const option: any = { ...defaultHeatOption };
          option.xAxis.data = Object.keys(Object.values(heatMap[item])[0] as any);
          option.yAxis.data = Object.keys(heatMap[item]);
          option.series[0].name = item;
          // option.visualMap.max = upperThreshold;

          const headData: any = [];
          Object.keys(heatMap[item]).forEach((yAxis, yIndex) => {
            Object.keys(heatMap[item][yAxis]).forEach(xAxis => {
              headData.push([xAxis, yIndex, heatMap[item][yAxis][xAxis]]);
            });
          });
          option.series[0].data = headData;
          this.heatOptions.push(option);
        });
      }

      // 热力图 季
      if (param.timeCycle === 5 && heatMap) {
        this.heatOptions = [];
        Object.keys(heatMap).forEach((item: any) => {
          const option: any = { ...defaultQuarterOption };
          option.series[0].name = item;
          const [curYear, curQuarter] = param.collectDate.split('-');
          const arr = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
          const current = arr[curQuarter - 1];
          option.calendar = option.calendar.map((item, index) => {
            return {
              ...item,
              yearLabel: {
                margin: 40
              },
              monthLabel: {
                  nameMap: 'cn',
                  margin: 20
              },
              // dayLabel: {
              //     firstDay: 1,
              //     nameMap: 'cn'
              // },
              range: `${curYear}-${current[index]}`,
            }
          });
          Object.keys(heatMap[item]).forEach((month, index) => {
            // option.calendar[index].range = `${moment(param.collectDate).format('YYYY')}-${month}`;
            option.series[index].calendarIndex = index;
            option.series[index].data = Object.keys(heatMap[item][month]).map(day => {
              return [day, heatMap[item][month][day]]
            });
          });
          
          // if (Object.keys(heatMap[item]).length < 3) {
          //   delete option.calendar[2];
          //   delete option.series[2];
          // }
          this.heatOptions.push(option);
        });
      }

    } catch (err) {
      console.error(err)
    }
    this.loading = false;
  }

  @action.bound
  async exportStatisReport(param) {
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

    try {
      const response: any = await FORM_POST('/device-data-history/exportStatisReport', param);
      const { headers, data } = response;
      const type = headers['content-type']
      const file = new Blob([data], { type });
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '导出数据.xls');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch {

    }
    this.loading = false;
  }

}
