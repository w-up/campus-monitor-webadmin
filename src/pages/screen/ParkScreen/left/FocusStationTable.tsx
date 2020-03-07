import React from 'react';
import {useLocalStore, useObserver} from "mobx-react-lite";
import {CarouselProvider, Dot, DotGroup, Slide, Slider} from "pure-react-carousel";

export const FocusStationTable = () => {

  const store = useLocalStore(() => ({
    focusStationData: [
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
      <div className="pr-4 topRight screenTable flex-1">
        <div className="pt-8 pb-2 tableTitle flex justify-between">
          <div className="text-left">重点污染物—废气</div>
          <div className="vertical-middle">
            <img src="/images/787878.png" className="float-right"/>
          </div>
        </div>
        <div className="">
          <div className="tabTitle">
            <div>站点名称</div>
            <div>监测数值</div>
            <div>限值</div>
            <div>超标率(%)</div>
          </div>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={60}
            totalSlides={3}
          >
            <Slider>
              {
                store.focusStationData.map((page, index) => {
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


