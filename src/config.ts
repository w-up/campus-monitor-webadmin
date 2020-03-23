const query = new URLSearchParams(window.location.search);
const api = query.get("api");

export const globalConfig = {
  apiEndpoint: api ? api : process.env.NODE_ENV == "development" ? "?api=http://69uu2r.natappfree.cc/" : "http://gypark.admin.iisu.cn/api/"
};
