<template>
  <div>
    <orgTree
      ref="tree"
      @clickNode="nodeClick"
      inputdefaultText="请输入关键字检索"
      @treeEnd="treeend"
      :isSelectSwitch="false"
    >
    </orgTree>
  </div>
</template>
<script>
// 变压器 4
// 屏柜 5
// 底层设备 6
// 表计 8
// 动环监控 9
// 通讯终端 11
// 配电室 13
// 间隔 14
// 视频 32
import orgTree from "hlcx-qiankun-commonservice/components/newCommonOrgTree";
import { mapState,mapMutations } from "vuex";
import * as deviceServe from "hlcx-qiankun-commonservice/utils/api/equipment/device";
export default {
  components: { orgTree },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    }),
  },
  data() {
    return {
      watchDictNum: 0,
      treeActive: {},
      treeActiveLabel: "",
      //企业列表
      systemList: "",
      //路由层级
      routreArr: [],
      menuVisible: false,
    };
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus"]),

    async treeend() {
      var router = this.$route;
      if (router.params.query) {
        var ids = this.decode(router.params.query).split("-");
        this.routreArr = ids;
        this.$refs.tree.$refs.tree.getNode(ids[0]).expanded = true;
        var activeNode = this.$refs.tree.$refs.tree.getNode(ids[0]);
        await this.initTree(this.$refs.tree.$refs.tree.getNode(ids[0]), ids[0]);
        for (let i = 1; i < ids.length; i++) {
          if (ids[i] == "") continue;
          var actionNode = activeNode.childNodes.filter((nodeitem) => {
            return nodeitem.data.id == ids[i];
          });
          if (actionNode.length) {
            activeNode = actionNode[0];
            await this.initTree(activeNode);
          }
          //企业获取配电室/配电室获取屏柜/屏柜获取间隔/间隔获取用电设备
        }
      }
    },
    //初始化获取树
    initTree(node, orgId) {
      var paramsId;
      if (orgId != undefined) {
        paramsId = orgId;
      } else {
        paramsId = node.data.id;
      }
      node.data.children = [];
      node.childNodes = [];
      return new Promise((resolve) => {
        deviceServe.GET_TREE(paramsId).then((e) => {
          e.data.forEach((i) => {
            this.$refs.tree.$refs.tree.append(i, node);
          });
          node.expanded = true;

          resolve();
        });
      });
    },
    //点击获取树
    gettree(node, id) {
      node.data.children = [];

      deviceServe.GET_TREE(id).then((e) => {
        e.data.forEach((i) => {
          this.$refs.tree.$refs.tree.append(i, node);
        });
        node.expanded = true;

        // var sibling = node.parent.childNodes;
        // sibling.forEach(i => {
        //   i.expanded = false;
        // });
        // node.expanded = true;
      });
    },
    //节点点击
    nodeClick(data, node) {
      if (data.enterpriseProperty != "01" && "enterpriseProperty" in data) {
        return false;
      }
      // if (node.childNodes.length) {
      //   node.childNodes.forEach(i => {
      //     i.expanded = false;
      //   });
      // }
      var flag = true;
      if (node.childNodes.length) {
        flag = false;
      }
      /**
       * 企业enterpriseProperty==01-配电室及以下category
       */
      if (data.enterpriseProperty == "01") {
        if (flag) {
          this.gettree(node, data.orgId);
        }
        this.routreArr[0] = data.orgId;
        this.routreArr = this.routreArr.slice(0, 1);
      }

      if ("category" in data) {
        sessionStorage.removeItem("category");
        switch (data.category) {
          //配电室
          case 13:
            if (flag) {
              this.gettree(node, data.id);
            }
            this.routreArr[1] = data.id;
            this.routreArr = this.routreArr.slice(0, 2);
            break;
          //屏柜
          case 5:
            if (flag) {
              this.gettree(node, data.id);
            }
            this.routreArr[2] = data.id;
            this.routreArr = this.routreArr.slice(0, 3);
            break;
          //变压器
          case 4:
            if (flag) {
              this.gettree(node, data.id);
            }
            sessionStorage.setItem("category", data.category);
            this.routreArr[2] = data.id;
            this.routreArr = this.routreArr.slice(0, 3);
            break;
          //动环监控
          case 9:
            if (flag && data.euqiptreeId == 9) {
              this.gettree(node, data.id);
            }
            if (data.name == "动环监控" && data.euqiptreeId == 9) {
              this.routreArr[2] = data.id;
              this.routreArr = this.routreArr.slice(0, 3);
            } else {
              this.routreArr[3] = "";
              this.routreArr[4] = data.id;
              this.routreArr = this.routreArr.slice(0, 5);
            }
            sessionStorage.setItem("category", data.category);

            break;
          //通讯终端
          case 11:
            if (flag) {
              this.gettree(node, data.id);
            }

            this.routreArr[4] = data.id;
            this.routreArr[2] = null;
            this.routreArr[3] = null;
            this.routreArr = this.routreArr.slice(0, 5);
            break;
          //视频
          case 32:
            this.routreArr[4] = data.id;
            this.routreArr[2] = null;
            this.routreArr[3] = null;
            this.routreArr = this.routreArr.slice(0, 5);
            break;
          //间隔
          case 14:
            if (flag) {
              this.gettree(node, data.id);
            }
            this.routreArr[3] = data.id;
            this.routreArr = this.routreArr.slice(0, 4);
            break;
          //底层设备
          case 6:
            this.routreArr[4] = data.id;
            this.routreArr = this.routreArr.slice(0, 5);
            break;
          //表计
          case 8:
            this.routreArr[4] = data.id;
            this.routreArr = this.routreArr.slice(0, 5);
            break;
        }
      }
      this.$router.push({
        params: {
          action: "add",
          query: this.encode(this.routreArr.join("-")),
        },
      });
    },
    async refreshTree() {
      console.log("命你刷新树节点device");
      var ids = this.decode(this.$route.params.query).split("-");
      this.$refs.tree.$refs.tree.getNode(ids[0]).expanded = true;
      var activeNode = this.$refs.tree.$refs.tree.getNode(ids[0]);
      await this.initTree(this.$refs.tree.$refs.tree.getNode(ids[0]), ids[0]);
      for (let i = 1; i < ids.length; i++) {
        if (ids[i] == "") continue;
        var actionNode = activeNode.childNodes.filter((nodeitem) => {
          return nodeitem.data.id == ids[i];
        });
        if (actionNode.length) {
          activeNode = actionNode[0];
        }
        await this.initTree(activeNode);
      }
      this.deviceTreeStatus(false);
    },
  },
};
</script>
<style lang="scss" scoped></style>
