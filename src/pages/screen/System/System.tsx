import { Switch, Route, RouteComponentProps } from "react-router-dom";
import React from 'react'
import { SystemConfigration } from "./SystemConfig";

export const System = (props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/configration`} component={SystemConfigration}></Route>
    </Switch>
  )
}