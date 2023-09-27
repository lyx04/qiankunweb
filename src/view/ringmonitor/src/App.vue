<template>
  <div style="width: 100%; height: 100%">
    <el-container>
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
          <el-aside v-if="radioGroupSwitch" width="266px" style="height:100%">
            <template v-if="TreeActive == 'videoMonitor'">
              <video-tree></video-tree>
            </template>
            <template v-if="TreeActive == 'runoverview'">
              <run-tree></run-tree>
            </template>
            <template v-if="TreeActive == 'ringMonitoring'">
              <monit-tree></monit-tree>
            </template>
            <template v-if="TreeActive == 'globalMonitor'">
              <golbalmonitor></golbalmonitor>
            </template>
            <template v-if="TreeActive == 'comparisonAnalysis'">
              <comparison-analysis-tree
                ref="comparisonAnalysis"
                key="comparisonAnalysis"
              ></comparison-analysis-tree>
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
  </div>
</template>

<script>
import runTree from "./components/tree";
import VideoTree from "./components/VideoTree";
import ComparisonAnalysisTree from "./components/ComparisonAnalysisTree";
import Breadcrumb from "hlcx-qiankun-commonservice/components/Breadcrumb";
export default {
  name: "index",
  components: { VideoTree, Breadcrumb ,runTree,ComparisonAnalysisTree},
  data() {
    return {
      radioGroupSwitch: true, // 默认开启
      radioGroupSwitchBtn: true, // 默认关闭树的点击按钮，只有在特定路由才开启
      TreeActive: ""
    };
  },
  methods: {
    // 动态面包屑
    loadTitle() {
      var mouseFlag = this.$route.meta.mouseTree;
      this.radioGroupSwitch = mouseFlag;
      this.radioGroupSwitchBtn = mouseFlag;
      if (this.$route.meta.mouseTree) {
        console.log(this.$route.name);
        this.TreeActive = this.$route.name;
      }
    }
  },
  watch: {
    $route() {
      this.loadTitle();
    }
  },
  mounted() {
    this.loadTitle();
  }
};
</script>

<style>
</style>
