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
