const query = new URLSearchParams(window.location.search);
const api = query.get("api");

export const globalConfig = {
  apiEndpoint: api ? api : process.env.NODE_ENV == "development" ? "http://2ejnkz.natappfree.cc/" : "http://2ejnkz.natappfree.cc/"
};
