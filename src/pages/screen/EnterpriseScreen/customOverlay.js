import icon from "../../../assets/img/ps9584563327b54298-eddd-40c8-a935-e5af0eec008d.png";
import iconActive from "../../../assets/img/psfe3cfd750f8cc8dc-7879-4416-9832-a398f85a77b1.png";
import { utils } from "utils";

const BMapGL = window.BMapGL;

//覆盖物类 加入 obj 站点信息
export function ComplexCustomOverlay(point, obj, index, store) {
  this._point = point;
  this._obj = obj;
  this._index = index;
  this._store = store;
}

ComplexCustomOverlay.prototype = new BMapGL.Overlay();
ComplexCustomOverlay.prototype.initialize = function(map) {
  let _index = this._index;
  const index = this._store.curSiteIndex;
  const isActive = _index == index;

  this._map = map;
  var div = document.createElement("div");
  div.style.display = "inline-block";
  let cells = `<div style='width:250px;'>
  <div style='display:inline-block'>
      <div style='width:40px;height:15px;background:${isActive ? "rgba(5,100,230,1)" : "#5A6C77"};border:1px solid rgba(4,249,204,1);color:white;border-radius:2px;'>${this._obj.text}</div>
      <img style='width:40px;height:55px;' src='${isActive ? icon : iconActive}'/>
  </div>
  <div style='display:inline-block;border:1px solid rgba(4,108,249,1);border-radius:4px;' >
      <div style='font-size:12px;display:flex;background-color:${isActive ? "rgba(4,108,249,1)" : "#2C5081"};color:white;'>
          <div style='padding:5px 0px;margin-left:15px;width:70px;'>更新时间</div>
      </div>
  <div style='overflow-y: auto;overflow-x: hidden;height:104px;background-color:${isActive ? "#1D4476" : "#5B666C"};' class='cell-area'>
  `;
  for (let x of this._obj.children) {
    cells =
      cells +
      `<div style='font-size:12px;display:flex;opacity:0.9;color:white;'>
                            <div style='padding:5px 0px;margin-left:15px;width:70px;'>${x.name}</div>
                            <div style='padding:5px 0px;'>${utils.number.toPrecision(x.value)} ${x.unit}</div>
                        </div>`;
  }
  cells = cells + `</div></div></div>`;
  div.innerHTML = cells;

  div.onmouseover = () => {
    if (!this._store.activeFlag) return;
    this._store.activeFlag = false; // 轮播标识 关闭
    this._store.addpoints({ index: _index }); //鼠标悬浮是 重新渲染
    // }
  };
  div.onmouseout = () => {
    this._store.activeFlag = true; //鼠标离开 轮播标识 打开
  };
  div.style.fontSize = "12px";
  div.style.position = "absolute";
  div.style.zIndex = 100;
  this._store.map.getPanes().labelPane.appendChild(div);
  this._div = div;
  return div;
};
//重写渲染
ComplexCustomOverlay.prototype.draw = function() {
  var map = this._map;
  var pixel = map.pointToOverlayPixel(this._point);
  this._div.style.position = "absolute";
  this._div.style.left = pixel.x + "px";
  this._div.style.top = pixel.y + "px";
};
