import React from "react";
import { useObserver } from "mobx-react-lite";
import { Breadcrumb } from "antd";

export const BreadCrumb = () => {
  return useObserver(() => (
    <div style={{height: 100, background: "#fff", marginBottom: 20, border: "1px solid #e8e8e8", borderLeft: 0, borderRight: 0, padding: "20px"}}>
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Application Center</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="">Application List</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>An Application</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{margin: 10, marginLeft: 0, fontWeight: "bold", fontSize: 20}}>current router</div>
    </div>
  ))
}