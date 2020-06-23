import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { useStore } from "../../../../stores";
import { _ } from "../../../../utils/lodash";

export const CornerTable = () => {
  const {
    screen: { enterpriseOutScreenMap: enterpriseScreenMap },
  } = useStore();

  return useObserver(() => (
    <div className="topRight screenTable">
      <div className="tableTitle text-center text-white pt-2" style={{ fontSize: 28, color: "#fff" }}>
        厂界西北角
        <p className="text-white" style={{ fontSize: 16 }}>
          更新时间 {enterpriseScreenMap.updateTime}
        </p>
      </div>
      <div className="box">
        <div className="tabTitle">
          <div>物质</div>
          <div>数值</div>
          <div>限值</div>
        </div>
        {enterpriseScreenMap.SiteRuntimePmData.children.map((item, index) => {
          return (
            <div className={Number(item.limit) && Number(item.limit) && Number(item.value) > Number(item.limit) ? "listItem tabTitle warningColor" : " listItem tabTitle"}>
              <div title={item.collectDate}>{item.name}</div>
              <div>{item.value}</div>
              <div>{item.limit}</div>
            </div>
          );
        })}
      </div>
    </div>
  ));
};
