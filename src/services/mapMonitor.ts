import { GET, POST } from "../utils/request";

export default {
  confirmAlarmInfoById(data: { alarmId: number; companyId?: number; unitId?: number; userId?: number; username?: string }) {
    return GET("/mapMonitor/getMapConfigLogin", data);
  },
  getDynamicSourceByPmCodeAndParkId(data: {}) {
    return POST("/mapMonitor/getDynamicSourceByPmCodeAndParkId", data);
  },
  getEmissionsContributionByPmCodeAndParkId(data: { parkId: number; pmCode: string; rankingType: number; statisticalTime: string; statisticalType: number }) {
    return POST("/mapMonitor/getEmissionsContributionByPmCodeAndParkId", data);
  },
  getFactoryEmissionsTrendByPmCode(data: { factoryId: number; pmCode: string; type: number; statisticalTime: string }) {
    return POST("/mapMonitor/getFactoryEmissionsTrendByPmCode", data);
  },
  getPollutantDistributionByPmCode(data: { parkId: number; pmCode: string; timeStart: string; timeEnd: string }) {
    return POST("/mapMonitor/getPollutantDistributionByPmCode", data);
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

  getUncheckedAlarmInformation() {
    return GET("/mapMonitor/getUncheckedAlarmInformation");
  }
};
