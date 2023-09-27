/* * @Author: liangyuxuan * @Date: 2021-08-23 14:19:17 * @Last Modified by:
liangyuxuan * @Last Modified time: 2021-08-23 14:19:17 * 告警策略设置 */
<template>
  <div class="alarmList">
    <el-select
      v-model="reportQuery"
      @change="getAlarmList(1)"
      :placeholder="placeholder"
    >
      <el-option
        v-for="item in powerQueryList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
    <el-button
      v-if="editorlook"
      type="primary"
      style="margin-left:10px;"
      @click="openAlarmModal"
      class="btn-none"
      v-hasPermi="['ema:elemeasure:add']"
      >添加告警</el-button
    >
    <el-button
      style="margin-left:10px;width: 88px;height: 31.6px;"
      type="danger"
      plain
      @click="deleteBatchRule"
      :disabled="!reportmodule.selectItems.length"
      v-hasPermi="['ema:elemeasure:delete']"
      >删除告警</el-button
    >
    <!-- <el-select
      style="float:right;"
      v-model="reportValue"
      placeholder="请选择"
      :disabled="!reportQuery"
      @change="tablereport(0)"
    >
      <el-option
        v-for="item in dict.measurement_type"
        :label="item.dictLabel"
        :value="item.dictValue"
        :key="item.dictCode"
      ></el-option>
    </el-select> -->
    <!-- 告警策略列表 -->
    <el-table
      :data="reportmodule.list"
      @selection-change="tablelistSelect"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="ruleName" align="center" label="策略名称">
      </el-table-column>
      <!-- <el-table-column prop="ruleType" align="center" label="策略类型">
        <template slot-scope="scope">
          <template v-if="scope.row.ruleType == '01'">系统策略</template>
          <template v-else>用户策略</template>
        </template>
      </el-table-column> -->
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
      <el-table-column label="操作" v-if="editorlook" align="center">
        <template slot-scope="scope">
          <span style="display:none">1</span>
          <el-button
            class="nomargin"
            type="primary"
            plain
            v-hasPermi="['ema:elealarm:update']"
            @click="openEditAlarmModal(scope.row)"
          >
            编辑
          </el-button>

          <el-button
            type="danger"
            class="btn-none"
            v-hasPermi="['ema:elemeasure:delete']"
            plain
            @click="deleteDeviceRule(scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 遥测量 -->
    <!--  <el-form
      inline-message
      :model="reportForm.measure"
      ref="reportMeasure"
      :rules="reportForm.measurRules"
    >
      <el-table
        v-if="reportValue == 2"
        stripe
        :data="reportmodule.list"
        style="width:100%;"
        empty-text="请从量测量列表中选择所需告警量"
      >
        <el-table-column
          align="center"
          prop="measureName"
          label="遥测量"
          show-overflow-tooltip
        >
          <template slot="header" slot-scope="head">
            <p>{{ head.column.label }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="upperLimit" label="越上限值">
          <template slot="header" slot-scope="head">
            <p>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-form-item prop="upperLimit">
                <el-input
                  type="number"
                  v-model.trim="reportForm.measure.upperLimit"
                ></el-input>
              </el-form-item>
            </template>
            <template v-else>
              {{ scope.row.upperLimit }}
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="lowerLimit" label="越下限值"
          ><template slot="header" slot-scope="head">
            <p>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-form-item prop="lowerLimit">
                <el-input
                  type="number"
                  v-model.trim="reportForm.measure.lowerLimit"
                ></el-input>
              </el-form-item>
            </template>
            <template v-else>
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
            <template v-if="scope.row.editflag">
              <el-form-item prop="crossUpperLimit">
                <el-input
                  type="number"
                  v-model.trim="reportForm.measure.crossUpperLimit"
                ></el-input>
              </el-form-item>
            </template>
            <template v-else>
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
            <template v-if="scope.row.editflag">
              <el-form-item prop="crossLowerLimit">
                <el-input
                  type="number"
                  v-model.trim="reportForm.measure.crossLowerLimit"
                ></el-input>
              </el-form-item>
            </template>
            <template v-else>
              {{ scope.row.crossLowerLimit }}
            </template>
          </template>
        </el-table-column>
        < 下拉列表 -->
    <!-- <el-table-column
      align="center"
      prop="alarmLevel"
      label="越上下限告警等级"
      width="136"
    >
      <template slot="header" slot-scope="head">
        <span class="required">*</span>
        {{ head.column.label }}
      </template>
      <template slot-scope="scope">
        <template v-if="scope.row.editflag">
          <el-form-item prop="alarmLevel">
            <el-select
              :disabled="
                !(
                  reportForm.measure.upperLimit || reportForm.measure.lowerLimit
                )
              "
              v-model="reportForm.measure.alarmLevel"
            >
              <el-option
                :key="item.dictCode"
                v-for="item in dict.alert_level"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
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
      <template slot="header" slot-scope="head">
        <span class="required">*</span>
        {{ head.column.label }}
      </template>
      <template slot-scope="scope">
        <template v-if="scope.row.editflag">
          <el-form-item prop="crossAlarmLevel">
            <el-select
              :disabled="
                !(
                  reportForm.measure.crossUpperLimit ||
                  reportForm.measure.crossLowerLimit
                )
              "
              v-model="reportForm.measure.crossAlarmLevel"
            >
              <el-option
                :key="item.dictCode"
                v-for="item in dict.alert_level"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          {{ scope.row.crossAlarmLevel | nameFilter(that, "alert_level") }}
        </template>
      </template>
    </el-table-column> -->
    <!-- <el-table-column prop="isDelayAlarm" label="上下限延迟告警">
              </el-table-column> -->
    <!-- <el-table-column prop="delay" label="延迟时间(s)">
              </el-table-column> 

        <el-table-column align="center" label="操作" width="135">
          <template slot="header" slot-scope="head">
            <p>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-button
                class="nomargin btn-none"
                @click="reportSub(scope.row)"
                type="primary"
                plain
                >保存</el-button
              >
              <el-button
                class="nomargin btn-none"
                @click="cancelRow(scope.row)"
                type="danger"
                plain
                >取消</el-button
              >
            </template>
            <template v-else>
              <el-button
                class="nomargin btn-none"
                @click="rowEdit(scope.row)"
                type="primary"
                plain
                v-hasPermi="['ema:elealarm:update']"
                >编辑</el-button
              >
              <el-button
                @click="reportDel(scope.row)"
                class="nomargin btn-none"
                type="danger"
                plain
                v-hasPermi="['ema:elealarm:delete']"
                >删除</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-form>-->
    <!-- 遥信量 -->
    <!-- <el-form
      inline-message
      :model="reportForm.signal"
      ref="reportSignal"
      :rules="reportForm.signalRules"
    >
      <el-table
        v-if="reportValue == 1"
        stripe
        :data="reportmodule.list"
        style="width:100%;"
        empty-text="请从量测量列表中选择所需告警量"
      >
        <el-table-column
          align="center"
          prop="measureName"
          label="遥信量"
          show-overflow-tooltip
        >
          <template slot="header" slot-scope="head">
            <p>{{ head.column.label }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="alarmVal" label="告警值">
          <template slot="header" slot-scope="head">
            <p><span>*</span>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-form-item prop="alarmVal">
                <el-select v-model="reportForm.signal.alarmVal">
                  <el-option label="1" :value="1"></el-option>
                  <el-option label="0" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              {{ scope.row.alarmVal == null ? "--" : scope.row.alarmVal }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="eventZero"
          label="值变为0时的事件"
        >
          <template slot="header" slot-scope="head">
            <p><span>*</span>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-form-item prop="eventZero">
                <el-select v-model="reportForm.signal.eventZero">
                  <el-option
                    :key="item.dictCode"
                    v-for="item in dict.teleindication_type"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              {{
                scope.row.eventZero | nameFilter(that, "teleindication_type")
              }}
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="eventOne" label="值变为1时的事件">
          <template slot="header" slot-scope="head">
            <p><span>*</span>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-form-item prop="eventOne">
                <el-select v-model="reportForm.signal.eventOne">
                  <el-option
                    :key="item.dictCode"
                    v-for="item in dict.teleindication_type"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              {{ scope.row.eventOne | nameFilter(that, "teleindication_type") }}
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="alarmLevel" label="告警等级">
          <template slot="header" slot-scope="head">
            <p><span>*</span>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-form-item prop="alarmLevel">
                <el-select v-model="reportForm.signal.alarmLevel">
                  <el-option
                    :key="item.dictCode"
                    v-for="item in dict.alert_level"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              {{ scope.row.alarmLevel | nameFilter(that, "alert_level") }}
            </template>
          </template>
        </el-table-column>
        <! <el-table-column prop="isDelayAlarm" label="延迟告警"></el-table-column>
        <! <el-table-column prop="delay" label="延迟时间(s)">
              </el-table-column>
        <el-table-column align="center" label="操作" width="135">
          <template slot="header" slot-scope="head">
            <p>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-button
                class="nomargin btn-none"
                @click="reportSub(scope.row)"
                type="primary"
                plain
                >保存</el-button
              >
              <el-button
                class="nomargin"
                @click="cancelRow(scope.row)"
                type="danger"
                plain
                >取消</el-button
              >
            </template>
            <template v-else>
              <el-button
                class="nomargin btn-none"
                @click="rowEdit(scope.row)"
                type="primary"
                plain
                v-hasPermi="['ema:elealarm:update']"
                >编辑</el-button
              >
              <el-button
                @click="reportDel(scope.row)"
                class="nomargin btn-none"
                type="danger"
                plain
                v-hasPermi="['ema:elealarm:delete']"
                >删除</el-button
              >
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-form> -->
    <pagination
      :pageSize="reportmodule.pageSize"
      :total="reportmodule.total"
      :currentPage1.sync="reportmodule.pageNum"
      @handleCurrent="reportcurrent"
      @size-change="handleSizeChange"
    ></pagination>
    <common-modal
      :visible="alarmModal.active"
      @on-closed="alaramModalClose"
      customClass="Maxform"
    >
      <template slot="head">
        <span
          >新增告警策略
          <i class="el-icon-refresh" @click="getDeviceRulesList"></i
        ></span>
      </template>
      <template slot="body">
        <el-table
          class="modal"
          ref="modaltable"
          :data="alarmModal.list"
          style="width: 100%"
          @selection-change="alarmModalSelectChange"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
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
        </el-table>
        <el-button @click="openAlarmNewTab"
          >没有合适的告警策略,点击新增</el-button
        >
      </template>
      <template slot="foot">
        <el-button @click="alaramModalClose">取消</el-button>
        <el-button
          type="primary"
          @click="addDeviceRule"
          :disabled="!alarmModal.selectList.length"
          >确认</el-button
        >
      </template>
    </common-modal>
<!--    <device-seting-modal-->
<!--      v-if="deviceAlarmModal.active"-->
<!--      :dialogVisibleUserAlarm.sync="deviceAlarmModal.active"-->
<!--      title="修改告警策略"-->
<!--      source="40"-->
<!--      :id="deviceAlarmModal.id"-->
<!--      :electricroomId="reportQuery"-->
<!--      @dialogVisibleUserAlarmClosed="closeEditAlarmModal"-->
<!--    ></device-seting-modal>-->
  </div>
</template>
<script>
import commonModal from "hlcx-qiankun-commonservice/components/Modal";
import pagination from "hlcx-qiankun-commonservice/components/pagination";
// import deviceSetingModal from "@/system/alarmStrategy/AddUserAlarm";
import {
  GET_METER_SELECT,
  // GET_ELE_ALARM,
  DELETE_ELE_ALRAM,
  UPDATE_ELE_ALRAM,
  GET_DEV_ALARMRULE,
  DELETE_DEV_ALARMRULE,
  GET_ALARMRULE_LIST,
  ADD_DEVICET_RULE,
  // eslint-disable-next-line no-unused-vars
  DELETE_BATCH_DEVICE_RULE
} from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { mapState } from "vuex";
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
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    })
  },
  mounted() {
    this.init();
  },
  //默认都是配电室告警量的数据
  props: {
    editorlook: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: "请选择动环监控"
    },
    treeType: {
      type: String,
      default: "9"
    },
    id: {
      type: String
    },
    orgid: {
      type: String
    }
  },
  components: {
    pagination,
    commonModal,
    // deviceSetingModal
  },
  data() {
    var upperLimit = (rule, value, callback) => {
      if (this.reportForm.measure.crossUpperLimit && !value) {
        callback(new Error("请输入越上限值"));
      } else {
        callback();
      }
    };
    var lowerLimit = (rule, value, callback) => {
      if (this.reportForm.measure.crossLowerLimit && !value) {
        callback(new Error("请输入越下限值"));
      } else {
        callback();
      }
    };
    var alarmLevel = (rule, value, callback) => {
      if (
        (this.reportForm.measure.upperLimit ||
          this.reportForm.measure.lowerLimit) &&
        value
      ) {
        callback();
      } else if (
        this.reportForm.measure.upperLimit ||
        this.reportForm.measure.lowerLimit
      ) {
        callback(new Error("请选择告警等级"));
      } else {
        callback();
      }
    };
    var crossAlarmLevel = (rule, value, callback) => {
      if (
        (this.reportForm.measure.crossUpperLimit ||
          this.reportForm.measure.crossLowerLimit) &&
        value
      ) {
        callback();
      } else if (
        this.reportForm.measure.crossUpperLimit ||
        this.reportForm.measure.crossLowerLimit
      ) {
        callback(new Error("请选择告警等级"));
      } else {
        callback();
      }
    };
    return {
      // 行修改开关
      editrow: true,
      that: this,
      //告警量的量测量模块
      reportmodule: {
        pageNum: 1,
        pageSize: 10,
        list: [],
        selectItems: [],
        total: ""
      },
      //单条设备告警的modal
      deviceAlarmModal: {
        active: false,
        id: ""
      },
      //告警策略的modal
      alarmModal: {
        active: false,
        list: [],
        selectList: []
      },
      //配电室的动环监控
      powerQueryList: [],
      //告警量中的设备的选择
      reportQuery: "",
      reportValue: "2",
      //告警量校验信息
      reportForm: {
        measure: {
          // 越上限值
          upperLimit: "",
          // 越下限值
          lowerLimit: "",
          // 越上上限值
          crossUpperLimit: "",
          // 越下下限值
          crossLowerLimit: "",
          //越上下线告警等级
          alarmLevel: "",
          //越上上线下下线告警等级
          crossAlarmLevel: ""
        },
        measurRules: {
          upperLimit: [{ validator: upperLimit, trigger: "blur" }],
          lowerLimit: [{ validator: lowerLimit, trigger: "blur" }],
          alarmLevel: [{ validator: alarmLevel, trigger: "blur" }],
          crossAlarmLevel: [{ validator: crossAlarmLevel, trigger: "blur" }]
        },
        signal: {
          alarmVal: "",
          eventZero: "",
          eventOne: "",
          alarmLevel: ""
        },
        signalRules: {
          alarmVal: [
            { required: true, message: "请选择告警值", trigger: "blur" }
          ],
          eventZero: [
            { required: true, message: "请选择事件", trigger: "blur" }
          ],
          eventOne: [
            { required: true, message: "请选择事件", trigger: "blur" }
          ],
          alarmLevel: [
            { required: true, message: "请选择告警等级", trigger: "blur" }
          ]
        }
      }
    };
  },
  methods: {
    init() {
      //加载告警信息
      GET_METER_SELECT(this.id, this.treeType).then(e => {
        this.powerQueryList = e.data;
        this.reportQuery = e.data.length ? e.data[0].id : "";
        if (this.powerQueryList.length) {
          this.getAlarmList();
          // this.tablereport(0);
        }
      });
    },
    //跳转到新增告警策略页面
    openAlarmNewTab() {
      const href = this.$router.resolve({
        path: "/index/system/alarmStrategy"
      });
      // console.log(href);
      window.open(href.href, "_blank");
    },
    rowEdit(value) {
      if (this.editrow) {
        value.editflag = true;
        this.editrow = false;
        if (value.type == 1) {
          this.reportForm.signal = value.subinfo;
        } else {
          this.reportForm.measure = value.subinfo;
        }
      } else {
        this.$message({
          message: "请将现有的修改或者取消",
          type: "warning"
        });
      }
    },
    cancelRow(value) {
      value.editflag = false;
      this.editrow = true;
    },
    //打开修改单条策略的弹框
    openEditAlarmModal(item) {
      this.deviceAlarmModal.id = item.id;
      this.deviceAlarmModal.active = true;
    },
    //关闭修改单条策略的弹框
    closeEditAlarmModal() {
      this.deviceAlarmModal.active = false;
      this.reportmodule.pageNum = 1;
      this.getAlarmList(1);
    },
    //打开添加告警的弹框
    openAlarmModal() {
      this.alarmModal.active = true;
      this.alarmModal.pageNum = 1;

      this.alarmModal.selectList = [];
      this.getDeviceRulesList();
    },
    //关闭添加告警的弹框
    alaramModalClose() {
      this.alarmModal.active = false;
    },
    // 设备告警策略的分页
    reportcurrent(e) {
      this.reportmodule.pageNum = e;
      this.getAlarmList();
    },
    handleSizeChange(val) {
      this.reportmodule.pageNum = 1;
      this.reportmodule.pageSize = val;
      this.getAlarmList();
    },
    // 新增设备告警策略的分页
    alarmModalcurrent(e) {
      this.alarmModal.pageNum = e;
    },
    //设备告警策略列表
    getAlarmList(value) {
      var params = {
        pageSize: this.reportmodule.pageSize,
        pageNum: value ? value : this.reportmodule.pageNum,
        electricroomId: this.reportQuery
      };
      if (value == 1) {
        this.reportmodule.pageNum = 1;
      }
      GET_DEV_ALARMRULE(params).then(e => {
        this.reportmodule.total = e.total;
        this.reportmodule.list = e.rows;
      });
    },
    //获取未分配的策略列表
    getDeviceRulesList() {
      var params = {
        electricroomId: this.reportQuery,
        orgId: this.orgid
      };
      GET_ALARMRULE_LIST(params).then(e => {
        this.alarmModal.list = e.data;
      });
    },
    //批量选择告警策略
    tablelistSelect(selection) {
      this.reportmodule.selectItems = selection;
    },
    //批量删除告警策略
    deleteBatchRule() {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "告警策略已经被使用，删除后策略将会失效。",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          var paramsList = this.reportmodule.selectItems.map(i => {
            return { electricroomId: this.reportQuery, ruleId: i.id };
          });
          DELETE_BATCH_DEVICE_RULE(paramsList).then(() => {
            this.getAlarmList(1);
          });
        })
        .catch(() => {});
    },
    deleteDeviceRule(item) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "告警策略已经被使用，删除后该策略将会失效。",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          DELETE_DEV_ALARMRULE({
            electricroomId: this.reportQuery,
            ruleId: item.row.id
          }).then(() => {
            this.getAlarmList(1);
          });
        })
        .catch(() => {});
    },
    alarmModalSelectChange(e) {
      this.alarmModal.selectList = e;
      // e.forEach(i => {
      //   var obj = {
      //     ruleId: i.id,
      //     electricroomId: this.reportQuery
      //   };
      //   this.alarmModal.selectList.push(obj);
      // });
    },
    //添加设备告警策略
    addDeviceRule() {
      var selectList = [];
      var submitList = [];
      if (this.alarmModal.selectList.length > 1) {
        selectList = this.alarmModal.selectList.filter(i => {
          {
            var first = this.alarmModal.selectList[0];
            return (
              i.alarmLevel == first.alarmLevel && i.alarmType == first.alarmType
            );
          }
        });
        if (selectList.length > 1) {
          this.$message.error(
            "该间隔下已配置同类型和等级的告警策略，不可重复配置。"
          );
          return false;
        } else {
          selectList = this.alarmModal.selectList;
        }
      } else {
        selectList = this.alarmModal.selectList;
      }
      selectList.forEach(i => {
        var obj = {
          ruleId: i.id,
          electricroomId: this.reportQuery
        };
        submitList.push(obj);
      });
      ADD_DEVICET_RULE(submitList).then(() => {
        this.alarmModal.active = false;
        this.reportmodule.pageNum = 1;
        this.getAlarmList(1);
      });
    },
    //选择动环监控后加载告警
    // tablereport(val) {
    //   if (val == 0) {
    //     this.reportmodule.pageNum = 1;
    //     this.editrow = true;
    //   }
    //   var params = {
    //     pageNum: this.reportmodule.pageNum,
    //     pageSize: 10
    //   };
    //   GET_ELE_ALARM(this.reportQuery, this.reportValue, params).then(e => {
    //     e.rows.forEach(i => {
    //       this.$set(i, "editflag", false);
    //       if (this.reportValue == 1) {
    //         i.subinfo = {
    //           alarmVal: i.alarmVal,
    //           eventZero: i.eventZero,
    //           eventOne: i.eventOne,
    //           alarmLevel: i.alarmLevel || "3"
    //         };
    //       } else {
    //         i.subinfo = {
    //           upperLimit: i.upperLimit,
    //           lowerLimit: i.lowerLimit,
    //           crossUpperLimit: i.crossUpperLimit,
    //           crossLowerLimit: i.crossLowerLimit,
    //           alarmLevel: i.alarmLevel || "1",
    //           crossAlarmLevel: i.crossAlarmLevel || "2"
    //         };
    //       }
    //     });
    //     this.reportmodule.list = e.rows;
    //     this.reportmodule.total = e.total;
    //   });
    // },

    //告警量分页
    // reportcurrent(e) {
    //   this.editrow = true;
    //   this.reportmodule.pageNum = e;
    //   this.tablereport();
    // },
    //删除告警参数
    reportDel(data) {
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
          DELETE_ELE_ALRAM(data.id).then(e => {
            if (e.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.reportmodule.pageNum = 1;
              this.editrow = true;
              this.tablereport();
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    //保存修改的告警量
    reportSub(data) {
      // reportMeasure 遥测
      // reportSignal 遥信
      // <!--遥信1 遥测2-->
      var refs = "";
      var valueArray;
      switch (this.reportValue) {
        case "1":
          refs = "reportSignal";
          for (var s in data.subinfo) {
            this.reportForm.signal[s] = data.subinfo[s];
          }
          valueArray = Object.values(this.reportForm.signal);
          break;
        case "2":
          refs = "reportMeasure";
          for (var m in data.subinfo) {
            this.reportForm.measure[m] = data.subinfo[m];
          }
          valueArray = Object.values(this.reportForm.measure);
          break;
      }
      valueArray = valueArray.filter(i => {
        return i > 0;
      });
      if (!valueArray.length) {
        data.editflag = false;
      } else {
        this.$refs[refs].validate(e => {
          if (e) {
            data.subinfo["id"] = data.id;
            UPDATE_ELE_ALRAM(data.subinfo).then(e => {
              if (e.code == 200) {
                for (var i in data.subinfo) {
                  data[i] = data.subinfo[i];
                }
                data.editflag = false;
                this.editrow = true;
              }
            });
          }
        });
      }
      // data.subinfo["id"] = data.id;
      // deviceServe.UPDATE_ELE_ALRAM(data.subinfo).then(e => {
      //   if (e.code == 200) {
      //     for (var i in data.subinfo) {
      //       data[i] = data.subinfo[i];
      //     }
      //     this.$message({
      //       message: "修改成功",
      //       type: "success"
      //     });
      //     data.editflag = false;
      //   }
      // });
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  max-height: 420px;
  overflow-y: auto;
}
</style>
