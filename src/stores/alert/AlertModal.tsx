import React from "react";
import { observable, action } from "mobx";
import { notification, Card } from "antd";
import { AlertItem } from "components/AlertItem";
import { AlarmInfo } from "../../type";
import { store } from "../index";
import { Scrollbars } from "react-custom-scrollbars";

export class AlertModal {
  @observable alerts: Array<AlarmInfo> = [
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

  @observable visible = false;

  init() {
    this.showAlert();
  }

  setAlerts({ messageType, data }: { messageType: string; data: any }) {
    this.alerts = data;
    if (messageType == "1") {
      this.showAlert();
    } else if (messageType == "2") {
      if (!data) {
        notification.close("0");
      }
      if (this.visible) {
        this.showAlert();
      }
    }
  }

  timer = null as any;

  @action.bound
  showAlert() {
    // if (!this.alerts || this.alerts.length == 0) return;
    this.visible = true;
    const noti = notification.info({
      message: "告警",
      duration: 0,
      key: "0",
      description: (
        <div className="scroll-1" style={{ height: "80vh", overflow: "scroll", zIndex: 10000 }}>
          <div className="text-white pr-4" style={{ background: "#0d142f" }}>
            {this.alerts.map((i, index) => (
              <AlertItem item={i} key={index} type="popup"></AlertItem>
            ))}
          </div>
        </div>
      ),
      placement: "bottomRight",
      onClose: () => {
        store.ws.sendMessage(store.auth.user?.id);
        this.visible = false;
      },
    });
    console.log(noti);
  }
}
