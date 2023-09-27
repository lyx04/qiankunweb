<template>
  <el-container class="h-all">
    <el-header height="74px">
      <div class="header-left">
        <router-link to="/index"
          ><div class="header-logo" @click="logoClick">
            电力能源综合数字平台
          </div></router-link
        >
        <head-nav :indexId="indexId"></head-nav>
      </div>
      <div class="header-right">
        <head-user-info></head-user-info>
      </div>
    </el-header>
    <!--内容-->
    <div id="container-index"></div>
  </el-container>
</template>

<script>
import HeadNav from "./components/HeadNav";
import HeadUserInfo from "./components/HeadUserInfo";
import apps from "./util/loadMicroApp";
import { mapState, mapMutations } from "vuex";
export default {
  name: "index",
  components: {
    HeadNav,
    HeadUserInfo,
  },
  data() {
    return {
      indexId: true,
    };
  },
  computed: {
    ...mapState(["drawChange", "jumpbeforFun"]),
  },
  beforeRouteUpdate(to, from, next) {
    if (this.drawChange) {
      this.jumpbeforFun().then(() => {
        this.drawChangeAction(false);
        next();
      });
    }
    // if (to.matched.some((record) => record.meta.requireAuth)) {
    //   // 判断该路由是否需要登录权限
    //   if (sessionStorage.getItem("access_token")) {
    //     next();
    //   } else {
    //     Message({
    //       message: "登录异常，请重新登录",
    //       type: "error",
    //     });
    //     next({
    //       path: "/login",
    //     });
    //   }
    // } else {
    else {
      next();
    }
    // }
  },
  watch: {
    // $route() {
    //   if (this.$route.path == "/index") {
    //     var permissions = JSON.parse(sessionStorage.getItem("permissions"));
    //     var global = permissions.findIndex((item) => {
    //       return item == "overview:global:list";
    //     });
    //     var site = permissions.findIndex((item) => {
    //       return item == "overview:site:list";
    //     });
    //     var superadmin = permissions.findIndex((item) => {
    //       return item == "*:*:*";
    //     });
    //     if (superadmin != -1) {
    //       this.$router.push({
    //         path: "/index/overview/all",
    //       });
    //     } else if (global != -1) {
    //       this.$router.push({
    //         path: "/index/overview/all",
    //       });
    //     } else if (site != -1) {
    //       this.$router.push({
    //         path: "/index/overview/site",
    //       });
    //     } else {
    //       this.$router.push({
    //         path: "/translation",
    //       });
    //     }
    //   }
    // },
  },
  methods: {
    ...mapMutations('common',["drawChangeAction"]),
    logoClick() {
      sessionStorage.removeItem("indexId");
      this.indexId = !this.indexId;
    },
  },
  created() {
    apps();
    // if (this.$route.path == "/index") {
    //   var permissions = JSON.parse(sessionStorage.getItem("permissions"));
    //   var global = permissions.findIndex((item) => {
    //     return item == "overview:global:list";
    //   });
    //   var site = permissions.findIndex((item) => {
    //     return item == "overview:site:list";
    //   });
    //   var superadmin = permissions.findIndex((item) => {
    //     return item == "*:*:*";
    //   });
    //   if (superadmin != -1) {
    //     this.$router.push({
    //       path: "/index/overview/all",
    //     });
    //   } else if (global != -1) {
    //     this.$router.push({
    //       path: "/index/overview/all",
    //     });
    //   } else if (site != -1) {
    //     this.$router.push({
    //       path: "/index/overview/site",
    //     });
    //   } else {
    //     this.$router.push({
    //       path: "/translation",
    //     });
    //   }
    // }
  },
};
</script>

<style scoped lang="scss">
#container-index {
  width: 100%;
  height: 100%;
  > ::v-deep div {
    width: 100%;
    display: flex;
    height: 100%;
  }
}
</style>
