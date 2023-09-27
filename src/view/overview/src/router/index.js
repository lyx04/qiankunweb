/* eslint-disable no-undef */
const defaultRoutes = [
  {
    path: "/all",
    name: "all",
    meta: {
      title: "全局概况",
      requireAuth: true,
      perms: ["overview:global:list"]
    },
    component: (resolve) => require(["@/page/all"], resolve)
  },

  {
    path: "/site/:orgId?",
    name: "site",
    meta: {
      title: "站点概况",
      requireAuth: true,
      perms: ["overview:site:list"]
    },
    component: resolve => require(["@/page/site"], resolve)
  }
];
/**
 * 初始化路由
 * @export initRouter
 * @param {String} routerBase - 路由Base
 * @param {Array} routerList - 统一通过公共包赋值路由，独立运行时，只有401、401、Login，一起运行时，则会有该应用配置的动态路由以及包括独立运行时所拥有的路由
 */
export const initRouter = (routerBase, routerList) => {
  const routes = [...defaultRoutes, ...(routerList || [])];
  const router = new VueRouter({
    mode: "history",
    base: routerBase,
    routes
  });

  // 自定义路由拦截，可以继续这么加
  // router.beforeEach(...)
  // router.afterEach(...)
  return router;
};
