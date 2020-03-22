import { Switch, Route, RouteComponentProps } from "react-router-dom";
import React from 'react'
import { UserManagementPage } from "./UserManagement";
import { EditUser } from "./EditUser";
import { RoleEdit } from "./RoleEdit";
import { Roles } from "./Roles";

export const User = (props: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={`${props.match.path}/userlist`} component={UserManagementPage}></Route>
      <Route path={`${props.match.path}/user-edit`} component={EditUser}></Route>
      <Route path={`${props.match.path}/user-edit/:id`} component={EditUser}></Route>
      <Route path={`${props.match.path}/rolelist`} component={Roles}></Route>
      <Route path={`${props.match.path}/role-edit`} component={RoleEdit}></Route>
      <Route path={`${props.match.path}/role-edit/:id`} component={RoleEdit}></Route>
    </Switch>
  )
}