import {useLocalStore, useObserver} from "mobx-react-lite";
import React, {useState} from "react";
import {Button, Icon, Tabs, Tree} from "antd";
import { Scrollbars } from 'react-custom-scrollbars';

export const ScreenTopSetting = () => {
  const {TabPane} = Tabs;
  const {TreeNode} = Tree;

  const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const store = useLocalStore(() => ({
    treeData: [
      {
        title: '0-0',
        key: '0-0',
        children: [
          {
            title: '0-0-0',
            key: '0-0-0',
            children: [
              {title: '0-0-0-0', key: '0-0-0-0'},
              {title: '0-0-0-1', key: '0-0-0-1'},
              {title: '0-0-0-2', key: '0-0-0-2'},
            ],
          },
          {
            title: '0-0-1',
            key: '0-0-1',
            children: [
              {title: '0-0-1-0', key: '0-0-1-0'},
              {title: '0-0-1-1', key: '0-0-1-1'},
              {title: '0-0-1-2', key: '0-0-1-2'},
            ],
          },
          {
            title: '0-0-2',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '0-1',
        key: '0-1',
        children: [
          {title: '0-1-0-0', key: '0-1-0-0'},
          {title: '0-1-0-1', key: '0-1-0-1'},
          {title: '0-1-0-2', key: '0-1-0-2'},
        ],
      },
      {
        title: '0-2',
        key: '0-2',
      }
    ],
    boxDisplay: false,
    toggleSettingBox: () => {
      console.log(store.boxDisplay);
      store.boxDisplay = !store.boxDisplay;
    },
    onExpand: expandedKeys => {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      setExpandedKeys(expandedKeys);
      setAutoExpandParent(false);
    },
    onCheck: checkedKeys => {
      console.log('onCheck', checkedKeys);
      setCheckedKeys(checkedKeys);
    },
    onSelect: (selectedKeys, info) => {
      console.log('onSelect', info);
      setSelectedKeys(selectedKeys);
    },
    renderTreeNodes: data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {store.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} {...item} />;
      }),
  }));

  return useObserver(() => (
    <div className="head-center">
      <div className="text-center primary-text-color text-2xl font-bold relative">
        <span className="screenTitleGradient">鼎龙工业园污染源实时监测</span>
        <Icon onClick={() => store.toggleSettingBox()} className="text-lg absolute ml-6 cursor-pointer" style={{top: "10px"}} type="setting" theme="filled"/>
        <div className="absolute screenSetting z-50" style={{width: 300, display: store.boxDisplay?"block":"none"}}>
          <div className="setting-box-header text-center">
            驾驶舱显示设置
            <span className="text-red-600" onClick={() => store.toggleSettingBox()}>
                <Icon className="absolute right-0 top-0 mr-4 mt-3 cursor-pointer" type="close-circle" theme="filled"/>
              </span>
          </div>
          <div className="p-4">
            <Tabs defaultActiveKey="1">
              <TabPane tab="站点关注" key="1">
                <Scrollbars style={{ height: 230 }}>
                <Tree
                  checkable
                  onExpand={store.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={store.onCheck}
                  checkedKeys={checkedKeys}
                  onSelect={store.onSelect}
                  selectedKeys={selectedKeys}
                >
                  {store.renderTreeNodes(store.treeData)}
                </Tree>
                </Scrollbars>
              </TabPane>
              <TabPane tab="园区切换" key="2">
                Content of Tab Pane 2
              </TabPane>
            </Tabs>
          </div>
          <div className="setting-box-footer p-2">
            <Button type="primary" size="default">
              确定
            </Button>
            <Button className="ml-4" type="default" size="default">
              取消
            </Button>
          </div>
        </div>
      </div>
    </div>
  ));
};
