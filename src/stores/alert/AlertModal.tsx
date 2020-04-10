import React from "react";
import { observable, action } from "mobx";
import { notification, Card } from "antd";
import { AlertItem } from "components/AlertItem";
import { AlarmInfo } from "../../type";
import { store } from "../index";

export class AlertModal {
  alerts: Array<AlarmInfo> = [];
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
