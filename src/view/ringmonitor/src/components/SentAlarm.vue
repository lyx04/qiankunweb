<template>
  <div class="tabs-content">
    <div class="alarm-form">
      <el-form
        :model="request"
        ref="request"
        label-width="auto"
        class="filter-form"
      >
        <el-row>
          <el-col :span="4">
            <el-form-item label="用电单位:" prop="orgId">
              <el-select
                v-model="request.orgId"
                placeholder="请选择用电单位"
                @change="orgChange"
                filterable
              >
                <el-option label="全部"></el-option>
                <el-option
                  v-for="item in orgList"
                  :key="item.orgId"
                  :label="item.name"
                  :value="item.orgId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="告警设备:" prop="equipmentId">
              <el-cascader
                placeholder="请选择告警设备"
                v-model="request.equipmentId"
                :options="treeData"
                :props="Props"
                :show-all-levels="false"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="告警等级:" prop="alarmLevel">
              <el-select
                v-model="request.alarmLevel"
                placeholder="请选择告警等级"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in dict.alert_level"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="告警类型:" prop="alarmRuleType">
              <el-select
                v-model="request.alarmRuleType"
                placeholder="请选择告警类型"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="item in dict.alarm_type"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="告警时间:" prop="time">
              <el-date-picker
                v-model="request.time"
                type="datetimerange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="-"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :clearable="false"
                :editable="false"
                popper-class="date-time-range"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="alarm-form-button">
          <el-button
            type="primary"
            @click="batchProcessClick"
            class="btn-none"
            v-hasPermi="['monitor:alarm:handle']"
            v-track-event="{
              category: 'alarm',
              action: 'batchDone',
              opt_label: 'sent'
            }"
            >批量已处理</el-button
          >
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <!--<el-button>导出</el-button>-->
        </div>
      </el-form>
    </div>
    <!--表格-->
    <div class="h-table-content">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="告警等级" width="84">
          <template slot-scope="scope">
            <span v-if="scope.row.alarmLevel == 1" style="color: #2589ee;">{{
              scope.row.alarmLevel | alarmLevelFormatter(that)
            }}</span>
            <span
              v-else-if="scope.row.alarmLevel == 2"
              style="color: #fff386;"
              >{{ scope.row.alarmLevel | alarmLevelFormatter(that) }}</span
            >
            <span
              v-else-if="scope.row.alarmLevel == 3"
              style="color: #e97e61;"
              >{{ scope.row.alarmLevel | alarmLevelFormatter(that) }}</span
            >
            <span v-else style="color: #ffffff;">{{
              alarmDelail.alarmLevel | alarmLevelFormatter(that)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orgName"
          align="center"
          label="用电单位"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="leavel"
          align="center"
          label="配电室/屏柜"
          min-width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.eleRoomName }}{{ scope.row.cabinetName ? "/" : ""
            }}{{ scope.row.cabinetName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="equipmentName"
          align="center"
          label="设备名称"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="告警类型"
          width="120"
          prop="alarmRuleType"
          show-overflow-tooltip
          :formatter="alarmRuleTypeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="datetime"
          align="center"
          label="告警时间"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" label="状态" width="80">
          <template>
            <span style="color: #fff386;">已派单</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              @click="detailClick(scope.row)"
              class="btn-none"
              v-hasPermi="['monitor:alarm:detail']"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <paging
        @change="handleCurrent"
        :page-size="request.pageSize"
        :total="totalNum"
        layout="jumper,total"
        :current-page="request.pageNum"
      ></paging>
    </div>
    <!--详情弹框-->
    <alarm-detail-model
      :alarmDelail="alarmDelail"
      :dialogVisibleAlarmDetail="dialogVisibleAlarmDetail"
      @alarmDelailClosed="alarmDelailClosed"
      @refreshList="refreshList"
    ></alarm-detail-model>
    <!--已处理弹框-->
    <batch-process-modal
      :detailObj="detailObj"
      :dialogVisibleBatchProcess="dialogVisibleBatchProcess"
      @batchProcessClosed="batchProcessClosed"
      @refreshList="refreshList"
    ></batch-process-modal>
  </div>
</template>

<script>
import alarmDetailModel from "./alarmDetailModel";
import BatchProcessModal from "./BatchProcessModal";
import Paging from "hlcx-qiankun-commonservice/components/Paging";
import { GET_MONITOR_ALARM_LIST } from "hlcx-qiankun-commonservice/utils/api/monitor/alarm";
import { GET_SYSTEM_ORG_LIST } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import { GET_ORG_ALL_TREES } from "hlcx-qiankun-commonservice/utils/api/maintain/repairOrder";
import { mapState } from "vuex";

export default {
  name: "SentAlarm",
  components: {
    alarmDetailModel,
    Paging,
    BatchProcessModal
  },
  data() {
    return {
      that: this,
      orgList: [], // 用电单位列表
      treeData: [], // 告警设备
      Props: {
        label: "name",
        value: "id",
        children: "childs",
        checkStrictly: true
      },
      request: {
        orgId: undefined,
        equipmentId: "", // 告警设备id
        eleId: "",
        alarmLevel: "", // 告警等级
        alarmRuleType: "", // 告警类型
        time: [this.getBeforeDate(), this.getDate()], // 告警时间
        startTime: this.getBeforeDate(),
        endTime: this.getDate(),
        handleStatus: 1,
        pageNum: 1,
        pageSize: 10
      },
      totalNum: 0,
      tableData: [],
      multipleSelection: [], // 选中值
      alarmId: [], // 选中id
      alarmDelail: {}, // 当前详情
      dialogVisibleAlarmDetail: false, // 详情弹框
      dialogVisibleBatchProcess: false, // 处理弹框
      detailObj: {}, // 处理信息
      tableEmptyText: "拼命加载中"
    };
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    })
  },
  filters: {
    // 告警等级
    alarmLevelFormatter(val, that) {
      let dictLabel = "";
      if (that.dict.alert_level) {
        that.dict.alert_level.forEach(item => {
          if (item.dictValue == val) {
            dictLabel = item.dictLabel;
          }
        });
        return dictLabel;
      }
    }
  },
  methods: {
    // 告警类型
    alarmRuleTypeFormatter(row) {
      if (row.alarmRuleType) {
        let dictLabel = "";
        this.dict.alarm_type.forEach(item => {
          if (item.dictValue == row.alarmRuleType) {
            dictLabel = item.dictLabel;
          }
        });
        return dictLabel;
      } else {
        return "--";
      }
    },
    // 查询组织list
    getOrgList() {
      GET_SYSTEM_ORG_LIST().then(res => {
        this.orgList = res.data;
        if (this.request.orgId) {
          this.getTreeAll();
        }
        this.getArarmList();
      });
    },
    // 查询组织下的设备
    getTreeAll() {
      this.treeData = [];
      this.request.eleId = "";
      this.request.equipmentId = "";
      if (String(this.request.orgId) != "undefined") {
        GET_ORG_ALL_TREES(this.request.orgId, false).then(res => {
          res.data.forEach(item => {
            item.childs.forEach(itemChilds => {
              itemChilds.childs.filter(val => {
                delete val.childs;
                return val;
              });
            });
          });
          res.data.forEach(item => {
            item.childs.filter(itemChilds => {
              if (itemChilds.childs.length == 0) {
                delete itemChilds.childs;
              }
              return itemChilds;
            });
          });
          this.treeData = res.data;
        });
      }
    },
    //  切换用电单位
    orgChange(val) {
      this.request.orgId = val;
      this.getTreeAll();
    },
    // 搜索
    search() {
      if (this.request.time && this.request.time.length > 0) {
        this.request.startTime = this.request.time[0];
        this.request.endTime = this.request.time[1];
      }
      if (this.request.equipmentId.length > 0) {
        this.request.eleId = this.request.equipmentId[
          this.request.equipmentId.length - 1
        ];
      }
      this.request.pageNum = 1;
      this.getArarmList();
    },
    // 重置
    reset() {
      this.resetForm("request");
      // this.request.orgId = this.orgList[0].orgId;
      this.request.eleId = "";
      this.request.pageNum = 1;
      this.getArarmList();
    },
    // 当前时间
    getDate() {
      var today = new Date();

      var month = today.getMonth() + 1;

      month = month < 10 ? "0" + month : month;

      var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();

      var hours =
        today.getHours() < 10 ? "0" + today.getHours() : today.getHours();

      var mins =
        today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();

      var secs =
        today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
      var now1 =
        today.getFullYear() +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        mins +
        ":" +
        secs;
      return now1;
    },
    // 前一天
    getBeforeDate() {
      var curDate = new Date();
      var today = new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      var month = today.getMonth() + 1;

      month = month < 10 ? "0" + month : month;

      var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();

      var hours =
        today.getHours() < 10 ? "0" + today.getHours() : today.getHours();

      var mins =
        today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();

      var secs =
        today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
      var now1 =
        today.getFullYear() +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        mins +
        ":" +
        secs;
      return now1;
    },
    // 列表
    getArarmList() {
      this.tableData = [];
      var query = {
        orgId: this.request.orgId, // 用电单位id,
        eleId: this.request.eleId, // 告警设备id
        alarmLevel: this.request.alarmLevel, // 告警等级
        alarmRuleType: this.request.alarmRuleType, // 告警类型
        startTime: this.request.startTime,
        endTime: this.request.endTime,
        handleStatus: this.request.handleStatus,
        pageNum: this.request.pageNum,
        pageSize: this.request.pageSize
      };
      GET_MONITOR_ALARM_LIST(query).then(res => {
        this.totalNum = 0;
        this.tableData = res.rows;
        this.totalNum = res.total;
        if (this.tableData.length === 0) {
          this.tableEmptyText = "暂无数据";
        }
      });
    },
    //  翻页
    handleCurrent(val) {
      this.request.pageNum = val;
      this.getArarmList();
    },
    // 选择table框
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.alarmId = [];
      this.multipleSelection.forEach(item => {
        this.alarmId.push(item.id);
      });
    },
    //  点击详情
    detailClick(row) {
      this.alarmDelail = row;
      this.dialogVisibleAlarmDetail = true;
    },
    //  关闭详情弹框
    alarmDelailClosed() {
      this.alarmDelail = {};
      this.dialogVisibleAlarmDetail = false;
    },
    // 处理弹框
    batchProcessClick() {
      if (this.alarmId.length > 0) {
        this.detailObj = {
          ids: this.alarmId,
          handlerRemark: "",
          title: "批量告警处理"
        };
        this.dialogVisibleBatchProcess = true;
      } else {
        this.$message.error("错了哦，请选择告警数据");
      }
    },
    //  关闭处理弹框
    batchProcessClosed() {
      this.detailObj = {};
      this.dialogVisibleBatchProcess = false;
    },
    //  刷新列表
    refreshList() {
      this.request.pageNum = 1;
      this.getArarmList();
    }
  },
  created() {
    this.getOrgList();
  }
};
</script>

<style scoped lang="scss">
::v-deep.tabs-content {
  .filter-form {
    margin-top: 25px;
    .alarm-form-button {
      margin-left: 30px;
    }
  }
  .h-table-content {
    margin-top: 25px;
  }
}
</style>
