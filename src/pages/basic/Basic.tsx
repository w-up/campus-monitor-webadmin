import { Switch, Route, RouteComponentProps } from "react-router-dom";
import React from 'react'
import { ParkPage } from "./Park";
import { EnterprisePage } from "./Enterprise";
import { MyEnterprisePage } from "./MyEnterprise";
import { AddNewEnterprise } from "./AddNewEnterprise";
import { ParkEditPage } from "./ParkEditPage";

export const Basic = (props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/park`} component={ParkPage}></Route>
      <Route path={`${props.match.path}/enterprise`} component={EnterprisePage}></Route>
      <Route path={`${props.match.path}/my-enterprise`} component={MyEnterprisePage}></Route>
      <Route path={`${props.match.path}/add-enterprise`} component={AddNewEnterprise}></Route>
      <Route path={`${props.match.path}/park-edit`} component={ParkEditPage}></Route>
    </Switch>
  )
}