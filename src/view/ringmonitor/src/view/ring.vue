<template>
  <div class="main-content">
    <el-form
      :model="request"
      ref="request"
      label-width="auto"
      clss="filter-form"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item label="用电单位:" prop="orgId">
            <el-select
              v-model.trim="request.orgId"
              placeholder="请选择用电单位"
              @change="orgChange"
              filterable
            >
              <el-option
                v-for="item in orgList"
                :key="item.orgId"
                :label="item.name"
                :value="item.orgId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="配电室:" prop="orderSwitchroom">
            <el-select
              v-model.trim="request.orderSwitchroom"
              placeholder="请选择配电室"
              @change="orderSwitchroomChange"
            >
              <el-option
                v-for="item in roomList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--量测量-->
    <div class="realtime-content" v-show="realTimeList.length > 0">
      <ul>
        <li
          v-for="(item, index) in realTimeList"
          :key="index"
          @click="realTimeChange(item, index)"
          :class="realTimeActive == index ? 'active' : ''"
        >
          <!--四角-->
          <div class="angle angle-left-top"></div>
          <div class="angle angle-left-bottom"></div>
          <div class="angle angle-right-top"></div>
          <div class="angle angle-right-bottom"></div>
          <el-tooltip
            :content="item.name"
            :disabled="item.name && item.name.length > 10 ? false : true"
            class="item"
            effect="dark"
            :visible-arrow="false"
            placement="bottom"
          >
            <div class="realtime-content-title">
              {{ item.name | ellipsis(10) }}
            </div>
          </el-tooltip>
          <div class="realtime-content-data">
            <div class="realtime-content-data-label">
              {{ item.measureName }}
            </div>
            <div
              :class="
                item.isAlarm == 1
                  ? 'realtime-content-data-value active'
                  : 'realtime-content-data-value'
              "
            >
              {{ item.value || "--"
              }}<i
                v-if="String(item.value)"
                :style="item.unit ? 'font-size:14px;' : ''"
                >{{ item.unit }}</i
              >
            </div>
          </div>
        </li>
        <i></i
        ><i></i
        ><i></i
        ><i></i
        ><i></i
        ><i></i
        ><i></i>
      </ul>
    </div>
    <!--曲线-->
    <div class="realtime-curve" v-show="realTimeList.length > 0">
      <div class="realtime-curve-title">
        <i class="iconfont icon-weibiaoti--"></i><span>历史曲线</span>
      </div>
      <div class="realtime-curve-screen">
        <el-form
          :model="request"
          ref="request"
          label-width="auto"
          class="filter-form"
        >
          <div class="monitor-curve-screen-title monitor-curve-screen-input">
            {{ request.name }}
          </div>
          <div class="monitor-curve-screen-input" style="width: 168px">
            <el-form-item label="周期:" prop="cycle">
              <el-select
                v-model.trim="request.cycle"
                size="small"
                placeholder="请选择周期"
                @change="cycleChange"
              >
                <el-option label="日" value="1"></el-option>
                <el-option label="月" value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div
            class="monitor-curve-screen-input"
            style="width: 200px"
            v-if="request.cycle == 1"
          >
            <el-form-item label="时间:" prop="day">
              <el-date-picker
                v-model.trim="request.day"
                type="date"
                placeholder="选择时间"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :clearable="false"
                :editable="false"
                size="small"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div
            class="monitor-curve-screen-input"
            style="width: 200px"
            v-if="request.cycle == 2"
          >
            <el-form-item label="时间:" prop="day">
              <el-date-picker
                v-model.trim="request.month"
                type="month"
                placeholder="选择时间"
                value-format="yyyy-MM"
                format="yyyy-MM"
                :clearable="false"
                :editable="false"
                size="small"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form>
      </div>
      <!--echars曲线-->
      <div
        id="ring-chart"
        ref="ringChart"
        class="chart-statistics"
        style="width: 100%;"
      ></div>
    </div>
    <div v-if="roomList.length == 0" class="el__empty-block">
      <span>暂无配电室</span>
    </div>
    <div v-else-if="realTimeList.length == 0" class="el__empty-block">
      <span>未关联动环监控设备</span>
    </div>
  </div>
