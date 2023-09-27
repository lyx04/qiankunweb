<template>
  <comonMondal @on-closed="monitorSub" :visible="show" customClass="Miniform">
    <template slot="head">
      <span>关联动环监控</span>
    </template>
    <template slot="body">
      <el-form :model="form" :rules="rules" ref="monitor" label-width="130px">
        <el-form-item label="关联动环监控" prop="monitor">
          <el-cascader
            :props="caderprops"
            v-model="form.monitor"
            :options="list"
            :show-all-levels="false"
            ref="cascader"
            :placeholder="placeholder"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
    </template>
    <template slot="foot">
      <el-button @click="monitorSub">关闭</el-button>
    </template>
  </comonMondal>
</template>
<script>
import comonMondal from "hlcx-qiankun-commonservice/components/Modal";
import {
  GET_METER_SELECT,
  GET_INTERVAL_MEASURE
} from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { mapMutations } from "vuex";

export default {
  components: {
    comonMondal
  },
  props: {
    show: Boolean
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      caderprops: {
        lazy: true,
        emitPath: false,
        value: "id",
        label: "name",
        leaf: "identify",
        lazyLoad(node, resolve) {
          console.log(node);
          let { level } = node;
          if (level == 1) {
            GET_INTERVAL_MEASURE(node.data.id, 9, 1).then(e => {
              resolve(e.data);
            });
          }
        }
      },
      parent: this.$parent,
      placeholder: "",
      list: [],
      form: {
        monitor: ""
      },
      rules: {
        monitor: [
          {
            required: true,
            message: "请选择动环监控",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    ...mapMutations('common',["drawChangeAction"]),
    //关闭弹窗
    closed() {
      this.$emit("update:show", false);
    },
    init() {
      GET_METER_SELECT(this.parent.drawInfo.power, 9).then(e => {
        this.list = e.data;
        var cache = this.parent.drawNodeInfoList;
        var activenode = this.parent.props.node;
        if (activenode.id in cache && cache[activenode.id].length > 0) {
          this.form.monitor = cache[activenode.id][0].id;
          this.placeholder = cache[activenode.id][0].name;
        } else {
          this.form.monitor = "";
          this.placeholder = "";
        }
      });
    },
    //动环监控弹框的确认
    monitorSub() {
      var cache = this.parent.drawNodeInfoList;
      var activenode = this.parent.props.node;

      //获取当前选中的节点
      var node = this.$refs.cascader.getCheckedNodes(true)[0];
      if (node && node.level != 1) {
        var nodeData = node.data;
        if ("labels" in nodeData) {
          // 主要是获取间隔id，因为这里不需要回显间隔名称，因此不需要存储equipmentSelectId
          // var parentData = node.parent.data;
          nodeData["drawNodeId"] = activenode.id;
          //   nodeData["equipmentSelectId"] = parentData.id;
          cache[activenode.id] = [nodeData];
          this.drawChangeAction(true);

          this.closed();
        } else {
          this.$message.error("请选择量测量");
        }
      } else if (activenode.id in cache) {
        this.closed();
      } else {
        delete cache[activenode];
        this.closed();
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
