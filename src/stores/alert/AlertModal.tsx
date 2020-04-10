import React from "react";
import { observable, action } from "mobx";
import { notification, Card } from "antd";
import { AlertItem } from "components/AlertItem";
import { AlarmInfo } from "../../type";

export class AlertModal {
  alerts: Array<AlarmInfo> = [
    {
      id: "1245523841726128130",
      warnTarget: "测试园区",
      monitorType: "厂界",
      siteName: "厂界2",
      warnName: "甲苯",
      warnLevel: "中度",
      warnTime: "2020-04-03 11:06:00",
      totalTime: 10689,
      warnPeriod: -1,
      pmValue: "0 ug/m^3",
      deviceName: null,
    },
    {
      id: "1245910639727972354",
      warnTarget: "测试园区",
      monitorType: "厂界",
      siteName: "固定污染源1",
      warnName: "甲苯",
      warnLevel: "中度",
      warnTime: "2020-04-10 21:15:00",
      totalTime: 0,
      warnPeriod: -1,
      pmValue: "0 ug/m^3",
      deviceName: null,
    },
    {
      id: "1245966254718394369",
      warnTarget: "测试园区",
      monitorType: "厂界",
      siteName: "厂界4",
      warnName: "甲苯",
      warnLevel: "中度",
      warnTime: "2020-04-10 21:15:00",
      totalTime: 0,
      warnPeriod: -1,
      pmValue: "0 ug/m^3",
      deviceName: null,
    },
    {
      id: "1245964495576965121",
      warnTarget: "测试园区",
      monitorType: "厂界",
      siteName: "厂界5",
      warnName: "甲苯",
      warnLevel: "中度",
      warnTime: "2020-04-10 21:15:00",
      totalTime: 0,
      warnPeriod: -1,
      pmValue: "0 ug/m^3",
      deviceName: null,
    },
  ];
  init() {
    this.showAlert();
  }

  setAlerts(data) {
    this.alerts = data;
    this.showAlert();
  }

  @action.bound
  showAlert() {
    // if (!this.alerts || this.alerts.length == 0) return;
    notification.info({
      message: "告警",
      duration: 0,
      description: (
        <div className="text-white overflow-y-auto" style={{ background: "#0d142f", height: "400px" }}>
          {this.alerts.map((i) => (
            <AlertItem item={i}></AlertItem>
          ))}
        </div>
      ),
      placement: "bottomRight",
      onClose: () => {
        setTimeout(() => {
          this.showAlert();
        }, 60 * 1000);
      },
    });
  }
}
