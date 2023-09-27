/* eslint-disable no-undef */
const defaultRoutes = [
  {
    path: `/`,
    name: "equipmentParameter",
    meta: {
      title: "设备台账",
    },
    component: (resolve) => require(["@/views/index"], resolve),
    children: [
      {
        path: "marking",
        name: "marking",
        meta: {
          title: "型号管理",
          mouseTree: false,
          requireAuth: true,
          perms: ["ema:eptment:list"],
        },
        component: (resolve) => require(["@/views/marked/index"], resolve),
      },
      {
        path: "device/:action?/:query?",
        name: "device",
        meta: {
          title: "设备管理",
          mouseTree: true,
          requireAuth: true,
          perms: ["ema:room:tree"],
        },
        component: (resolve) => require(["@/views/device/index"], resolve),
      },
      {
        path: "drawadd/:params?",
        name: "drawadd",
        meta: {
          title: "接线图管理",
          mouseTree: true,
          requireAuth: true,
          perms: ["ema:cd:list"],
        },
        component: (resolve) => require(["@/views/draw/drawAdd"], resolve),
      },
    ],
  },
];
/**
 * 初始化路由
 * @export initRouter
 * @param {String} routerBase - 路由Base
 * @param {Array} routerList - 统一通过公共包赋值路由，独立运行时，只有401、401、Login，一起运行时，则会有该应用配置的动态路由以及包 括独立运行时所拥有的路由
 */
export const initRouter = (routerBase , routerList) => {
  const routes = [...defaultRoutes, ...(routerList || [])];
  const router = new VueRouter({
    mode: "history",
    base: routerBase,
    routes,
  });

  // 自定义路由拦截，可以继续这么加
  // router.beforeEach(...)
  // router.afterEach(...)
  return router;
};
