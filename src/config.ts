const query = new URLSearchParams(window.location.search);
const api = query.get("api");

export const globalConfig = {
  apiEndpoint: api ? api : process.env.NODE_ENV == "development" ? "http://z69yih.natappfree.cc" : "http://z69yih.natappfree.cc"
  // wsEndpoint: process.env.NODE_ENV == "development": ""
};
