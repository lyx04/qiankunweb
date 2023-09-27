<template>
  <div class="measureList">
    <div class="monitor_option">
      <el-button
        type="primary"
        @click="newmeasureClick"
        class="btn-none"
        v-hasPermi="['ema:elemeasure:add']"
        >新增量测量</el-button
      >
      <el-button
        type="danger"
        plain
        @click="delectMonitor"
        class="btn-none"
        v-hasPermi="['ema:elemeasure:delete']"
        >删除</el-button
      >
      <span style="color:red;font-size:12px;margin-left:10px;"
        >不同表计的量测量请勿重复!</span
      >
      <el-select
        v-model="value"
        @change="monitorChange(0)"
        placeholder="请选择监控设备"
      >
        <el-option
          v-for="item in list"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <el-table
      @selection-change="selectChange"
      :row-key="tableRowKey"
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column type="selection" align="center"> </el-table-column>
      <el-table-column type="index" align="center" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="name" align="center" label="量测量名称">
      </el-table-column>
      <el-table-column prop="identify" align="center" label="量测量标识">
      </el-table-column>
      <el-table-column
        prop="type"
        :formatter="typeFormatter"
        align="center"
        label="量测量分类"
      >
      </el-table-column>
      <el-table-column prop="equipName" align="center" label="所属量测集">
      </el-table-column>
      <el-table-column prop="labels" align="center" label="标签">
      </el-table-column>
      <el-table-column prop="unit" align="center" label="单位">
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <template v-if="scope.row.hasAlarm">
            <el-button disabled class="nomargin" type="warning" plain
              >已加预设</el-button
            >
          </template>
          <template v-else>
            <el-button
              type="primary"
              class="btn-none"
              v-hasPermi="['ema:elealarm:add']"
              plain
              @click="addwarning(scope.row)"
              >预设阈值</el-button
            >
          </template>
          <el-button
            type="danger"
            class="btn-none"
            v-hasPermi="['ema:elemeasure:delete']"
            plain
            @click="monitorDelect(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pageSize="pageSize"
      :total="total"
      :currentPage1.sync="pageNum"
      @handleCurrent="measureCurrent"
      @size-change="handleSizeChange"
    ></pagination>
    <!-- 新增量测量 -->
    <commonModal
      class="device"
      @on-closed="newmeasure = false"
      customClass="Maxform"
      :visible="newmeasure"
    >
      <template slot="head">
        <span>新增量测量</span>
        <el-select
          v-model="newmeasureselect"
          @change="newmeasureChange(0)"
          placeholder="请选择设备"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </template>
      <template slot="body">
        <el-table
          class="modal"
          @selection-change="newMeasureCheck"
          :row-key="tableRowKey"
          :data="addMeasureModule.list"
          stripe
          style="width: 100%"
          ref="measureTable"
        >
          <el-table-column
            :reserve-selection="true"
            type="selection"
            align="center"
          >
          </el-table-column>
          <el-table-column type="index" align="center" label="序号" width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            show-overflow-tooltip
            label="量测量名称"
          >
          </el-table-column>
          <el-table-column prop="identify" align="center" label="量测量标识">
          </el-table-column>
          <el-table-column
            prop="type"
            :formatter="typeFormatter"
            align="center"
            label="量测量分类"
          >
          </el-table-column>
          <el-table-column prop="equipName" align="center" label="所属量测集">
          </el-table-column>
          <el-table-column prop="labels" align="center" label="标签">
          </el-table-column>
          <el-table-column prop="unit" align="center" label="单位">
          </el-table-column>
        </el-table>
        <pagination
          :pageSize="addMeasureCurrent.pageSize"
          :total="addMeasureModule.total"
          :currentPage1.sync="addMeasureCurrent.pageNum"
          @handleCurrent="addMeasureCurrent"
          @size-change="addSizeChange"
        ></pagination>
      </template>
      <template slot="foot">
        <el-button @click="newmeasure = false">取消</el-button>
        <el-button type="primary" @click="subMeasure">保存</el-button>
      </template>
    </commonModal>
  </div>
</template>
<script>
import { mapState } from "vuex";

import {
  ADD_ELE_MEASURE,
  DELETE_DEVICE_MEASURE,
  GET_MEASURE_LIST,
  ADD_ELE_ALRAM,
  GET_ADD_MEASURE,
  GET_METER_SELECT
} from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import commonModal from "hlcx-qiankun-commonservice/components/Modal";
import pagination from "hlcx-qiankun-commonservice/components/pagination";

