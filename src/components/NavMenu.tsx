import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { Menu, Icon } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { useStore } from "../stores";
import { Link, useLocation } from "react-router-dom";

export const NavMenu = () => {
  const { menu, auth } = useStore();
  const store = useLocalStore(() => ({
    openKeys: [] as any,
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      this.openKeys = [latestOpenKey];
    }
  }));

  const renderMenu = (data: any[]) => {
    return data
      .filter(item => !item.isHide)
      .map(item => {
        if (item.code && !auth.codes.includes(item.code)) return;
        if (item.children && item.children.length > 0 && item.children.some(item => !item.isHide)) {
          return (
            <SubMenu
              title={
                <span>
                  {item.icon && <Icon style={{ display: "inline-block", lineHeight: "40px" }} type={item.icon} />}
                  <span>{item.title}</span>
                </span>
              }
              key={item.path}
            >
              {renderMenu(item.children)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item title={item.title} key={item.path}>
            <Link to={item.path}>
              {item.icon && <Icon style={{ display: "inline-block", lineHeight: "40px" }} type={item.icon} />}
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        );
      });
  };
  const { pathname } = useLocation();
  const dir = pathname.substring(0, pathname.lastIndexOf("/"));
  return useObserver(() => (
    <Menu defaultSelectedKeys={[pathname]} openKeys={store.openKeys} onOpenChange={store.onOpenChange} defaultOpenKeys={[dir]} mode="inline" theme="dark">
      <Menu.Item title="菜单" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {!menu.collapsed && <span></span>}
        <Icon className="trigger" type={menu.collapsed ? "menu-unfold" : "menu-fold"} style={{ fontSize: "20px" }} onClick={menu.toggleCollapsed} />
      </Menu.Item>
      {renderMenu(menu.menus)}
    </Menu>
  ));
};
