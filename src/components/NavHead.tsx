import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Icon, Layout, Menu, Dropdown } from "antd";
import { useStore } from "../stores";
import { Link, useHistory } from "react-router-dom";
// import { Link, useLocation } from "react-router-dom";

export const NavHead = () => {
  const { menu, auth } = useStore();
  const history = useHistory();
  const store = useLocalStore(() => ({
    async logout() {
      await auth.logout();
      history.replace("/login");
    }
  }));
  const userMenu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          修改资料
        </a>
      </Menu.Item>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
          修改密码
        </a>
      </Menu.Item>
      <Menu.Item onClick={store.logout}>
        <a rel="noopener noreferrer">退出系统</a>
      </Menu.Item>
    </Menu>
  );
  return useObserver(() => (
    <Layout.Header style={{ background: "#1E2538", padding: "0 24px", display: "flex", justifyContent: "space-between", position: "fixed", zIndex: 2, width: "100%" }}>
      <h1 style={{ color: "#fff", fontSize: "20px" }}>工业园区在线监测告警平台</h1>
      <Dropdown overlay={userMenu}>
        <a style={{ width: "80px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Icon type="user" style={{ fontSize: "20px" }} />
          Admin
          <Icon type="down" style={{ fontSize: "16px" }} />
        </a>
      </Dropdown>
    </Layout.Header>
  ));
};
