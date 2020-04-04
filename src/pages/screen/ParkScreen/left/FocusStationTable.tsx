import React from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { useStore } from "../../../../stores/index";
import { _ } from "utils/lodash";
import { utils } from "../../../../utils/index";

export const FocusStationTable = () => {
  const {
    screen: { parkScreenMap }
  } = useStore();

  const store = useLocalStore(() => ({
    get allConcernSiteDataPage() {
      return _.chunk(parkScreenMap.allConcernSiteData, 6) || [];
    }
  }));
  return useObserver(() => (
    <div className="pr-4 topRight screenTable flex-1">
      <div className="pt-8 pb-2 tableTitle flex justify-between">
        <div className="text-left">重点污染物—废气</div>
        <div className="vertical-middle">
          <img src="/images/787878.png" className="float-right" />
        </div>
      </div>
      <div className="">
        <div className="tabTitle">
          <div>站点名称</div>
          <div>监测数值</div>
          <div>限值</div>
          <div>超标率(%)</div>
        </div>
        <CarouselProvider isPlaying interval={5000} naturalSlideWidth={100} naturalSlideHeight={60} totalSlides={store.allConcernSiteDataPage.length}>
          <Slider>
            {store.allConcernSiteDataPage.map((page, index) => {
              return (
                <Slide index={index}>
                  {page.map(item => {
                    return (
                      <div className="listItem tabTitle">
                        <div>{item.siteName}</div>
                        <div>
                          <span style={{ color: Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? "red" : "" }}>{utils.number.toPrecision(item.collectValue)}</span>
                        </div>
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
            {store.allConcernSiteDataPage.map((item, index) => (
              <Dot slide={index} className="text-white sliderDotButton" children={""} />
            ))}
          </DotGroup>
        </CarouselProvider>
      </div>
    </div>
  ));
};
