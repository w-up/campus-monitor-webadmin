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
// import { api } from "./services/index";
import { Basic } from "./pages/basic/Basic";
import { User } from "./pages/basic/User/User";
import { System } from "./pages/basic/System/System";
import zhCN from "antd/es/locale/zh_CN";

const App = () => {
  const { menu, auth } = useStore();

  const renderRoute = (data: any[]) => {
    return data.map(item => {
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
  const MainRoute = useObserver(() =>
    auth.token ? (
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <NavHead></NavHead>
          {/* <Layout.Sider collapsible collapsed={menu.collapsed} onCollapse={menu.toggleCollapsed} style={{ borderTop: "1px solid #00B1FF" }}>
          <NavMenu></NavMenu>
        </Layout.Sider> */}
          <Layout>
            <Layout.Sider trigger={null} collapsible collapsed={menu.collapsed}>
              <NavMenu></NavMenu>
            </Layout.Sider>
            <Layout.Content>
              <Switch>
                <Route path="/base" component={Basic}></Route>
                <Route path="/user" component={User}></Route>
                <Route path="/system" component={System}></Route>
                {renderRoute(menu.menus)}
              </Switch>
            </Layout.Content>
          </Layout>
        </Layout>
      </Router>
    ) : (
      <Redirect to={{ pathname: "/login" }} />
    )
  );

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
