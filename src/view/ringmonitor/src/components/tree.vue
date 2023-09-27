<template>
  <div class="runTree">
    <mouse-tree
      ref="tree"
      @clickNode="nodeClick"
      inputdefaultText="请输入关键字名称检索"
    >
      <template slot="tooltip">
        <p></p>
      </template>
      <template slot="treecustom" slot-scope="{ data }">
        <span :title="data.name" class="custom-tree-node">
          <i :class="data.icon"></i>
          <span>{{ data.name }}</span>
        </span>
      </template>
    </mouse-tree>
  </div>
</template>
<script>
import mouseTree from "hlcx-qiankun-commonservice/components/newCommonOrgTree";
import { GET_DRAW_TREE } from "hlcx-qiankun-commonservice/utils/api/equipment/draw";
import { mapState } from "vuex";

export default {
  components: { mouseTree },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    })
  },
  data() {
    return {
      routreArr: []
    };
  },
  methods: {
    nodeClick(data, node) {
      var flag = true;
      if (node.childNodes.length) {
        flag = false;
      }
      if (data.enterpriseProperty == "01") {
        if (flag) {
          this.gettree(data, node, data.orgId);
        }
        this.routreArr[0] = data.orgId;
        this.routreArr = this.routreArr.slice(0, 1);
      } else {
        this.routreArr[0] = data.orgId;
        this.routreArr = this.routreArr.slice(0, 1);
      }
      if ("jsondata" in data) {
        this.routreArr[1] = data.id;
      }
      this.$router.push({
        params: {
          query: this.routreArr.join("-")
        }
      });
    },
    //获取接线图
    gettree(data, node, orgId) {
      GET_DRAW_TREE({ orgId: orgId }).then(e => {
        var list = e.filter(i => {
          return i.isDraft != 1;
        });
        list.forEach(i => {
          this.$refs.tree.$refs.tree.append(i, node);
        });
        node.expanded = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
