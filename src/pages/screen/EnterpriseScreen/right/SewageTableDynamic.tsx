import React from 'react';
import {useObserver} from "mobx-react-lite";
import {CarouselProvider, Dot, DotGroup, Slide, Slider} from "pure-react-carousel";
import {GasTableStore} from "../../../../stores/screen/GasTableStore";
import {useStore} from "../../../../stores";

export const SewageTableDynamic = () => {
  const {
    screen: {sewageTable: sewageTableStore}
  } = useStore();

  return useObserver(() => (
      <div className="topright screenTable flex-1">
        <div className="tableTitle text-center">污水排放情况（实时）</div>
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
            naturalSlideHeight={75}
            totalSlides={3}
            isPlaying={true}
          >
            <Slider>
              {
                sewageTableStore.list.map((page, index) => {
                  return (
                    <Slide index={index}>{page.map((item) => {
                      return (
                        <div className="listitem tabtitle">
                          <div>{item.name}</div>
                          <div>{item.thing}</div>
                          <div>{item.num + 'ppm'}</div>
                          <div>{item.unnormal}</div>
                          <div>{item.bigger}</div>
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


