import { observable, action } from "mobx";
import WebSocketAsPromised from "websocket-as-promised";
import { globalConfig } from "../config";
import { store } from "./index";

export class WsStore {
  ws: WebSocketAsPromised = new WebSocketAsPromised(globalConfig.wsEndpoint + "/10");
  init() {
    this.ws.open().then(() => {
      console.log("ws connected.");
      store.alert.modal.showAlert();
      this.ws.onMessage.addListener((data) => {
        console.log(data);
      });
    });
  }
  sendMessage(data) {
    this.ws.send(data);
  }
}
