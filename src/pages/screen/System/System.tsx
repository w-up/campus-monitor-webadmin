import { Switch, Route, RouteComponentProps } from "react-router-dom";
import React from 'react'
import { SystemConfigration } from "./SystemConfig";

export const System = (props: RouteComponentProps) => {
  console.log(1111, props.match.path)
  return (
    <Switch>
      <Route path={`${props.match.path}/configration`} component={SystemConfigration}></Route>
    </Switch>
  )
}