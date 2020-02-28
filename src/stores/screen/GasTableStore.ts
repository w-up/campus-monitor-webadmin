import {action, observable} from "mobx";

export class GasTableStore {
  @observable columns = [
    {
      title: '站点名称',
      dataIndex: 'name',
    },
    {
      title: '检测物质',
      dataIndex: 'dataName',
    },
    {
      title: '监测数据',
      dataIndex: 'num',
    },
    {
      title: '限值',
      dataIndex: 'maxNum'
    },
    {
      title: "超标率(%)",
      dataIndex: "point"
    }];

  @observable list = [
    {
      name: "中试车间",
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
      name: "中试车间",
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
}
