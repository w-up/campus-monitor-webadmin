import React, {useEffect, useState} from "react";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {Button, Icon, Radio, Tabs, Checkbox} from "antd";
import {Scrollbars} from 'react-custom-scrollbars';
import {useProperties} from "@uiw/react-baidu-map/lib/cjs/common/hooks";

export const SettingBox = ({boxDisplay, toggle}) => {
  const {TabPane} = Tabs;
  const [settingDisplay, setSettingDisplay] = useState(boxDisplay);

  useEffect(() => {
    setSettingDisplay(boxDisplay);
  });

  const store = useLocalStore(() => ({
    checkboxGroupData1:[
      {id:'1', name: '非甲烷总烃'},
      {id:'2', name: 'TVOC'},
      {id:'3', name: '苯'},
      {id:'4', name: '甲苯'},
      {id:'5', name: '二甲苯'},
      {id:'6', name: '非甲烷总烃'},
      {id:'7', name: 'TVOC'},
      {id:'8', name: '苯'},
      {id:'9', name: '甲苯'},
      {id:'10', name: '二甲苯'},
      {id:'11', name: '二甲苯'},
    ],
    checkboxGroupData2:[
      {id:'1', name: 'COD'},
      {id:'2', name: '氨氮'},
      {id:'3', name: 'PH'},
      {id:'4', name: '流量'},
      {id:'5', name: '色度'},
      {id:'6', name: 'PH'},
      {id:'7', name: 'TVOC'},
      {id:'8', name: '流量'},
      {id:'9', name: '色度'},
      {id:'10', name: '二甲苯'},
      {id:'11', name: 'COD'},
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
  }));

  return useObserver(() => (
    <div className="absolute screenSetting z-50 mt-8" style={{width: 350, height:410, left: 100, display: settingDisplay ? "block" : "none"}}>
      <div className="setting-box-header text-center">
        驾驶舱显示设置
        <span className="text-red-600 z-50 absolute right-0 top-0" onClick={() => toggle(!settingDisplay)}>
          <Icon className="mr-4 cursor-pointer" type="close-circle" theme="filled"/>
        </span>
      </div>
      <div className="px-4">
        <Tabs defaultActiveKey="1">
          <TabPane tab="因子配置" key="1">
            <div className="flex">
              <div className="w-6/12 pl-2">
                <Scrollbars style={{height: 230}}>
                  <div className="font-normal">废气:</div>
                  <Checkbox.Group>
                    {store.checkboxGroupData1.map((item)=> {
                      return(
                        <Checkbox value={item.id}>{item.name}</Checkbox>
                      )
                    })}
                  </Checkbox.Group>
                </Scrollbars>
              </div>
              <div className="w-6/12 pl-2">
                <Scrollbars style={{height: 230}}>
                  <div className="font-normal">废水:</div>
                  <Checkbox.Group>
                    {store.checkboxGroupData2.map((item)=> {
                      return(
                        <Checkbox value={item.id}>{item.name}</Checkbox>
                      )
                    })}
                  </Checkbox.Group>
                </Scrollbars>
              </div>
            </div>
          </TabPane>
          <TabPane tab="厂区切换" key="2">
            <Scrollbars style={{height: 230}}>
              <Radio.Group>
                {store.radioGroupData.map((item) => {
                  return (
                    <Radio value={item.id}>{item.name}</Radio>
                  )
                })}
              </Radio.Group>
            </Scrollbars>
          </TabPane>
          <TabPane tab="地图配置" key="3">
            <Scrollbars style={{height: 230}}>

            </Scrollbars>
          </TabPane>
        </Tabs>
      </div>
      <div className="setting-box-footer">
        <Button type="primary" size="default">
          确定
        </Button>
        <Button className="ml-4" type="default" size="default">
          取消
        </Button>
      </div>
    </div>
  ));
};
