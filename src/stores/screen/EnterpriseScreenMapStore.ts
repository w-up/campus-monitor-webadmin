import { action, observable } from "mobx";
import { ComplexCustomOverlay } from "../../pages/screen/EnterpriseScreen/customOverlay";
//@ts-ignore
const BMapGL = window.BMapGL;

export class EnterpriseScreenMapStore {
  @observable map: any = null;
  @observable center = new BMapGL.Point(116.384405, 39.9001);
  @observable zoom = 20;
  @observable heading = 50.5;
  @observable tilt = 53;
  @observable overlays = [] as any;
  @observable activeFlag = true;
  @observable curIndex = 0;

  playTimer?: any;

  @action.bound
  addpoints(index: number) {
    for (let x in this.overlays) {
      this.map.removeOverlay(this.overlays[x]);
    }
    this.curIndex = index;
    this.overlays = [];
    for (let x in this.lists) {
      const myCompOverlay = new ComplexCustomOverlay(new BMapGL.Point(this.lists[x].position[0], this.lists[x].position[1]), this.lists[x], x, this);
      this.overlays.push(myCompOverlay);
      this.map.addOverlay(myCompOverlay);
    }
  }

  @action.bound
  play() {
    clearInterval(this.playTimer);
    this.playTimer = setInterval(() => {
      this.addpoints(this.curIndex >= this.lists.length - 1 ? 0 : this.curIndex + 1);
    }, 5000);
  }

  lists = [
    {
      class: "dnj",
      text: "东南角",
      update: "15:30:30",
      position: [116.384405, 39.9001],
      children: [
        { name: "非甲烷总经", value: "111ppm", display: "true" },
        { name: "苯乙烯", value: "200ppm", display: "true" },
        { name: "H2S", value: "111ppm", display: "true" },
        { name: "NH3", value: "111ppm", display: "true" },
        { name: "Test", value: "111ppm", display: "true" }
        // {name:"非甲烷总经",value:"111ppm",display:"true"},
        // {name:"苯乙烯",value:"200ppm",display:"true"},
        // {name:"H2S",value:"111ppm",display:"true"},
        // {name:"NH3",value:"111ppm",display:"true"}
      ]
    },
    {
      class: "dbj",
      text: "东北角",
      update: "15:30:30",
      position: [116.384305, 39.9011],
      children: [
        { name: "非甲烷总经", value: "111ppm", display: "true" },
        { name: "苯乙烯", value: "200ppm", display: "true" },
        { name: "H2S", value: "111ppm", display: "true" },
        { name: "NH3", value: "111ppm", display: "true" },
        { name: "Test", value: "111ppm", display: "true" }
        // {name:"非甲烷总经",value:"111ppm",display:"true"},
        // {name:"苯乙烯",value:"200ppm",display:"true"},
        // {name:"H2S",value:"111ppm",display:"true"},
        // {name:"NH3",value:"111ppm",display:"true"}
      ]
    },
    {
      class: "xbj",
      text: "西北角",
      update: "15:30:30",
      position: [116.383805, 39.9005],
      children: [
        { name: "非甲烷总经", value: "111ppm", display: "true" },
        { name: "苯乙烯", value: "200ppm", display: "true" },
        { name: "H2S", value: "111ppm", display: "true" },
        { name: "NH3", value: "111ppm", display: "true" },
        { name: "Test", value: "111ppm", display: "true" }
        // {name:"非甲烷总经",value:"111ppm",display:"true"},
        // {name:"苯乙烯",value:"200ppm",display:"true"},
        // {name:"H2S",value:"111ppm",display:"true"},
        // {name:"NH3",value:"111ppm",display:"true"}
      ]
    },
    {
      class: "xnj",
      text: "西南角",
      update: "15:30:30",
      position: [116.383305, 39.9001],
      children: [
        { name: "非甲烷总经", value: "111ppm", display: "true" },
        { name: "苯乙烯", value: "200ppm", display: "true" },
        { name: "H2S", value: "111ppm", display: "true" },
        { name: "NH3", value: "111ppm", display: "true" },
        { name: "Test", value: "111ppm", display: "true" }
        // {name:"非甲烷总经",value:"111ppm",display:"true"},
        // {name:"苯乙烯",value:"200ppm",display:"true"},
        // {name:"H2S",value:"111ppm",display:"true"},
        // {name:"NH3",value:"111ppm",display:"true"}
      ]
    }
  ];
}
