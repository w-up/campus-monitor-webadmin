import { Switch, Route, RouteComponentProps } from "react-router-dom";
import React from 'react'
import { UserManagementPage } from "./UserManagement";
import { EditUser } from "./EditUser";
import { AddEditRole } from "./AddEditRole";
import { Roles } from "./Roles";

export const User = (props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/userlist`} component={UserManagementPage}></Route>
      <Route path={`${props.match.path}/user-edit`} component={EditUser}></Route>
      <Route path={`${props.match.path}/user-edit/:id`} component={EditUser}></Route>
      <Route path={`${props.match.path}/rolelist`} component={Roles}></Route>
      <Route path={`${props.match.path}/addOrEditRole`} component={AddEditRole}></Route>
    </Switch>
  )
}