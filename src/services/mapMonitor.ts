import { GET, POST } from "../utils/request";

export default {
  confirmAlarmInfoById(data: { alarmId: number; companyId?: number; unitId?: number; userId?: number; username?: string }) {
    return GET("/mapMonitor/getMapConfigLogin", data);
  },
  getDynamicSourceByPmCodeAndParkId(data: {}) {
    return GET("/mapMonitor/getDynamicSourceByPmCodeAndParkId", data);
  },
  getEmissionsContributionByPmCodeAndParkId(data: { parkId: number; pmcCode: string; rankingType: number; statisticalTime: string; statisticalType: string }) {
    return GET("/mapMonitor/getEmissionsContributionByPmCodeAndParkId", data);
  },
  getFactoryEmissionsTrendByPmCode(data: { parkId: number; pmcCode: string; statisticalType: string; type: number }) {
    return GET("/mapMonitor/getFactoryEmissionsTrendByPmCode", data);
  },
  getParkList() {
    return GET("/mapMonitor/getParkList");
  },
  getFactoryList(data: { parkId: number }) {
    return GET("/mapMonitor/getFactoryList", data);
  },
  getPmCodeList(data: { factoryId: number }) {
    return GET("/mapMonitor/getPmCodeList", data);
  },
  getSitePmValueList(data: { pmCode: string }) {
    return GET("/mapMonitor/getSitePmValueList", data);
  },
  getSiteMonitorDataById(data: { siteId: string }) {
    return GET("/mapMonitor/getSiteMonitorDataById", data);
  },
  getPmCodeListByParkId(data: { parkId: string }) {
    return GET("/mapMonitor/getPmCodeListByParkId", data);
  },
  getPollutantDistributionByPmCode(data: { parkId: number; pmCode: string; timeStart: string; timeEnd: string }) {
    return GET("/mapMonitor/getPollutantDistributionByPmCode", data);
  }
};
