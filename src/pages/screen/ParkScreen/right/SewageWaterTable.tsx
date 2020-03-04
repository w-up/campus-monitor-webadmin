import React from 'react';
import {useObserver} from "mobx-react-lite";
import {useStore} from "../../../../stores";

export const SewageWaterTable = () => {
  const {
    screen: {gasTable: gasTableStore}
  } = useStore();

  return useObserver(() => (
      <div className="topRight screenTable flex-1">
        <div className="pt-4 px-4">
          <div className="tableTitle text-left pb-2">重点污染物—废气</div>
        </div>
        <div className="px-4">
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


