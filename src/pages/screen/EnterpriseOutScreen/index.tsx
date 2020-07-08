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
    height: `${430 * 0.8}px`,
    width: `${930 * 0.8}px`,
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
            <div className=" pl-4 flex flex-col">
              <div className="relative" style={{ background: "#0F1B35", width: store.width }}>
                <div style={{ height: store.height, width: store.width }}>
                  <div id="allmap" style={{ height: store.height, width: store.width }} />
                  <img className="groundImg" style={{ height: store.height, width: store.width }} src={utils.img.getImageUrl(enterpriseScreenMap?.curMapConfig?.picUrl)} />
                </div>
              </div>
              <div style={{ marginTop: 10, minHeight: 100, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {enterpriseScreenMap.curSiteData?.siteName && <div style={{ color: "#3398d4", fontWeight: "bold", fontSize: 18 }}>{enterpriseScreenMap.curSiteData?.siteName}近二十天日均值趋势图</div>}

                <div style={{ width: "100%" }}>{enterpriseScreenMap.curSiteRuntimeData.length > 0 && <LineChart height={150} animate datas={enterpriseScreenMap.curSiteRuntimeData}></LineChart>}</div>
              </div>
            </div>
            <div className="flex-1 pr-4 flex flex-col items-end">
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
