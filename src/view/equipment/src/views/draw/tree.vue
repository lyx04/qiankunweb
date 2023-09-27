<template>
  <div>
    <mouseTree
      ref="tree"
      @clickNode="nodeClick"
      inputdefaultText="请输入关键字检索"
      @rihgtClick="rihgtClick"
      :isSelectSwitch="false"
    >
      <template slot="tooltip">
        <p>提示：右键可对接线图管理</p>
      </template>
      <template slot="treecustom" slot-scope="{ data }">
        <span :title="data.name" class="custom-tree-node">
          <template v-if="data.isEdit">
            <el-input
              maxlength="20"
              v-model="data.name"
              :ref="'slotTreeInput' + data.name"
              autofocus
              placeholder="请输入内容"
              @blur.stop="NodeBlur"
              @keyup.enter.native="NodeBlur"
            ></el-input>
          </template>
          <template v-else>
            <i :class="data.icon"></i>
            <span>{{ data.name }}</span>
          </template>
        </span>
      </template>
    </mouseTree>
    <ul ref="right_box" class="right_box">
      <li
        :disabled="!disabled"
        class="btn-none"
        @click="addDraw"
        v-hasPermi="['ema:cd:add']"
      >
        新增接线图
      </li>
      <li
        :disabled="disabled"
        class="btn-none"
        @click="rename"
        v-hasPermi="['ema:cd:update']"
      >
        重命名
      </li>
      <li
        :disabled="disabled"
        class="btn-none"
        @click="NodeDel"
        v-hasPermi="['ema:cd:remove']"
      >
        删除
      </li>
    </ul>
    <!-- 分割线 -->
    <comonMondal
      @on-closed="addModal = false"
      :visible="addModal"
      customClass="Miniform"
    >
      <template slot="head">
        <span>新增接线图</span>
      </template>
      <template slot="body">
        <el-form
          :model="addForm"
          :rules="addFormrules"
          ref="ruleForm"
          label-width="120px"
        >
          <el-form-item label="系统类型：" prop="cdType">
            <el-select v-model="addForm.cdType">
              <el-option
                v-for="item in cd_type_list"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图类型：" prop="diagramType">
            <el-select v-model="addForm.diagramType">
              <el-option
                v-for="item in diagram_type_list"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图名称：" prop="name">
            <el-input v-model="addForm.name" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="配电室" prop="power">
            <el-select v-model="addForm.power">
              <el-option
                v-for="item in powerList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="cdSub">保存</el-button>
      </template>
    </comonMondal>
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
import mouseTree from "hlcx-qiankun-commonservice/components/newCommonOrgTree";
import comonMondal from "hlcx-qiankun-commonservice/components/Modal";
import { mapState, mapMutations } from "vuex";
import { GET_METER_SELECT } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import * as drawServe from "hlcx-qiankun-commonservice/utils/api/equipment/draw";
export default {
  mounted() {
    this.initCdType();
    window.onclick = () => {
      if (this.$refs.right_box) {
        this.$refs.right_box.style.display = "none";
      }
    };
    window.onscroll = () => {
      if (this.$refs.right_box) {
        this.$refs.right_box.style.display = "none";
      }
    };
    this.$refs.right_box.onclick = (e) => {
      e.stopPropagation();
    };
    this.$refs.right_box.oncontextmenu = (e) => {
      e.preventDefault();
    };
  },
  components: { mouseTree, comonMondal },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    }),
    disabled() {
      var data = this.treeActive.object;
      if (data) {
        if ("enterpriseProperty" in data && data.enterpriseProperty == "01") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    parId() {
      return this.$route.params.params.split("-")[1];
    },
  },
  data() {
    return {
      cd_type_list: [],
      diagram_type_list: [],
      powerList: [],
      addForm: {
        name: "",
        cdType: "1",
        diagramType: "1",
        power: "",
      },
      addFormrules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        power: [{ required: true, message: "请选择配电室", trigger: "blur" }],
      },
      addModal: false,
      treeActive: {},
      treeActiveLabel: "",
      //企业列表
      systemList: "",
      //路由层级
      routreArr: [],
    };
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus"]),
    //初始化图类型和系统类型
    initCdType() {
      if (this.dict) {
        this.cd_type_list = this.dict.cd_type;
        this.diagram_type_list = this.dict.diagram_type;
      }
    },
    //input失去焦点
    NodeBlur() {
      if (!this.treeActive.object.name) {
        this.$message.error("请输入名称");
        return false;
      }
      var params = {
        id: this.treeActive.object.id,
        name: this.treeActive.object.name,
      };
      drawServe.EDIT_DRAW(params).then((e) => {
        if (e.code == 200) {
          this.treeActive.object.isEdit = false;
          this.$message(e.msg);
        } else {
          this.$message(e.message);
        }
      });
    },
    //新增接线图
    cdSub() {
      this.$router.push({
        params: {
          params: String(this.treeActive.value.data.orgId),
        },
      });
      this.$refs.ruleForm.validate((e) => {
        if (e) {
          this.addForm["orgId"] = this.treeActive.value.data.orgId;
          this.addForm["tenantId"] = JSON.parse(
            sessionStorage.getItem("userInfo")
          ).tenantId;
          this.addForm["orgName"] = this.treeActive.object.name;
          this.addForm["isDraft"] = 1;
          drawServe.ADD_CD(this.addForm).then((e) => {
            if (e.code == 200) {
              this.addModal = false;
              this.resetForm("ruleForm");

              this.deviceTreeStatus(true);
            }
          });
        }
      });
    },
    //新增接线图弹框
    addDraw() {
      var right_box = this.$refs.right_box;
      right_box.style.display = "none";
      this.addModal = true;
      GET_METER_SELECT(this.treeActive.value.data.orgId, 13).then((e) => {
        this.powerList = e.data;
      });
    },
    //关闭接线图弹窗
    cancel() {
      this.addModal = false;
      this.resetForm("ruleForm");
    },
    //重命名
    rename() {
      this.$set(this.treeActive.object, "isEdit", true);
      var right_box = this.$refs.right_box;
      right_box.style.display = "none";
    },
    //删除节点
    NodeDel() {
      //二次确认
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除该接线图全部数据！",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          drawServe.DELECT_CD(this.treeActive.value.data.id).then((e) => {
            if (e.code == 200) {
              this.$message.success("删除成功！");
              this.$router.push({
                params: {
                  params: this.$route.params.params.split("-")[0],
                },
              });
              this.deviceTreeStatus(true);
            }
          });
        })
        .catch(() => {});
    },
    rihgtClick(data) {
      var flag = true;
      //首先有编辑状态的，先让修改完
      if (data.value.level != 1) {
        for (var i = 0; i < data.value.parent.data.children.length; i++) {
          if (data.value.parent.data.children[i].isEdit) {
            flag = false;
            this.$message.warning("请先将正在修改的提交");
            break;
          }
        }
      }

      if (flag) {
        var right_box = this.$refs.right_box;
        if (
          data.object.enterpriseProperty != "01" &&
          "enterpriseProperty" in data.object
        ) {
          console.log(111);
        } else {
          right_box.style.display = "block";
          right_box.style.left = data.event.clientX + "px";
          right_box.style.top = data.event.clientY + "px";
          this.treeActive = data;
        }
      }
    },
    //重新获取树结构
    renderTree(node, orgId) {
      return new Promise((resolve) => {
        drawServe.GET_DRAW_TREE({ orgId: orgId }).then((e) => {
          // if (e.length != node.childNodes.length) {
          node.childNodes = [];
          node.data.children = [];
          e.forEach((i) => {
            if (i.isDraft == 1) {
              i.icon = "icon-caogao";
            }
            this.$refs.tree.$refs.tree.append(i, node);
          });
          // }
          node.expanded = true;
          resolve();
        });
      });
    },
    gettree(data, node, orgId) {
      drawServe.GET_DRAW_TREE({ orgId: orgId }).then((e) => {
        e.forEach((i) => {
          if (i.isDraft == 1) {
            i.icon = "icon-caogao";
          }
          this.$refs.tree.$refs.tree.append(i, node);
          node.expanded = true;
        });
      });
    },
    //节点点击
    nodeClick(data, node) {
      this.$refs.right_box.style.display = "none";
      var flag = true;
      if (node.childNodes.length) {
        flag = false;
      }
      /**
       * 企业orgType-配电室及以下category
       */

      if (data.enterpriseProperty == "01") {
        if (flag) {
          this.gettree(data, node, data.orgId);
        }
        this.routreArr[0] = data.orgId;
        this.routreArr = this.routreArr.slice(0, 1);
      }
      if ("jsondata" in data) {
        this.routreArr[1] = data.id;
      }
      if (!data.isEdit) {
        this.$router.push({
          params: {
            params: this.routreArr.join("-"),
          },
        });
      }
    },
    async refreshTree() {
      var ids = this.$route.params.params.split("-");
      await this.renderTree(this.$refs.tree.$refs.tree.getNode(ids[0]), ids[0]);
      this.deviceTreeStatus(false);
    },
  },
};
</script>
<style lang="scss" scoped>
.right_box {
  display: none;
}
</style>
