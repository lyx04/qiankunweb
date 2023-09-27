<template>
  <comonMondal @on-closed="closed" :visible="show" customClass="Miniform">
    <template slot="head">
      <span>关联开关</span>
    </template>
    <template slot="body">
      <el-form :model="form" :rules="rules" ref="SwitchRef" label-width="120px">
        <el-form-item label="链接到：" prop="link">
          <el-cascader
            :props="caderprops"
            v-model="form.link"
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
      <el-button @click="switchSub">确认</el-button>
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
  components: { comonMondal },
  props: {
    show: Boolean
  },
  data() {
    return {
      parent: this.$parent,
      //开关关联间隔
      placeholder: "",
      list: [],
      form: {
        link: ""
      },
      rules: {
        link: [
          {
            required: true,
            message: "请选择间隔",
            trigger: "blur"
          }
        ]
      },
      caderprops: {
        lazy: true,
        emitPath: false,
        value: "id",
        label: "name",
        leaf: "identify",
        lazyLoad(node, resolve) {
          let { level } = node;
          if (level == 1) {
            GET_METER_SELECT(node.data.id, 14).then(e => {
              resolve(e.data);
            });
          }
          if (level == 2) {
            GET_INTERVAL_MEASURE(node.data.id, 14, 1).then(e => {
              resolve(e.data);
            });
          }
        }
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
      GET_METER_SELECT(this.parent.drawInfo.power, 5).then(e => {
        this.list = e.data;
        var cache = this.parent.drawNodeInfoList;
        var activenode = this.parent.props.node;
        if (activenode.id in cache && cache[activenode.id].length > 0) {
          this.form.link = cache[activenode.id][0].id;
          this.placeholder = cache[activenode.id][0].name;
        } else {
          this.form.link = "";
          this.placeholder = "";
        }
      });
    },
    //开关关联间隔
    switchSub() {
      var cache = this.parent.drawNodeInfoList;
      var activenode = this.parent.props.node;

      //获取当前选中的节点
      var node = this.$refs.cascader.getCheckedNodes(true)[0];
      if (node && node.level > 2) {
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

      // this.drawNodeInfoList[this.props.node.id] =
    }
  }
};
</script>
