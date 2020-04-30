import { observable, action } from "mobx";
import WebSocketAsPromised from "websocket-as-promised";
import { globalConfig } from "../config";
import { store } from "./index";

export class WsStore {
  ws: WebSocketAsPromised | null = null;
  init() {
    // this.ws = new WebSocketAsPromised(globalConfig.wsEndpoint + `${store.auth.user?.id}`);
    this.ws = new WebSocketAsPromised(globalConfig.wsEndpoint + 23);

    this.ws.open().then(() => {
      console.log("ws connected.");
      this.ws?.onMessage.addListener((data) => {
        console.log(data);
        store.alert.modal.setAlerts(JSON.parse(data));
      });
    });
  }
  close() {
    this.ws?.close();
  }
  sendMessage(data) {
    this.ws?.send(data);
  }
}
