import {observable} from "mobx";

type SewageDisposal = {
  name: String;
  thing: String;
  num: String;
  unnormal: string;
  bigger: string;
}

export class SewageTableStore {

  @observable list: SewageDisposal[][] = [
    [
      {
        name: "环保站污水厂",
        thing: "COD",
        num: '24mg/L',
        unnormal: "100",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "氨氮",
        num: '5.07mg/L',
        unnormal: "100",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "PH",
        num: '7.5',
        unnormal: "-",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "流量",
        num: '1.15L',
        unnormal: "-",
        bigger:'-'
      }
    ], [
      {
        name: "环保站污水厂",
        thing: "COD",
        num: '24mg/L',
        unnormal: "100",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "氨氮",
        num: '5.07mg/L',
        unnormal: "100",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "PH",
        num: '7.5',
        unnormal: "-",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "流量",
        num: '1.15L',
        unnormal: "-",
        bigger:'-'
      }
    ],[
      {
        name: "环保站污水厂333",
        thing: "COD",
        num: '24mg/L',
        unnormal: "100",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "氨氮",
        num: '5.07mg/L',
        unnormal: "100",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "PH",
        num: '7.5',
        unnormal: "-",
        bigger:'-'
      },
      {
        name: "环保站污水厂",
        thing: "流量",
        num: '1.15L',
        unnormal: "-",
        bigger:'-'
      }
    ]];
}
