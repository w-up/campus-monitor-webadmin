import React from "react";
import { useObserver } from "mobx-react-lite";
import { Menu, Icon } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { useStore } from "../stores";
import { Link, useLocation } from "react-router-dom";

export const NavMenu = () => {
  const { menu } = useStore();

  const renderMenu = (data: any[]) => {
    return data.map(item => {
      if (item.children.length > 0) {
        return (
          <SubMenu
            title={
              <span>
                <Icon type={item.icon}></Icon>
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
            <Icon type={item.icon}></Icon>
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
      );
    });
  };
  const { pathname } = useLocation();
  const dir = pathname.substring(0, pathname.lastIndexOf("/"));
  return useObserver(() => (
    <Menu defaultSelectedKeys={[pathname]} defaultOpenKeys={[dir]} mode="inline" theme="dark">
      {renderMenu(menu.menus)}
    </Menu>
  ));
};
