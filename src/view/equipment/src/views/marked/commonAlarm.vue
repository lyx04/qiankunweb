// 弹框中的告警量列表
<template>
  <div class="commonAlarm report">
    <el-select
      v-model="alarm.selecValue"
      placeholder="请选择"
      @change="alarmValueChange"
    >
      <el-option
        v-for="item in dict.measurement_type"
        :key="item.dictValue"
        :value="item.dictValue"
        :label="item.dictLabel"
      ></el-option>
      <!--遥信1 遥测2-->
    </el-select>
    <!-- 遥测量 -->
    <el-form
      :model="reportForm.measure"
      ref="reportMeasure"
      :rules="reportForm.measurRules"
    >
      <el-table
        v-show="alarm.selecValue == 2"
        header-align="center"
        class="modal"
        stripe
        :data="alarm.tableData"
        style="width:100%;"
      >
        <el-table-column prop="euqiptreeName" label="遥测量">
          <template slot="header" slot-scope="head">
            <p>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            <p>{{ scope.row.measureName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="upperLimit" label="越上限值">
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
              {{ scope.row.upperLimit || "--" }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="lowerLimit" label="越下限值"
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
              {{ scope.row.lowerLimit || "--" }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="crossUpperLimit" label="越上上限值"
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
              {{ scope.row.crossUpperLimit || "--" }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="crossLowerLimit" label="越下下限值">
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
              {{ scope.row.crossLowerLimit || "--" }}
            </template>
          </template>
        </el-table-column>
        <!-- 下拉列表 -->
        <!-- <el-table-column prop="alarmLevel" label="越上下限告警等级" width="100">
          <template slot="header" slot-scope="head">
            <span>*</span>
            {{ head.column.label }}
          </template>
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-form-item prop="alarmLevel">
                <el-select
                  :disabled="
                    !(
                      reportForm.measure.upperLimit ||
                      reportForm.measure.lowerLimit
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
          prop="crossAlarmLevel"
          label="越上上限/越下下限告警等级"
        >
          <template slot="header" slot-scope="head">
            <span>*</span>
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
              </el-table-column> -->
        <template v-if="!editOrLook">
          <el-table-column align="center" label="操作" width="100">
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.editflag">
                <el-button
                  class="nomargin"
                  @click="saveAlarm(scope.row)"
                  type="primary"
                  plain
                  >保存</el-button
                >
                <el-button
                  class="nomargin"
                  @click="cancelAlarm(scope.row)"
                  type="danger"
                  plain
                  >取消</el-button
                >
              </template>
              <template v-else>
                <el-button
                  class="nomargin"
                  @click="rowEdit(scope.row)"
                  type="primary"
                  plain
                  >编辑</el-button
                >
                <el-button
                  class="nomargin"
                  @click="delectAlarm(scope.row)"
                  type="danger"
                  plain
                  >删除</el-button
                >
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-form>
    <!-- 遥信量 -->
    <el-form
      :model="reportForm.signal"
      ref="reportSignal"
      :rules="reportForm.signalRules"
    >
      <el-table
        v-show="alarm.selecValue == 1"
        class="modal"
        stripe
        :data="alarm.tableData"
        style="width:100%;"
      >
        <el-table-column prop="euqiptreeName" label="遥信量">
          <template slot="header" slot-scope="head">
            <p>{{ head.column.label }}</p>
          </template>
          <template slot-scope="scope">
            {{ scope.row.measureName }}
          </template>
        </el-table-column>
        <el-table-column prop="alarmVal" label="告警值">
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
              {{ scope.row.alarmVal != null ? scope.row.alarmVal : "--" }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="eventZero" label="值变为0时的事件">
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
        <el-table-column prop="eventOne" label="值变为1时的事件">
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
        <!-- <el-table-column prop="alarmLevel" label="告警等级">
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
        </el-table-column> -->
        <!-- <el-table-column prop="isDelayAlarm" label="延迟告警">
              </el-table-column> -->
        <!-- <el-table-column prop="delay" label="延迟时间(s)">
              </el-table-column> -->
        <template v-if="!editOrLook">
          <el-table-column align="center" label="操作" width="100">
            <template slot="header" slot-scope="head">
              <p>{{ head.column.label }}</p>
            </template>
            <template slot-scope="scope">
              <template v-if="scope.row.editflag">
                <el-button
                  class="nomargin"
                  @click="saveAlarm(scope.row)"
                  type="primary"
                  plain
                  >保存</el-button
                >
                <el-button
                  class="nomargin"
                  @click="cancelAlarm(scope.row)"
                  type="danger"
                  plain
                  >取消</el-button
                >
              </template>
              <template v-else>
                <el-button
                  class="nomargin"
                  @click="rowEdit(scope.row)"
                  type="primary"
                  plain
                  >编辑</el-button
                >
                <el-button
                  class="nomargin"
                  @click="delectAlarm(scope.row)"
                  type="danger"
                  plain
                  >删除</el-button
                >
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-form>
    <pagination
      :pageSize="alarm.pageSize"
      :total="alarm.totalNum"
      :currentPage1.sync="alarm.pageNum"
      @handleCurrent="alarmCurrent"
      @size-change="handleSizeChange"
    ></pagination>
  </div>
</template>
<script>
import { mapState } from "vuex";
import pagination from "hlcx-qiankun-commonservice/components/pagination";
import {
  UPDATE_EPT_ALRAM,
  GET_EQUIPMENT_QUERYEPT_ALARM,
  DELETE_EPT_ALRAM
} from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";

export default {
  components: { pagination },
  props: {
    /**
     * false是编辑
     * true查看
     */
    editOrLook: {
      type: Boolean,
      default: false
    },
    markId: String
  },
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
  mounted() {
    this.getEptAlarmList();
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    })
  },
  methods: {
    // 告警参数
    getEptAlarmList() {
      var params = {
        pageNum: this.alarm.pageNum,
        pageSize: this.alarm.pageSize
      };
      GET_EQUIPMENT_QUERYEPT_ALARM(
        this.markId,
        this.alarm.selecValue,
        params
      ).then(res => {
        res.rows.forEach(i => {
          i["editflag"] = false;
          if (this.alarm.selecValue == 1) {
            i.subinfo = {
              alarmVal: i.alarmVal,
              eventZero: i.eventZero,
              eventOne: i.eventOne
              // alarmLevel: i.alarmLevel || "3"
            };
          } else {
            i.subinfo = {
              upperLimit: i.upperLimit,
              lowerLimit: i.lowerLimit,
              crossUpperLimit: i.crossUpperLimit,
              crossLowerLimit: i.crossLowerLimit
              // alarmLevel: i.alarmLevel || "1",
              // crossAlarmLevel: i.crossAlarmLevel || "2"
            };
          }
        });
        this.alarm.tableData = res.rows;
        this.alarm.totalNum = res.total;
      });
    },
    // 告警参数选择分类
    alarmValueChange() {
      this.editrow = true;
      this.alarm.pageNum = 1;
      this.getEptAlarmList();
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
    //修改告警参数
    saveAlarm(data) {
      // reportMeasure 遥测
      // reportSignal 遥信
      // <!--遥信1 遥测2-->
      var refs = "";
      var valueArray;
      switch (this.alarm.selecValue) {
        case "1":
          refs = "reportSignal";
          for (var s in this.reportForm.signal) {
            data.subinfo[s] = this.reportForm.signal[s];
          }
          valueArray = Object.values(this.reportForm.signal);
          break;
        case "2":
          refs = "reportMeasure";
          console.log(data.subinfo);

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
            UPDATE_EPT_ALRAM(data.subinfo).then(e => {
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
    },
    //不保存告警参数
    cancelAlarm(data) {
      this.editrow = true;
      data.editflag = false;
      if (this.alarm.selecValue == 1) {
        data.subinfo = {
          alarmVal: data.alarmVal,
          eventZero: data.eventZero,
          eventOne: data.eventOne
          // alarmLevel: data.alarmLevel
        };
      } else {
        data.subinfo = {
          upperLimit: data.upperLimit,
          lowerLimit: data.lowerLimit,
          crossUpperLimit: data.crossUpperLimit,
          crossLowerLimit: data.crossLowerLimit
          // alarmLevel: data.alarmLevel,
          // crossAlarmLevel: data.crossAlarmLevel
        };
      }
    },
    //删除选择的遥信
    delectAlarm(data) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前设备型号的告警量",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          // eslint-disable-next-line no-unused-vars
          DELETE_EPT_ALRAM(data.id).then(e => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getEptAlarmList();
          });
        })
        .catch(() => {});
    },
    // 告警翻页器
    alarmCurrent(val) {
      this.alarm.pageNum = val;
      this.getEptAlarmList();
    },
    handleSizeChange(val) {
      this.alarm.pageNum = 1;
      this.alarm.pageSize = val;
      this.getEptAlarmList();
    }
  },
  data() {
    var upperLimit = (rule, value, callback) => {
      if (value && value.length > 20) {
        callback(new Error("数字长度最长20"));
      }
      if (this.reportForm.measure.crossUpperLimit && !value) {
        callback(new Error("请输入越上限值"));
      } else {
        callback();
      }
    };
    var lowerLimit = (rule, value, callback) => {
      if (value && value.length > 20) {
        callback(new Error("数字长度最长20"));
      }
      if (this.reportForm.measure.crossLowerLimit && !value) {
        callback(new Error("请输入越下限值"));
      } else {
        callback();
      }
    };
    // var alarmLevel = (rule, value, callback) => {
    //   if (
    //     (this.reportForm.measure.upperLimit ||
    //       this.reportForm.measure.lowerLimit) &&
    //     value
    //   ) {
    //     callback();
    //   } else if (
    //     this.reportForm.measure.upperLimit ||
    //     this.reportForm.measure.lowerLimit
    //   ) {
    //     callback(new Error("请选择告警等级"));
    //   } else {
    //     callback();
    //   }
    // };
    // var crossAlarmLevel = (rule, value, callback) => {
    //   if (
    //     (this.reportForm.measure.crossUpperLimit ||
    //       this.reportForm.measure.crossLowerLimit) &&
    //     value
    //   ) {
    //     callback();
    //   } else if (
    //     this.reportForm.measure.crossUpperLimit ||
    //     this.reportForm.measure.crossLowerLimit
    //   ) {
    //     callback(new Error("请选择告警等级"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      editrow: true,
      that: this,
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
          crossLowerLimit: ""
          // //越上下线告警等级
          // alarmLevel: "",
          // //越上上线下下线告警等级
          // crossAlarmLevel: ""
        },
        measurRules: {
          upperLimit: [{ validator: upperLimit, trigger: "blur" }],
          lowerLimit: [{ validator: lowerLimit, trigger: "blur" }],
          // alarmLevel: [{ validator: alarmLevel, trigger: "blur" }],
          // crossAlarmLevel: [{ validator: crossAlarmLevel, trigger: "blur" }],
          crossUpperLimit: [
            {
              max: 20,
              trigger: "blur"
            }
          ],
          crossLowerLimit: [
            {
              max: 20,
              trigger: "blur"
            }
          ]
        },
        signal: {
          alarmVal: "",
          eventZero: "",
          eventOne: ""
          // alarmLevel: ""
        },
        signalRules: {
          alarmVal: [
            { required: true, message: "请选择告警值", trigger: "blur" }
          ],
          eventZero: [
            { required: true, message: "请选择事件", trigger: "blur" }
          ],
          eventOne: [{ required: true, message: "请选择事件", trigger: "blur" }]
          // alarmLevel: [
          //   { required: true, message: "请选择告警等级", trigger: "blur" }
          // ]
        }
      },
      // <!--遥信1 遥测2-->
      alarm: {
        selecValue: "1",
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        totalNum: 0
      }
    };
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
  ::v-deep.el-form {
    .el-form-item {
      width: 100%;
      height: 100%;
      &.is-error {
        .el-input__inner {
          border-color: #f56c6c !important;
        }
      }
      .el-form-item__content {
        line-height: 15px;
        height: 100%;
        .el-select {
          width: 80% !important;
        }
        .el-form-item__error {
          display: none !important;
        }
      }
    }
    .el-table {
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
          span {
            color: red;
            font-size: 10px;
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
              // margin-top: 5px;
              height: 20px;
              font-size: 0;
              line-height: 20px;
              .el-input__inner {
                border-color: white;
                background-color: transparent;
                border-radius: 0;
                height: 100%;
                width: 100%;
                color: white;
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
}
</style>
