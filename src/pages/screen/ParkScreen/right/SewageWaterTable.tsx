import React from 'react';
import {useObserver} from "mobx-react-lite";
import {useStore} from "../../../../stores";

export const SewageWaterTable = () => {
  const {
    screen: {gasTable: gasTableStore}
  } = useStore();

  return useObserver(() => (
      <div className="topRight px-4 screenTable flex-1">
        <div className="pt-4 pb-2 tableTitle flex justify-between">
          <div className="text-left">重点污染物—废气</div>
          <div className="vertical-middle">
            <img src="/images/787878.png" className="float-right"/>
          </div>
        </div>
        <div className="">
          <div className="tabTitle">
            <div>区域</div>
            <div>污染物</div>
            <div>浓度值</div>
            <div>限值</div>
          </div>
          <div>{gasTableStore.wasteGasList.map((item) => {
                return (
                  <div className="listItem tabTitle">
                    <div>{item.region}</div>
                    <div>{item.wu}</div>
                    <div>{item.data}</div>
                    <div>{item.maxnum}</div>
                  </div>)
              })}
          </div>
        </div>
      </div>
    )
  );
}


