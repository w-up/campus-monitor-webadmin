import {useLocalStore, useObserver} from "mobx-react-lite";
import React from "react";
import {Button, Icon, Tabs, Tree, Radio} from "antd";
import { Scrollbars } from 'react-custom-scrollbars';

export const ScreenTopSetting = () => {
  const {TabPane} = Tabs;
  const {TreeNode} = Tree;

  const store = useLocalStore(() => ({
    treeData1: [
      {
        title: '江苏XX有限公司',
        key: '0-0',
        children: [
          {
            title: 'A化工XX厂',
            key: '0-0-0',
            children: [
              {title: 'A化工西南', key: '0-0-0-0'},
              {title: 'A化工西北', key: '0-0-0-1'},
              {title: 'A化工东北', key: '0-0-0-2'},
            ],
          },
          {
            title: 'B化工XX厂',
            key: '0-0-1',
            children: [
              {title: 'B化工西南', key: '0-0-1-0'},
              {title: 'B化工西北', key: '0-0-1-1'},
              {title: 'B化工东北', key: '0-0-1-2'},
            ],
          },
          {
            title: 'C化工XX厂',
            key: '0-0-2',
          },
        ],
      },
      {
        title: '江苏YY有限公司',
        key: '0-1',
        children: [
          {title: 'C化工ZZ厂', key: '0-1-0-0'},
          {title: 'C化工ZZ厂', key: '0-1-0-1'},
          {title: 'C化工ZZ厂', key: '0-1-0-2'},
        ],
      },
      {
        title: '江苏ZZ有限公司',
        key: '0-2',
      }
    ],
    radioGroupData:[
      {id:'1', name: 'A园区'},
      {id:'2', name: 'B园区'},
      {id:'3', name: 'C园区'},
      {id:'4', name: 'D园区'},
      {id:'5', name: 'E园区'},
      {id:'6', name: 'F园区'},
      {id:'7', name: 'G园区'},
      {id:'8', name: 'H园区'},
      {id:'9', name: 'I园区'},
      {id:'10', name: 'J园区'},
      {id:'11', name: 'K园区'},
    ],
    boxDisplay: false,
    expandedKeys: ['0-0-0', '0-0-1'],
    checkedKeys: ['0-0-0'],
    autoExpandParent: true,
    selectedKeys:[],
    toggleSettingBox: () => {
      store.boxDisplay = !store.boxDisplay;
    },
    onExpand: expandedKeys => {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      store.expandedKeys = expandedKeys;
      store.autoExpandParent = false;
    },
    onCheck: checkedKeys => {
      console.log('onCheck', checkedKeys);
      store.checkedKeys = checkedKeys;
    },
    onSelect: (selectedKeys, info) => {
      console.log('onSelect', info);
      store.selectedKeys = selectedKeys;
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
        <Icon onClick={() => store.toggleSettingBox()} className="text-lg absolute ml-6 cursor-pointer z-50" style={{top: "10px"}} type="setting" theme="filled"/>
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
                  expandedKeys={store.expandedKeys}
                  autoExpandParent={store.autoExpandParent}
                  onCheck={store.onCheck}
                  checkedKeys={store.checkedKeys}
                  onSelect={store.onSelect}
                  selectedKeys={store.selectedKeys}
                >
                  {store.renderTreeNodes(store.treeData1)}
                </Tree>
                </Scrollbars>
              </TabPane>
              <TabPane tab="园区切换" key="2">
                <Scrollbars style={{ height: 230 }}>
                  <Radio.Group>
                    {store.radioGroupData.map((item) => {
                      return (
                        <Radio value={item.id}>{item.name}</Radio>
                      )
                    })}
                  </Radio.Group>
                </Scrollbars>
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
