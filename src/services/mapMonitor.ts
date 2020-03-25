import { GET, POST } from "../utils/request";

export default {
  confirmAlarmInfoByIdxxx(data: { alarmId: number; companyId?: number; unitId?: number; userId?: number; username?: string }) {
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
  getFactoryListAll() {
    return GET("mapMonitor/getFactoryListAll");
  },
  getPmCodeListAll() {
    return GET("mapMonitor/getPmCodeListAll");
  },
  getFactoryList(data: { parkId: number }) {
    return GET("/mapMonitor/getFactoryList", data);
  },
  getPmCodeList(data: { factoryId: number }) {
    return GET("/mapMonitor/getPmCodeList", data);
  },
  getSitePmValueList(data: { pmCode: string; parkId: number; factoryId: number }) {
    return POST("/mapMonitor/getSitePmValueList", data);
  },
  getSiteMonitorDataById(data: { siteId: string }) {
    return GET("/mapMonitor/getSiteMonitorDataById", data);
  },
  getPmCodeListByParkId(data: { parkId: string }) {
    return GET("/mapMonitor/getPmCodeListByParkId", data);
  },

  getUncheckedAlarmInformation() {
    return GET("/mapMonitor/getUncheckedAlarmInformation");
  },

  confirmAlarmInfoById(data: { alarmId: string }) {
    return GET("/mapMonitor/confirmAlarmInfoById", data);
  },
  getMapInfoByPmCodeAndParkId(data: { parkId: number; pmCode: string }) {
    return POST("/mapMonitor/getMapInfoByPmCodeAndParkId", data);
  },
  getDynamicSourceContribution(data: { endTime: string; lng: string; lat: string; parkId: number; pmCode: string; startTime: string }) {
    return POST("/mapMonitor/getDynamicSourceContribution", data);
  },
  getDynamicSourceWindRose(data: { endTime: string; parkId: number; pmCode: string; startTime: string }) {
    return POST("/mapMonitor/getDynamicSourceWindRose", data);
  },
  getDynamicSourceTraceSource(data: { endTime: string; parkId: number; pmCode: string; startTime: string }) {
    return POST("/mapMonitor/getDynamicSourceTraceSource", data);
  }
};
