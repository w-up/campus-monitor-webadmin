import React, { useRef, useEffect } from "react";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { Icon, Modal } from "antd";
import { useStore } from "../../../stores/index";
import { CarouselProvider, Dot, DotGroup, Slide, Slider } from "pure-react-carousel";
import { utils } from "../../../utils";
import { _ } from "../../../utils/lodash";
import { ScreenTop } from "../EnterpriseScreen/top/ScreenTop";
import { EnterpriseMap } from "../EnterpriseScreen/center/Map";
import { SewageTableDynamic } from "../EnterpriseScreen/right/SewageTableDynamic";
import { CornerTable } from "./right/CornerTable";
import { LineChart } from "../../../components/LineChart";

export const EnterpriseScreenOutPage = () => {
  const {
    config: { sysParams },
    screen: { enterpriseOutScreenMap: enterpriseScreenMap },
  } = useStore();
  const fullScreenRef = useRef<HTMLDivElement>(null);

  const store = useLocalStore(() => ({
    enterpriseTimer: null as any,
    setUpTimer() {
      if (this.enterpriseTimer) clearInterval(this.enterpriseTimer);
      this.enterpriseTimer = setInterval(() => {
        enterpriseScreenMap.reload();
      }, Math.max(Number(sysParams.qyjsc_refresh_period.paramValue), 1) * 1000 * 60);
    },
    clearTimer() {
      clearInterval(this.enterpriseTimer);
    },
    SiteRuntimePmDate(type) {
      let datas = [] as any;
      enterpriseScreenMap.SiteRuntimePmDate.forEach((site) => {
        if (!site.pmInfos) return;
        site.pmInfos.forEach((i) => {
          if (i.pmType == type) {
            datas.push({ ...i, siteName: site.siteName });
          }
        });
      });
      return _.chunk<any>(datas, 10);
    },
  }));

  useEffect(() => {
    enterpriseScreenMap.initMap();
    enterpriseScreenMap.init();

    store.setUpTimer();
    return () => {
      store.clearTimer();
      enterpriseScreenMap.map = null;
    };
  }, []);

  return useObserver(() => (
    <div className="p-4 screenPage outScreen1280">
      <div className="text-white pb-4 pl-2 cursor-pointer" style={{ color: "#0DACF2" }} onClick={() => fullScreenRef.current?.requestFullscreen()}>
        <Icon className="text-3xl font-black" type="fullscreen" />
        <span className="ml-2">全屏展示</span>
      </div>
      <div ref={fullScreenRef} className="flex-1 flex flex-col h-full w-full pb-4" style={{ backgroundColor: "#061630" }}>
        <ScreenTop />
        <div className="pb-4 flex-1" style={{ backgroundColor: "#061630" }}>
          <div className="flex mt-4 justify-between">
            <div className="w-3/5 pl-4 flex flex-col">
              <div className="relative" style={{ background: "#0F1B35" }}>
                <div style={{ height: "40vh" }}>
                  <div id="allmap" style={{ height: "40vh", width: "100%" }} />
                  <img className="groundImg" style={{ height: "40vh" }} src={utils.img.getImageUrl(enterpriseScreenMap?.curMapConfig?.picUrl)} />
                </div>
              </div>
              <div style={{ marginTop: 40, minHeight: 100 }}>{enterpriseScreenMap.curSiteRuntimeData.length > 0 && <LineChart animate datas={enterpriseScreenMap.curSiteRuntimeData}></LineChart>}</div>
            </div>
            <div className="w-2/5 pr-4 flex flex-col items-end">
              <CornerTable />
            </div>
          </div>
        </div>
        <div className="copyright fixed bottom-0 w-full text-center pb-1" style={{ color: "#88a8c5" }}>
          版权所有: 武汉三藏科技有限责任公司
        </div>
      </div>
    </div>
  ));
};
