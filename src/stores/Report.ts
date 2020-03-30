import { action, observable } from "mobx";
import { GET, POST } from "../utils/request";
import Mock, { Random } from 'mockjs';
import moment from 'moment';

export class Report {
  
  @observable loading: boolean = false;
  @observable parkList: any = [];
  @observable companyList: any = [];
  @observable pmList: any = [];
  @observable tableColumn: any = [];
  @observable tableData: any = [];
  
  @observable chartOption: any = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      orient: 'horizontal',
      x: 'center',
      y: 'bottom',
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
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        // data: ['10-24-00', '10-24-06', '10-24-12', '10-24-18', '10-25-00']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
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
    param.collectDate = moment(param.collectDate).format('YYYY-MM-DD');
    try {
      let data: any = {};
      if (param.timeCycle !== 3) {
        const { data: res }: any = await POST('/device-data-history/getStatisReport', param);
        data = res;
      } else {
        const { data: res }: any = await POST('/device-data-history/getStatisReportByYear', param);
        data = res;
      }

      const { tableHeaderData, tableData, trendData, heatMap } = data;
      const comumn = tableHeaderData.map((title, index) => {
        const col: any = { title, dataIndex: index, key: index, width: 100 };
        if (index === 0) {
          col.width = 200;
          col.fixed = 'left';
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
      this.chartOption.legend.data = Object.keys(trendData);
      this.chartOption.xAxis.data = Object.keys(Object.values(trendData)[0] as any);
      const series: any = [];
      Object.keys(trendData).forEach(name => {
        const obj: any = { name, type: 'line', stack: '总量' };
        obj.data = Object.values(trendData[name]);
        series.push(obj);
      });
      this.chartOption.series = series;
    } catch {

    }
    this.loading = false;
  }

  @action.bound
  async exportStatisReport(param) {
    this.loading = true;
    param.collectDate = moment(param.collectDate).format('YYYY-MM-DD');
    try {
      const { headers, data }: any = await POST('/device-data-history/exportStatisReport', param);
      const type = headers['content-type']
      const file = new Blob([data], { type });
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.xls');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {

    }
    this.loading = false;
  }

}
