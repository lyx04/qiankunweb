<!--型号管理-->
<template>
  <div class="marked">
    <div class="marked_head">
      <el-form
        :inline="true"
        :model="selectForm"
        ref="selectForm"
        label-width="105px"
      >
        <el-form-item label="所属分类:" prop="group">
          <el-select
            v-model="selectForm.group"
            @change="groupChange"
            placeholder="请选择内容"
          >
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="samll" label="设备分类:" prop="type">
          <el-select
            v-model="selectForm.type"
            @change="typeChange($event)"
            placeholder="请选择内容"
          >
            <el-option
              v-for="item in equipmentTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="samll"
          label=""
          prop="childType"
          v-if="equipmentTypeList1.length > 0"
        >
          <el-select
            v-model="selectForm.childType"
            @change="type1Change($event)"
            placeholder="请选择内容"
          >
            <el-option
              v-for="item in equipmentTypeList1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="厂家:" prop="factory">
          <template v-if="showFlag">
            <el-input
              v-model.trim="selectForm.factory"
              placeholder="请输入内容"
            ></el-input>
          </template>
          <template v-else>
            <el-select v-model="selectForm.factory">
              <el-option
                v-for="item in commonInfoData.factory"
                :key="item.id"
                :value="item.id"
                :label="item.factoryName"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="品牌:" prop="brand">
          <el-input
            v-model.trim="selectForm.brand"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="型号:" prop="modelNum">
          <el-input
            v-model.trim="selectForm.modelNum"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button
            type="primary"
            @click="
              selectForm.pageNum = 1;
              getEquipmentList();
            "
            >查询</el-button
          >
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="marked_option">
      <el-button
        size="small"
        plain
        class="btn-none"
        v-hasPermi="['ema:eptment:add']"
        @click="newtype"
      >
        新增{{ newButton }}型号
      </el-button>
      <!--<el-button type="primary" style="float:right;">导出</el-button>-->
      <div style="clear: both;"></div>
    </div>
    <div class="marked_table">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" align="center" width="50" label="序号">
        </el-table-column>
        <el-table-column prop="equipName" align="center" label="设备类型">
        </el-table-column>
        <el-table-column prop="factory" align="center" label="厂家">
        </el-table-column>
        <el-table-column prop="brand" align="center" label="品牌">
        </el-table-column>
        <el-table-column prop="modelNum" align="center" label="型号">
        </el-table-column>
        <el-table-column prop="paramCount" align="center" label="设计参数">
        </el-table-column>
        <el-table-column
          width="80"
          prop="meausureCount"
          align="center"
          label="测量参数"
          v-if="selectForm.group == 7"
        >
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createTime.slice(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="270">
          <template slot-scope="scope">
            <el-button
              plain
              class="btn-none"
              type="success"
              v-hasPermi="['ema:eptment:info']"
              @click="lookRow(scope.row)"
              >详情</el-button
            >
            <el-button
              type="primary"
              v-hasPermi="['ema:eptment:update']"
              class="btn-none"
              plain
              @click="editRow(scope.row)"
              >{{ selectForm.group == 7 ? "编辑基本参数" : "编辑" }}</el-button
            >
            <el-button
              v-hasPermi="['ema:eptment:updateMeasure']"
              type="primary"
              class="btn-none"
              @click="editRow(scope.row, 'params')"
              plain
              v-if="selectForm.group == 7"
              >编辑参数</el-button
            >
            <el-button
              type="warning"
              class="btn-none"
              v-hasPermi="['ema:eptment:copy']"
              plain
              @click="copyRow(scope.row)"
              >复制</el-button
            >
            <el-button
              class="btn-none"
              type="danger"
              v-hasPermi="['ema:eptment:delete']"
              plain
              @click="delequipMent(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="tableData.length"
        :pageSize="selectForm.pageSize"
        :total="totalNum"
        :currentPage1.sync="selectForm.pageNum"
        @handleCurrent="current"
        @size-change="handleSizeChange"
      ></pagination>
    </div>
    <!-- 分割线 -->
    <!-- 新增与复制弹框 -->
    <new-and-copy-modal
      @getEquipment="getEquipmentList"
      :classify="selectForm.group"
      :show.sync="newOrCopyModal"
      :params="neworCopyParam"
      :newOrCopy="newOrCopy"
      v-if="newOrCopyModal"
    ></new-and-copy-modal>
    <!-- 修改和查看弹窗 -->
    <edit-and-look-modal
      @getEquipment="getEquipmentList"
      :classify="selectForm.group"
      :show.sync="editOrLookModal"
      :params="editOrLookParam"
      :editOrLook="editOrLook"
      v-if="editOrLookModal"
    ></edit-and-look-modal>
  </div>
</template>
<script>
// 日期   1
// 数值   2
// 不限    3
// 下拉列表（单选） 4
// 系统数据勾选     5
import pagination from "hlcx-qiankun-commonservice/components/pagination";
import newAndCopyModal from "./newAndCopyModal";
import editAndLookModal from "./EditAndlookModal";
import * as equipmnetServe from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";
import { GET_EMA_FACTORY } from "hlcx-qiankun-commonservice/utils/api/EMA/mparam";
import { mapState } from "vuex";
export default {
  components: { pagination, newAndCopyModal, editAndLookModal },
  watch: {
    editOrLookModal(val) {
      if (!val) {
        this.getEquipmentList();
      }
    }
  },
  data() {
    return {
      //基本信息源数据
      commonInfoData: {
        euqiptreeId: [],
        factory: []
      },
      newOrCopyModal: false,
      newOrCopy: false,
      neworCopyParam: {},
      editOrLookModal: false,
      editOrLook: false,
      editOrLookParam: {},

      selectForm: {
        group: "", // 所属分组
        type: "", // 设备类型
        childType: "", // 设备子类型
        factory: "", // 厂家名称
        brand: "", // 厂家品牌
        modelNum: "", // 厂家型号
        tenantId: JSON.parse(sessionStorage.getItem("userInfo")).tenantId,
        pageNum: 1,
        pageSize: 10
      },
      //列表的数据
      tableData: [],
      groupList: [], // 所属分类
      equipmentTypeList: [], // 设备分类
      equipmentTypeList1: [] // 设备分类一
    };
  },
  mounted() {
    this.getTreeSelect("group", 2);
  },
  methods: {
    //加载厂家
    loadFactory() {
      GET_EMA_FACTORY().then(e => {
        this.commonInfoData.factory = e.rows;
      });
    },

    //新增型号
    newtype() {
      this.newOrCopyModal = true;
      this.newOrCopy = false;
    },
    //表格查看
    lookRow(row) {
      this.editOrLookParam = {};
      this.editOrLook = true;
      this.editOrLookParam.id = row.id;
      this.editOrLookModal = true;
    },
    //修改表格
    editRow(row, params) {
      this.editOrLook = false;
      this.editOrLookParam.id = row.id;
      this.editOrLookParam.params = params;
      this.editOrLookModal = true;
    },
    //复制表格数据
    copyRow(row) {
      this.newOrCopy = true;
      this.newOrCopyModal = true;
      this.neworCopyParam.id = row.id;
    },

    //确认是否删除当前设备型号
    delequipMent(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前设备型号",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          equipmnetServe.DELETE_EQUIPMENT_DELEQUIPMENT(row.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getEquipmentList();
          });
        })
        .catch(() => {});
    },
    reset() {
      this.resetForm("selectForm");
      this.selectForm.group = this.groupList[0].id;
      this.getEquipmentList();
    },
    //清空数据
    clearData(params) {
      this.selectForm[params] = "";
    },
    groupChange(e) {
      this.resetForm("selectForm");
      this.selectForm.pageNum = 1;
      this.selectForm.group = e;
      this.tableData = [];
      this.equipmentTypeList = [];
      this.equipmentTypeList1 = [];
      this.getTreeSelect("type", e);
      this.getEquipmentList();
    },
    typeChange(e) {
      this.clearData("childType");
      this.getTreeSelect("childType", e);
    },
    type1Change(e) {
      console.log(e);
    },
    current(val) {
      this.selectForm.pageNum = val;
      this.getEquipmentList();
    },
    handleSizeChange(val) {
      this.selectForm.pageNum = 1;
      this.selectForm.pageSize = val;
      this.getEquipmentList();
    },
    // 查询所属分类、设备分类接口
    getTreeSelect(type, id) {
      equipmnetServe.GET_EQUIPMENT_QUERY_TREE_SELECT(id).then(res => {
        if (type === "group") {
          let groupList = res.data.filter(item => {
            return item.id != 12;
          });
          this.selectForm.group = groupList[0].id;
          this.groupList = groupList;
          this.getTreeSelect("type", this.selectForm.group);
          this.getEquipmentList();
        } else if (type === "type") {
          this.equipmentTypeList = res.data;
        } else if (type === "childType") {
          this.equipmentTypeList1 = res.data;
        }
      });
    },
    // 获取设备型号列表
    getEquipmentList() {
      equipmnetServe.GET_EQUIPMENT_LIST(this.selectForm).then(res => {
        this.tableData = res.rows;
        this.totalNum = res.total;
      });
    }
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    }),
    newButton() {
      switch (this.selectForm.group) {
        case 3:
          return "配电设备";
        case 7:
          return "监控设备";
        case 10:
          return "通讯终端";
        default:
          return "配电设备";
      }
    },
    showFlag() {
      switch (this.selectForm.group) {
        case 3:
          return true;
        case 7:
          this.loadFactory();
          return false;
        case 10:
          return true;
        default:
          return true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.report {
  padding: 0 15px;
  ::v-deep .el-select {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      font-size: 10px;
    }
    .el-input__icon {
      line-height: 30px;
    }
    margin-bottom: 20px;
  }
  ::v-deep .el-table {
    font-size: 10px;
    .el-table__header-wrapper {
      .cell {
        font-size: 10px;
        line-height: 15px;
        vertical-align: middle;
        color: white;
        text-align: center;
        p {
          height: 100%;
          line-height: 30px;
        }
      }
    }
    .el-table__body-wrapper {
      table {
        .cell {
          text-align: center;
          button {
            font-size: 10px;
          }
          .el-select {
          }
          .el-input {
            margin: 0 auto;
            width: 80%;
            border: 1px solid white;
            margin-top: 5px;
            height: 20px;
            font-size: 0;
            line-height: 20px;
            .el-input__inner {
              background-color: transparent;
              height: 100%;
              width: 100%;
              color: white;
              border: none;
              padding: 0;
              padding-left: 10px;
              font-size: 10px;
            }
            .el-input__icon {
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
.el-dialog__wrapper {
  ::v-deep .el-dialog__body {
    .el-tabs {
      padding: 0 10px;
    }
    .el-pagination {
      .el-pagination__rightwrapper {
        .el-pagination__total {
          font-size: 10px;
        }
        .el-pager li {
          font-size: 10px;
        }
        .el-pagination__jump {
          font-size: 10px;
          .el-input__inner {
            font-size: 10px;
          }
        }
      }
    }

    .measure_table {
      padding: 10px;
      ::v-deep table {
        .cell {
          font-size: 10px;
          color: white;
        }
      }
      .tab_option {
        margin-bottom: 8px;
        button {
          font-size: 10px;
        }
      }
    }
    button {
      padding: 2px 8px;
    }
    table {
      .el-input {
        .el-input__icon {
          line-height: 20px;
        }
      }
    }
  }
}
.marked {
  padding-top: 17px;
}
.avatar-uploader {
  display: inline-block;
}

.marked_head {
  margin-bottom: 15px;
  ::v-deep .el-form {
    .el-form-item {
      margin-bottom: 0;
      &.button {
        margin-left: 29px;
      }
      &.samll {
        margin-right: 5px;
        margin-bottom: 10px;
        .el-form-item__content {
          width: 105px;
          .el-select {
            width: 100%;
            .el-input__inner {
              padding-right: 19px;
            }
            .el-input__suffix {
              right: 0;
            }
          }
        }
      }
      .el-form-item__label {
        text-align: left;
      }
      .el-form-item__content {
        width: 216px;
        .el-select {
          width: 100%;
        }
      }
    }
  }
}
.marked_option,
.marked_table {
  padding: 0 22px;
}
.marked_option {
  margin-bottom: 20px;
  .el-button {
    margin: 0 !important;
    &.is-plain {
      padding: 8px 20px;
      font-size: 14px;
      &:hover {
        background: transparent;
        border: 1px solid #0ceaf3;
        color: #0ceaf3;
      }
      &:focus {
        background: transparent;
        border: 1px solid #0ceaf3;
        color: #0ceaf3;
      }

      &.is-disabled {
        background: transparent;

        border: 1px solid #0ceaf3;
        color: #0ceaf3;
      }
    }
  }
}
</style>
