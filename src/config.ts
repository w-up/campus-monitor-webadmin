const query = new URLSearchParams(window.location.search);
const api = query.get("api");

export const globalConfig = {
  // apiEndpoint: api ? api : process.env.NODE_ENV == "development" ? "http://39.100.203.1:8898" : "http://39.100.203.1:8898",
  apiEndpoint: api ? api : process.env.NODE_ENV == "development" ? "http://47.101.175.184:8898" : "http://47.101.175.184:8898",
  // wsEndpoint: process.env.NODE_ENV == "development" ? "ws://39.100.203.1:8898/webSocketServer/" : "ws://39.100.203.1:8898/webSocketServer/",
  wsEndpoint: process.env.NODE_ENV == "development" ? "ws://47.101.175.184:8898/webSocketServer/" : "ws://47.101.175.184:8898/webSocketServer/",
};
