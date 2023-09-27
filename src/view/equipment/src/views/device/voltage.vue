<!-- 变压器 -->
<template>
  <div class="voltage">
    <div class="action">
      <span
        style="display:inline-block;margin-right:10px;"
        :class="{ 'btn-block': voltageInfo.releInterval }"
      >
        <el-button
          type="primary"
          @click="relation"
          class="btn-none"
          v-hasPermi="['ema:releinterval:update']"
          >关联间隔</el-button
        >
      </span>
      <el-button
        type="primary"
        class="btn-none"
        plain
        @click="editvoltage"
        v-hasPermi="['ema:room:update']"
        >编辑</el-button
      >
      <el-button
        type="danger"
        class="btn-none"
        plain
        @click="delect"
        v-hasPermi="['ema:room:delete']"
        >删除</el-button
      >
    </div>
    <div class="device_infor">
      <ul class="baseInfo">
        <li class="long" :title="voltageInfo.name">
          <p>
            名称：<span>{{ voltageInfo.name }}</span>
          </p>
        </li>
        <li>
          <p>
            运行状态：<span>{{
              voltageInfo.state == 1 ? "停运" : "在运"
            }}</span>
          </p>
        </li>
        <li class="long">
          <p>
            投运日期：<span>{{ voltageInfo.launchTime }}</span>
          </p>
        </li>
      </ul>
      <!-- <ul class="systemInfo">
        <li>
          <i class="icon-kaoshishichang"></i>
          <p>3<span>年</span></p>
          <span>运行时间</span>
        </li>
        <li>
          <i class="icon-gaojing"></i>
          <p>3<span>年</span></p>
          <span>历史警告</span>
        </li>
        <li>
          <i class="icon-baogao"></i>
          <p>3<span>年</span></p>
          <span>巡视报告</span>
        </li>
        <li>
          <i class="icon-guzhangquexian"></i>
          <p>3<span>年</span></p>
          <span>累计缺陷</span>
        </li>
        <li>
          <i class="icon-winfo-icon-chakanbaogao"></i>
          <p>3<span>年</span></p>
          <span>实验报告</span>
        </li>
        <li>
          <i class="icon-qiangxiuyujing"></i>
          <p>3<span>年</span></p>
          <span>检修(抢修)</span>
        </li>
      </ul> -->
    </div>
    <div class="device_table">
      <ul class="table_head">
        <li @click="tabChange('1')" :class="{ active: tabActive == 1 }">
          <span>基本信息</span>
        </li>
        <li @click="tabChange('2')" :class="{ active: tabActive == 2 }">
          <span>量测量</span>
        </li>
        <li @click="tabChange('3')" :class="{ active: tabActive == 3 }">
          <span>阈值设置</span>
        </li>
        <li @click="tabChange('4')" :class="{ active: tabActive == 4 }">
          <span>告警设置</span>
        </li>
        <li @click="tabChange('5')" :class="{ active: tabActive == 5 }">
          <span>附属信息</span>
        </li>
      </ul>
      <!-- 基本信息 -->
      <div class="common_infors" v-show="tabActive == 1">
        <div class="imgs">
          <img :src="voltageInfo.pic1" alt="" />
          <img :src="voltageInfo.pic2" alt="" />
        </div>
        <ul class="infor">
          <li>
            <p class="inforTitle">设备信息</p>
            <div class="font">
              <p>
                设备类型：<span>{{ voltageInfo.equipName }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                厂家：<span>{{ voltageInfo.factory }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                品牌：<span>{{ voltageInfo.brand }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                型号：<span>{{ voltageInfo.modelNum }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                备注：<span>{{ voltageInfo.remark }}</span>
              </p>
            </div>
          </li>
          <li class="inline">
            <p class="inforTitle">设计参数</p>
            <div
              class="font"
              v-for="item in voltageInfo.equipmentList"
              :key="item.id"
            >
              <p>
                {{ item.paramName }}：<span
                  >{{ item.paramVal || item.defaultVal }}{{ item.unit }}</span
                >
              </p>
            </div>
            <div
              class="font"
              v-for="item in voltageInfo.roomList"
              :key="item.id"
            >
              <p>
                {{ item.paramName }}：<span
                  >{{ item.paramVal || item.defaultVal }}{{ item.unit }}</span
                >
              </p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 附属信息 -->
      <ul class="common_auxiliary" v-show="tabActive == 5">
        <li>
          创建人：<span>{{ voltageInfo.createBy }}</span>
        </li>
        <li>
          创建时间：<span>{{
            voltageInfo.createTime ? voltageInfo.createTime.substr(0, 10) : ""
          }}</span>
        </li>
        <br />
        <li>
          最后维护人：<span>{{ voltageInfo.updateBy }}</span>
        </li>
        <li>
          最后维护时间：<span>{{
            voltageInfo.updateTime ? voltageInfo.updateTime.substr(0, 10) : ""
          }}</span>
        </li>
      </ul>
      <!-- 量测量 -->
      <div class="addmonitor" v-show="tabActive == 2">
        <div class="monitor_option">
          <p>
            关联间隔：{{ voltageInfo.releIntervalName }}
            <i
              @click="delectInterval"
              v-if="voltageInfo.releInterval"
              class="el-icon-close btn-none"
              v-hasPermi="['ema:releinterval:update']"
            ></i>
          </p>
          <el-select
            v-model="monitor.value"
            @change="monitorChange(0)"
            placeholder="请选择监控设备"
          >
            <el-option
              v-for="item in monitor.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <div style="clear: both;"></div>
        </div>
        <el-table :data="monitor.table" stripe style="width: 100%">
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
        </el-table>
        <pagination
          :pageSize="monitor.pageSize"
          :total="monitor.total"
          :currentPage1.sync="monitor.pageNum"
          @handleCurrent="current"
          @size-change="handleSizeChange"
        ></pagination>
      </div>
      <!-- 告警设置 -->
      <div class="report" v-show="tabActive == 4">
        <rule-list
          :id="voltageInfo.releInterval"
          placeholder="请选择监控设备"
          treeType="8"
          :orgid="voltageInfo.orgId"
          v-if="tabActive == 4"
          :editorlook="false"
        ></rule-list>
      </div>
      <!-- 阈值设置 -->
      <div class="report" v-show="tabActive == 3">
        <alarm-list
          placeholder="请选择监控设备"
          :id="voltageInfo.releInterval"
          :orgid="voltageInfo.orgId"
          v-if="tabActive == 3"
          treeType="8"
          :editorlook="false"
        ></alarm-list>

        <!-- <el-select v-model="report.value" placeholder="请选择监控设备">
          <el-option
            v-for="item in monitor.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-table :data="report.tableData" style="width: 100%">
          <el-table-column prop="ruleName" align="center" label="策略名称">
          </el-table-column>
          <el-table-column prop="ruleType" align="center" label="策略类型">
            <template slot-scope="scope">
              <template v-if="scope.row.ruleType == '01'">系统策略</template>
              <template v-else>用户策略</template>
            </template>
          </el-table-column>
          <el-table-column
            prop="describe"
            :show-overflow-tooltip="true"
            align="center"
            label="规则"
          >
          </el-table-column>
          <el-table-column align="center" label="告警类型">
            <template slot-scope="scope">
              {{ scope.row.alarmType | nameFilter(that, "alarm_type") }}
            </template>
          </el-table-column>
          <el-table-column prop="address" align="center" label="告警等级">
            <template slot-scope="scope">
              {{ scope.row.alarmLevel | nameFilter(that, "alert_level") }}
            </template>
          </el-table-column>
        </el-table> -->
        <!-- <el-select
          style="float:right"
          v-model="reportValue"
          @change="reportChange"
          :disabled="!report.value"
          placeholder="请选择"
        >
          <el-option
            v-for="item in dict.measurement_type"
            :label="item.dictLabel"
            :value="item.dictValue"
            :key="item.dictCode"
          ></el-option>
        </el-select> -->
        <!-- 遥测量 -->
        <!-- <el-table
          v-if="reportValue == 2"
          stripe
          :data="report.measureList"
          style="width:100%;"
        >
          <el-table-column align="center" prop="measureName" label="遥测量">
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="upperLimit" label="越上限值">
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              <template>
                {{ scope.row.upperLimit }}
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="lowerLimit" label="越下限值"
            ><template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              <template>
                {{ scope.row.lowerLimit }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="crossUpperLimit"
            label="越上上限值"
            ><template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              <template>
                {{ scope.row.crossUpperLimit }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="crossLowerLimit"
            label="越下下限值"
          >
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              <template>
                {{ scope.row.crossLowerLimit }}
              </template>
            </template>
          </el-table-column> -->
        <!-- 下拉列表 -->
        <!-- <el-table-column
            align="center"
            prop="alarmLevel"
            label="越上下限告警等级"
            width="136"
          >
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              <template>
                {{ scope.row.alarmLevel | nameFilter(that, "alert_level") }}
              </template>
            </template>
          </el-table-column> -->
        <!-- 下拉列表 -->
        <!-- <el-table-column
            align="center"
            prop="crossAlarmLevel"
            label="越上上限/下下限告警等级"
          >
            <template slot-scope="scope">
              <template>
                {{
                  scope.row.crossAlarmLevel | nameFilter(that, "alert_level")
                }}
              </template>
            </template>
          </el-table-column> -->
        <!-- <el-table-column prop="isDelayAlarm" label="上下限延迟告警">
              </el-table-column> -->
        <!-- <el-table-column prop="delay" label="延迟时间(s)">
              </el-table-column> -->
        <!-- </el-table> -->
        <!-- 遥信量 -->
        <!-- <el-table
          v-if="reportValue == 1"
          stripe
          :data="report.alarmList"
          style="width:100%;"
        >
          <el-table-column align="center" prop="measureName" label="遥信量">
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="alarmVal" label="告警值">
            <template slot-scope="scope">
              {{ scope.row.alarmVal == null ? "--" : scope.row.alarmVal }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="eventZero"
            label="值变为0时的事件"
          >
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              {{
                scope.row.eventZero | nameFilter(that, "teleindication_type")
              }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="eventOne"
            label="值变为1时的事件"
          >
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.eventOne | nameFilter(that, "teleindication_type") }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="alarmLevel" label="告警等级">
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              {{ scope.row.alarmLevel | nameFilter(that, "alert_level") }}
            </template>
          </el-table-column> -->
        <!-- <el-table-column prop="isDelayAlarm" label="延迟告警">
              </el-table-column> -->
        <!-- <el-table-column prop="delay" label="延迟时间(s)">
              </el-table-column> -->
        <!-- </el-table> -->
        <!-- <pagination
          :pageSize="10"
          :total="report.total"
          @handleCurrent="reportcurrent"
        ></pagination> -->
      </div>
    </div>
    <!-- 关联间隔 -->
    <commonModal
      class="device"
      @on-closed="relationModal.active = false"
      customClass="Miniform"
      :visible="relationModal.active"
    >
      <template slot="head">
        <span>关联间隔</span>
      </template>
      <template slot="body">
        <el-form
          :model="relationModal.form"
          :rules="relationModal.formRules"
          ref="relation"
          label-width="100px"
        >
          <el-form-item label="屏柜">
            <el-select v-model="relationModal.form.panel" @change="panelchange">
              <el-option
                v-for="item in panelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="间隔" prop="releInterval">
            <el-select v-model="relationModal.form.releInterval">
              <el-option
                v-for="item in intervalList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="relationModal.active = false">取消</el-button>
        <el-button type="primary" @click="subrelation">确认</el-button>
      </template>
    </commonModal>
    <!-- 修改变压器 -->
    <device-modal
      v-if="voltageModal.active"
      :active="voltageModal.active"
      :id="parId"
      :category="4"
      euqiptreeId="4"
      :categoryName="voltageModal.row.equipName"
      @cancelForm="cancelForm"
      @subForm="voltageSub"
      title="修改变压器"
      :orgid="voltageInfo.orgId"
    ></device-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import pagination from "hlcx-qiankun-commonservice/components/pagination";
import * as deviceServe from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import commonModal from "hlcx-qiankun-commonservice/components/Modal";
import deviceModal from "./component/deviceModel";
import { mapMutations } from "vuex";
import alarmList from "./component/alarmList";
import ruleList from "./component/ruleList";

export default {
  filters: {
    nameFilter: (val, that, dictKey) => {
      if (val && that.dict[dictKey].length > 0) {
        for (let i in that.dict[dictKey]) {
          if (that.dict[dictKey][i].dictValue == val) {
            return that.dict[dictKey][i].dictLabel;
          }
        }
      }
    }
  },
  components: { pagination, commonModal, deviceModal, alarmList, ruleList },
  computed: {
    ...mapState(["dict"]),
    parId() {
      return this.decode(this.$route.params.query).split("-")[2];
    }
  },
  data() {
    return {
      that: this,
      voltageInfo: "",
      tabActive: 1,
      reportValue: "1",
      rmdData: [],
      tableData: [],
      //关联间隔
      relationModal: {
        active: false,
        form: {
          releInterval: "",
          panel: ""
        },
        formRules: {
          releInterval: [
            { required: true, message: "请选择间隔", trigger: "blur" }
          ]
        }
      },
      //修改变压器
      voltageModal: {
        active: false,
        row: ""
      },
      // 屏柜列表
      panelList: [],
      // 间隔列表
      intervalList: [],
      //表计列表
      monitor: {
        list: [],
        pageNum: 1,
        pageSize: 10,
        value: "",
        total: "",
        table: []
      },
      //告警信息
      report: {
        measureList: "",
        alarmList: "",
        pageNum: 1,
        value: "",
        total: "",
        tableData: []
      }
    };
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus"]),
    //删除关联的间隔
    delectInterval() {
      deviceServe.DELETE_ELE_INTERVAL(this.parId).then(e => {
        if (e.code == 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.monitor.table = [];
          this.monitor.list = [];
          this.monitor.value = "";
          this.tabActive = 1;
          this.initvoltage();
        }
      });
    },
    //修改变压器
    editvoltage() {
      this.voltageModal.row = this.voltageInfo;
      this.voltageModal.active = true;
    },
    cancelForm() {
      this.voltageModal.active = false;
    },
    voltageSub(e) {
      deviceServe.EDIT_DEVICE(e).then(e => {
        if (e.code == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.initvoltage();
          this.deviceTreeStatus(true);

          this.voltageModal.active = false;
        }
      });
    },
    //提交关联间隔
    subrelation() {
      this.$refs.relation.validate(e => {
        if (e) {
          deviceServe
            .UPDATE_INTERVAAL(this.parId, this.relationModal.form.releInterval)
            .then(e => {
              if (e.code == 200) {
                this.relationModal.active = false;
                this.initvoltage();
                this.deviceTreeStatus(true);
              }
            });
        }
      });
    },
    //关联间隔
    relation() {
      this.relationModal.active = true;
      var parId = this.decode(this.$route.params.query).split("-")[1];
      //屏柜
      deviceServe.GET_METER_SELECT(parId, "5").then(e => {
        this.panelList = e.data;
      });
    },
    //屏柜动，获取间隔
    panelchange(e) {
      deviceServe.GET_TREE(e).then(e => {
        this.intervalList = e.data;
      });
    },
    //通过关联的间隔获取监控设备
    getEtm() {
      deviceServe
        .GET_METER_SELECT(this.voltageInfo.releInterval, "8")
        .then(e => {
          this.monitor.list = e.data;
          if (this.tabActive == 2) {
            this.monitor.value = e.data[0].id;
            this.monitorChange();
          } else {
            this.report.value = e.data[0].id;
            //查询对应的告警策略
            this.reportChange();
          }
        });
    },
    initvoltage() {
      this.tabActive = 1;
      var par = this.parId;
      deviceServe.GET_DEVICE_INFO(par).then(e => {
        this.voltageInfo = e.data;
      });
    },
    //删除设备
    delect() {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除当前设备!",
        showCancelButton: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          deviceServe.DELETE_ELE_ROOM(this.parId).then(e => {
            if (e.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.deviceTreeStatus(true);
              var routeArr = this.decode(this.$route.params.query)
                .split("-")
                .slice(0, 2);
              this.$router.push({
                params: {
                  query: this.encode(String(routeArr.join("-")))
                }
              });
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    current(e) {
      this.monitor.pageNum = e;
      this.monitorChange();
    },
    handleSizeChange(val) {
      this.monitor.pageNum = 1;
      this.monitor.pageSize = val;
      this.monitorChange();
    },
    reportcurrent(e) {
      this.report.pageNum = e;
      this.reportChange();
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
    //量测量中表计的选择
    monitorChange(e) {
      if (e == 0) {
        this.monitor.pageNum = 1;
      }
      var params = {
        pageNum: this.monitor.pageNum,
        pageSize: this.monitor.pageSize
      };
      if (this.monitor.value != "") {
        deviceServe.GET_MEASURE_LIST(this.monitor.value, params).then(e => {
          this.monitor.table = e.rows;
          this.monitor.total = e.total;
        });
      }
    },
    //告警信息中的表计选择
    reportChange() {
      var params = {
        pageSize: 10,
        pageNum: this.report.pageNum,
        electricroomId: this.report.value
      };
      deviceServe.GET_DEV_ALARMRULE(params).then(e => {
        this.report.total = e.total;
        this.report.tableData = e.rows;
      });
      // deviceServe
      //   .GET_ELE_ALARM(this.report.value, this.reportValue, params)
      //   .then(e => {
      //     if (this.reportValue == 1) {
      //       this.report.alarmList = e.rows;
      //     } else {
      //       this.report.measureList = e.rows;
      //     }
      //   });
    },
    tabChange(action) {
      if (action == 2 || action == 3 || action == 4) {
        if (this.voltageInfo.releInterval) {
          //加载表计
          this.getEtm();
        } else {
          this.$message({
            message: "请先添加间隔",
            type: "warning"
          });
          return false;
        }
      }
      this.tabActive = action;
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-block {
  pointer-events: none;
}
.btn-block .el-button {
  color: #fff;
  background-color: #a0cfff;
  border-color: #a0cfff;
  cursor: pointer;
}
.addmonitor {
  padding: 20px 20px 0 20px;
  .monitor_option {
    margin-bottom: 20px;
    p {
      display: inline-block;
      line-height: 31.6px;
      font-size: 14px;
      i {
        cursor: pointer;
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
}
.report {
  padding: 30px 20px 0 20px;
  ::v-deep .el-input__inner {
    height: 30px !important;
    line-height: 30px;
  }
  ::v-deep .el-select {
    .el-input {
      &.is-disabled {
        .el-input__inner {
          background-color: rgba(235, 235, 235, 0.15);
        }
      }
      .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }
    .el-input__icon {
      line-height: 30px;
    }
  }
  ::v-deep table {
    .cell {
      font-size: 14px;
      font-weight: normal;
      line-height: 1;
      p {
        font-size: 14px;
      }
    }
  }
}
.common_infors {
  font-size: 0;
  .imgs {
    width: 300px;
    height: auto;
    padding-right: 100px;
    position: relative;
    display: inline-block;
    margin-right: 100px;
    &::after {
      content: "";
      position: absolute;
      width: 1px;
      height: 400px;
      right: 0;
      top: 0;
      background: #172e9f;
    }
    img {
      width: 200px;
      height: 200px;
      border-radius: 10px;
      border-color: #01cdf6;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .infor {
    width: calc(100% - 400px);
    display: inline-block;
    vertical-align: top;
    li {
      display: inline-block;
      vertical-align: top;
      margin-right: 50px;
      width: 200px;
      &:last-child {
        margin-right: 0;
      }
      .inforTitle {
        font-size: 20px;
        color: #0ceaf3;
        margin-bottom: 30px;
      }
      .font {
        p {
          font-size: 14px;
          color: white;
        }
        margin-bottom: 20px;
      }
      &.inline {
        width: calc(100% - 250px);
        .font {
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
