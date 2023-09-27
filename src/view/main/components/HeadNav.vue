<template>
  <div class="nav-menu">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      text-color="#ffffff"
      active-text-color="#ffffff"
      @select="handleSelect"
    >
      <!-- 引入组件 -->
      <menu-tree :navMenu="navMenu"></menu-tree>
    </el-menu>
  </div>
</template>

<script>
// import * as ConstVal from "../config/navMenu";
import MenuTree from "./MenuTree";
// import { GET_MENU_LIST } from "@/toolKit/api/system/menu";
import { mapState  } from "vuex";

export default {
  name: "HeadNav",
  components: {
    MenuTree,
  },
  computed: {
    ...mapState({
      headerList:state=>state.common.headerList
    }),
    navMenu: function () {
      if (
        sessionStorage.getItem("navMenu") &&
        JSON.parse(sessionStorage.getItem("navMenu")).length > 0
      ) {
        return JSON.parse(sessionStorage.getItem("navMenu"));
      } else {
        return this.headerList;
      }
    },
  },
  props: {
    indexId: {
      type: String,
    },
  },
  data() {
    return {
      // navMenu: JSON.parse(sessionStorage.getItem("navMenu")), // 导航
      activeIndex: "1", // 导航选择id
      orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
      isTop: JSON.parse(sessionStorage.getItem("userInfo")).isTop,
    };
  },
  watch: {
    indexId() {
      this.activeIndex = null;
    },
  },
  methods: {
    handleSelect(key, indexId) {
      console.log(key, indexId);
      this.activeIndex = key;
      sessionStorage.setItem("indexId", JSON.stringify(indexId));
      this.$store.commit( 'common/indexIdStatus',JSON.parse(sessionStorage.getItem("indexId"))
      );
      //大屏
      if (this.rescursion(this.navMenu, key).component == "new") {
        let newUrl = this.$router.resolve({
          path: this.rescursion(this.navMenu, key).path,
        });
        window.open(newUrl.href, "_blank");
      } else if (this.rescursion(this.navMenu, key).isFrame == "0") {
        window.open(this.rescursion(this.navMenu, key).path, "_blank");
      } else {
        this.$router.push({
          path: this.rescursion(this.navMenu, key).path,
        });
      }
    },
    // 过滤查找当前树结构对象
    rescursion(data, id) {
      let result;
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.menuId == id) {
          result = item;
          break;
        } else if (item.children && item.children.length > 0) {
          result = this.rescursion(item.children, id);
          if (result) return result;
        }
      }
      return result;
    },
  },
  beforeMount() {
    this.$store.commit( 'common/indexIdStatus',JSON.parse(sessionStorage.getItem("indexId")))
  },
  created() {
    this.activeIndex =
      JSON.parse(sessionStorage.getItem("indexId")) &&
      JSON.parse(sessionStorage.getItem("indexId")).length > 0
        ? JSON.parse(sessionStorage.getItem("indexId"))[
            JSON.parse(sessionStorage.getItem("indexId")).length - 1
          ]
        : null;
  },
};
</script>

<style scoped lang="scss">
.nav-menu {
  margin-top: 2px;
  margin-left: 33px;
  ::v-deep .el-menu {
    background-color: transparent;
    border: none;
    /* 水平样式 */
    &.el-menu--horizontal > div > .el-submenu {
      float: left;
    }
    /* 一级菜单的样式 */
    &.el-menu--horizontal > div > .el-menu-item {
      float: left;
      height: 29px;
      line-height: 26px;
    }
    /* 解决下图1 下拉三角图标 */
    &.el-menu--horizontal > div > .el-submenu .el-submenu__icon-arrow {
      display: none;
    }
    /* 解决下图2 无下拉菜单时 不对齐问题 */
    &.el-menu--horizontal > div > .el-submenu .el-submenu__title {
      height: 29px;
      line-height: 26px;
    }
    .el-menu--horizontal {
      border: none !important;
    }
    .el-menu-item {
      padding: 0;
      width: 102px;
      text-align: center;
      height: 29px;
      line-height: 27px;
      border: none !important;
      &.is-active {
        border: none;
        background-image: url("../assets/img/common/tab_active.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .el-submenu {
      .el-submenu__title {
        padding: 0;
        /*width: 102px;*/
        text-align: center;
        height: 29px;
        line-height: 27px;
        background-color: transparent;
        border: none !important;
        padding: 0 23px;
      }
      &.is-active {
        border: none;
        background-image: url("../assets/img/common/tab_active.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .el-menu-item:not(.is-disabled):focus,
    .el-menu-item:not(.is-disabled):hover,
    .el-submenu > .el-submenu__title:hover {
      background-image: url("../assets/img/common/tab_active.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-color: transparent;
      border: none !important;
    }
    [class*=" el-icon-"],
    [class^="el-icon-"] {
      //删除了导航菜单上的小箭头
      display: none !important;
    }
    .el-menu-item {
      background-color: transparent;
    }
    .submenu-item {
      .el-menu--horizontal {
        ul {
          position: relative;
          min-width: 102px;
          box-shadow: none;
          background-image: url("../assets/img/common/Rectangle.png");
          background-size: 100% 100%;
          li {
            min-width: 102px;
            padding: 0 20px;
            text-align: center;
            width: auto;
            &:hover,
            &.is-active {
              background: transparent;
              background-image: url("../assets/img/common/menu_active.png");
              background-repeat: no-repeat;
              background-size: auto;
            }
          }
          &:before {
            position: relative;
            top: 0;
            left: 0;
            right: 0;
            margin: -14px auto 0;
            content: "\e78f";
            font-family: element-icons !important;
            color: #79caf1;
          }
        }
      }
      &.submenu-children-item {
        .el-submenu__title {
          position: relative;
        }
        [class*=" el-icon-"],
        [class^="el-icon-"] {
          //删除了导航菜单上的小箭头
          display: inline-block !important;
          color: #ffffff;
          position: absolute;
          right: 0;
          top: 10px;
          margin-left: 0;
          margin-top: 0;
        }
        .el-menu {
          &:before {
            display: none;
          }
        }
      }
    }
  }
}
</style>