</template>

<script>
import { Chart } from "@antv/g2";
import { GET_SYSTEM_ORG_LIST } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import { GET_TREE } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { GET_MONITOR_MEASURE_ROOMID } from "hlcx-qiankun-commonservice/utils/api/ringMonitor/index";
import {
  GET_MONITOR_ALARM_BY_METER,
  GET_MONITOR_HISTORY_LIST_BY_15MINUTE,
  GET_MONITOR_HISTORY_LIST_BY_Day
} from "hlcx-qiankun-commonservice/utils/api/monitor/monitor";

export default {
  name: "ring",
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > Date.now() - 8.64e6;
        }
      },
      request: {
        orgId: "", // 用电单位id,
        orderSwitchroom: "",
        name: "", // 选中的名字
        id: "", // 表计id
        labels: "",
        dev: "",
        sn: "",
        pkey: "",
        cycle: "1", // 周期
        value: "max",
        day: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd"), // 日
        month: this.jstool.jshandle.getcurrentTime("yyyy-MM") // 月
      },
      orgList: [], // 用电单位列表
      roomList: [], // 配电室列表
      //数据选中，默认第一个
      realTimeActive: 0,
      realTimeList: [], // 动环监控量测量数据
      // 历史曲线定义chart
      chart1: {},
      //历史数据
      chartData: [],
      // topic
      topic: []
    };
  },
  methods: {
    // 查询组织list
    getOrgList() {
      GET_SYSTEM_ORG_LIST().then(res => {
        // 只展示用电企业
        var data = res.data;
        this.request.orgId = data[0].orgId;
        this.orgList = data;
        // 查询配电室list
        GET_TREE(this.request.orgId).then(res => {
          this.roomList = res.data;
          if (res.data.length > 0) {
            this.request.orderSwitchroom = res.data[0].id;
            this.getallMonitorMeasureByRoomId();
          }
        });
      });
    },
    // 切换用电单位
    orgChange(val) {
      // 查询配电室list
      this.roomList = [];
      this.request.orderSwitchroom = "";
      GET_TREE(val).then(res => {
        this.roomList = res.data;
        if (res.data.length > 0) {
          this.request.orderSwitchroom = res.data[0].id;
          this.getallMonitorMeasureByRoomId();
        }
      });
    },
    // 切换配电室
    orderSwitchroomChange() {
      this.getallMonitorMeasureByRoomId();
    },
    //  点击数据
    realTimeChange(item, index) {
      console.log(item, index);
      this.realTimeActive = index;
      this.request.name = item.name + "-" + item.measureName;
      this.request.id = item.id;
      this.request.labels = item.labels;
      this.request.dev = item.dev;
      this.request.sn = item.sn;
      this.request.pkey = item.pkey;
      this.getHistoryList();
    },
    // 加载数据
    getallMonitorMeasureByRoomId() {
      this.realTimeList = [];
      this.realTimeActive = 0;
      GET_MONITOR_MEASURE_ROOMID(this.request.orderSwitchroom).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.value = "";
            item.isAlarm = 0;
            item.alarmTime = null;
          });
          this.realTimeList = res.data;
          this.request.name = res.data[0].name + "-" + res.data[0].measureName;
          this.request.id = res.data[0].id;
          this.request.labels = res.data[0].labels;
          this.request.dev = res.data[0].dev;
          this.request.sn = res.data[0].sn;
          this.request.pkey = res.data[0].pkey;
          this.getHistoryList();
          this.chart1.destroy();
          this.$nextTick(() => {
            this.chart1 = new Chart({
              container: "ring-chart", // 指定图表容器 ID
              autoFit: true,
              height: 277,
              appendPadding: [0, 25, 0, 20]
            });
          });
          var topicList = ["alarm/001/#"];
          res.data.forEach(item => {
            topicList.push("/edge/" + item.pkey + "/" + item.sn + "/rtg");
          });
          topicList = [...new Set(topicList)];
          this.topic = topicList;
          this.subscribe();
        }
      });
    },
    //------------mqtt-------------------
    // 订阅mqtt列表
    subscribe() {
      if (this.topic.length > 0) {
        this.connectMqtt();
        this.topic.forEach(item => {
          window.mqttClient.unsubscribe(item);
          window.mqttClient.subscribe(item);
          var str = {
            ver: "v2.2.2",
            pKey: item.split("/")[2],
            sn: item.split("/")[3],
            type: "rtg",
            seq: new Date().getTime()
          };
          window.mqttClient.publish(
            `/cloud/${item.split("/")[2]}/${item.split("/")[3]}/rtg/call`,
            JSON.stringify(str)
          );
        });
      } else {
        return false;
      }
    },
    // 接受mqtt返回数据
    connectMqtt() {
      window.mqttClient.addListener("message", this.mqttMessage);
    },
    mqttMessage(topic, message) {
      if (topic.indexOf("edge") >= 0) {
        var data = this.jstool.jshandle.mqttAdapter(topic, message);
        this.gatewayToDraw(data);
      }
      if (topic.indexOf("alarm") != -1) {
        var res = JSON.parse(message.toString());
        if (res.orgId == this.request.orgId) {
          if (res.dev) {
            //量测量告警数据会有dev
            this.meterMonitorDetailsAlarm(res);
          } else {
            //网关 01掉线
            this.gatewayMonitorAlarm(res);
          }
        }
      }
    },
    //  处理mqtt数据
    gatewayToDraw(message) {
      var res = message;
      var topic = "/edge/" + res.pKey + "/" + res.sn + "/rtg";
      var nowDate = Date.now();
      var alarmReset = sessionStorage.getItem("alarmReset");
      this.topic.forEach(item => {
        if (item == topic) {
          res.devs.forEach(i => {
            let mydevs = this.realTimeList.filter(j => {
              return j.dev == i.dev;
            });
            if (mydevs.length > 0) {
              mydevs.forEach(devItem => {
                i.d.forEach(ElemItem => {
                  if (ElemItem.m == devItem.labels) {
                    if (devItem.type == 1) {
                      if (ElemItem.dq && ElemItem.dq != 0) {
                        devItem.alarmTime = null;
                        devItem.value = "异常";
                        devItem.isAlarm = 1;
                      } else {
                        if (
                          !devItem.alarmTime ||
                          nowDate - devItem.alarmTime > alarmReset
                        ) {
                          devItem.alarmTime = null;
                          devItem.isAlarm = 0;
                          devItem.value = "正常";
                        }
                      }
                    } else {
                      if (ElemItem.dq && ElemItem.dq == 1) {
                        devItem.alarmTime = null;
                        devItem.value = "";
                        devItem.isAlarm = 1;
                      } else {
                        devItem.value = ElemItem.v;
                        if (
                          !devItem.alarmTime ||
                          nowDate - devItem.alarmTime > alarmReset
                        ) {
                          devItem.alarmTime = null;
                          devItem.isAlarm = 0;
                        }
                      }
                    }
                  }
                });
              });
            }
          });
        }
      });
    },
    //表计掉线告警01 或者量测量越上限、月下限
    meterMonitorDetailsAlarm(message) {
      var res = message;
      if (res.alarmType == "01") {
        // 基本量测量判断sn
        this.topic.forEach(item => {
          if (item && item.indexOf(res.clientId) >= 0) {
            if (this.realTimeList.length) {
              this.realTimeList.forEach(item => {
                if (item.dev == res.dev) {
                  if (item.type == 1) {
                    item.value = "";
                    item.isAlarm = 1;
                  } else {
                    item.value = "";
                    item.isAlarm = 1;
                  }
                }
              });
            }
          }
        });
      } else {
        this.topic.forEach(item => {
          if (item && item.indexOf(res.clientId) >= 0) {
            if (this.realTimeList.length) {
              this.realTimeList.forEach(item => {
                if (item.dev == res.dev && res.measure == item.labels) {
                  item.alarmTime = new Date(res.datetime).getTime();
                  console.log(res.measure, res.datetime);
                  if (item.type == 1) {
                    item.value = "异常";
                    item.isAlarm = 1;
                  } else {
                    item.isAlarm = 1;
                  }
                }
              });
            }
          }
        });
      }
    },
    //  网关掉线
    gatewayMonitorAlarm(message) {
      var res = message;
      if (res.alarmType == "01") {
        // 基本量测量判断sn
        this.topic.forEach(item => {
          if (item && item.indexOf(res.clientId) >= 0) {
            if (this.realTimeList.length) {
              this.realTimeList.forEach(item => {
                if (item.sn == res.clientId) {
                  if (item.type == 1) {
                    item.value = "";
                    item.isAlarm = 1;
                  } else {
                    item.value = "";
                    item.isAlarm = 1;
                  }
                }
              });
            }
          }
        });
      }
    },
    //  历史曲线---------------------------------------
    //  选择周期
    cycleChange() {
      this.chart1.clear(); // 清理所有图形
      this.getHistoryList();
    },
    //  搜索
    search() {
      this.chart1.clear(); // 清理所有图形
      this.getHistoryList();
    },
    // 历史曲线
    getHistoryList() {
      if (this.request.id) {
        this.getMonitorAlarmbymeter(this.request.id, this.request.labels);
      }
    },
    //  获取表计某个量测量的告警信息
    getMonitorAlarmbymeter(meterId, labels) {
      GET_MONITOR_ALARM_BY_METER(meterId, labels)
        .then(res => {
          if (res.data) {
            this.request.upperLimit = res.data.upperLimit;
            this.request.lowerLimit = res.data.lowerLimit;
          } else {
            this.request.upperLimit = null;
            this.request.lowerLimit = null;
          }
          if (this.request.cycle == 1) {
            this.getHistoryBy15Minute();
          } else if (this.request.cycle == 2) {
            this.getHistoryByDay();
          }
        })
        .catch(() => {
          if (this.request.cycle == 1) {
            this.getHistoryBy15Minute();
          } else if (this.request.cycle == 2) {
            this.getHistoryByDay();
          }
        });
    },
    //  按15分钟历史数据查询
    getHistoryBy15Minute() {
      let data = {
        tag: this.request.labels,
        begintime: this.request.day,
        endTime: this.request.day,
        sn: this.request.sn,
        dev: this.request.dev
      };
      GET_MONITOR_HISTORY_LIST_BY_15MINUTE(data).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            if (this.request.upperLimit) {
              item.upperLimit = this.request.upperLimit;
            }
            if (this.request.lowerLimit) {
              item.lowerLimit = this.request.lowerLimit;
            }
            item.date = this.jstool.jshandle.filtertime(item.time, "HH:mm");
            item.value = item.v;
          });
        }
        this.chartData = res.data;
        this.chart1.clear(); // 清理所有图形
        this.curveChart();
      });
    },
    // 按日历史数据查询
    getHistoryByDay() {
      let data = {
        tag: this.request.labels,
        begintime: this.request.month,
        endTime: this.request.month,
        sn: this.request.sn,
        dev: this.request.dev,
        type: this.request.value
      };
      GET_MONITOR_HISTORY_LIST_BY_Day(data).then(res => {
        res.data.forEach(item => {
          if (this.request.upperLimit) {
            item.upperLimit = this.request.upperLimit;
          }
          if (this.request.lowerLimit) {
            item.lowerLimit = this.request.lowerLimit;
          }
          item.date = this.jstool.jshandle.filtertime(item.time, "yyyy-MM-dd");
          item.value = item.v;
        });
        this.chart1.clear(); // 清理所有图形
        this.chartData = res.data;
        this.curveChart();
      });
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    //  曲线面积图
    curveChart() {
      this.$nextTick(() => {
        let data = this.chartData;
        this.chart1.data(data);
        this.chart1.axis("value", {
          label: {
            offset: 30,
            style: {
              fontSize: 14,
              textAlign: "center",
              fill: "#8A9ECF" // 文本颜色
            }
          },
          line: {
            stroke: "#1F63A3" // 网格线颜色
          },
          grid: {
            line: {
              type: "line",
              style: {
                stroke: "#1F63A3" // 网格线颜色
              }
            }
          }
        });
        this.chart1.axis("date", {
          label: {
            offset: 23,
            style: {
              fontSize: 14,
              textAlign: "center",
              fill: "#8A9ECF" // 文本颜色
            }
          },
          grid: {
            line: {
              type: "line",
              style: {
                stroke: "#1F63A3" // 网格线颜色
              }
            }
          }
        });
        this.chart1.scale({
          value: {
            min: 0,
            nice: true,
            alias: this.request.name
          },
          date: {
            range: [0, 1],
            tickCount: 30,
            type: "cat"
          },
          upperLimit: {
            alias: "上限"
          },
          lowerLimit: {
            alias: "下限"
          }
        });
        this.chart1.tooltip({
          showCrosshairs: true,
          crosshairs: {
            type: "x",
            line: {
              style: {
                lineDash: [3, 3],
                stroke: "#ffffff",
                lineWidth: 2
              }
            }
          },
          domStyles: {
            "g2-tooltip-marker": {
              background: "#EF9734",
              borderRadius: "50%"
            },
            "g2-tooltip": {
              backgroundColor: "rgba(45, 76, 220, 0.4)",
              color: "#CAF2F5",
              fontSize: "12px",
              borderRadius: "4px",
              border: "1px solid #ffffff",
              boxShadow: "none"
            }
          }
        });
        if (data.length > 0) {
          if (data[0].upperLimit) {
            this.chart1.annotation().line({
              start: ["min", data[0].upperLimit],
              end: ["max", data[0].upperLimit],
              style: {
                stroke: "#3859ff",
                lineWidth: 2,
                lineDash: [3, 3]
              },
              text: {
                content: "上限" + data[0].upperLimit,
                position: "95%",
                style: {
                  fill: "#8A9ECF",
                  fontSize: 12,
                  textBaseline: "top",
                  textAlign: "center"
                }
              }
            });
          }
          if (data[0].lowerLimit) {
            this.chart1.annotation().line({
              start: ["min", data[0].lowerLimit],
              end: ["max", data[0].lowerLimit],
              style: {
                stroke: "#ff0000",
                lineWidth: 2,
                lineDash: [3, 3]
              },
              text: {
                position: "95%",
                style: {
                  fill: "#ff0000",
                  fontSize: 12,
                  textBaseline: "top",
                  textAlign: "center"
                },
                content: "下限" + data[0].lowerLimit
              }
            });
          }
          var array = data.concat([]);
          if (array.length > 2) {
            this.chart1.annotation().dataMarker({
              top: true,
              position: [
                array.sort(this.compare("value"))[0].date,
                array.sort(this.compare("value"))[0].value
              ],
              text: {
                content: array.sort(this.compare("value"))[0].value,
                background: {
                  padding: 7,
                  style: {
                    fill: "#00AEEF",
                    fillOpacity: 0.26,
                    lineWidth: 1,
                    stroke: "#43DBF1"
                  }
                },
                style: {
                  fill: "#FFFEFE",
                  fontSize: 12,
                  textBaseline: "top",
                  textAlign: "center"
                }
              },
              line: {
                length: 30
              }
            });
            this.chart1.annotation().dataMarker({
              top: true,
              position: [
                array.sort(this.compare("value"))[array.length - 1].date,
                array.sort(this.compare("value"))[array.length - 1].value
              ],
              text: {
                content: array.sort(this.compare("value"))[array.length - 1]
                  .value,
                background: {
                  padding: 7,
                  style: {
                    fill: "#00AEEF",
                    fillOpacity: 0.26,
                    lineWidth: 1,
                    stroke: "#43DBF1"
                  }
                },
                style: {
                  fill: "#FFFEFE",
                  fontSize: 12,
                  textBaseline: "top",
                  textAlign: "center"
                }
              },
              line: {
                length: 10
              }
            });
          }
          if (this.request.cycle == 3 && data.length > 96) {
            this.chart1.option("slider", {
              start: 0.0,
              end: 0.3,
              trendCfg: {
                isArea: false,
                smooth: true
              },
              textStyle: {
                fill: "#4efcfc",
                fontSize: 12,
                textBaseline: "top"
              }
            });
          } else {
            this.chart1.option("slider", false);
          }
        }
        this.chart1
          .line()
          .position("date*value")
          .shape("smooth")
          .color("#3859ff")
          .tooltip("value*upperLimit*lowerLimit");
        this.chart1
          .area()
          .position("date*value")
          .shape("smooth")
          .color("l(90) 0:#3859ff 1:#071652")
          .tooltip("value*upperLimit*lowerLimit");
        this.chart1.render();
      });
    }
  },
  destroyed() {
    if (this.topic.length > 0) {
      window.mqttClient.removeListener("message", this.mqttMessage);
      this.topic.forEach(item => {
        window.mqttClient.unsubscribe(item);
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.topic.length > 0) {
      window.mqttClient.removeListener("message", this.mqttMessage);
      this.topic.forEach(item => {
        window.mqttClient.unsubscribe(item);
      });
    }
    next();
  },
  mounted() {
    this.$nextTick(() => {
      this.chart1 = new Chart({
        container: "ring-chart", // 指定图表容器 ID
        autoFit: true,
        height: 277,
        appendPadding: [0, 25, 0, 20]
      });
      this.getOrgList();
    });
  }
};
</script>

<style scoped lang="scss">
::v-deep.main-content {
  margin-top: 25px;
  font-size: 14px;
  .realtime-content {
    padding: 0 30px;
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-right: -30px;
      & > i {
        width: 270px;
        margin-right: 30px;
      }
      li {
        position: relative;
        width: 270px;
        padding: 20px 20px 30px;
        background: rgba(0, 186, 255, 0.1);
        margin-bottom: 32px;
        font-size: 18px;
        margin-right: 30px;
        box-sizing: border-box;
        cursor: pointer;
        color: #0ceaf3;
        .realtime-content-title {
        }
        .realtime-content-data {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          .realtime-content-data-value.active {
            color: #ef9734;
          }
        }
        &.active {
          background: rgba(56, 89, 255, 0.6);
          color: #ffffff;
          .angle {
            border-color: #ffffff;
          }
        }
      }
    }
  }
  .realtime-curve {
    padding: 0 30px;
    .realtime-curve-title {
      i {
        font-size: 25px;
        background-image: linear-gradient(0deg, #0b8ee9, #1bdffc);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        vertical-align: sub;
      }
      span {
        font-size: 16px;
        margin-left: 10px;
      }
    }
    .realtime-curve-screen {
      padding-right: 25px;
      .filter-form {
        margin: 20px 0 19px;
        .monitor-curve-screen-input {
          display: inline-block;
          margin-left: 30px;
          .el-form-item {
            margin-bottom: 0;
          }
          .el-form-item__label {
            padding-left: 0;
            line-height: 32px;
          }
          .el-input__inner {
            border: 1px solid #cccccc;
          }
          .el-form-item__content {
            line-height: 32px;
          }
          .el-date-editor.el-input {
            width: 100%;
          }
        }
        .el-button--primary {
          margin-left: 25px;
        }
      }
    }
    .chart-statistics {
      margin-bottom: 20px;
      width: 100%;
    }
  }
}
</style>
