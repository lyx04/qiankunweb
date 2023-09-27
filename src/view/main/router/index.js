const routes = [
  {
    path: "/index*",
    name: "index",
    meta: {
      requireAuth: true,
    },
    component: (resolve) => require(["../index.vue"], resolve),
  },
  {
    path: "/login",
    name: "login",
    props: {
      home: "/index",
    },
    meta: {
      title: "登录",
      requireAuth: false,
    },
    component: (resolve) =>
      require(["hlcx-qiankun-commonservice/view/login/login.vue"], resolve),
  },
];
// eslint-disable-next-line no-undef
const router = new VueRouter({
  mode: "history",
  base: "qiankun",
  routes,
});
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0); // 跳转后返回顶部
  if (to.meta.title) {
    document.title = "电力能源综合数字平台";
  }
  if (to.matched.some((record) => record.meta.requireAuth)) {
    // 判断该路由是否需要登录权限
    if (sessionStorage.getItem("access_token")) {
      next();
    } else {
      // Message({
      //   message: "登录异常，请重新登录",
      //   type: "error",
      // });
      next({
        path: "/login",
      });
    }
  } else {
  next();
  }
});
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    console.log("进入路由报错拦截", targetPath);
    location.reload();
    // router.replace(targetPath);
  }
});
export default router;
