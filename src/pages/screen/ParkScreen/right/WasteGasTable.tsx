import React from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { Scrollbars } from "react-custom-scrollbars";
import { useStore } from "../../../../stores/index";

export const WasteGasTable = () => {
  const {
    screen: { parkScreenMap }
  } = useStore();

  const store = useLocalStore(() => ({
    sewageGas: [
      { region: "CB废水", wu: "PH", data: "52.7mg/m³", maxNum: "200" },
      { region: "B废水", wu: "流量", data: "12.2mg/m³", maxNum: "100" },
      { region: "B废水", wu: "COD", data: "12.2mg/m³", maxNum: "100" },
      { region: "B废水", wu: "PH", data: "52.7mg/m³", maxNum: "200" },
      { region: "CB废水", wu: "PH", data: "52.7mg/m³", maxNum: "200" },
      { region: "B废水", wu: "流量", data: "12.2mg/m³", maxNum: "100" },
      { region: "B废水", wu: "COD", data: "12.2mg/m³", maxNum: "100" },
      { region: "B废水", wu: "PH", data: "52.7mg/m³", maxNum: "200" },
      { region: "CB废水", wu: "PH", data: "52.7mg/m³", maxNum: "200" },
      { region: "B废水", wu: "流量", data: "12.2mg/m³", maxNum: "100" },
      { region: "B废水", wu: "COD", data: "12.2mg/m³", maxNum: "100" },
      { region: "B废水", wu: "PH", data: "52.7mg/m³", maxNum: "200" }
    ]
  }));

  return useObserver(() => (
    <div className="topRight mt-4 screenTable">
      <div className="pt-4 px-4">
        <div className="tableTitle text-left pb-2">重点污染物—废水</div>
      </div>
      <div className="px-4">
        <div className="tabTitle">
          <div>区域</div>
          <div>污染物</div>
          <div>浓度值</div>
          <div>限值</div>
        </div>
        <div>
          <Scrollbars style={{ height: 250 }}>
            {parkScreenMap.waterData.map(item => {
              return (
                <div className="listItem tabTitle">
                  <div>{item.factoryName}</div>
                  <div>{item.pmName}</div>
                  <div>{item.collectValue}</div>
                  <div>
                    {item.maxNum}
                    {item.unit}
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
