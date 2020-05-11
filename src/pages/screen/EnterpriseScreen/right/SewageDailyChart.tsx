import React from "react";
import { useObserver } from "mobx-react-lite";
import { _ } from "../../../../utils/lodash";
import { useStore } from "../../../../stores/index";
import { LineChart } from "components/LineChart";

export const SewageDailyChart = () => {
  const {
    screen: { enterpriseScreenMap },
  } = useStore();

  return useObserver(() => (
    <div className="screenTable flex-1" style={{ marginTop: 14 }}>
      <div className="tableTitle flex justify-between items-center">
        <img src="/images/left.png" className="img" />
        <div>污水日均排放趋势图</div>
        <img src="/images/right1.png" className="img" />
      </div>
      <div style={{ width: "100%", height: "252px", paddingTop: 15 }}>
        {enterpriseScreenMap.dailySewage.pms.length > 0 && <LineChart animate datas={enterpriseScreenMap.dailySewage.pms} precision={true} />}
      </div>
    </div>
  ));
};
