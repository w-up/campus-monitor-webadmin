import React from "react";
import { useLocalStore, useObserver, useComputed } from "mobx-react-lite";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { useStore } from "../../../../stores/index";
import { _ } from "utils/lodash";
import { utils } from "../../../../utils/index";
import { Scrollbars } from "react-custom-scrollbars";

export const TopTenMonitorTable = () => {
  const {
    screen: { parkScreenMap },
  } = useStore();

  const store = useLocalStore(() => ({
    get topTenMonitorData() {
      return parkScreenMap.allParkMapData.siteDatas.slice(0, 10);
    },
  }));

  return useObserver(() => (
    <div className="pr-4 mt-4 topRight screenTable flex-1">
      <div className="pb-2 tableTitle flex justify-between">
        <div className="text-left">站点实时监测数据 (前十）</div>
        <div className="vertical-middle">
          <img src="/images/787878.png" className="float-right" />
        </div>
      </div>
      <div className="">
        <div className="tabTitle">
          <div>采集时间</div>
          <div>区域</div>
          <div>监测数值</div>
          <div>限值</div>
        </div>
        <div>
          <Scrollbars style={{ height: 350 }}>
            {store.topTenMonitorData.map((item, index) => (
              <div
                className={Number(item.limit) && Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? "listItem tabTitle warningColor" : " listItem tabTitle"}
                onClick={(e) => parkScreenMap.setCurrentSite(item.siteId)}
              >
                <div title={item.collectDate}>{item.collectDate}</div>
                <div>{item.siteName}</div>
                <div>
                  <span>{item.collectValue}</span>
                </div>
                <div>{item.limit}</div>
              </div>
            ))}
          </Scrollbars>
        </div>
      </div>
    </div>
  ));
};
