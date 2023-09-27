<template>
  <el-container>
    <div style="display: none">{{ refreTree }}</div>
    <div class="container-back"></div>
    <div class="h-container">
      <!--面包屑-->
      <breadcrumb></breadcrumb>
      <div class="h-content">
        <div
          v-if="radioGroupSwitchBtn"
          :class="
            radioGroupSwitch
              ? 'h-radio-group'
              : 'h-radio-group h-radio-group-false'
          "
          @click="radioGroupSwitch = !radioGroupSwitch"
        ></div>
        <el-aside v-show="radioGroupSwitch" width="266px" style="height: 100%">
          <template v-if="TreeActive == 'parameter'">
            <parameTree></parameTree>
          </template>
          <template v-if="TreeActive == 'device'">
            <deviceTree ref="device" key="device"></deviceTree>
          </template>
          <template v-if="TreeActive == 'drawadd'">
            <drawTree ref="draw" key="drawadd"></drawTree>
          </template>
        </el-aside>
        <el-main
          :style="
            radioGroupSwitch
              ? 'height:100%;width: calc(100% - 266px);left:266px;'
              : 'height:100%;width: 100%;left:0;'
          "
        >
          <router-view />
        </el-main>
      </div>
    </div>
  </el-container>
</template>
<script>
import deviceTree from "./device/tree";
import { mapMutations } from "vuex";
import drawTree from "./draw/tree";
import Breadcrumb from "hlcx-qiankun-commonservice/components/Breadcrumb";

export default {
  components: { drawTree, deviceTree, Breadcrumb },
  name: "index",
  data() {
    return {
      radioGroupSwitch: true, // 默认开启
      radioGroupSwitchBtn: true, // 默认关闭树的点击按钮，只有在特定路由才开启
      TreeActive: "",
    };
  },
  computed: {
    refreTree() {
      switch (this.TreeActive) {
        case "device":
          if (this.$refs.device) {
            // 当vuex里面数据变更之后刷新树节点
            if (!this.$store.state.common.deviceTreeUpdata) {
              return "";
            } else {
              this.$refs.device.refreshTree();
            }
          }
          break;
        case "drawadd":
          if (this.$refs.draw) {
            // 当vuex里面数据变更之后刷新树节点
            if (!this.$store.state.common.deviceTreeUpdata) {
              return "";
            } else {
              this.$refs.draw.refreshTree();
            }
          }
          break;
      }
      return this.$store.state.common.deviceTreeUpdata;
    },
  },
  mounted() {
    this.drawChangeAction(false);
    this.loadTitle();
  },
  watch: {
    $route() {
      this.loadTitle();
    },
    radioGroupSwitch() {
      this.drawAction(this.radioGroupSwitch);
    },
  },
  methods: {
    ...mapMutations('common',["drawAction", "drawChangeAction"]),

    // 动态面包屑+是否有左侧树形结构
    loadTitle() {
      var mouseFlag = this.$route.meta.mouseTree;
      this.radioGroupSwitch = mouseFlag;
      this.radioGroupSwitchBtn = mouseFlag;
      if (this.$route.meta.mouseTree) {
        this.TreeActive = this.$route.name;
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
