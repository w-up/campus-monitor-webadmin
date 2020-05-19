import React, { useEffect, useContext, Component, useState } from "react";
import { message, Button, Menu, Dropdown } from "antd";
import { observer, useObserver } from "mobx-react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile, Image } from "ol/layer";
import { XYZ, TileImage } from "ol/source";
import TileGrid from "ol/tilegrid/TileGrid";
import { defaults, MousePosition } from "ol/control";
import { transform } from "ol/proj";
import { applyTransform } from "ol/extent";
import { Projection } from "ol/proj";
import { addProjection } from "ol/proj";
import { addCoordinateTransforms } from "ol/proj";
import { createStringXY } from "ol/coordinate";
import Vector from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import ISelect from "ol/interaction/Select";
import DragBox from "ol/interaction/DragBox";
import { platformModifierKeyOnly } from "ol/events/condition";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Polygon from "ol/geom/Polygon";
import ImageLayer from "ol/layer/Image";
import ImageCanvasSource from "ol/source/ImageCanvas";
import coordtransform from "coordtransform";
import kriging from "./kriging";
import { useStore } from "stores";
import ImageState from "ol/ImageState";

const BMap = window.BMap;

export const KrigingMap = () => {
  const {
    map: { krigingMap: pageStore },
    mapMonitor,
  } = useStore();

  useEffect(() => {
    //初始化地图,地图中心按需求传递
    initmap(pageStore.center);
    mapMonitor.updateMap();
    pageStore.renderSite();
    clearInterval(pageStore.timer);
  }, []);

  ////////////////////////////////////////↓↓↓↓无视此处代码↓↓↓↓//////////////////////////////////////////////////////////
  const bd09toMercator = (lng, lat) => {
    if (lng == null || lng == "" || lat == null || lat == "") {
      return null;
    }
    var point = new BMap.MercatorProjection().lngLatToPoint(new BMap.Point(lng, lat));
    return [point.x, point.y];
  };

  const mercatortoBd09 = (x, y) => {
    if (x == null || x == "" || y == null || y == "") {
      return null;
    }
    var c = new BMap.MercatorProjection().pointToLngLat(new BMap.Pixel(x, y));
    return [c.lng, c.lat];
  };

  const initmap = (mapCenter) => {
    console.log("in===", true);
    var b2,
      a8 = (b2 = a8 || {
        version: "1.3.4",
      });
    a8.guid = "$BAIDU$";
    window[a8.guid] = window[a8.guid] || {};
    a8.object = a8.object || {};
    a8.extend = a8.object.extend = function (cM, T) {
      for (var cL in T) {
        if (T.hasOwnProperty(cL)) {
          cM[cL] = T[cL];
        }
      }
      return cM;
    };

    // window.BMap = window.BMap || {};
    // window.BMap.version = "1.3";
    // window.BMap._register = [];
    // window.BMap.register = function (T) {
    //   this._register.push(T);
    // };
    // window.BMap.apiLoad = window.BMap.apiLoad || function () {};

    window._jsload = function (T, cL) {
      // cA.run(T, cL)
    };

    function bu(T, cL) {
      this.x = T || 0;
      this.y = cL || 0;
    }
    bu.prototype.equals = function (T) {
      return T && T.x == this.x && T.y == this.y;
    };

    function cd(T, cL) {
      if (isNaN(T)) {
        // T = bV(T);
        T = isNaN(T) ? 0 : T;
      }
      if (b3(T)) {
        T = parseFloat(T);
      }
      if (isNaN(cL)) {
        // cL = bV(cL);
        cL = isNaN(cL) ? 0 : cL;
      }
      if (b3(cL)) {
        cL = parseFloat(cL);
      }
      this.lng = T;
      this.lat = cL;
    }
    cd.isInRange = function (T) {
      return T && T.lng <= 180 && T.lng >= -180 && T.lat <= 74 && T.lat >= -74;
    };
    cd.prototype.equals = function (T) {
      return T && this.lat == T.lat && this.lng == T.lng;
    };

    function bd() {}
    bd.prototype.lngLatToPoint = function () {
      throw "lngLatToPoint\u65b9\u6cd5\u672a\u5b9e\u73b0";
    };
    bd.prototype.pointToLngLat = function () {
      throw "pointToLngLat\u65b9\u6cd5\u672a\u5b9e\u73b0";
    };

    function ba() {}
    ba.prototype = new bd();
    a8.extend(ba, {
      EARTHRADIUS: 6370996.81,
      MCBAND: [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
      LLBAND: [75, 60, 45, 30, 15, 0],
      MC2LL: [
        [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2],
        [
          -7.435856389565537e-9,
          0.000008983055097726239,
          -0.78625201886289,
          96.32687599759846,
          -1.85204757529826,
          -59.36935905485877,
          47.40033549296737,
          -16.50741931063887,
          2.28786674699375,
          10260144.86,
        ],
        [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37],
        [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06],
        [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062, 23.10934304144901, -0.00023663490511, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4],
        [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8, 7.47137025468032, -0.00000353937994, -0.02145144861037, -0.00001234426596, 0.00010322952773, -0.00000323890364, 826088.5],
      ],
      LL2MC: [
        [-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5],
        [0.0008277824516172526, 111320.7020463578, 647795574.6671607, -4082003173.641316, 10774905663.51142, -15171875531.51559, 12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5],
        [0.00337398766765, 111320.7020202162, 4481351.045890365, -23393751.19931662, 79682215.47186455, -115964993.2797253, 97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5],
        [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5],
        [-0.0003441963504368392, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5],
        [-0.0003218135878613132, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45],
      ],
      getDistanceByMC: function (cP, cN) {
        if (!cP || !cN) {
          return 0;
        }
        var cL, cO, T, cM;
        cP = this.convertMC2LL(cP);
        if (!cP) {
          return 0;
        }
        cL = this.toRadians(cP.lng);
        cO = this.toRadians(cP.lat);
        cN = this.convertMC2LL(cN);
        if (!cN) {
          return 0;
        }
        T = this.toRadians(cN.lng);
        cM = this.toRadians(cN.lat);
        return this.getDistance(cL, T, cO, cM);
      },
      getDistanceByLL: function (cP, cN) {
        if (!cP || !cN) {
          return 0;
        }
        cP.lng = this.getLoop(cP.lng, -180, 180);
        cP.lat = this.getRange(cP.lat, -74, 74);
        cN.lng = this.getLoop(cN.lng, -180, 180);
        cN.lat = this.getRange(cN.lat, -74, 74);
        var cL, T, cO, cM;
        cL = this.toRadians(cP.lng);
        cO = this.toRadians(cP.lat);
        T = this.toRadians(cN.lng);
        cM = this.toRadians(cN.lat);
        return this.getDistance(cL, T, cO, cM);
      },
      convertMC2LL: function (cL) {
        var cM, cO;
        cM = new cd(Math.abs(cL.lng), Math.abs(cL.lat));
        for (var cN = 0; cN < this.MCBAND.length; cN++) {
          if (cM.lat >= this.MCBAND[cN]) {
            cO = this.MC2LL[cN];
            break;
          }
        }
        var T = this.convertor(cL, cO);
        var cL = new cd(T.lng.toFixed(6), T.lat.toFixed(6));
        return cL;
      },
      convertLL2MC: function (T) {
        var cL, cN;
        T.lng = this.getLoop(T.lng, -180, 180);
        T.lat = this.getRange(T.lat, -74, 74);
        cL = new cd(T.lng, T.lat);
        for (var cM = 0; cM < this.LLBAND.length; cM++) {
          if (cL.lat >= this.LLBAND[cM]) {
            cN = this.LL2MC[cM];
            break;
          }
        }
        if (!cN) {
          for (var cM = this.LLBAND.length - 1; cM >= 0; cM--) {
            if (cL.lat <= -this.LLBAND[cM]) {
              cN = this.LL2MC[cM];
              break;
            }
          }
        }
        var cO = this.convertor(T, cN);
        var T = new cd(cO.lng.toFixed(2), cO.lat.toFixed(2));
        return T;
      },
      convertor: function (cM, cN) {
        if (!cM || !cN) {
          return;
        }
        var T = cN[0] + cN[1] * Math.abs(cM.lng);
        var cL = Math.abs(cM.lat) / cN[9];
        var cO = cN[2] + cN[3] * cL + cN[4] * cL * cL + cN[5] * cL * cL * cL + cN[6] * cL * cL * cL * cL + cN[7] * cL * cL * cL * cL * cL + cN[8] * cL * cL * cL * cL * cL * cL;
        T *= cM.lng < 0 ? -1 : 1;
        cO *= cM.lat < 0 ? -1 : 1;
        return new cd(T, cO);
      },
      getDistance: function (cL, T, cN, cM) {
        return this.EARTHRADIUS * Math.acos(Math.sin(cN) * Math.sin(cM) + Math.cos(cN) * Math.cos(cM) * Math.cos(T - cL));
      },
      toRadians: function (T) {
        return (Math.PI * T) / 180;
      },
      toDegrees: function (T) {
        return (180 * T) / Math.PI;
      },
      getRange: function (cM, cL, T) {
        if (cL != null) {
          cM = Math.max(cM, cL);
        }
        if (T != null) {
          cM = Math.min(cM, T);
        }
        return cM;
      },
      getLoop: function (cM, cL, T) {
        while (cM > T) {
          cM -= T - cL;
        }
        while (cM < cL) {
          cM += T - cL;
        }
        return cM;
      },
    });
    a8.extend(ba.prototype, {
      lngLatToMercator: function (T) {
        return ba.convertLL2MC(T);
      },
      lngLatToPoint: function (T) {
        var cL = ba.convertLL2MC(T);
        return new bu(cL.lng, cL.lat);
      },
      mercatorToLngLat: function (T) {
        return ba.convertMC2LL(T);
      },
      pointToLngLat: function (T) {
        var cL = new cd(T.x, T.y);
        return ba.convertMC2LL(cL);
      },
      pointToPixel: function (cL, cP, cO, cN, cQ) {
        if (!cL) {
          return;
        }
        cL = this.lngLatToMercator(cL, cQ);
        var cM = this.getZoomUnits(cP);
        var T = Math.round((cL.lng - cO.lng) / cM + cN.width / 2);
        var cR = Math.round((cO.lat - cL.lat) / cM + cN.height / 2);
        return new bu(T, cR);
      },
      pixelToPoint: function (T, cS, cO, cM, cL) {
        if (!T) {
          return;
        }
        var cR = this.getZoomUnits(cS);
        var cP = cO.lng + cR * (T.x - cM.width / 2);
        var cN = cO.lat - cR * (T.y - cM.height / 2);
        var cQ = new cd(cP, cN);
        return this.mercatorToLngLat(cQ, cL);
      },
      getZoomUnits: function (T) {
        return Math.pow(2, 18 - T);
      },
    });

    // function aj(T, cL) {
    //   window.BMap[T] = cL;
    // }

    function b3(T) {
      return typeof T == "string";
    }

    // aj("Point", cd);
    // aj("Pixel", bu);
    // aj("MercatorProjection", ba);

    var projBD09 = new Projection({
      code: "BD:09",
      extent: [-20037726.37, -11708041.66, 20037726.37, 12474104.17],
      units: "m",
      axisOrientation: "neu",
      global: false,
    });
    addProjection(projBD09);
    addCoordinateTransforms(
      "EPSG:3857",
      "BD:09",
      function (coordinate) {
        return mercatortoBd09(coordinate[0], coordinate[1]);
      },
      function (coordinate) {
        return bd09toMercator(coordinate[0], coordinate[1]);
      }
    );

    var bmercResolutions = new Array(19);
    for (var i = 0; i < 19; ++i) {
      bmercResolutions[i] = Math.pow(2, 18 - i);
    }
    let baiduX, baiduY;
    var baidu = new Tile({
      source: new XYZ({
        projection: "EPSG:3857",
        maxZoom: 18,
        tileUrlFunction: function (tileCoord) {
          var x = tileCoord[1];
          var y = tileCoord[2];
          var z = tileCoord[0];
          // 对编号xy处理
          baiduX = x < 0 ? -x : x;
          baiduY = y < 0 ? -y : y;
          return "http://api0.map.bdimg.com/customimage/tile?&x=" + baiduX + "&y=" + baiduY + "&z=" + z + "&udt=20200408&scale=1&p=1&customid=midnight";
        },
        crossOrigin: "anonymous",
        tileGrid: new TileGrid({
          resolutions: bmercResolutions,
          origin: [0, 0],
          tileSize: [256, 256],
        }),
      }),
    });
    ////////////////////////////////////////↑↑↑↑无视此处代码↑↑↑↑//////////////////////////////////////////////////////////
    pageStore.map = new Map({
      target: "kriginMap",
      layers: [baidu],
      view: new View({
        //TODO 页面首次加载所需mapCenter参数根据需求传递
        center: transform(mapCenter, "BD:09", "EPSG:3857"),
        zoom: 18,
        minZoom: 10,
        maxZoom: 18,
        projection: "EPSG:3857",
      }),

      // 显示鼠标位置坐标
      /*controls: defaults().extend([
					new MousePosition({
						coordinateFormat: createStringXY(8), //坐标格式
						projection: 'BD:09',
						target: document.getElementById("map"),
						undefinedHTML: '&nbsp;'
					})
				])*/
    });

    //鼠标移入地图变手
    pageStore.map.on("pointermove", function (e) {
      var pixel = pageStore.map.getEventPixel(e.originalEvent);
      var feature = pageStore.map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      if (feature == undefined) {
        pageStore.map.getTargetElement().style.cursor = "url(/src/assets/images/openhand.cur),auto";
      } else {
        pageStore.map.getTargetElement().style.cursor = "url(/src/assets/images/openhand.cur),auto";
      }
    });
  };

  return useObserver(() => (
    <div className="outer-container">
      <div id="kriginMap" className="kriginMap"></div>
    </div>
  ));
};
