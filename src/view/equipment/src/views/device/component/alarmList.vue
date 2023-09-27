<template>
  <div class="alarmList">
    <el-select
      v-model="reportQuery"
      @change="tablereport(0)"
      :placeholder="placeholder"
    >
      <el-option
        v-for="item in powerQueryList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
    <el-select
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
    </el-select>
    <!-- 遥测量 -->
    <el-form
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
        <!-- 下拉列表 -->
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
              </el-table-column> -->

        <el-table-column
          align="center"
          v-if="editorlook"
          label="操作"
          width="135"
        >
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
    </el-form>
    <!-- 遥信量 -->
    <el-form
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
        <!-- <el-table-column align="center" prop="alarmLevel" label="告警等级">
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
        <el-table-column
          align="center"
          v-if="editorlook"
          label="操作"
          width="135"
        >
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
    </el-form>
    <pagination
      :pageSize="reportmodule.pageSize"
      :total="reportmodule.total"
      :currentPage1.sync="reportmodule.pageNum"
      @handleCurrent="reportcurrent"
      @size-change="handleSizeChange"
    ></pagination>
  </div>
</template>
<script>
import pagination from "hlcx-qiankun-commonservice/components/pagination";
import {
  GET_METER_SELECT,
  GET_ELE_ALARM,
  DELETE_ELE_ALRAM,
  UPDATE_ELE_ALRAM
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
    }
  },
  components: { pagination },
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
      // 行修改开关
      editrow: true,
      that: this,
      //告警量的量测量模块
      reportmodule: {
        pageNum: 1,
        pageSize: 10,
        list: [],
        total: ""
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
          crossLowerLimit: ""
          //越上下线告警等级
          // alarmLevel: "",
          //越上上线下下线告警等级
          // crossAlarmLevel: ""
        },
        measurRules: {
          upperLimit: [{ validator: upperLimit, trigger: "blur" }],
          lowerLimit: [{ validator: lowerLimit, trigger: "blur" }]
          // alarmLevel: [{ validator: alarmLevel, trigger: "blur" }],
          // crossAlarmLevel: [{ validator: crossAlarmLevel, trigger: "blur" }]
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
          this.tablereport(0);
        }
      });
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
    //选择动环监控后加载告警
    tablereport(val) {
      if (val == 0) {
        this.reportmodule.pageNum = 1;
        this.editrow = true;
      }
      var params = {
        pageNum: this.reportmodule.pageNum,
        pageSize: this.reportmodule.pageSize
      };
      GET_ELE_ALARM(this.reportQuery, this.reportValue, params).then(e => {
        e.rows.forEach(i => {
          this.$set(i, "editflag", false);
          if (this.reportValue == 1) {
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
        this.reportmodule.list = e.rows;
        this.reportmodule.total = e.total;
      });
    },

    //告警量分页
    reportcurrent(e) {
      this.editrow = true;
      this.reportmodule.pageNum = e;
      this.tablereport();
    },
    handleSizeChange(val) {
      this.editrow = true;
      this.reportmodule.pageNum = 1;
      this.reportmodule.pageSize = val;
      this.tablereport();
    },
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
              this.tablereport(0);
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
        this.editrow = true;
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
<style lang="scss" scoped></style>
