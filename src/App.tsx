import React from "react";
import { useObserver } from "mobx-react-lite";
import { Route, BrowserRouter as Router, Switch, useLocation, useHistory, Redirect } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { Layout, ConfigProvider } from "antd";
import { NavMenu } from "./components/NavMenu";
import { NavHead } from "./components/NavHead";
import "./App.scss";
import { useStore } from "./stores";
import { Basic } from "./pages/basic/Basic";
import { User } from "./pages/basic/User/User";
import { System } from "./pages/basic/System/System";
import zhCN from "antd/es/locale/zh_CN";
import { useEffect } from "react";
import { UserInfoEdit } from "./pages/basic/UserProfile/UserInfoEdit";
import { UserPasswordEdit } from "./pages/basic/UserProfile/UserPasswordEdit";
import { UserAvatarEdit } from "pages/basic/UserProfile/UserAvatarEdit";
import { Scrollbars } from "react-custom-scrollbars";

const App = (props) => {
  const { menu, auth, root } = useStore();
  console.log(props);
  useEffect(() => {
    root.init();
  }, []);

  const renderRoute = (data: any[]) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Route path={item.path} key={item.path} component={item.component}>
            {renderRoute(item.children)}
          </Route>
        );
      }
      return <Route exact path={item.path} key={item.path} component={item.component} />;
    });
  };
  const MainRoute = useObserver(() => {
    return auth.token ? (
      <Router>
        <Layout>
          <Scrollbars style={{ height: "100vh" }}>
            <NavHead />
            {/* <Layout.Sider collapsible collapsed={menu.collapsed} onCollapse={menu.toggleCollapsed} style={{ borderTop: "1px solid #00B1FF" }}>
          <NavMenu></NavMenu>
        </Layout.Sider> */}
            <Layout style={{ marginTop: 64 }}>
              <Layout.Sider
                style={{
                  height: "100vh",
                  position: "fixed",
                  left: 0,
                }}
                trigger={null}
                collapsible
                collapsed={menu.collapsed}
              >
                <Scrollbars style={{ height: "100vh" }}>
                  <NavMenu />
                </Scrollbars>
              </Layout.Sider>
              <Layout.Content style={{ marginLeft: menu.collapsed ? 80 : 200 }}>
                <Scrollbars style={{ height: "calc(100vh - 64px)" }}>
                  <Switch>
                    <Route path="/base" component={Basic} />
                    <Route path="/user" component={User} />
                    <Route path="/system" component={System} />
                    <Route path="/profile" component={UserInfoEdit} />
                    <Route path="/edit-password" component={UserPasswordEdit} />
                    <Route path="/edit-avatar" component={UserAvatarEdit} />

                    {renderRoute(menu.menus)}
                  </Switch>
                </Scrollbars>
              </Layout.Content>
            </Layout>
          </Scrollbars>
        </Layout>
      </Router>
    ) : (
      <Redirect to={{ pathname: "/login" }} />
    );
  });

  return useObserver(() => (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route path="/">{MainRoute}</Route>
        </Switch>
      </Router>
    </ConfigProvider>
  ));
};

export default App;
