import { action, observable } from "mobx";
import { GET, POST } from "../../utils/request";
import { store } from "../index";
import moment from "moment";
import { globalConfig } from "../../config";

export class HistoryData {
  @observable loading: boolean = false;
  @observable query: any = {
    current: 1,
    pageSize: 10,
    size: 10,
  };
  @observable total: number = 0;

  @observable parkTree: any = [];
  @observable ptList: any = [];
  @observable columns: any = [];
  @observable dataList: any = [];

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
  paginationChange(page, pageSize) {
    this.query = {
      ...this.query,
      current: page,
      size: pageSize,
      pageSize,
    };
    this.queryDatas(this.query);
  }

  @action.bound
  async queryDatas(param: any = {}) {
    this.loading = true;

    if (param.timeRange && param.timeRange.length > 0) {
      param.startTime = moment(param.timeRange[0]).format("YYYY-MM-DD HH:mm:ss");
      param.endTime = moment(param.timeRange[1]).format("YYYY-MM-DD HH:mm:ss");
    }

    this.query = {
      ...this.query,
      ...param,
    };
    try {
      const { data }: any = await POST("/device-data-history/queryHistoryDatas", this.query);
      this.columns = data.titles.map((item, index) => {
        const config = { ...item, width: 100, key: item.titleKey, dataIndex: item.titleKey };
        if (index === 0) {
          config.fixed = "left";
          // config.width = 150;
        }
        // if (index === data.titles.length - 1) {
        //   delete config.width;
        // }
        return config;
      });
      this.dataList = data.dataList.records.map((item, index) => ({ ...item, key: index }));

      this.total = data.dataList.total;
      this.query.pageSize = data.dataList.size;
      this.query.current = data.dataList.current;
    } catch {}

    this.loading = false;
  }

  @action.bound
  async exportDatas() {
    this.loading = true;
    try {
      // let f = document.createElement("form");
      // f.setAttribute('method',"post");
      // f.setAttribute('action',`${globalConfig.apiEndpoint}/device-data-history/exportHistoryDatas`);

      // let endTimeInput = document.createElement("input");
      // endTimeInput.setAttribute('type',"text");
      // endTimeInput.setAttribute('name',"endTime");
      // endTimeInput.value = this.query.endTime;
      // f.appendChild(endTimeInput);

      // let startTimeInput = document.createElement("input");
      // startTimeInput.setAttribute('type',"text");
      // startTimeInput.setAttribute('name',"startTime");
      // startTimeInput.value = this.query.startTime;
      // f.appendChild(startTimeInput);

      // let siteIdInput = document.createElement("input");
      // siteIdInput.setAttribute('type',"text");
      // siteIdInput.setAttribute('name',"siteId");
      // siteIdInput.value = this.query.siteId;
      // f.appendChild(siteIdInput);

      // this.query.pmCodeList.forEach(val => {
      //   let pmCodeInput = document.createElement("input");
      //   pmCodeInput.setAttribute('type',"text");
      //   pmCodeInput.setAttribute('name',"pmCodeList[]");
      //   pmCodeInput.value = val;
      //   f.appendChild(pmCodeInput);
      // });

      // document.getElementsByTagName('body')[0].appendChild(f);

      // f.submit();

      const { headers, data }: any = await POST("/device-data-history/exportHistoryDatas", {
        ...this.query,
      });

      const type = headers["content-type"];
      const file = new Blob([data], { type });
      const url = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xls");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {}

    this.loading = false;
  }
}
