import React from "react";
import { MenuStore } from "./MenuStore";
import { AuthStore } from "./AuthStore";
import { MapStore } from "./MapStore";

export const StoresContext = React.createContext({
  menu: new MenuStore(),
  auth: new AuthStore(),
  map: new MapStore()
});

export const useStore = () => React.useContext(StoresContext);
