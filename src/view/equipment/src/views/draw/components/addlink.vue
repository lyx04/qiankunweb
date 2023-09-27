<template>
  <comonMondal @on-closed="closed" :visible="show" customClass="Miniform">
    <template slot="head">
      <span>链接到接线图</span>
    </template>
    <template slot="body">
      <el-form :model="linkForm" ref="ruleForm" label-width="120px">
        <el-form-item label="链接到：" prop="link">
          <el-select v-model="linkForm.link">
            <el-option
              v-for="item in linkList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template slot="foot">
      <el-button @click="linkSub">关闭</el-button>
    </template>
  </comonMondal>
</template>
<script>
import comonMondal from "hlcx-qiankun-commonservice/components/Modal";
// eslint-disable-next-line no-unused-vars
import { GET_DRAW_TREE } from "hlcx-qiankun-commonservice/utils/api/equipment/draw";
import { mapMutations } from "vuex";

export default {
  components: { comonMondal },
  props: {
    show: Boolean
  },
  data() {
    return {
      linkForm: {
        link: ""
      },
      parent: this.$parent,
      linkList: []
    };
  },
  methods: {
    ...mapMutations('common',["drawChangeAction"]),
    init() {
      GET_DRAW_TREE({ orgId: this.parent.drawInfo.orgId }).then(e => {
        this.linkForm.link = this.parent.props.node.data
          ? this.parent.props.node.data.customLink
          : "";
        var nomycdlist = e.filter(i => {
          return i.id != this.parent.parId;
        });
        if (nomycdlist.length) {
          this.linkList = nomycdlist;
        }
      });
    },
    //关闭弹窗
    closed() {
      this.$emit("update:show", false);
    },
    //链接到接线图
    linkSub() {
      //被操作的节点，存储关于设备的信息，用于点击设备的时候取对应的数据
      this.parent.props.node.data = {
        customLink: this.linkForm.link
      };
      this.drawChangeAction(true);

      this.closed();
    }
  }
};
</script>
