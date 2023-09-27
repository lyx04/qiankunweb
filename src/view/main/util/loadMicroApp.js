import qiankundata from "hlcx-qiankun-commonservice/utils/store/qiankunStore";
import { registerMicroApps, start } from "qiankun";

// const isProduction = process.env.NODE_ENV === "production";
export default () => {
  const apps = [
    {
      name: "overview",
      entry: "//localhost:8081/overview/",
      container: "#container-index",
      activeRule: "/qiankun/index/overview",
      props: {
        routerBase: `/qiankun/index/overview/`, // 子应用路由的base
        getGlobalState: qiankundata.getGlobalState, // 提供子应用获取公共数据，最好是统一通过store.getters['common/xx']这样获取
        window: window,
      },
    },
    {
      name: "eqipment",
      entry: "//localhost:81/equipmentParameter/",
      container: "#container-index",
      activeRule: "/qiankun/index/equipmentParameter",
      props: {
        routerBase: `/qiankun/index/equipmentParameter/`, // 子应用路由的base
        getGlobalState: qiankundata.getGlobalState, // 提供子应用获取公共数据，最好是统一通过store.getters['common/xx']这样获取
        window: window,
      },
    },
    {
      name: "ringmonitor",
      entry: "//localhost:8080/all/",
      container: "#container-index",
      activeRule: ["/qiankun/index/all/ringmonitor",'/qiankun/index/all/monitor'],
      props: {
        routerBase: `/qiankun/index/all`, // 子应用路由的base
        getGlobalState: qiankundata.getGlobalState, // 提供子应用获取公共数据，最好是统一通过store.getters['common/xx']这样获取
        window: window,
      },
    },
  ];
  registerMicroApps(apps);
  start({
    prefetch: false,
    sandbox:false
  });
  // apps.map((e) => {
  //   // 本地启动调试，需提前手动在localStorage写入子应用本地地址
  //   // const devUrl = localStorage.getItem(e.path);
  //   return {
  //     ...e,
  //     title: e.name,
  //     name: e.path,
  //     // 本地调试 entry: 'http://localhost:7003/module/micro_A'
  //     // 生产环境 entry: '/module/micro_A'
  //     entry: `${isProduction ? "/" : e.path || e.entry || ""}view/${e.path}`,
  //     activeRule: `/view/${e.path}`,
  //     container: `${container}-${e.path}`,
  //     props: {
  //       routerBase: `/index/${e.path}`, // 子应用路由的base
  //       getGlobalState: qiankundata.getGlobalState, // 提供子应用获取公共数据，最好是统一通过store.getters['common/xx']这样获取
  //       path: e.path.replace(/\//g, ""),
  //     },
  //   };
  // });
};
