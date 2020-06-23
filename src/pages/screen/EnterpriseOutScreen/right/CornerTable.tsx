import React from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { useStore } from "../../../../stores";
import { _ } from "../../../../utils/lodash";

export const CornerTable = () => {
  const {
    screen: { enterpriseOutScreenMap: enterpriseScreenMap },
  } = useStore();

  const store = useLocalStore(() => ({
    get SiteRuntimePmDate() {
      let datas = [] as any;
      enterpriseScreenMap.SiteRuntimePmDate.forEach((site) => {
        if (!site.pmInfos) return;
        site.pmInfos.forEach((i) => {
          if (i.pmType == 2) {
            datas.push({ ...i, siteName: site.siteName });
          }
        });
      });
      return _.chunk<any>(datas, 4);
    },
    carouselProviderPlay: enterpriseScreenMap.SiteRuntimePmDate.length > 1 ? true : false,
  }));

  return useObserver(() => (
    <div className="topRight screenTable">
      <div className="tableTitle text-center text-white pt-2" style={{ fontSize: 28, color: "#fff" }}>
        厂界西北角
        <p className="text-white" style={{ fontSize: 16 }}>
          更新时间 2020-06-22 12:00:00
        </p>
      </div>
      <div className="box">
        <div className="tabTitle">
          <div>物质</div>
          <div>数值</div>
          <div>限值</div>
        </div>
        <CarouselProvider naturalSlideWidth={100} dragEnabled={store.carouselProviderPlay} naturalSlideHeight={42} totalSlides={enterpriseScreenMap.SiteRuntimePmDate.length}>
          <Slider>
            {store.SiteRuntimePmDate.map((site, index) => {
              return (
                <Slide index={index}>
                  {site.map((item) => {
                    if (item.pmType !== 2) return;
                    return (
                      <div className={Number(item.limit) && Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? "listItem tabTitle warningColor" : " listItem tabTitle"}>
                        <div>{item.siteName}</div>
                        <div>{item.pmName}</div>
                        <div>
                          <span>{item.collectValue}</span>
                        </div>
                        <div>{item.limit}</div>
                        {false && <div>{item.overRate}</div>}
                      </div>
                    );
                  })}
                </Slide>
              );
            })}
          </Slider>
          <DotGroup className="text-center">
            {store.SiteRuntimePmDate.map((site, index) => {
              return <Dot slide={index} className="text-white sliderDotButton" children="" />;
            })}
          </DotGroup>
        </CarouselProvider>
      </div>
    </div>
  ));
};
