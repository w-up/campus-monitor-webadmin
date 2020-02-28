import React from "react";
import { MenuStore } from "./MenuStore";
import { AuthStore } from "./AuthStore";
import { ConfigStore } from "./ConfigStore";
import { ParkScreenMapStore } from "./screen/ParkScreenMapStore";
import { EnterpriseScreenMapStore } from "./screen/EnterpriseScreenMapStore";
import {GasTableStore} from "./screen/GasTableStore";

export const StoresContext = React.createContext({
  menu: new MenuStore(),
  auth: new AuthStore(),
  config: new ConfigStore(),
  screen: {
    parkScreenMap: new ParkScreenMapStore(),
    enterpriseScreenMap: new EnterpriseScreenMapStore(),
    gasTable: new GasTableStore()
  }
});

export const useStore = () => React.useContext(StoresContext);
