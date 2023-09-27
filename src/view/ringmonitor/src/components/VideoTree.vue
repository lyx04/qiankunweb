<template>
  <div class="tree-aside">
    <common-org-tree
      ref="tree"
      :ischilds="ischilds"
      @clickNode="nodeClick"
      nodeKey="dictCode"
      inputdefaultText="请输入关键字检索"
      :continueBollean="true"
      @treeEnd="treeend"
    >
    </common-org-tree>
  </div>
</template>

<script>
import CommonOrgTree from "hlcx-qiankun-commonservice/components/newCommonOrgTree";
import { mapState } from "vuex";
import { GET_SYSTEM_ORG_LIST } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import { GET_TREE } from "hlcx-qiankun-commonservice/utils/api/equipment/device";

export default {
  name: "VideoTree",
  components: { CommonOrgTree },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    })
  },
  data() {
    return {
      ischilds: true
    };
  },
  methods: {
    //
    async treeend() {
      var router = this.$route;
      if (
        router.params.orgId &&
        router.params.roomId &&
        this.decode(router.params.orgId) &&
        this.decode(router.params.roomId)
      ) {
        var ids = [
          this.decode(router.params.orgId),
          this.decode(router.params.roomId)
        ];
        this.routreArr = ids;
        this.$refs.tree.$refs.tree.getNode(ids[0]).expanded = true;
        await this.gettree(
          this.$refs.tree.$refs.tree.getNode(ids[0]).data,
          this.$refs.tree.$refs.tree.getNode(ids[0]),
          ids[0]
        );
      }
    },
    //节点点击
    nodeClick(data, node) {
      var flag = true;
      if (node.childNodes.length) {
        flag = false;
      }
      if ("enterpriseProperty" in data) {
        this.routreArr = [];
        if (flag) {
          this.gettree(data, node, data.orgId);
        }
        this.routreArr.push(this.encode(String(data.orgId)));
        this.routreArr.splice(1, 1);
      }
      if ("category" in data) {
        this.routreArr[1] = this.encode(String(data.id));
      }
      this.$router.push({
        params: {
          orgId: this.routreArr[0],
          roomId: this.routreArr[1]
        }
      });
    },
    //获取系统企业列表
    getSystemList() {
      GET_SYSTEM_ORG_LIST().then(e => {
        var list = this.jstool.jshandle.getFilterOrgList(e.data);
        this.treeData.forEach(item => {
          var iden = list.filter(i => {
            return i.orgType == item.dictValue;
          });
          item.childs = [];
          iden.forEach(child => {
            this.$set(child, "childs", [{}]);
            item.childs.push(child);
          });
        });
      });
    },
    //点击获取树
    gettree(data, node, id) {
      data.children = [];
      GET_TREE(id).then(e => {
        e.data.forEach(item => {
          this.$refs.tree.$refs.tree.append(item, node);
        });
      });
      node.expanded = true;
    }
  },
  mounted() {
    if (this.$route.params.orgType && this.decode(this.$route.params.orgType)) {
      this.$router.push({
        name: "videoMonitor"
      });
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep.tree-aside {
}
</style>
