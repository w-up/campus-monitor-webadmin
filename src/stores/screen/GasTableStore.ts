import {action, observable} from "mobx";

type GasDischarge = {
  name: String;
  dataName: String;
  num: number;
  maxNum: number;
  point: string;
}

export class GasTableStore {

  @observable pageNum = 0;
  @observable pageSize = 5;
  @observable list: GasDischarge[] = [
    {
      name: "中试车间1",
      dataName: "TVOC",
      num: 441,
      maxNum: 600,
      point: "-"
    },
    {
      name: "中试车间",
      dataName: "H2S",
      num: 1.15,
      maxNum: 200,
      point: "-"
    },
    {
      name: "中试车间",
      dataName: "SO2",
      num: 441,
      maxNum: 600,
      point: "-"
    },
    {
      name: "中试车间",
      dataName: "NH3",
      num: 1.15,
      maxNum: 200,
      point: "-"
    },
    {
      name: "中试车间",
      dataName: "非甲烷总烃",
      num: 441,
      maxNum: 600,
      point: "-"
    },
    {
      name: "中试车间2",
      dataName: "苯乙烯",
      num: 1.15,
      maxNum: 200,
      point: "-"
    },
    {
      name: "CPT车间",
      dataName: "TVOC",
      num: 441,
      maxNum: 600,
      point: "-"
    },
    {
      name: "CPT车间",
      dataName: "H2S",
      num: 1.15,
      maxNum: 200,
      point: "-"
    },
    {
      name: "CPT车间",
      dataName: "SO2",
      num: 441,
      maxNum: 600,
      point: "-"
    },
    {
      name: "CPT车间",
      dataName: "NH3",
      num: 1.15,
      maxNum: 200,
      point: "-"
    }];
  @observable listNum = 0;
  @observable newList: GasDischarge[][] = [
    [{
      name: "中试车间1",
      dataName: "TVOC",
      num: 441,
      maxNum: 600,
      point: "-"
    },
      {
        name: "中试车间",
        dataName: "H2S",
        num: 1.15,
        maxNum: 200,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "SO2",
        num: 441,
        maxNum: 600,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "NH3",
        num: 1.15,
        maxNum: 200,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "非甲烷总烃",
        num: 441,
        maxNum: 600,
        point: "-"
      },{
      name: "中试车间1",
      dataName: "TVOC",
      num: 441,
      maxNum: 600,
      point: "-"
    },
      {
        name: "中试车间",
        dataName: "H2S",
        num: 1.15,
        maxNum: 200,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "SO2",
        num: 441,
        maxNum: 600,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "NH3",
        num: 1.15,
        maxNum: 200,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "非甲烷总烃",
        num: 441,
        maxNum: 600,
        point: "-"
      }],
    [{
      name: "中试车间2",
      dataName: "苯乙烯",
      num: 1.15,
      maxNum: 200,
      point: "-"
    },
      {
        name: "CPT车间",
        dataName: "TVOC",
        num: 441,
        maxNum: 600,
        point: "-"
      },
      {
        name: "CPT车间",
        dataName: "H2S",
        num: 1.15,
        maxNum: 200,
        point: "-"
      },
      {
        name: "CPT车间",
        dataName: "SO2",
        num: 441,
        maxNum: 600,
        point: "-"
      },
      {
        name: "CPT车间",
        dataName: "NH3",
        num: 1.15,
        maxNum: 200,
        point: "-"
      },{
      name: "中试车间1",
      dataName: "TVOC",
      num: 441,
      maxNum: 600,
      point: "-"
    },
      {
        name: "中试车间",
        dataName: "H2S",
        num: 1.15,
        maxNum: 200,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "SO2",
        num: 441,
        maxNum: 600,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "NH3",
        num: 1.15,
        maxNum: 200,
        point: "-"
      },
      {
        name: "中试车间",
        dataName: "非甲烷总烃",
        num: 441,
        maxNum: 600,
        point: "-"
      }]];


  @action.bound
  listInit() {
    this.listNum = this.list.length;
    // let start = 0, len = this.list.length;
    // for(start<len; start+=this.pageSize;){
    //   this.newList.push(this.list.slice(start,start+ this.pageSize));
    // }
    this.listNum = this.newList.length;
    console.log(this.listNum);
  }
}
