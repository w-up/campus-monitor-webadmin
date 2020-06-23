import React from "react";
import { MenuStore } from "./MenuStore";
import { AuthStore } from "./AuthStore";
import { ConfigStore } from "./ConfigStore";
import { ParkScreenMapStore } from "./screen/ParkScreenMapStore";
import { EnterpriseScreenMapStore } from "./screen/EnterpriseScreenMapStore";
import { GasTableStore } from "./screen/GasTableStore";
import { SewageTableStore } from "./screen/SewageTableStore";
import { DrawMapStore } from "./map/DrawMapStore";
import { MapMonitorStore } from "./mapMonitor/index";
import { Park } from "./base/Park";
import { Enterprise } from "./base/Enterprise";
import { ParkEdit } from "./base/ParkEdit";
import { EnterpriseEdit } from "./base/EnterpriseEdit";
import { MyEnterprise } from "./base/MyEnterprise";
import { UserManagement } from "./base/user/UserManagement";
import { UserEdit } from "./base/user/UserEdit";
import { Roles } from "./base/role/Roles";
import { RoleEdit } from "./base/role/RoleEdit";
import { DynamicSourceStore } from "./dynamicSource/index";
import { SystemConfig } from "./SystemConfig";
import { DataManage } from "./data/DataManage";
import { Replenish } from "./data/Replenish";
import { DataAudit } from "./data/DataAudit";
import { DataView } from "./data/DataView";
import { RuntimeData } from "./query/RuntimeData";
import { HistoryData } from "./query/HistoryData";
import { AlertManage } from "./alert/AlertManage";
import { AlertSetting } from "./alert/AlertSetting";
import { Rank } from "./analysis/Rank";
import { Comparison } from "./analysis/Comparison";
import { Report } from "./Report";
import { RootStore } from "./RootStore";
import { WsStore } from "./WsStore";
import { AlertModal } from "./alert/AlertModal";
import { KrigingMapStore } from "./mapMonitor/krigingMap";
import { EnterpriseOutScreenMapStore } from "./screen/EnterpriseOutScreenMapStore";

export const store = {
  ws: new WsStore(),
  root: new RootStore(),
  menu: new MenuStore(),
  auth: new AuthStore(),
  config: new ConfigStore(),
  mapMonitor: new MapMonitorStore(),
  dynamicSource: new DynamicSourceStore(),
  map: {
    drawMap: new DrawMapStore(),
    krigingMap: new KrigingMapStore(),
  },
  screen: {
    parkScreenMap: new ParkScreenMapStore(),
    enterpriseScreenMap: new EnterpriseScreenMapStore(),
    enterpriseOutScreenMap: new EnterpriseOutScreenMapStore(),
    gasTable: new GasTableStore(),
    sewageTable: new SewageTableStore(),
  },
  base: {
    park: new Park(),
    parkEdit: new ParkEdit(),
    enterprise: new Enterprise(),
    enterpriseEdit: new EnterpriseEdit(),
    myEnterprise: new MyEnterprise(),
    user: new UserManagement(),
    userEdit: new UserEdit(),
    role: new Roles(),
    roleEdit: new RoleEdit(),
  },
  systemConfig: new SystemConfig(),
  data: {
    manage: new DataManage(),
    replenish: new Replenish(),
    audit: new DataAudit(),
    view: new DataView(),
  },
  query: {
    runTimeData: new RuntimeData(),
    historyData: new HistoryData(),
  },
  analysis: {
    rank: new Rank(),
    comparison: new Comparison(),
  },
  alert: {
    alertManage: new AlertManage(),
    alertSetting: new AlertSetting(),
    modal: new AlertModal(),
  },
  report: new Report(),
};
//@ts-ignore
global._store = store;

export const StoresContext = React.createContext(store);

export const useStore = () => React.useContext(StoresContext);
