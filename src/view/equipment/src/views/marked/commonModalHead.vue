<template>
  <div class="commonModalHead">
    <el-tabs v-if="headType == 'e'" v-model="active" @tab-click="handleClick">
      <!-- 先判断型号类型在判断按钮类型 -->
      <el-tab-pane
        v-for="(item, index) in devType ? distributioStep : tabrender().data"
        :label="item"
        :name="tabrender().flag ? index + 1 : index + 3"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
    <el-steps v-if="headType == 'n'" :active="active" align-center>
      <el-step
        v-for="(item, index) in devType ? distributioStep : monitorStep"
        :key="index"
        :title="item"
      ></el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  /**
   * headType 是修改的头部还是新建的头部
   * n 新建
   * e 修改
   * devType 根据当前选择的所属分类，判断头上有几个菜单
   * true 配电设备
   * false 监控设备
   */
  props: {
    headType: {
      type: String,
      default: "n"
    },
    /**
     * 判断是配电设备还是监控设备
     */
    devType: {
      type: Boolean,
      default: true
    },
    active: Number,
    /**
     * 监控设备中按钮的判断
     * basic 修改基本参数
     * measure 修改测量参数
     * look 查看
     */
    editbasic: String
  },
  methods: {
    handleClick() {
      this.$emit("update:active", this.active);
      this.$emit("tabclick");
    },
    tabrender() {
      switch (this.editbasic) {
        case "look":
          return { data: this.monitorStep, flag: true };
        case "basic":
          return { data: this.distributioStep, flag: true };
        case "measure":
          return { data: this.monitorTab, flag: false };
      }
    }
  },
  data() {
    return {
      tabActive: 1,
      // 配电设备、通讯终端的进度条
      distributioStep: ["基本信息", "设计参数"],
      // 监控设备的进度条
      monitorStep: ["基本信息", "设计参数", "测量参数", "阈值设置"],
      //监控设备修改时候的tab
      monitorTab: ["测量参数", "阈值设置"]
    };
  }
};
</script>
<style lang="scss" scoped>
.el-steps {
  .el-step {
  }
  &.nopadding {
    padding-left: 0;
  }
}
</style>
