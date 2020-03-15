export interface Park {
  id: string;
  parkNo: string;
  parkName: string;
  parkStatus: number;
  remark: string;
  createTime: string;
  createUser?: any;
  modifyTime: string;
  modifyUser?: any;
  isDelete: number;
}

export interface Factory {
  id: string;
  factoryName: string;
  factoryAddress: string;
  parkId: string;
  contactPerson?: any;
  contactPhone?: any;
  companyId: string;
  contactPosition?: any;
  email?: any;
  createTime: string;
  createUser?: any;
  modifyTime: string;
  modifyUser?: any;
  isDelete: number;
}

export interface PMCode {
  pmId: string;
  pmName: string;
  pmCode: string;
}
export interface PMValue {
  siteId: string;
  ranking: number;
  siteName: string;
  pmCode?: any;
  pmName: string;
  unit: string;
  collectValue: string;
  lastUpdateTime: string;
}

export interface SitePMValue {
  pmName: string;
  pmCode: string;
  collectValue: string;
  unit: string;
  pmType: number;
  limit: number;
  overRate: string;
}

export interface SitlePMData {
  siteId: string;
  siteName: string;
  siteCode: string;
  pmInfos: Array<SitePMValue>;
}

export interface DailySewage {
  pmCode: string;
  pmName: string;
  upperLimit: number;
  unit: string;
  datas: Array<{
    collectValue: number;
    unit: string;
    time: string;
  }>;
}

export type allSiteRes = Array<{
  companyId: string;
  companyName: string;
  factorys: Array<{
    factoryId: string;
    factoryName: string;
    sites: Array<{
      siteId: string;
      siteName: string;
      concern: boolean;
    }>;
  }>;
}>;

export type Tree = Array<{
  key: string;
  title: string;
  selected?: boolean;
  children: Tree;
}>;

export interface ConcernSiteData {
  siteId: string;
  gpsX: string;
  gpsY: string;
  factoryId?: any;
  siteName: string;
  device_code: string;
  collectValue: string;
  unit: string;
  limit: string;
  overRate: string;
}

export type AllParkData = {
  parkId: string;
  parkName: string;
  parkPoints: Array<{
    longitude: string;
    latitude: string;
  }>;
  siteDatas: Array<ConcernSiteData>;
  factoryDatas: Array<{
    factoryId: string;
    factoryName: string;
    factoryPoints: any;
    averageValue: string;
    unit: string;
  }>;
};
