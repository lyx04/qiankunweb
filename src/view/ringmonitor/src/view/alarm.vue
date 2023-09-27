<template>
  <div class="main-content">
    <tabs
      :tabsData="tabsData"
      :tabsActiveId="tabsActiveId"
      @tabs-change="tabsChange"
    ></tabs>
    <untreated-alarm v-if="tabsActiveId == 10"></untreated-alarm>
    <sent-alarm v-else-if="tabsActiveId == 20"></sent-alarm>
    <deal-with-alarm v-else-if="tabsActiveId == 30"></deal-with-alarm>
  </div>
</template>

<script>
import tabs from "hlcx-qiankun-commonservice/components/Tabs";
import UntreatedAlarm from "../components/UntreatedAlarm";
import SentAlarm from "../components/SentAlarm";
import DealWithAlarm from "../components/DealWithAlarm";

export default {
  name: "alarm",
  components: {
    tabs,
    UntreatedAlarm,
    SentAlarm,
    DealWithAlarm
  },
  data() {
    return {
      // tab选中
      tabsActiveId: "10",
      //  tab内容
      tabsData: [
        {
          label: "未处理",
          value: "10",
          perms: "monitor:alarm:list"
        },
        {
          label: "已派单",
          value: "20",
          perms: "monitor:alarm:list"
        },
        {
          label: "已处理",
          value: "30",
          perms: "monitor:alarm:list"
        }
      ]
    };
  },
  methods: {
    //  tab切换
    tabsChange(val) {
      this.tabsActiveId = val;
    }
  }
};
</script>

<style scoped lang="scss">
.main-content {
  margin-top: 25px;
  padding: 0 30px;
}
</style>
