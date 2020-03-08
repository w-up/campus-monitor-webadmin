import React from 'react';
import {useObserver} from "mobx-react-lite";
import {Icon} from "antd";

export const LocationDisplay = () => {

  return useObserver(() => (
      <div className="leading-5 flex-1 flex items-end mr-4">
        <div className="head-right text-center flex flex-row justify-end items-center">
          <div className="px-2 flex flex-row">
            <Icon style={{marginTop:4, marginRight:4}} type="environment" theme="filled"/>
            <span> 武汉 蔡甸区</span>
          </div>
          <div className="px-2">轻度污染</div>
          <div><img src="/images/qing.png"/></div>
          <div>
              <div className="font-bold text-sm">14~20℃</div>
              <div className="text-xs">阴转多云</div>
          </div>
        </div>
      </div>
    )
  );
}

