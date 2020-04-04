import React from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { Scrollbars } from "react-custom-scrollbars";
import { useStore } from "../../../../stores/index";
import { utils } from "../../../../utils/index";

export const SewageWaterTable = () => {
  const {
    screen: { parkScreenMap }
  } = useStore();

  const store = useLocalStore(() => ({
    sewageWater: [
      { region: "CB化工", wu: "二氧化硫", data: "52.7mg/m³", maxNum: "200" },
      { region: "B化工", wu: "一氧化碳", data: "12.2mg/m³", maxNum: "100" },
      { region: "B化工", wu: "氮氧化物", data: "12.2mg/m³", maxNum: "100" },
      { region: "B化工", wu: "氮氧化物", data: "52.7mg/m³", maxNum: "200" },
      { region: "CB化工", wu: "二氧化硫", data: "52.7mg/m³", maxNum: "200" },
      { region: "B化工", wu: "一氧化碳", data: "12.2mg/m³", maxNum: "100" },
      { region: "B化工", wu: "氮氧化物", data: "12.2mg/m³", maxNum: "100" },
      { region: "B化工", wu: "氮氧化物", data: "52.7mg/m³", maxNum: "200" },
      { region: "CB化工", wu: "二氧化硫", data: "52.7mg/m³", maxNum: "200" },
      { region: "B化工", wu: "一氧化碳", data: "12.2mg/m³", maxNum: "100" },
      { region: "B化工", wu: "氮氧化物", data: "12.2mg/m³", maxNum: "100" },
      { region: "B化工", wu: "氮氧化物", data: "52.7mg/m³", maxNum: "200" }
    ]
  }));

  return useObserver(() => (
    <div className="topRight px-4 screenTable">
      <div className="pt-4 pb-2 tableTitle flex justify-between">
        <div className="text-left">重点污染物—废气</div>
        <div className="vertical-middle">
          <img src="/images/787878.png" className="float-right" />
        </div>
      </div>
      <div className="">
        <div className="tabTitle text-left">
          <div>区域</div>
          <div>污染物</div>
          <div>浓度值</div>
          <div>限值</div>
        </div>
        <div>
          <Scrollbars style={{ height: 250 }}>
            {parkScreenMap.gasData.map(item => {
              return (
                <div className="listItem tabTitle">
                  <div>{item.factoryName}</div>
                  <div>{item.pmName}</div>
                  <div>
                    <span style={{ color: Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? "red" : "" }}>{utils.number.toPrecision(item.collectValue)}</span>
                  </div>
                  <div>{item.limit}</div>
                </div>
              );
            })}
          </Scrollbars>
        </div>
      </div>
    </div>
  ));
};
