import React, {useRef} from "react";
import {useLocalStore, useObserver} from "mobx-react-lite";
import {EnterpriseMap} from "./center/Map";
import {EnterpriseScreenGasChart} from "./left/GasChart";
import {Icon, Modal} from "antd";
import {GasTable} from "./left/GasTable";
import {SewageTableDynamic} from "./right/SewageTableDynamic";
import {EnterpriseScreenGroupChart} from "./center/GroupChart";
import {Sewage24HourChart} from "./right/Sewage24HourChart";
import {SewageDailyChart} from "./right/SewageDailyChart";
import {ScreenTop} from "./top/ScreenTop";
import {useEffect} from "react";
import {useStore} from "../../../stores/index";
import {CarouselProvider, Dot, DotGroup, Slide, Slider} from "pure-react-carousel";
import {utils} from "../../../utils";
import {_} from "../../../utils/lodash";

export const EnterpriseScreenPage = () => {
  const {
    screen: {enterpriseScreenMap}
  } = useStore();
  const fullScreenRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    enterpriseScreenMap.init();
  }, []);

  const store = useLocalStore(() => ({
    SiteRuntimePmDate(type) {
      let datas = [] as any;
      enterpriseScreenMap.SiteRuntimePmDate.forEach(site => {
        if (!site.pmInfos) return;
        site.pmInfos.forEach(i => {
          if (i.pmType == type) {
            datas.push({...i, siteName: site.siteName});
          }
        });
      });
      return _.chunk<any>(datas, 10);
    }
  }));

  return useObserver(() => (
    <div className="p-4 screenPage flex flex-col">
      <div className="text-white pb-4 pl-2 cursor-pointer" style={{color: "#0DACF2"}}
           onClick={() => fullScreenRef.current?.requestFullscreen()}>
        <Icon className="text-3xl font-black" type="fullscreen"/>
        <span className="ml-2">全屏展示</span>
      </div>
      <div ref={fullScreenRef} className="flex-1 flex flex-col w-full pb-4"
           style={{backgroundColor: "#061630", height: "calc(100vh - 114px)"}}>
        <ScreenTop/>
        <div className="pb-4 flex-1" style={{backgroundColor: "#061630"}}>
          <div className="flex mt-4 justify-between">
            <div className="w-1/4 pl-4 flex flex-col">
              <GasTable/>
              <EnterpriseScreenGasChart/>
            </div>
            <div className="w-2/4 pl-4 pr-4 flex flex-col">
              <EnterpriseMap/>
              <EnterpriseScreenGroupChart/>
            </div>
            <div className="w-1/4 pr-4 flex flex-col items-end">
              <SewageTableDynamic/>
              <Sewage24HourChart/>
              <SewageDailyChart/>
            </div>
          </div>
        </div>
        <Modal
          width={956}
          getContainer={false}
          visible={enterpriseScreenMap.modalVisibility}
          footer={null} closable={false}>
          <div
            className="screen-modal-title text-white">{enterpriseScreenMap.modalShowType == 1 ? "气体排放情况（实时）详情" : "污水排放情况（实时）详情"}
            <span className="text-blue-600 z-50 absolute" style={{right: 50, top: 24}}
                  onClick={e => enterpriseScreenMap.toggleModal(1)}>
              <Icon className="mr-4 cursor-pointer" style={{fontSize: 28}} type="close-circle" theme="filled"/>
            </span>
          </div>
          <div className="mt-4">
            <div className="tabTitle">
              <div>采集时间</div>
              <div>站点名称</div>
              <div>检测物质</div>
              <div>监测数值</div>
              <div>限值</div>
              <div>超标率(%)</div>
            </div>
            {
              <CarouselProvider naturalSlideWidth={100} isPlaying naturalSlideHeight={50}
                                totalSlides={store.SiteRuntimePmDate(enterpriseScreenMap.modalShowType).length}>
                <Slider>
                  {store.SiteRuntimePmDate(enterpriseScreenMap.modalShowType).map((site, index) => {
                    return (
                      <Slide index={index}>
                        {site.map(item => {
                          if (item.pmType !== enterpriseScreenMap.modalShowType) return;
                          return (
                            <div
                              className={Number(item.limit) && Number(item.limit) && Number(item.collectValue) > Number(item.limit) ? "listItem tabTitle warningColor" : " listItem tabTitle"}>
                              <div>{item.collectDate}</div>
                              <div>{item.siteName}</div>
                              <div>{item.pmName}</div>
                              <div>
                                <span>
                                  {utils.number.toPrecision(item.collectValue)}
                                </span>
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
                  {store.SiteRuntimePmDate(enterpriseScreenMap.modalShowType).map((site, index) => {
                    return <Dot slide={index} className="text-white sliderDotButton" children=""/>;
                  })}
                </DotGroup>
              </CarouselProvider>}
          </div>
        </Modal>
      </div>
    </div>
  ));
};
