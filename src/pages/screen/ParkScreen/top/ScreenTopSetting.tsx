import { useLocalStore, useObserver } from "mobx-react-lite";
import React from "react";
import { Button, Icon, Tabs, Tree, Radio } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import { useStore } from "../../../../stores/index";

export const ScreenTopSetting = () => {
  const { TabPane } = Tabs;
  const { TreeNode } = Tree;
  const {
    screen: { parkScreenMap }
  } = useStore();

  const store = useLocalStore(() => ({
    expandedKeys: [],
    autoExpandParent: true,
    async saveSelectedSites() {
      const sites = parkScreenMap.selectedSites.filter(i => !i.includes("-")).map(i => Number(i));
      parkScreenMap.saveSelectedSites(sites);
    },
    onExpand: expandedKeys => {
      // console.log("onExpand", expandedKeys);
      store.expandedKeys = expandedKeys;
    },
    onCheck: checkedKeys => {
      // console.log("onCheck", checkedKeys);
      parkScreenMap.selectedSites = checkedKeys;
    }
  }));

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  return useObserver(() => (
    <div className="head-center">
      <div className="text-center primary-text-color text-2xl font-bold relative">
        <span className="screenTitleGradient">鼎龙工业园污染源实时监测</span>
        <Icon onClick={() => parkScreenMap.toggleBox()} className="text-lg absolute ml-6 cursor-pointer z-50" style={{ top: "10px" }} type="setting" theme="filled" />
        <div className="absolute screenSetting z-50" style={{ width: 300, display: parkScreenMap.boxDisplay ? "block" : "none" }}>
          <div className="setting-box-header text-center">
            驾驶舱显示设置
            <span className="text-red-600" onClick={() => parkScreenMap.toggleBox()}>
              <Icon className="absolute right-0 top-0 mr-4 mt-3 cursor-pointer" type="close-circle" theme="filled" />
            </span>
          </div>
          <div className="p-4">
            <Tabs defaultActiveKey="1">
              <TabPane tab="站点关注" key="1">
                <Scrollbars style={{ height: 230 }}>
                  <Tree
                    checkable
                    onExpand={store.onExpand}
                    expandedKeys={store.expandedKeys}
                    autoExpandParent={store.autoExpandParent}
                    onCheck={store.onCheck}
                    checkedKeys={parkScreenMap.selectedSites}
                  >
                    {renderTreeNodes(parkScreenMap.allSites)}
                  </Tree>
                </Scrollbars>
                <div className="setting-box-footer p-2" onClick={store.saveSelectedSites}>
                  <Button type="primary" size="default">
                    确定
                  </Button>
                  <Button className="ml-4" type="default" size="default">
                    取消
                  </Button>
                </div>
              </TabPane>
              <TabPane tab="园区切换" key="2">
                <Scrollbars style={{ height: 230 }}>
                  <Radio.Group value={parkScreenMap.currentPark} onChange={e => parkScreenMap.selectFactory(e.target.value)}>
                    {parkScreenMap.allParks.map(item => {
                      return <Radio value={item.id}>{item.parkName}</Radio>;
                    })}
                  </Radio.Group>
                </Scrollbars>
                <div className="setting-box-footer p-2" onClick={parkScreenMap.saveSelectedFactory}>
                  <Button type="primary" size="default">
                    确定
                  </Button>
                  <Button className="ml-4" type="default" size="default">
                    取消
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  ));
};
