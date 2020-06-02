import { observable, action, computed } from "mobx";
import { constant } from "../../common/constants";
import { transform } from "ol/proj";
import Polygon from "ol/geom/Polygon";
import kriging from "../../pages/MapMonitor/kriging";
import ImageLayer from "ol/layer/Image";
import ImageCanvasSource from "ol/source/ImageCanvas";
import { message } from "antd";
import { store } from "../index";
import { Overlay } from "ol";

export class KrigingMapStore {
  @observable map: any = null;
  @observable timer = null;
  @observable onPlay = false;
  @observable index = 0;
  center = [117.191785, 30.460618];
  lngs = [
    [114.190383, 114.192921, 114.193213, 114.190213],
    [114.190383, 114.192921, 114.193213, 114.190213],
    [114.190383, 114.192921, 114.193213, 114.190213],
    [114.190383, 114.192921, 114.193213, 114.190213],
  ];
  lats = [
    [30.460976, 30.461092, 30.460403, 30.459898],
    [30.460976, 30.461092, 30.460403, 30.459898],
    [30.460976, 30.461092, 30.460403, 30.459898],
    [30.460976, 30.461092, 30.460403, 30.459898],
  ];
  times = ["2020-04-22 10", "2020-04-22 11", "2020-04-22 12", "2020-04-22 13"];
  values = [
    [100, 200, 300, 400],
    [200, 100, 300, 400],
    [400, 200, 100, 300],
    [100, 400, 200, 300],
  ];
  @observable colors = constant.krigingColors;
  @observable loading = false;
  coord = [
    [
      [114.190136, 30.461135],
      [114.193599, 30.461372],
      [114.19342, 30.459929],
      [114.189835, 30.459606],
    ],
  ];

  @computed get extent() {
    let extent = [this.center[0] - 0.005, this.center[1] - 0.005, this.center[0] + 0.005, this.center[1] + 0.005];
    return extent;
  }

  @action.bound
  renderSite() {
    if (!this.map) return;
    this.map.getOverlays().forEach((i) => this.map.removeOverlay(i));
    store.mapMonitor.curParkData.forEach((park) => {
      park.siteDatas
        .filter((i) => i.collectValue && Number(i.collectValue) > 0)
        .forEach((site) => {
          //@ts-ignore
          const position = transform([site.gpsX, site.gpsY], "BD:09", "EPSG:3857");
          const element = document.createElement("div");
          element.innerHTML = `
       <div>
        <img style="maxWidth:40px;height:40px" src=${Number(site.limit) && Number(site.collectValue) > Number(site.limit) ? require("../../assets/red.png") : require("../../assets/green.png")} />
        <div class="number">${site.collectValue || 0}</div>
       </div>
       `;
          const overlay = new Overlay({
            position,
            element,
          });
          this.map.addOverlay(overlay);
        });
    });
  }

  @action.bound
  handleParkChange = ({ parkCenter }: { parkCenter: string[] }) => {
    //实际应用中根据选中的园区获取园区中心,注:所有从百度地图获取的坐标必须做一次坐标系转换(transform)，否则定位会有偏差
    // let parkCenter = ["114.191771", "30.460555"];
    if (!this.map?.getView) return;
    //@ts-ignore
    this.map.getView().setCenter(transform(parkCenter, "BD:09", "EPSG:3857"));
  };

  @action.bound
  trainAndReDrawKriging = ({ extent = this.extent, coord, values, lngs, lats, colors = this.colors[0] }) => {
    if (!coord) {
      return;
    }
    console.log("inKriging", true);
    let clipgeom = new Polygon(coord);
    //绘制kriging插值图
    let canvasLayer: any = null;
    if (values.length > 2) {
      let variogram = kriging.train(values, lngs, lats, "exponential", 0, 100);
      let ex = clipgeom.getExtent();
      let grid = kriging.grid(coord, variogram, (ex[2] - ex[0]) / 1600);
      //移除已有图层
      if (canvasLayer != null) {
        this.map.removeLayer(canvasLayer);
      }
      //创建新图层
      canvasLayer = new ImageLayer({
        source: new ImageCanvasSource({
          canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
            let canvas = document.createElement("canvas");
            canvas.width = size[0];
            canvas.height = size[1];
            canvas.style.display = "block";
            //设置canvas透明度
            //@ts-ignore
            canvas.getContext("2d").globalAlpha = 0.75;
            //使用分层设色渲染
            kriging.plot(canvas, grid, [extent[0], extent[2]], [extent[1], extent[3]], colors);
            return canvas;
          },
          projection: "BD:09",
        }),
      });
      //向map添加图层
      this.map.addLayer(canvasLayer);
      console.log("keigingEnd===", true);
    } else {
      //TODO 统一做成消息提示
      message.error("有效样点个数不足，无法插值");
    }
  };

  //获取污染分布数据
  @action.bound
  async getPollutantDistribution(param) {
    // this.loading = true;
    // const res = await request({
    //   url: '/mapMonitor/getPollutantDistributionByParkIdAndPmCode',
    //   method: 'post',
    //   headers:{
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json; charset=UTF-8',
    // },
    //   data: param,
    // });
    // if (res.code==20000) {
    //   const resData = res.data || {};
    //   console.log("resData====",resData)
    //   //正式使用时，每次点击调取回顾从后台获取数据并改变kriging绘制所需参数
    //    /*this.colors=resData.colors;
    //    this.coord=resData.coord;
    //    this.values=resData.values;
    //    this.lats=resData.lats;
    //    this.lngs=resData.lngs;
    //    this.times=resData.times;*/
    // }
    // setTimeout(() => {
    //   this.loading = false;
    // }, 500);
  }
}
