import React from 'react';
import {useObserver} from "mobx-react-lite";
import {useStore} from "../../../../stores";
import {ButtonBack, ButtonNext, CarouselProvider, Dot, DotGroup, Slide, Slider} from "pure-react-carousel";
import 'pure-react-carousel/dist/react-carousel.es.css';

export const GasTable = () => {
  const {
    screen: {gasTable: GasTableStore}
  } = useStore();

  return useObserver(() => (
      <div className="topleft">
        <div className="title text-center">气体排放情况（实时）</div>
        <div className="box">
          <div className="tabtitle">
            <div>站点名称</div>
            <div>检测物质</div>
            <div>监测数值</div>
            <div>限值</div>
            <div>超标率(%)</div>
          </div>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={125}
            totalSlides={3}
          >
            <Slider>
              <Slide index={0}>{GasTableStore.list.map((item) => {
                return (
                  <div className="listitem tabtitle">
                    <div>{item.name}</div>
                    <div>{item.dataName}</div>
                    <div>{item.num + 'ppm'}</div>
                    <div>{item.maxNum}</div>
                    <div>{item.point}</div>
                  </div>
                )
              })}</Slide>
              <Slide index={1} className="text-white">I am the second Slide.</Slide>
              <Slide index={2} className="text-white">I am the third Slide.</Slide>
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

