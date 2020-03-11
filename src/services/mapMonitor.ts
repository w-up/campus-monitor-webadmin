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
  getFactoryEmissionsTrendByPmCode(data: { parkId: number; pmcCode: string; rankingType: number; statisticalType: string; type: number }) {
    return GET("/mapMonitor/getEmissionsContributionByPmCodeAndParkId", data);
  }
};
