<template>
  <!-- 监控设备中新增量测量 -->
  <commonModal
    @on-closed="$emit('update:show', false)"
    :visible="show"
    customClass="transfer"
  >
    <template slot="head">
      <p>新增量测量</p>
    </template>
    <template slot="body">
      <div class="leftTree">
        <mouseTree
          inputdefaultText="输入量测量集以检索"
          :treeActive.sync="treeActive"
          customClass="default"
          :treeData="treeData"
          :contextBollean="false"
        >
          <template slot-scope="{ data }" slot="treecustom">
            <span class="font" @click="getleafnode(data)">{{ data.name }}</span>
          </template>
        </mouseTree>
      </div>
      <div class="leafNodes" v-if="row">
        <el-input
          class="treeInput"
          v-model.trim="nodeSearch"
          placeholder="输入量测量以检索"
          @keyup.enter.native="SearchNode"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="SearchNode"
          ></i>
        </el-input>
        <el-checkbox
          :indeterminate="indeterminate"
          v-model="checkAll"
          @change="checkAllChange"
          v-if="nodelist.length == nodeTotal && nodelist.length > 0"
          >全选</el-checkbox
        >

        <el-checkbox
          :title="item.name"
          @change="checkChange(item, item.checked)"
          v-for="(item, index) in nodelist"
          :key="index"
          :checked="item.checked"
          v-model="item.checked"
          >{{ item.name }}</el-checkbox
        >
        <div class="font" v-if="nodelist.length < nodeTotal" @click="learMore">
          <span>加载更多...</span>
        </div>
      </div>
    </template>
    <template slot="foot">
      <el-button @click="$emit('update:show', false)">取消</el-button>
      <el-button type="primary" @click="Subnode">保存</el-button>
    </template>
  </commonModal>
</template>
<script>
import commonModal from "hlcx-qiankun-commonservice/components/Modal";
import { GET_EMA_TREE_LIST } from "hlcx-qiankun-commonservice/utils/api/EMA/tree";
import {
  // eslint-disable-next-line no-unused-vars
  ADD_EPT_MEASURE,
  QUERY_MEASUR_SELECT,
} from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";

