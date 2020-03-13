import { action, observable, computed } from "mobx";
import * as geolib from "geolib";
import { utils } from "../../utils/index";

export class DynamicSourceStore {
  //@ts-ignore
  @observable map: BMap.Map = null;
  @observable center = { lng: 120.983642, lat: 31.36556 };
  @observable zoom = 17;
  @observable computeType: "1" | "2" | "3" = "1";
  @observable polygonPath = [
    { lng: 120.990022, lat: 31.3717 },
    { lng: 120.970045, lat: 31.3702 },
    { lng: 120.981034, lat: 31.3616 }
  ];

  @computed
  get polyCenter(): ReturnType<typeof geolib.getCenterOfBounds> {
    const result = geolib.getCenterOfBounds(utils.array.formatLatLngLong(this.polygonPath));
    return result;
  }
  @observable compamys = [
    [
      { lng: 120.985022, lat: 31.3687 },
      { lng: 120.985022, lat: 31.3681 },
      { lng: 120.985612, lat: 31.3681 },
      { lng: 120.985612, lat: 31.3687 }
    ],
    [
      { lng: 120.983022, lat: 31.3657 },
      { lng: 120.983022, lat: 31.3651 },
      { lng: 120.983612, lat: 31.3651 },
      { lng: 120.983612, lat: 31.3657 }
    ],
    [
      { lng: 120.980022, lat: 31.3657 },
      { lng: 120.980022, lat: 31.3651 },
      { lng: 120.980612, lat: 31.3651 },
      { lng: 120.980612, lat: 31.3657 }
    ],
    [
      { lng: 120.980022, lat: 31.3687 },
      { lng: 120.980022, lat: 31.3681 },
      { lng: 120.980612, lat: 31.3681 },
      { lng: 120.980612, lat: 31.3687 }
    ]
  ];
  @observable offset = {
    width: 0,
    height: -20
  };
  @observable pointsc = [
    { position: { lng: 120.985072, lat: 31.3681 }, mapPos: { left: "376px", top: "157px" }, number: 123 },
    { position: { lng: 120.985622, lat: 31.3683 }, mapPos: { left: "392px", top: "150px" }, number: 23 },
    { position: { lng: 120.985642, lat: 31.3682 }, mapPos: { left: "392px", top: "153px" }, number: 12 },
    { position: { lng: 120.983022, lat: 31.3659 }, mapPos: { left: "319px", top: "228px" }, number: 23 },
    { position: { lng: 120.983032, lat: 31.36556 }, mapPos: { left: "320px", top: "239px" }, number: 12 },
    { position: { lng: 120.983642, lat: 31.36513 }, mapPos: { left: "337px", top: "253px" }, number: 34 },
    { position: { lng: 120.983612, lat: 31.36523 }, mapPos: { left: "336px", top: "250px" }, number: 23 },
    { position: { lng: 120.980092, lat: 31.36588 }, mapPos: { left: "238px", top: "229px" }, number: 34 },
    { position: { lng: 120.980022, lat: 31.36543 }, mapPos: { left: "236px", top: "243px" }, number: 23 },
    { position: { lng: 120.980632, lat: 31.3653 }, mapPos: { left: "253px", top: "247px" }, number: 12 },
    { position: { lng: 120.980642, lat: 31.3654 }, mapPos: { left: "253px", top: "244px" }, number: 23 },
    { position: { lng: 120.980072, lat: 31.36865 }, mapPos: { left: "237px", top: "139px" }, number: 43 },
    { position: { lng: 120.980022, lat: 31.36856 }, mapPos: { left: "236px", top: "142px" }, number: 11 },
    { position: { lng: 120.980682, lat: 31.36813 }, mapPos: { left: "254px", top: "156px" }, number: 22 }
  ];
  @observable compname = [
    { position: { lng: 120.985022, lat: 31.3687 }, name: "化工西北" },
    { position: { lng: 120.983022, lat: 31.3657 }, name: "长润发" },
    { position: { lng: 120.980022, lat: 31.3657 }, name: "群力化工" }
  ];

