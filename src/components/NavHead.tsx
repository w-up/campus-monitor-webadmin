import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Icon, Layout, Menu, Dropdown } from "antd";
import { useStore } from "../stores";
import { Link, Route, useHistory } from "react-router-dom";
import { Basic } from "../pages/basic/Basic";
import { UserInfoEdit } from "../pages/basic/UserProfile/UserInfoEdit";
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
        <a rel="noopener noreferrer" href="/profile">
          修改资料
        </a>
      </Menu.Item>
      <Menu.Item>
        <a rel="noopener noreferrer" href="/edit-password">
          修改密码
        </a>
      </Menu.Item>
      <Menu.Item onClick={store.logout}>
        <a rel="noopener noreferrer">退出系统</a>
      </Menu.Item>
    </Menu>
  );
  return useObserver(() => (
    <Layout.Header
      style={{
        background: "#1E2538",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        position: "fixed",
        zIndex: 51,
        width: "100%"
      }}
    >
      <h1 style={{ color: "#fff", fontSize: "20px" }}>工业园区在线监测告警平台</h1>
      <Dropdown overlay={userMenu}>
        <a
          style={{
            width: "80px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Icon type="user" style={{ fontSize: "20px" }} />
          {auth.user?.username}
          <Icon type="down" style={{ fontSize: "16px" }} />
        </a>
      </Dropdown>
    </Layout.Header>
  ));
};