import mouseTree from "hlcx-qiankun-commonservice/components/MouseTree";
export default {
  components: { commonModal, mouseTree },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    params: Object,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      GET_EMA_TREE_LIST(1).then((e) => {
        this.treeData = e.data;
        this.recurData(this.treeData);
        this.row = "";
        this.pageNum = 1;
        this.nodeSearch = "";
        this.nodelist = [];
        this.nodeTotal = "";
        this.indeterminate = false;
        this.checkAll = false;
      });
    },
    //递归量测量集
    recurData(data) {
      data.forEach((i) => {
        if (i.childs.length) {
          this.recurData(i.childs);
        } else {
          this.checkList[i.id] = [];
          // this.initmeasere(i)
        }
      });
    },
    //量测量提交
    Subnode() {
      var subarr = [];
      var objectMap = {
        equipmentId: "",
        measureParamId: "",
        flag: 0,
      };
      var arr = this.checkList.reduce((a, b) => {
        return a.concat(b);
      });
      arr.forEach((i) => {
        if (i.isSelected) {
          if (!i.checked) {
            objectMap = {
              equipmentId: this.params.id,
              measureParamId: i.id,
              flag: 0,
            };

            subarr.push(objectMap);
          }
        } else {
          if (i.checked) {
            objectMap = {
              equipmentId: this.params.id,
              measureParamId: i.id,
              flag: 1,
            };

            subarr.push(objectMap);
          }
        }
      });
      ADD_EPT_MEASURE(subarr).then((e) => {
        if (e.code == 200) {
          this.$emit("measurSub");
          this.$emit("update:show", false);
        }
      });
      //     {
      //   "equipmentId": 0,基本信息返回的id
      //   "measureParamId": 0 当前的主键id
      // }
    },
    //查看更多
    learMore() {
      this.pageNum += 1;
      this.getleafnode();
    },
    //全选按钮的操作
    checkAllChange(e) {
      this.nodelist.forEach((i) => {
        i.checked = e;
        var active = this.checkList[this.row.id].filter((item) => {
          return i.id == item.id;
        });
        active[0].checked = e;
      });
      this.checkAll = e;
      this.indeterminate = false;
    },
    //多选框的操作
    checkChange(item, value) {
      console.log(this.checkList[this.row.id]);
      var haveitem = this.checkList[this.row.id].filter((i) => {
        return i.id == item.id;
      });
      if (haveitem.length) {
        haveitem[0].checked = value;
      } else {
        this.checkList[this.row.id].push(item);
      }
      var truelength = 0;
      this.nodelist.forEach((i) => {
        if (i.checked) {
          truelength++;
        }
      });
      let checkedCount = truelength == this.nodelist.length ? true : false;
      this.checkAll = checkedCount;
      this.indeterminate = !checkedCount;
    },
    /**

     */
    //获取叶子节点
    getleafnode(data) {
      if (data) {
        if (data.childs.length) {
          return "";
        }
        this.nodelist = [];
        this.checkAll = false;
        this.indeterminate = false;
        this.pageNum = 1;
        this.row = data;
      }
      if (this.nodelist.length == 0 || this.nodelist.length != this.nodeTotal) {
        var params = {
          euqiptreeId: this.row.id,
          name: this.nodeSearch,
          pageNum: this.pageNum,
          pageSize: 10,
          equipmentId: this.params.id,
        };
        QUERY_MEASUR_SELECT(params).then((e) => {
          var checkedNum = 0;
          e.rows.forEach((i) => {
            if (i.isSelected == 1) {
              i.checked = true;
            } else {
              i.checked = false;
            }
            var isselectedlist = this.checkList[this.row.id].filter(
              (selectItem) => {
                return selectItem.id == i.id;
              }
            );
            if (isselectedlist.length) {
              i.checked = isselectedlist[0].checked;
            } else {
              this.checkList[this.row.id].push(i);
            }
          });
          this.nodelist = this.nodelist.concat(e.rows);
          this.nodeTotal = e.total;
          this.nodelist.forEach((i) => {
            if (i.checked) {
              checkedNum++;
            }
          });
          if (checkedNum == this.nodelist.length) {
            this.checkAll = true;
          } else if (checkedNum) {
            this.indeterminate = true;
          }
        });
      }
    },
    //搜索量测量
    SearchNode() {
      this.checkAll = false;
      this.indeterminate = false;
      this.pageNum = 1;
      var params = {
        euqiptreeId: this.row.id,
        name: this.nodeSearch,
        pageNum: this.pageNum,
        pageSize: 10,
        equipmentId: this.params.id,
      };
      QUERY_MEASUR_SELECT(params).then((e) => {
        var checkedNum = 0;

        e.rows.forEach((i) => {
          if (i.isSelected == 1) {
            i.checked = true;
          } else {
            i.checked = false;
          }
          var isselectedlist = this.checkList[this.row.id].filter(
            (selectItem) => {
              return selectItem.id == i.id;
            }
          );
          if (isselectedlist.length) {
            i.checked = isselectedlist[0].checked;
          } else {
            this.checkList[this.row.id].push(i);
          }
        });
        this.nodelist = e.rows;
        this.nodeTotal = e.total;
        this.nodelist.forEach((i) => {
          if (i.checked) {
            checkedNum++;
          }
        });
        if (checkedNum == this.nodelist.length) {
          this.checkAll = true;
        } else if (checkedNum) {
          this.indeterminate = true;
        }
      });
    },
  },
  data() {
    return {
      //穿梭框的信息
      modal: false,
      row: "",
      pageNum: 1,
      //节点
      nodeSearch: "",
      treeActive: {},
      alarmLevelList: [],
      crossAlarmLevel: [],
      //量测量列表
      nodelist: [],
      //选中的量测量
      checkList: [],
      //左侧树
      treeData: [],
      //量测量列表的总数
      nodeTotal: "",
      //没有全选的样式控制
      indeterminate: false,
      //全选的控制
      checkAll: false,
    };
  },
};
</script>
<style lang="scss" scoped>
.el-dialog__wrapper {
  ::v-deep .el-dialog__body {
    .treeInput {
      margin-bottom: 20px;
      .el-input__inner {
        width: 225px;
        height: 30px;
        line-height: 30px;
        font-size: 10px;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
    .leftTree {
      display: inline-block;
      padding-right: 53px;
      width: 278px;
      position: relative;
      height: 343px;
      &::after {
        content: "";
        width: 1px;
        height: 100%;
        background-color: rgba(42, 128, 178, 1);
        position: absolute;
        right: 0;
        top: 0;
      }
      .tree-aside {
        .el-input {
          margin-bottom: 20px;
          .el-input__inner {
            width: 225px;
            height: 30px;
            line-height: 30px;
            font-size: 10px;
          }
          .el-input__icon {
            line-height: 30px;
          }
        }
        .el-tree {
          background-color: transparent;
          .el-tree-node__content {
            font-size: 10px;
            background-color: transparent;
            .font {
              display: inline-block;
              width: 100%;
              height: 100%;
              line-height: 26px;
              text-align: left;
              color: white;
            }
            &:focus {
              background-color: transparent;
              .font {
                color: white;
              }
            }
            &:active {
              background-color: #f5f7fa;
              .font {
                color: #606266;
              }
            }
            &:hover {
              background-color: #f5f7fa;
              .font {
                color: #606266;
              }
            }
          }
        }
      }
    }
    .leafNodes {
      display: inline-block;
      width: 225px;
      vertical-align: top;
      margin-left: 67px;
      label {
        display: block;
        color: white;
        .el-checkbox__label {
          width: 87%;
          vertical-align: middle;
          overflow: hidden; /*超出部分隐藏*/
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /*规定段落中的文本不进行换行 */
          font-size: 10px;
        }
        margin-bottom: 20px;
      }
      .font {
        text-align: center;
        cursor: pointer;
        span {
          font-size: 10px;
          color: white;
        }
      }
    }
  }
}
</style>
