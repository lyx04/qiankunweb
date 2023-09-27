/* eslint-disable no-undef */
const defaultRoutes = [
  {
    path: "/ringmonitor/videoMonitor/:orgId?/:roomId?",
    name: "videoMonitor",
    meta: {
      title: "视频监控",
      mouseTree: true,
      requireAuth: true,
      perms: ["dynamic:video:list"]
    },
    component: resolve => require(["@/view/videoMonitor"], resolve)
  },
  {
    path: "/monitor/monitoring",
    name: "monitoring",
    meta: {
      title: "实时监控",
      requireAuth: true,
      perms: ["monitor:monitoring:list"]
    },
    component: resolve => require(["@/view/monitoring"], resolve)
  },
  {
    path:
      "/monitor/details/:id/:category/:orgName/:roomName/:name/:orgId/:cabinetsName?",
    name: "detailsMonitor",
    meta: {
      title: "实时监控",
      requireAuth: true,
      perms: ["monitor:monitoring:list"]
    },
    component: resolve => require(["@/view/detailsMonitor"], resolve)
  },
  {
    path: "/monitor/runoverview/:query?",
    name: "runoverview",
    meta: {
      title: "运行概况",
      mouseTree: true,
      requireAuth: true,
      perms: ["monitor:overview:list"]
    },
    component: resolve => require(["@/view/runOverview"], resolve)
  },
  {
    path: "/ringMonitor/ring",
    name: "ring",
    meta: {
      title: "动环监控",
      requireAuth: true,
      perms: ["dynamic:ring:list"]
    },
    component: resolve => require(["@/view/ring"], resolve)
  },
  {
    path: "/monitor/comparisonAnalysis",
    name: "comparisonAnalysis",
    meta: {
      title: "对比分析",
      requireAuth: true,
      mouseTree: true,
      perms: ["monitor:comparisonAnalysis:list"]
    },
    component: resolve => require(["@/view/comparisonAnalysis"], resolve)
  },
  {
    path: "/monitor/wcquery",
    name: "workingCondition",
    meta: {
      title: "工况查询",
      requireAuth: true,
      perms: ["monitor:condition:list"]
    },
    component: resolve => require(["@/view/workingCondition"], resolve)
  },
  {
    path: "/monitor/alarm",
    name: "alarm",
    meta: {
      title: "告警列表",
      requireAuth: true,
      perms: ["monitor:alarm:list"]
    },
    component: resolve => require(["@/view/alarm"], resolve)
  },
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
