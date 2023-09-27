<template>
  <div>
    <modal
      :visible="dialogVisibleAlarmDetail"
      customClass="customer-modal Miniform"
      :destroyOnClose="false"
      @on-closed="alarmDelailClosed"
    >
      <template slot="head">
        <span
          >告警详情（{{
            alarmDelail.handleStatus | handleStatusFormatter
          }}）</span
        >
      </template>
      <template slot="body">
        <el-form :model="alarmDelail" label-width="auto">
          <el-row>
            <el-form-item label="用电单位:">
              <span class="item-content">
                {{ alarmDelail.orgName || "--" }}
              </span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="配电室/屏柜:">
              <span class="item-content">
                {{ alarmDelail.eleRoomName || "--" }}
              </span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="设备名称:">
              <span class="item-content">
                {{ alarmDelail.equipmentName || "--" }}
                <el-button type="text" @click="jump(alarmDelail.equipmentId)"
                  >设备详情</el-button
                >
              </span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="告警等级:">
              <span
                v-if="alarmDelail.alarmLevel == 1"
                style="color: #2589ee;"
                >{{ alarmDelail.alarmLevel | alarmLevelFormatter(that) }}</span
              >
              <span
                v-else-if="alarmDelail.alarmLevel == 2"
                style="color: #fff386;"
                >{{ alarmDelail.alarmLevel | alarmLevelFormatter(that) }}</span
              >
              <span
                v-else-if="alarmDelail.alarmLevel == 3"
                style="color: #e97e61;"
                >{{ alarmDelail.alarmLevel | alarmLevelFormatter(that) }}</span
              >
              <span v-else style="color: #ffffff;">{{
                alarmDelail.alarmLevel | alarmLevelFormatter(that)
              }}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="告警类型:">
              <span class="item-content">
                {{ alarmDelail.alarmRuleType | alarmRuleTypeFormatter(that) }}
              </span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="告警时间:">
              <span class="item-content">
                {{ alarmDelail.datetime || "--" }}
              </span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="关联告警规则:">
              <span class="item-content">
                {{ alarmDelail.ruleDescribe || "--" }}
              </span>
            </el-form-item>
          </el-row>
          <el-row v-if="alarmDelail.measure">
            <el-form-item label="告警曲线:">
              <span class="item-content">
                <ul class="measure-list">
                  <li
                    v-for="(item, index) in alarmDelail.measure.split(',')"
                    :key="index"
                    @click="alarmCurve(item, alarmDelail)"
                  >
                    {{ item
                    }}{{
                      alarmDelail.measure.split(",").length - 1 == index
                        ? ""
                        : "、"
                    }}
                  </li>
                </ul>
              </span>
            </el-form-item>
          </el-row>
          <!--下划线-->
          <el-divider
            v-if="
              alarmDelail.handleStatus == 1 || alarmDelail.handleStatus == 2
            "
          ></el-divider>
          <el-row v-if="alarmDelail.handleStatus == 1">
            <el-form-item label="处理结果:">
              <span class="item-content"
                >已派单<el-button type="text" @click="orderDetail"
                  >工单详情</el-button
                ></span
              >
            </el-form-item>
          </el-row>
          <div v-if="alarmDelail.handleStatus == 2">
            <el-row>
              <el-form-item label="处理结果:">
                <span class="item-content">{{
                  alarmDelail.handlerRemark
                }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="处理人:">
                <span class="item-content">{{ alarmDelail.handler }}</span>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="处理时间:">
                <span class="item-content">{{ alarmDelail.handlerTime }}</span>
              </el-form-item>
            </el-row>
          </div>
        </el-form>
      </template>
      <template slot="foot">
        <el-button
          type="primary"
          v-if="alarmDelail.handleStatus == 0 || alarmDelail.handleStatus == 1"
          @click="batchProcessClick"
          class="btn-none"
          v-hasPermi="['monitor:alarm:handle']"
          >设为已处理</el-button
        >
        <el-button
          type="primary"
          v-if="alarmDelail.handleStatus == 0"
          @click="batchCreateOrder"
          class="btn-none"
          v-hasPermi="['monitor:alarm:order']"
          >创建工单</el-button
        >
      </template>
    </modal>
    <!--已处理弹框-->
    <batch-process-modal
      :detailObj="detailObj"
      :dialogVisibleBatchProcess="dialogVisibleBatchProcess"
      @batchProcessClosed="batchProcessClosed"
      @refreshList="refreshList"
    ></batch-process-modal>
    <!--抢修工单-->
    <add-standard-repair-order-modal
      :repOrdInfo="repOrdInfo"
      :dialogVisibleStandard="dialogVisibleStandard"
      @standardClosed="standardClosed"
      @refreshList="refreshList"
    ></add-standard-repair-order-modal>
    <!--查看工单详情-->
    <dealwith-standard-modal
      :repOrdInfo="repOrdInfo"
      :dialogVisibleDealwithStandard.sync="dialogVisibleDealwithStandard"
      @dealwith-standard-closed="dealwithStandardClosed"
    ></dealwith-standard-modal>
  </div>
</template>

<script>
import modal from "hlcx-qiankun-commonservice/components/Modal";
import AddStandardRepairOrderModal from "hlcx-qiankun-commonservice/components/viewComponents/AddStandardRepairOrderModal";
import DealwithStandardModal from "hlcx-qiankun-commonservice/components/viewComponents/DealwithStandardModal";
import { mapState } from "vuex";
import { GET_WORK_ORDER_ALARMID } from "hlcx-qiankun-commonservice/utils/api/maintain/repairOrder";
import BatchProcessModal from "./BatchProcessModal";

export default {
  name: "alarmDetailModel",
  components: {
    modal,
    BatchProcessModal,
    AddStandardRepairOrderModal,
    DealwithStandardModal
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    })
  },
  props: {
    dialogVisibleAlarmDetail: {
      type: Boolean,
      default: false
    },
    alarmDelail: {
      type: Object
    }
  },
  filters: {
    // 告警等级
    handleStatusFormatter(val) {
      let dictLabel = "";
      if (val == 0) {
        dictLabel = "未处理";
      } else if (val == 1) {
        dictLabel = "已派单";
      } else if (val == 2) {
        dictLabel = "已处理";
      } else if (val == 3) {
        dictLabel = "已复归";
      }
      return dictLabel;
    },
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
    },
    alarmRuleTypeFormatter(val, that) {
      if (val) {
        let dictLabel = "";
        if (that.dict.alarm_type) {
          that.dict.alarm_type.forEach(item => {
            if (item.dictValue == val) {
              dictLabel = item.dictLabel;
            }
          });
          return dictLabel;
        }
      } else {
        return "--";
      }
    }
  },
  data() {
    return {
      that: this,
      repairOrderInfo: {}, // 工单信息
      dialogVisibleBatchProcess: false, // 处理弹框
      detailObj: {}, // 处理信息
      multipleSelection: [],
      alarmId: [],
      // 工单信息
      repOrdInfo: {
        type: "", // 工单类型（抢修工单1，缺陷工单2、巡视工单3、预试工单4）
        come: 0, // 工单出处0当前，10告警
        click: "", // add新增 编辑editor 复制copy 查看view
        title: "", // 标题
        state: "" // 状态 0 为新建 1 创建人存草稿，2 处理人待处理，3 处理人存草稿，4 已完成
      },
      dialogVisibleStandard: false, // 基本工单（抢修工单1，缺陷工单2、预试工单4）
      dialogVisibleDealwithStandard: false //查看工单(标准工单)
    };
  },
  methods: {
    //  关闭弹框
    alarmDelailClosed() {
      this.$emit("alarmDelailClosed");
    },
    // 点击设备跳转设备管理
    jump(val) {
      console.log(val);
      let newUrl = this.$router.resolve({
        path: `/index/equipmentParameter/devArchives/${this.encode(
          String(val)
        )}/look`
      });
      sessionStorage.removeItem("indexId");
      window.open(newUrl.href, "_blank");
    },
    // 处理弹框
    batchProcessClick() {
      this.alarmId = [];
      this.alarmId.push(this.alarmDelail.id);
      if (this.alarmId.length > 0) {
        this.detailObj = {
          ids: this.alarmId,
          handlerRemark: "",
          title: "告警处理"
        };
        this.dialogVisibleBatchProcess = true;
      }
    },
    refreshList() {
      this.$emit("refreshList");
      this.alarmDelailClosed();
    },
    //  关闭处理弹框
    batchProcessClosed() {
      this.detailObj = {};
      this.dialogVisibleBatchProcess = false;
    },
    //  创建工单
    batchCreateOrder() {
      var arr = [];
      this.multipleSelection = [];
      this.multipleSelection.push(this.alarmDelail);
      this.alarmId.push(this.alarmDelail.id);
      for (var i = 0; i < this.multipleSelection.length; i++) {
        arr.push(this.multipleSelection[i].orgId);
      }
      if (arr.length > 0) {
        var newArr = [...new Set(arr)];
        if (newArr.length === 1) {
          this.repOrdInfo = {
            type: 1,
            come: 10,
            click: "add",
            state: "0",
            title: "新建抢修工单",
            multipleSelection: this.multipleSelection,
            alarmId: this.alarmId
          };
          this.dialogVisibleStandard = true;
        } else {
          this.$message.error("不可合并派单多个用电单位的告警信息");
        }
      } else {
        this.$message.error("错了哦，请选择告警数据");
      }
    },
    // 关闭抢修工单
    standardClosed() {
      this.dialogVisibleStandard = false;
    },
    //  工单详情
    orderDetail() {
      GET_WORK_ORDER_ALARMID(this.alarmDelail.id).then(res => {
        this.repOrdInfo = {
          type: 1,
          come: 10,
          click: "view",
          state: res.data.state,
          title: "查看抢修工单",
          id: res.data.id
        };
        this.dialogVisibleDealwithStandard = true;
      });
    },
    dealwithStandardClosed() {
      this.dialogVisibleDealwithStandard = false;
    },
    //  点击量测量跳转告警曲线
    alarmCurve(measuret, alarmDelail) {
      let newUrl = this.$router.resolve({
        path: `/index/alarmCurve/${this.encode(
          String(alarmDelail.id)
        )}/${this.encode(String(measuret))}`
      });
      window.open(newUrl.href, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
.item-content {
  display: inline-block;
  color: #ffffff;
  padding-right: 20px;
}
::v-deep.el-button--text {
  margin-left: 10px;
  padding: 0;
}
::v-deep.el-divider {
  width: 92%;
  background-color: transparent;
  border-top: 1px dashed #2a80b1;
  margin: 24px auto;
}
.measure-list {
  display: flex;
  flex-wrap: wrap;
  li {
    margin-right: 10px;
    color: #66b1ff;
    cursor: pointer;
  }
}
</style>
