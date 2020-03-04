import React, {useEffect} from 'react';
import {useObserver} from "mobx-react-lite";
import {useStore} from "../../../../stores";
import {CarouselProvider, Dot, DotGroup, Slide, Slider} from "pure-react-carousel";
import 'pure-react-carousel/dist/react-carousel.es.css';

export const GasTable = () => {
  const {
    screen: {gasTable: gasTableStore}
  } = useStore();

  return useObserver(() => (
      <div className="topLeft screenTable">
        <div className="tableTitle text-center">气体排放情况（实时）</div>
        <div className="box">
          <div className="tabTitle">
            <div>站点名称</div>
            <div>检测物质</div>
            <div>监测数值</div>
            <div>限值</div>
            <div>超标率(%)</div>
          </div>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={100}
            totalSlides={3}
          >
            <Slider>
              {
                gasTableStore.newList.map((page, index) => {
                  return (
                    <Slide index={index}>{page.map((item) => {
                      return (
                        <div className="listItem tabTitle">
                          <div>{item.name}</div>
                          <div>{item.dataName}</div>
                          <div>{item.num + 'ppm'}</div>
                          <div>{item.maxNum}</div>
                          <div>{item.point}</div>
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


