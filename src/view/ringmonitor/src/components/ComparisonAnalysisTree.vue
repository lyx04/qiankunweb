<template>
  <div class="tree-aside">
    <common-org-tree
      ref="tree"
      :isAccordion="false"
      :ischilds="ischilds"
      @clickNode="nodeClick"
      nodeKey="dictCode"
      inputdefaultText="请输入关键字检索"
      :continueBollean="true"
      :isSelectSwitch="false"
    >
    </common-org-tree>
  </div>
</template>

<script>
import CommonOrgTree from "hlcx-qiankun-commonservice/components/newCommonOrgTree";
import { mapState } from "vuex";
import { GET_SYSTEM_ORG_LIST } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import { GET_TREE } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { GET_INTERVAL_ELE_ID } from "hlcx-qiankun-commonservice/utils/api/ringMonitor/index";

export default {
  name: "monitTree",
  components: { CommonOrgTree },
  computed: {
    ...mapState({
      dict:state=>state.common.dict,
      comparisonAnalysisNode:"comparisonAnalysisNode",
      analysisRequest:"analysisRequest",
      analysisNodeObj:"analysisNodeObj"
    })
  },
  watch: {
    comparisonAnalysisNode(val) {
      if (val.length == 0) {
        this.paramsArr = [];
      }
    },
    analysisRequest: {
      handler: function(val) {
        this.request.cycle = val.cycle;
        if (val.cycle == 1) {
          this.request.date = val.day;
        } else if (val.cycle == 2) {
          this.request.date = val.month;
        } else if (val.cycle == 3) {
          this.request.date = val.year;
        }
        this.routreArrs.cycle = this.request.cycle;
        this.routreArrs.date = this.request.date;
        this.$store.commit(
          "analysisNodeObjStatus",
          JSON.parse(JSON.stringify(this.routreArrs))
        );
      },
      deep: true
    }
  },
  data() {
    return {
      ischilds: true,
      paramsArr: [],
      meterList: [], // 间隔和变压器数据
      routreArrs: {
        orgId: "",
        roomId: "",
        id: "",
        name: "",
        sn: "",
        dev: "",
        euqiptreeId: "",
        date: "",
        cycle: ""
      },
      request: {
        cycle: "1",
        date: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd")
      }
    };
  },
  methods: {
    //节点点击
    nodeClick(data, node) {
      var flag = true;
      if (node.childNodes.length) {
        flag = false;
      }
      if ("enterpriseProperty" in data) {
        if (flag) {
          this.gettree(data, node, data.orgId);
        }
        // 组织id
        this.routreArrs.roomId = "";
        this.routreArrs.id = "";
        this.routreArrs.name = "";
        this.routreArrs.sn = "";
        this.routreArrs.dev = "";
        this.routreArrs.euqiptreeId = "";
        this.routreArrs.orgId = data.orgId;
      }
      if (data.euqiptreeId == 13) {
        if (flag) {
          this.meterList = [];
          //  获取间隔和变压器
          this.getIntervalList(data, node, data.id);
        }
        this.routreArrs.id = "";
        this.routreArrs.name = "";
        this.routreArrs.sn = "";
        this.routreArrs.dev = "";
        this.routreArrs.euqiptreeId = "";
        // 配电室id
        this.routreArrs.roomId = data.id;
        this.routreArrs.euqiptreeId = data.euqiptreeId;
        this.$store.commit(
          "analysisNodeObjStatus",
          JSON.parse(JSON.stringify(this.routreArrs))
        );
      }
      if (data.euqiptreeId == 14 || data.euqiptreeId == 4) {
        this.routreArrs.id = "";
        this.routreArrs.name = "";
        this.routreArrs.sn = "";
        this.routreArrs.dev = "";
        this.routreArrs.euqiptreeId = "";
        this.routreArrs.id = String(data.id);
        this.routreArrs.name = data.name;
        this.routreArrs.sn = data.sn;
        this.routreArrs.dev = data.dev;
        this.routreArrs.euqiptreeId = data.euqiptreeId;
        this.routreArrs.cycle = this.request.cycle;
        this.routreArrs.date = this.request.date;
        if (this.paramsArr.length == 0) {
          this.paramsArr.push(JSON.parse(JSON.stringify(this.routreArrs)));
          this.$store.commit("comparisonAnalysisNodeStatus", this.paramsArr);
        } else {
          this.$store.commit(
            "analysisNodeObjStatus",
            JSON.parse(JSON.stringify(this.routreArrs))
          );
        }
      }
    },
    //获取系统企业列表
    getSystemList() {
      GET_SYSTEM_ORG_LIST().then(e => {
        var list = this.getFilterOrgList(e.data);
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
        node.expanded = true;
      });
    },
    //  获取间隔和变压器
    getIntervalList(data, node, id) {
      var params = {
        categorys: "4,14",
        eleId: id,
        measures: "P"
      };
      GET_INTERVAL_ELE_ID(params).then(res => {
        res.data.forEach(i => {
          this.$refs.tree.$refs.tree.append(i, node);
        });
        node.expanded = true;
      });
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep.tree-aside {
}
</style>
