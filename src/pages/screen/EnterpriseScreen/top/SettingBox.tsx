import React, { useEffect, useState } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { Button, Icon, Radio, Tabs, Checkbox } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import { useProperties } from "@uiw/react-baidu-map/lib/cjs/common/hooks";
import { MapSettingTab } from "./MapSettingTab";
import { useStore } from "../../../../stores/index";

export const SettingBox = () => {
  const { TabPane } = Tabs;
  const {
    screen: { enterpriseScreenMap }
  } = useStore();

  return useObserver(() => (
    <div className="absolute screenSetting z-50 mt-8" style={{ width: 350, height: 500, left: 100, display: enterpriseScreenMap.boxDisplay ? "block" : "none" }}>
      <div className="setting-box-header text-center">
        驾驶舱显示设置
        <span className="text-red-600 z-50 absolute right-0 top-0" onClick={e => enterpriseScreenMap.toggleBox()}>
          <Icon className="mr-4 cursor-pointer" type="close-circle" theme="filled" />
        </span>
      </div>
      <div className="px-4">
        <Tabs defaultActiveKey="1">
          <TabPane tab="因子配置" key="1">
            <div>
              <div className="flex">
                <Checkbox.Group onChange={enterpriseScreenMap.selectPmCode} value={enterpriseScreenMap.selectedPmCodes}>
                  <div className="flex">
                    <div className="w-6/12 pl-2">
                      <div className="font-normal">废气</div>
                      {enterpriseScreenMap.allPmCode.gas &&
                        enterpriseScreenMap.allPmCode.gas.map(item => {
                          return <Checkbox value={item.pmCode}>{item.pmName}</Checkbox>;
                        })}
                    </div>
                    <div className="w-6/12 pl-2">
                      <div className="font-normal">废水</div>
                      {enterpriseScreenMap.allPmCode.water &&
                        enterpriseScreenMap.allPmCode.water.map(item => {
                          return <Checkbox value={item.pmCode}>{item.pmName}</Checkbox>;
                        })}
                    </div>
                  </div>
                </Checkbox.Group>
              </div>
              <div className="setting-box-footer">
                <Button type="primary" size="default" onClick={enterpriseScreenMap.saveSelectedPmCodes}>
                  确定
                </Button>
                <Button className="ml-4" type="default" size="default" onClick={e => enterpriseScreenMap.toggleBox()}>
                  取消
                </Button>
              </div>
            </div>
          </TabPane>
          <TabPane tab="厂区切换" key="2">
            <Scrollbars style={{ height: 320 }}>
              <Radio.Group value={enterpriseScreenMap.currentFactory} onChange={e => enterpriseScreenMap.selectFactory(e.target.value)}>
                {enterpriseScreenMap.allfactoriy.map(item => {
                  return <Radio value={item.factoryId}>{item.factoryName}</Radio>;
                })}
              </Radio.Group>
              <Button type="primary" size="default" onClick={enterpriseScreenMap.saveSelectedFactory}>
                确定
              </Button>
              <Button className="ml-4" type="default" size="default" onClick={e => enterpriseScreenMap.toggleBox()}>
                取消
              </Button>
            </Scrollbars>
          </TabPane>
          <TabPane tab="地图配置" key="3">
            <Scrollbars style={{ height: 320 }}>
              <MapSettingTab />
            </Scrollbars>
          </TabPane>
        </Tabs>
      </div>
    </div>
  ));
};