  @action.bound
  draw() {
    for (let x in this.pointsc) {
      const pixel = this.map.pointToOverlayPixel(new BMap.Point(this.pointsc[x].position.lng, this.pointsc[x].position.lat));
      this.pointsc[x].mapPos.left = pixel.x - 15 + "px";
      this.pointsc[x].mapPos.top = pixel.y - 15 + "px";
    }
  }

  @observable arrows = [] as any;
  @observable arrowLine = [] as any;

  @action.bound
  fillArrow() {
    this.arrows.forEach(i => this.map.removeOverlay(i));
    this.arrowLine.forEach(i => this.map.removeOverlay(i));

    this.pointsc.forEach(i => {
      var polyline = new BMap.Polyline([new BMap.Point(i.position.lng, i.position.lat), new BMap.Point(120.985022, 31.3687)], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1 });
      console.log(polyline);
      this.map.addOverlay(polyline);
      this.addArrow(polyline, 40, Math.PI / 7);
      this.arrowLine.push(polyline);
    });
  }

  addArrow(polyline, length, angleValue) {
    //繪制箭頭的函數
    var linePoint = polyline.getPath(); //線的坐標串
    var arrowCount = linePoint.length;
    for (var i = 1; i < arrowCount; i++) {
      //在拐點處繪制箭頭
      var pixelStart = this.map.pointToPixel(linePoint[i - 1]);
      var pixelEnd = this.map.pointToPixel(linePoint[i]);
      var angle = angleValue; //箭頭和主線的夾角
      var r = length; // r/Math.sin(angle)代表箭頭長度
      var delta = 0; //主線斜率，垂直時無斜率
      var param = 0; //代碼簡潔考慮
      var pixelTemX, pixelTemY; //臨時點坐標
      var pixelX, pixelY, pixelX1, pixelY1; //箭頭兩個點
      if (pixelEnd.x - pixelStart.x == 0) {
        //斜率不存在是時
        pixelTemX = pixelEnd.x;
        if (pixelEnd.y > pixelStart.y) {
          pixelTemY = pixelEnd.y - r;
        } else {
          pixelTemY = pixelEnd.y + r;
        }
        //已知直角三角形兩個點坐標及其中一個角，求另外一個點坐標算法
        pixelX = pixelTemX - r * Math.tan(angle);
        pixelX1 = pixelTemX + r * Math.tan(angle);
        pixelY = pixelY1 = pixelTemY;
      } //斜率存在時
      else {
        delta = (pixelEnd.y - pixelStart.y) / (pixelEnd.x - pixelStart.x);
        param = Math.sqrt(delta * delta + 1);

        if (pixelEnd.x - pixelStart.x < 0) {
          //第二、三象限
          pixelTemX = pixelEnd.x + r / param;
          pixelTemY = pixelEnd.y + (delta * r) / param;
        } //第一、四象限
        else {
          pixelTemX = pixelEnd.x - r / param;
          pixelTemY = pixelEnd.y - (delta * r) / param;
        }
        //已知直角三角形兩個點坐標及其中一個角，求另外一個點坐標算法
        pixelX = pixelTemX + (Math.tan(angle) * r * delta) / param;
        pixelY = pixelTemY - (Math.tan(angle) * r) / param;

        pixelX1 = pixelTemX - (Math.tan(angle) * r * delta) / param;
        pixelY1 = pixelTemY + (Math.tan(angle) * r) / param;
      }
      var pointArrow = this.map.pixelToPoint(new BMap.Pixel(pixelX, pixelY));
      var pointArrow1 = this.map.pixelToPoint(new BMap.Pixel(pixelX1, pixelY1));
      var Arrow = new BMap.Polyline([pointArrow, linePoint[i], pointArrow1], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1 });
      this.map.addOverlay(Arrow);
      this.arrows.push(Arrow);
    }
  }

  @action.bound
  onMapUpdate(e: any) {
    if (!this.map) {
      this.map = e.target;
      //@ts-ignore
      this.map.setMapStyle({ features: [], style: "midnight" });
    } else {
      this.draw();
      this.fillArrow();
    }
  }
}
