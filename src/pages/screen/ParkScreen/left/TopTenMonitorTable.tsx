import React from 'react';
import {useLocalStore, useObserver} from "mobx-react-lite";
import {CarouselProvider, Dot, DotGroup, Slide, Slider} from "pure-react-carousel";

export const TopTenMonitorTable = () => {

  const store = useLocalStore(() => ({
    topTenMonitorData: [
      [
        {name: 'A化工东南', num: '2.12mg/m³', maxNum: '2', exceed: '6%'},
        {name: 'B化工西北', num: '2.12mg/m³', maxNum: '2', exceed: '6%'},
        {name: 'C化工西南', num: '3.12mg/m³', maxNum: '2', exceed: ''},
        {name: 'A化工西南', num: '2.12mg/m³', maxNum: '2', exceed: ''},
        {name: 'D化工西北', num: '1.12mg/m³', maxNum: '2', exceed: ''}
      ],
      [
        {name: 'C化工西南', num: '3.12mg/m³', maxNum: '2', exceed: ''},
        {name: 'A化工西南', num: '2.12mg/m³', maxNum: '2', exceed: ''},
        {name: 'D化工西北', num: '1.12mg/m³', maxNum: '2', exceed: ''},
        {name: 'A化工东南', num: '2.12mg/m³', maxNum: '2', exceed: '6%'},
        {name: 'B化工西北', num: '2.12mg/m³', maxNum: '2', exceed: '6%'}
      ],
      [
        {name: 'B化工西北', num: '2.12mg/m³', maxNum: '2', exceed: '6%'},
        {name: 'C化工西南', num: '3.12mg/m³', maxNum: '2', exceed: ''},
        {name: 'A化工东南', num: '2.12mg/m³', maxNum: '2', exceed: '6%'},
        {name: 'A化工西南', num: '2.12mg/m³', maxNum: '2', exceed: ''},
        {name: 'D化工西北', num: '1.12mg/m³', maxNum: '2', exceed: ''}
      ]
    ],
  }));
  return useObserver(() => (
      <div className="pr-4 mt-4 topRight screenTable flex-1">
        <div className="pb-2 tableTitle flex justify-between">
          <div className="text-left">站点实时监测数据 (前十）</div>
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
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={60}
            totalSlides={3}
          >
            <Slider>
              {
                store.topTenMonitorData.map((page, index) => {
                  return (
                    <Slide index={index}>{page.map((item) => {
                      return (
                        <div className="listItem tabTitle">
                          <div>{item.name}</div>
                          <div>{item.num}</div>
                          <div>{item.maxNum}</div>
                          <div>{item.exceed}</div>
                        </div>
                      )
                    })}</Slide>
                  )
                })
              }
            </Slider>
            <DotGroup className="text-center">
              <Dot slide={0} className="text-white sliderDotButton"> </Dot>
              <Dot slide={1} className="text-white sliderDotButton"> </Dot>
              <Dot slide={2} className="text-white sliderDotButton"> </Dot>
            </DotGroup>
          </CarouselProvider>
        </div>
      </div>
    )
  );
}


