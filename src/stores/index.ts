import React from "react";
import { MenuStore } from "./MenuStore";
import { AuthStore } from "./AuthStore";

export const StoresContext = React.createContext({
  menu: new MenuStore(),
  auth: new AuthStore()
});

export const useStore = () => React.useContext(StoresContext);
