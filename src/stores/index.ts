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
import { DynamicSourceStore } from "./dynamicSource/index";

export const store = {
  menu: new MenuStore(),
  auth: new AuthStore(),
  config: new ConfigStore(),
  mapMonitor: new MapMonitorStore(),
  dynamicSource: new DynamicSourceStore(),
  map: {
    drawMap: new DrawMapStore()
  },
  screen: {
    parkScreenMap: new ParkScreenMapStore(),
    enterpriseScreenMap: new EnterpriseScreenMapStore(),
    gasTable: new GasTableStore(),
    sewageTable: new SewageTableStore()
  }
};
//@ts-ignore
global._store = store;

export const StoresContext = React.createContext(store);

export const useStore = () => React.useContext(StoresContext);
