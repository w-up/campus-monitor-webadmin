import React from "react";
import { observable, action } from "mobx";
import { notification, Card } from "antd";
import { AlertItem } from "components/AlertItem";
import { AlarmInfo } from "../../type";
import { store } from "../index";

export class AlertModal {
  alerts: Array<AlarmInfo> = [
    {
      id: "1242360753860657153",
      warnTarget: "测试园区",
      monitorType: "厂界",
      siteName: "厂界1",
      warnName: "设备离线",
      warnLevel: null,
      warnTime: "2020-03-24 16:01:00",
      totalTime: 28724,
      warnPeriod: 1,
      pmValue: null,
      deviceName: "设备-厂界1",
    },
    {
      id: "1242363269398675458",
      warnTarget: "测试园区",
      monitorType: "厂界",
      siteName: "厂界1",
      warnName: "设备离线",
      warnLevel: null,
      warnTime: "2020-03-24 16:11:00",
      totalTime: 28714,
      warnPeriod: 1,
      pmValue: null,
      deviceName: "设备-厂界1",
    },
    {
      id: "1244807470499311621",
      warnTarget: "测试园区",
      monitorType: "厂界",
      siteName: "厂界1",
      warnName: "设备离线",
      warnLevel: null,
      warnTime: "2020-03-27 11:10:00",
      totalTime: 24695,
      warnPeriod: 1,
      pmValue: null,
      deviceName: "设备-厂界1",
    },
  ];
  init() {
    this.showAlert();
  }

  setAlerts(data) {
    this.alerts = data;
    this.showAlert();
  }

  timer = null as any;
  @action.bound
  showAlert() {
    // if (!this.alerts || this.alerts.length == 0) return;
    const noti = notification.info({
      message: "告警",
      duration: 0,
      key: "0",
      description: (
        <div className="text-white overflow-y-auto" style={{ background: "#0d142f", height: "400px" }}>
          {this.alerts.map((i, index) => (
            <AlertItem item={i} key={index}></AlertItem>
          ))}
        </div>
      ),
      placement: "bottomRight",
      onClose: () => {
        store.ws.sendMessage(10);
      },
    });
    console.log(noti);
  }
}
