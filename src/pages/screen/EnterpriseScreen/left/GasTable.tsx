import React, { useEffect } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import { useStore } from "../../../../stores";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { _ } from "../../../../utils/lodash";

export const GasTable = () => {
  const {
    screen: { enterpriseScreenMap }
  } = useStore();

  const store = useLocalStore(() => ({
    get SiteRuntimePmDate() {
      let datas = [] as any;
      enterpriseScreenMap.SiteRuntimePmDate.forEach(site => {
        site.pmInfos.forEach(i => {
          if (i.pmType == 1) {
            datas.push({ ...i, siteName: site.siteName });
          }
        });
      });
      return _.chunk<any>(datas, 8);
    }
  }));

  return useObserver(() => (
    <div className="topLeft screenTable">
      <div className="tableTitle text-center">气体排放情况（实时）</div>
      <div className="box">
        <div className="tabTitle">
          <div>站点名称</div>
          <div>检测物质</div>
          <div>监测数值</div>
          <div>限值</div>
          <div>超标率</div>
        </div>
        <CarouselProvider naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={store.SiteRuntimePmDate.length}>
          <Slider>
            {store.SiteRuntimePmDate.map((site, index) => {
              return (
                <Slide index={index}>
                  {site.map(item => {
                    if (item.pmType !== 1) return;
                    return (
                      <div className="listItem tabTitle">
                        <div>{item.siteName}</div>
                        <div>{item.pmName}</div>
                        <div>{item.collectValue + item.unit}</div>
                        <div>{item.limit}</div>
                        <div>{item.overRate}</div>
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
