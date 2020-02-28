import React from 'react';
import {useObserver} from "mobx-react-lite";

export const GasTableDynamic = () => {

  return useObserver(() => (
      <div className="topright">
        <div className="title text-center">气体排放情况（实时）</div>
        <div className="box">
          <div className="tabtitle">
            <div>站点名称</div>
            <div>检测物质</div>
            <div>监测数值</div>
            <div>限值</div>
            <div>超标率(%)</div>
          </div>
        </div>
      </div>
    )
  );
}


