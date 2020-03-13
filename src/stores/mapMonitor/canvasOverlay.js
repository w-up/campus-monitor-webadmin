const BMap = window.BMapGL;

let canvas, ctx;
export function CanvasOverlay(canvas, point) {
  this._point = point;
  canvas = canvas;
}
CanvasOverlay.prototype = new BMap.Overlay();
CanvasOverlay.prototype.initialize = function(map) {
  this._map = map;
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  var size = map.getSize();
  console.log(size);
  canvas.width = size.width;
  canvas.height = size.height;
  map.getPanes().mapPane.appendChild(canvas);
  return this.canvas;
};

CanvasOverlay.prototype.draw = function() {
  var map = this._map;
  var size = map.getSize();
  var canvasW = size.width;
  var canvasH = size.height;
  ctx.clearRect(0, 0, canvasW, canvasH);
  // 让画布的原点(0,0)始终位于地图可视范围的左上角
  var bmap_mask = document.getElementsByClassName("BMap_mask")[0];
  var left = bmap_mask.style.left;
  var top = bmap_mask.style.top;
  this.canvas.width = canvasW;
  this.canvas.height = canvasH;
  this.canvas.style.left = left;
  this.canvas.style.top = top;
  var earthLeftPxl = map.pointToPixel(new BMap.Point(-180, 0));
  var earthLeftPxl_x = earthLeftPxl.x;
  var earthCenterPxl = map.pointToPixel(new BMap.Point(0, 0));
  var earthCenterX = earthCenterPxl.x;
  var earthCenterY = earthCenterPxl.y;
  var earthRightPxl = map.pointToPixel(new BMap.Point(180, 0));
  var earthRightPxl_x = earthRightPxl.x;
  // 计算全球宽度（像素），每放大一个级别，宽度扩大两倍
  var earthW = (earthRightPxl.x - earthCenterX) << 1;
  var pxl = map.pointToPixel(this._point);
  ctx.fillStyle = "#00FF00";
  ctx.beginPath();
  ctx.arc(pxl.x, pxl.y, 20, 0, 2 * Math.PI, true);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(pxl.x - earthW, pxl.y, 20, 0, 2 * Math.PI, true);
  ctx.closePath();
  ctx.fill();
};