export default {
  components: { commonModal, pagination },
  props: {
    //查找量测量的设备类型
    category: Number,
    //父节点
    parId: Number
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    })
  },
  mounted() {
    //加载表计或者加载动环监控
    GET_METER_SELECT(this.parId, this.category).then(e => {
      this.list = e.data;
      this.value = e.data.length ? e.data[0].id : "";
      this.monitorChange();
    });
    this.tableData = [];
    this.total = "";
  },
  data() {
    return {
      newmeasure: false,
      checkedList: [],
      //量测量集合
      pageNum: 1,
      pageSize: 10,
      list: [],
      total: "",
      value: "",
      tableData: [],
      // 弹框里选择的量测量
      subMeasureList: [],
      //新增量测量里面的监控设备的选择
      newmeasureselect: "",
      //新增量测量按钮的集合
      addMeasureModule: {
        pageNum: 1,
        pageSize: 10,
        list: [],
        total: ""
      }
    };
  },
  methods: {
    //打开新增量测量的弹出框
    newmeasureClick() {
      this.newmeasure = true;
      this.$nextTick(() => {
        this.newmeasureselect = this.list.length ? this.list[0].id : "";
        this.newmeasureChange(0);
      });
    },
    //监控设备量测量的选择
    selectChange(data) {
      this.checkedList = data;
    },
    //提交设备选择的量测量
    subMeasure() {
      var subarr = [];
      this.subMeasureList.forEach(e => {
        var obj = {
          //设备id
          electricroomId: this.newmeasureselect,
          //型号id
          equipmentId: e.equipmentId,
          //量测量id
          measureParamId: e.measureParamId
        };
        subarr.push(obj);
      });
      ADD_ELE_MEASURE(subarr).then(e => {
        if (e.code == 200) {
          this.tableData = [];
          this.$refs.measureTable.clearSelection();
          this.addMeasureModule.total = 0;
          this.addMeasureModule.pageNum = 1;
          this.addMeasureModule.list = [];
          this.newmeasureselect = "";
          this.value = this.list.length ? this.list[0].id : "";
          this.newmeasure = false;
          this.monitorChange();
        }
      });
    },
    //新增量测量弹框中的分页
    addMeasureCurrent(e) {
      this.addMeasureModule.pageNum = e;
      this.newmeasureChange(e);
    },
    addSizeChange(val) {
      this.addMeasureModule.pageNum = 1;
      this.addMeasureModule.pageSize = val;
      this.newmeasureChange();
    },
    // 量测量分类转字符串
    typeFormatter(row) {
      let dictLabel = "";
      this.dict.measurement_type.forEach(item => {
        if (item.dictValue == row.type) {
          dictLabel = item.dictLabel;
        }
      });
      return dictLabel;
    },
    //返回rowKey用于报错选择
    tableRowKey(e) {
      return e.measureParamId;
    },
    newMeasureCheck(e) {
      this.subMeasureList = e;
    },
    //新增量测量里面选择表计的事件
    newmeasureChange(pageNum) {
      if (pageNum == 0) {
        //清空用户上次对表格的选择
        this.$refs.measureTable.clearSelection();
        this.addMeasureModule.total = 0;
        this.addMeasureModule.pageNum = 1;
      }
      var params = {
        pageNum: this.addMeasureModule.pageNum,
        pageSize: this.addMeasureModule.pageSize
      };
      var equipment = this.list.filter(i => {
        return i.id == this.newmeasureselect;
      });
      GET_ADD_MEASURE(equipment[0].id, equipment[0].equipmentId, params).then(
        e => {
          this.addMeasureModule.list = e.rows;
          if (!this.addMeasureModule.total) {
            this.addMeasureModule.total = e.total;
          }
        }
      );
    },
    //量测量列表的分页
    measureCurrent(e) {
      this.pageNum = e;
      this.monitorChange();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.monitorChange();
    },
    //量测量级删除
    monitorDelect(data) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除量测量！",
        showCancelButton: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          DELETE_DEVICE_MEASURE([data]).then(e => {
            if (e.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });

              this.monitorChange(0);
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    //加入告警
    addwarning(data) {
      var obj = {
        type: data.type,
        electricroomMeasureId: data.id,
        //设备id
        electricroomId: this.value,
        //型号id
        equipmentId: data.equipmentId,
        //量测量id
        measureParamId: data.measureParamId
      };
      ADD_ELE_ALRAM(obj).then(e => {
        if (e.code == 200) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          data.hasAlarm = 1;
        }
      });
    },
    // 量测量里面监控设备的选择
    monitorChange(e) {
      if (e == 0) {
        this.pageNum = 1;
      }
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };

      if (this.value != "") {
        GET_MEASURE_LIST(this.value, params).then(e => {
          this.tableData = e.rows;
          this.total = e.total;
        });
      }
    },
    //批量删除量测量
    delectMonitor() {
      if (this.checkedList.length) {
        this.$msgbox({
          title: "",
          customClass: "iconmes",
          message: "将删除选择的量测量!",
          showCancelButton: true,
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "error",
          iconClass: "iconfont icon-huishou",
          closeOnClickModal: false,
          closeOnPressEscape: false
        })
          .then(() => {
            DELETE_DEVICE_MEASURE(this.checkedList).then(e => {
              if (e.code == 200) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.checkedList = [];
                this.pageNum = 1;
                this.monitorChange();
              }
            });
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        this.$message.warning("请选择要删除的量测量");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.monitor_option {
  margin-bottom: 20px;
  .is-plain {
    width: 88px;
    height: 31.6px;
    &.is-disabled {
      color: #e97e62;
      background: transparent;
      border: 1px solid #e97e62;
    }
  }
  ::v-deep .el-select {
    float: right;
    .el-input {
      .el-input__inner {
        height: 31.6px;
        line-height: 31.6px;
      }
      .el-input__suffix {
        .el-input__suffix-inner {
          .el-input__icon {
            line-height: 31.6px;
          }
        }
      }
    }
  }
}
.el-dialog__wrapper {
  ::v-deep .Maxform {
    .el-dialog__header {
      .el-select {
        float: right;
        margin-right: 20px;
        .el-input__inner {
          height: 25px;
          line-height: 25px;
        }
        .el-input--suffix {
          .el-input__icon {
            line-height: 25px;
          }
        }
      }
    }
    .el-dialog__body {
      table {
        .cell {
          padding: 0;
        }
      }
      .el-form {
      }
    }
  }
}
</style>
