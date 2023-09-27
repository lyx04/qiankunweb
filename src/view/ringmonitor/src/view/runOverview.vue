<template>
  <div class="Cd ltee">
    <template
      v-if="
        !information &&
          $route.params.query &&
          $route.params.query.split('-').length == 1
      "
    >
      <org-info-view
        :external="false"
        :paramsNum="$route.params.query.split('-')[0]"
        ref="company"
      ></org-info-view>
    </template>
    <div
      style="position:relative;width:73%;height:100%;display:inline-block;border: 1px solid #3486DA;"
      v-show="information"
    >
      <div class="cd_option">
        <tabs
          :tabsData="tabsData"
          :tabsActiveId="tabsActiveId"
          @tabs-change="tabsChange"
        ></tabs>
      </div>

      <!-- 接线图 -->
      <div
        class="drawing"
        :class="{ toplayer: tabsActiveId == 2 }"
        v-show="information"
      >
        <draw-component ref="draw"></draw-component>

        <button
          style="position: absolute;"
          v-show="monitor.button"
          ref="monitorButton"
          @click="openModal"
          v-track-event="{
            category: 'monitor',
            action: 'rtCurve',
            opt_label: 'diagram'
          }"
        >
          实时监控
        </button>
      </div>
      <!-- 通讯工况 -->
      <div
        class="monitorState"
        :class="{ toplayer: tabsActiveId == 1 }"
        v-show="information"
      >
        <div class="stateTitle">{{ drawInfo.orgName }}工况图</div>
        <ul class="legend">
          <!-- <li><span class="circle"></span>未上送信号</li> -->
          <li><span class="circle active"></span>通讯正常</li>
          <li><span class="circle error"></span>通讯中断</li>
        </ul>
        <ul class="stateList">
          <li class="parentli" v-for="item in metersList" :key="item.id">
            <div class="terminal">
              <span
                class="circle"
                :class="{
                  active: item.status,
                  error: !item.status
                }"
              ></span>
              {{ item.name }}
            </div>
            <ul class="devli">
              <li v-for="dev in item.devs" :key="dev.id">
                <span
                  class="circle"
                  :class="{
                    active: dev.status,
                    error: !dev.status
                  }"
                ></span
                ><span class="font">{{ dev.name }}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="angle-border left-top-border"></div>
      <div class="angle-border right-top-border"></div>
      <div class="angle-border left-bottom-border"></div>
      <div class="angle-border right-bottom-border"></div>
    </div>
    <div
      style="width:27%;height:100%;display:inline-block;vertical-align: top;"
      v-if="information"
    >
      <org-chart></org-chart>
    </div>
    <!-- 分割线 -->
    <!-- 选择量测量 -->
    <common-modal
      @on-closed="monitor.active = false"
      customClass="Maxform"
      v-if="monitor.active"
      :visible="monitor.active"
      width="650px"
    >
      <template slot="head">
        <span>选择设备量测量</span>
      </template>
      <template slot="body">
        <el-table :data="monitor.tableData" stripe style="width: 100%">
          <el-table-column align="center" prop="name" label="测量名称">
          </el-table-column>
          <el-table-column align="center" label="查看实时曲线">
            <template slot-scope="scope">
              <i
                style="display:inline-block;width:100%;height:100%"
                class="iconfont icon-shujuzhexiantu"
                @click="openChart(scope.row)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </common-modal>
    <!-- 折线图 -->
    <common-modal
      @on-closed="closeChart"
      customClass="Maxform"
      v-if="monitor.chart"
      :visible="monitor.chart"
      width="650px"
    >
      <template slot="head">
        <span>实时曲线</span>
      </template>
      <template slot="body">
        <div class="items">
          <div class="item">设备名称：{{ monitor.chartName }}</div>
          <div class="item">参数名称：{{ monitor.charParName }}</div>
        </div>
        <div id="chart"></div>
      </template>
      <template slot="foot">
        <el-button @click="closeChart">关闭</el-button>
        <!-- <el-button type="primary" @click="closeChart">取消</el-button> -->
      </template>
    </common-modal>
  </div>
</template>
<script>
import tabs from "hlcx-qiankun-commonservice/components/Tabs";
import CommonModal from "hlcx-qiankun-commonservice/components/Modal";
import orgInfoView from "../../../equipment/src/views/device/company";
import orgChart from "@/components/runOverViewChart";
import { GET_CD } from "hlcx-qiankun-commonservice/utils/api/equipment/draw";
import { Chart } from "@antv/g2";
import {
  GET_DEVICE_INFO,
  QUERY_ROOM_INFO,
  GET_METER_SELECT
} from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import * as overviewServer from "hlcx-qiankun-commonservice/utils/api/monitor/overview";
import drawComponent from "@/components/draw";
var t;
export default {
  // mixins: [dataAdapter],
  data() {
    return {
      //是否加载一次mqttclien.onmessage
      mqMessageFlag: false,
      //通过接线图的列表，构建接线图渲染数据
      messageArray: {},
      //配电室名字
      powername: "",
      //掉线设备的列表
      dqList: [],
      //订阅者列表
      mqttSubList: [],
      devList: [],
      chart: "",
      canvas: "",
      tabsActiveId: 2,
      tabsData: [
        {
          label: "接线图",
          value: 2,
          perms: "monitor:overview:list"
        },
        {
          label: "通讯工况",
          value: 1,
          perms: "monitor:overview:list"
        }
      ],
      //网关及表计列表
      metersList: [],
      monitor: {
        //按钮
        button: false,
        //弹窗
        active: false,
        //折线图弹窗
        chart: false,
        //折线图设备名称
        chartName: "",
        charParName: "",
        //选中的那个节点
        node: "",
        //选中的哪个量测量
        rowNode: "",
        tableData: []
      },
      //接线图信息
      drawInfo: "",
      chartData: [],
      information: false
    };
  },
  components: { tabs, CommonModal,orgInfoView, drawComponent, orgChart },
  beforeRouteUpdate(to, from, next) {
    this.stopTimeout();
    if (this.mqttSubList.length) {
      this.mqttSubList.forEach(i => {
        window.mqttClient.unsubscribe(i);
      });
    }
    next();
    if (!to.params.query) {
      this.information = false;
    }
    if (to.params.query.split("-") && to.params.query.split("-").length == 2) {
      this.information = true;
      this.getCd();
    } else {
      this.tabsActiveId = 2;
      this.information = false;
      this.$nextTick(() => {
        this.$refs.company.initCompany();
      });
      this.stopTimeout();
      if (this.mqttSubList.length) {
        this.mqttSubList.forEach(i => {
          window.mqttClient.unsubscribe(i);
        });
      }
    }
    // react to route changes...
    // don't forget to call next()
  },
  destroyed() {
    window.mqttClient.removeListener("message", this.mqttMessage);
    this.stopTimeout();
    if (this.mqttSubList.length) {
      this.mqttSubList.forEach(i => {
        window.mqttClient.unsubscribe(i);
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    this.stopTimeout();
    if (this.mqttSubList.length) {
      this.mqttSubList.forEach(i => {
        window.mqttClient.unsubscribe(i);
      });
    }
    next();
  },
  mounted() {},

  computed: {
    queryId() {
      return this.$route.params.query.split("-")[1];
    }
  },
  methods: {
    //获取接线图
    getCd() {
      if (this.mqttSubList.length) {
        this.mqttSubList.forEach(i => {
          window.mqttClient.unsubscribe(i);
        });
      }
      GET_CD(this.queryId).then(e => {
        this.tabsActiveId = 2;
        this.drawInfo = e.data;
        //查询接线图的配电室
        GET_METER_SELECT(this.drawInfo.orgId, 13).then(powerlist => {
          var power = powerlist.data.filter(i => {
            return i.id == e.data.power;
          });
          this.powername = power[0].name;
        });
        this.getIot();
        this.devList = e.data.list;
        this.$nextTick(() => {
          this.$refs.draw.paint(e.data.jsondata);
        });
      });
    },
    meterhandle() {
      this.messageArray = {};
      // 有通讯终端页面，当前企业下的网关和表计都要渲染出来
      this.metersList.forEach(i => {
        var sn = i.sn;
        if (!(sn in this.messageArray)) {
          this.messageArray[sn] = {
            state: false
          };
          i.devs.forEach(devsitem => {
            var dev = devsitem.dev;
            if (!(dev in this.messageArray[sn])) {
              this.messageArray[sn][dev] = {
                state: false
              };
            }
          });
        }
      });
      this.devList.forEach(drawitem => {
        var meter = drawitem.labels;
        var dev = drawitem.commId;
        var sn = drawitem.sn;
        if (!(meter in this.messageArray[sn][dev])) {
          this.messageArray[sn][dev][meter] = {
            m: "",
            v: "",
            dq: 0,
            alarmTime: null
          };
        }
      });
    },
    //获取网关及表计列表
    getIot() {
      overviewServer.GET_METERS(this.drawInfo.orgId).then(e => {
        var snStr = "";
        this.mqttSubList = [];
        var pkeyOrSn = [];
        e.data.forEach(i => {
          i.status = "";
          if (i.type == "350") {
            i.toCmstopic = i.sn;
          } else {
            i.toCmstopic = i.pkey + "D" + i.sn;
          }
          i.topic = i.pkey + "/" + i.sn;
          if (snStr.length) {
            snStr += "," + i.toCmstopic;
          } else {
            snStr = i.toCmstopic;
          }
        });
        this.metersList = e.data;
        this.meterhandle();
        // 用作mqtt监听处理
        e.data.forEach(i => {
          var topic = "/edge/" + i.pkey + "/" + i.sn + "/rtg";
          if (pkeyOrSn.indexOf(topic) < 0) {
            pkeyOrSn.push(topic);
          }
        });

        window.mqttClient.subscribe("alarm/restore");
        this.mqttSubList.push("alarm/restore");
        window.mqttClient.subscribe("alarm/001/#");
        this.mqttSubList.push("alarm/001/#");
        if (pkeyOrSn.length) {
          pkeyOrSn.forEach(i => {
            this.mqttSubList.push(i);
            window.mqttClient.subscribe(i);
            var pkey = i.split("/")[2],
              sn = i.split("/")[3];
            var str = {
              ver: "v2.2.2",
              pKey: pkey,
              sn: sn,
              type: "rtg",
              seq: new Date().getTime()
            };
            window.mqttClient.publish(
              `/cloud/${pkey}/${sn}/rtg/call`,
              JSON.stringify(str)
            );
          });
        }
        overviewServer.GET_IOT_STATUS({ clientIds: snStr }).then(res => {
          res.data.forEach(i => {
            var client = this.metersList.filter(j => {
              return j.toCmstopic.toLowerCase() == i.clientId.toLowerCase();
            });
            if (client.length) {
              client[0].devs.forEach(dev => {
                this.$set(dev, "status", "");
                if (i.status == "client_disconnected") {
                  dev.status = false;
                  if (client[0].sn in this.messageArray) {
                    this.messageArray[client[0].sn].state = false;
                  }
                } else {
                  if (client[0].sn in this.messageArray) {
                    this.messageArray[client[0].sn].state = true;
                  }
                }
              });
            }
          });
        });
        if (!this.mqMessageFlag) {
          this.connectMqtt();
        }
      });
    },

    //分页量测量
    monitorCurrent(e) {
      this.monitor.pageNum = e;
    },
    stopTimeout() {
      clearTimeout(t);
    },
    startTimeout() {
      t = setTimeout(this.timeout, 5000);
    },
    timeout() {
      // 这里调用渲染接线图的渲染函数,因为数据独特性只渲染一次
      var draw = this.$refs.draw;
      if (!draw.canvasMoveflag) {
        if (Object.keys(this.messageArray).length > 0) {
          draw.drawRender(this.messageArray);
          draw.renderState(this.messageArray);
          if (this.monitor.chart) {
            this.gatewayToChart();
          }
        }

        this.startTimeout();
      } else {
        this.stopTimeout();
      }
    },
    mqttMessage(topic, message) {
      this.mqMessageFlag = true;
      if (topic.indexOf("edge") >= 0) {
        var mqttres = this.jstool.jshandle.mqttAdapter(topic, message);
        // 按实际的数据处理
        var sn = mqttres.sn;
        mqttres.devs.forEach(devitem => {
          var dev = devitem.dev;
          if (Object.keys(this.messageArray).length > 0) {
            if (dev in this.messageArray[sn]) {
              /**
               * 获取当前时间
               * 判断meter的alarmTime有没有数据
               * 有数据，当前时间减alarmTime小于复归时间什么都不干
               *                           大于复归时间将alarmTime =null
               */
              var nowDate = Date.now();
              var alarmReset = sessionStorage.getItem("alarmReset");
              if (
                devitem.d.length >= 2 &&
                (devitem.d[0].dq || devitem.d[1].dq)
              ) {
                this.messageArray[sn][dev].state = false;
              } else {
                this.messageArray[sn][dev].state = true;
              }
              devitem.d.forEach(m => {
                var meter = m.m;
                if (meter in this.messageArray[sn][dev]) {
                  if (
                    nowDate - this.messageArray[sn][dev][meter].alarmTime >
                    alarmReset
                  ) {
                    this.messageArray[sn][dev][meter].alarmTime = null;
                  }

                  this.messageArray[sn][dev][meter].m = meter;
                  this.messageArray[sn][dev][meter].v = m.v;
                  if (!this.messageArray[sn][dev][meter].alarmTime) {
                    this.messageArray[sn][dev][meter].dq = 0;
                  }
                }
              });
            }
          }
        });
      }
      //关于平台告警
      if (topic.indexOf("alarm") >= 0) {
        var res = JSON.parse(message.toString());
        var alarmsn = res.clientId;
        if (res.orgId == this.drawInfo.orgId) {
          if (res.dev) {
            //量测量告警数据会有dev
            // this.$refs.draw.measureAlarm(res);
            var dev = res.dev;
            var meter = res.measure.split(",");
            console.log("告警了", res.measure);

            meter.forEach(meterItem => {
              if (
                alarmsn in this.messageArray &&
                dev in this.messageArray[alarmsn] &&
                meterItem in this.messageArray[alarmsn][dev]
              ) {
                this.messageArray[alarmsn][dev][meterItem].alarmTime = new Date(
                  res.datetime
                ).getTime();
                this.messageArray[alarmsn][dev][meterItem].dq = 1;
              }
            });
          } else {
            //网关告警,表计要换色,相对应的量测量也要变色，数据没有Dev alarmType:00上线，01掉线
            if (topic.indexOf("alarm/restore") >= 0) {
              //网关复归
              this.messageArray[alarmsn].state = true;
            } else {
              this.messageArray[alarmsn].state = false;
              for (var i in this.messageArray[alarmsn]) {
                if (
                  typeof this.messageArray[alarmsn][i] == "object" &&
                  "state" in this.messageArray[alarmsn][i]
                ) {
                  this.messageArray[alarmsn][i].state = false;
                }
              }
            }
            // this.$refs.draw.gatewayAlarm(res);
          }
        }
      }
    },
    //接收mqtt信息
    connectMqtt() {
      var draw = this.$refs.draw;
      var divsHtml = document.getElementById("draw");
      divsHtml.onmouseup = () => {
        draw.canvasMoveflag = false;
        this.stopTimeout();
        this.startTimeout();
      };
      if (t) this.stopTimeout();

      //刷新数据时长 10秒刷新
      //每十秒刷新一次数据
      /**
       * 接线图的量测量（网关数据）
       * 量测量的告警量（后台数据）（监控不到表计掉线）
       * 网关的掉线变色（后台数据）
       * 表计的掉线变色（网关数据）
       * **/
      t = setTimeout(this.timeout, 5000);
      window.mqttClient.addListener("message", this.mqttMessage);
      window.mqttClient.on("reconnect", () => {
        this.stopTimeout();
        if (this.$refs.draw) {
          this.startTimeout();
        }
      });
    },

    //折线图实时数据
    gatewayToChart() {
      var node = this.monitor.rowNode;
      // var res = message;
      // res.devs.forEach(i => {
      //   var resElem = i.d.filter(j => {
      //     return (
      //       this.monitor.rowNode.sn == res.sn &&
      //       this.monitor.rowNode.commId == i.dev &&
      //       this.monitor.rowNode.labels == j.m
      //     );
      //   });
      //   if (resElem.length) {
      var nowTime = new Date();
      var timeStr =
        String(nowTime.getHours()) +
        ":" +
        (String(nowTime.getMinutes()).length < 2
          ? "0" + String(nowTime.getMinutes())
          : String(nowTime.getMinutes())) +
        ":" +
        (String(nowTime.getSeconds()).length < 2
          ? "0" + String(nowTime.getSeconds())
          : String(nowTime.getSeconds()));
      var dataCache = {
        time: timeStr,
        value: this.messageArray[node.sn][node.commId][node.labels].v
      };
      this.chartData.push(dataCache);
      if (this.chartData.length > 1) {
        if (this.chartData.length > 100) {
          this.chartData.shift();
        }
        this.chart.changeData(this.chartData);
      } else {
        this.chart.data(this.chartData);
        this.chart.render();
      }
      //   }
      // });
    },
    //打开弹框
    openModal() {
      this.monitor.tableData = this.monitor.node;
      this.monitor.active = true;
      this.monitor.button = false;
    },
    //打开折线图弹窗
    openChart(row) {
      var node = this.$refs.draw.returnCanvas().find(row.parentId);
      if (node) {
        switch (node.data.type) {
          case "interval":
            QUERY_ROOM_INFO(row.equipmentSelectId).then(e => {
              this.monitor.chartName = e.data.name;
            });
            break;
          case "transformer":
            GET_DEVICE_INFO(row.equipmentSelectId).then(e => {
              this.monitor.chartName = e.data.name;
            });
            break;
        }
        this.monitor.charParName = row.name;
        this.monitor.chart = true;
        this.monitor.rowNode = row;
        this.$nextTick(() => {
          this.monitor.active = false;
          this.setChart();
        });
      }
    },
    //关闭折线图
    closeChart() {
      this.monitor.chart = false;
      this.chartData = [];
    },
    //初始化折线图
    setChart() {
      this.chart = new Chart({
        container: "chart",
        autoFit: true,
        padding: [10, 20, 30, 30]
      });
      this.chart.data(this.chartData);
      this.chart.axis("value", {
        label: {
          style: {
            fill: "white"
          }
        },
        line: {
          style: {
            lineWidth: 1,
            stroke: "white"
          }
        },
        grid: {
          line: {
            style: {
              stroke: "white",
              lineDash: [5, 10]
            }
          }
        }
      });

      this.chart.axis("time", {
        tickLine: null,
        label: {
          style: {
            fill: "white"
          }
        }
      });
      this.chart.scale({
        value: {
          min: 0,
          type: "linear"
        },
        time: {
          tickCount: 6
        }
      });
      this.chart.tooltip({
        domStyles: {
          "g2-tooltip-list": {
            display: "none"
          },
          "g2-tooltip-title": {
            margin: "0"
          },
          "g2-tooltip": {
            minWidth: "50px",
            minHeight: "20px",
            backgroundColor: "#FB4542",
            color: "white",
            textAlign: "center",
            fontSize: "10px",
            lineHeight: "20px",
            borderRadius: "5px",
            boxShadow: "none",
            padding: "0"
          }
        },
        title: "value",
        showCrosshairs: true,
        crosshairs: {
          line: {
            style: {
              lineWidth: 2,
              stroke: "#FB4542"
            }
          }
        }
      });

      this.chart
        .line()
        .position("time*value")
        .color("#FB4542")
        .animate({
          enter: {
            animation: "fadeIn", // 动画名称
            easing: "easeQuadIn", // 动画缓动效果
            delay: 100, // 动画延迟执行时间
            duration: 600 // 动画执行时间
          }
        });
      this.chart
        .area()
        .position("time*value")
        .color("l(90) 0:#D24A4F 1:rgba(0,0,0,0)");
      this.chart
        .point()
        .position("time*value")
        .color("#FB4542");
      this.chart.render();
    },

    //  tabs切换
    tabsChange(val) {
      this.tabsActiveId = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.angle-border {
  position: absolute;
  width: 18px;
  height: 18px;
  z-index: 10;
}
.left-top-border {
  top: -2px;
  left: -2px;
  border-left: 4px solid #3486da;
  border-top: 4px solid #3486da;
}
.right-top-border {
  top: -2px;
  right: -2px;
  border-right: 4px solid #3486da;
  border-top: 4px solid #3486da;
}
.left-bottom-border {
  bottom: -2px;
  left: -2px;
  border-bottom: 4px solid #3486da;
  border-left: 4px solid #3486da;
}
.right-bottom-border {
  bottom: -2px;
  right: -2px;
  border-right: 4px solid #3486da;
  border-bottom: 4px solid #3486da;
}
.Cd {
  width: 100%;
  height: 100%;
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  .cd_option {
    padding: 7px;
    height: 46px;
    position: absolute;
    z-index: 11;
    right: 10px;

    ::v-deep .h-tabs {
      ul {
        flex-direction: row-reverse;
        li {
          border-radius: 4px;
          padding-top: 0;
          font-size: 14px;
          padding: 5px 10px;
          &:first-child {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .drawing {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: 1;
    &.toplayer {
      z-index: 10;
    }
  }
  .monitorState {
    width: 100%;
    padding-top: 10px;
    height: 100%;
    background-color: black;
    position: absolute;
    top: 0;
    overflow: auto;
    z-index: 1;
    &.toplayer {
      z-index: 10;
    }
    .stateTitle {
      width: 100%;
      font-size: 20px;
      text-align: center;
      margin-bottom: 10px;
    }
    .circle {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 10px;
      background-color: red;
      &.active {
        background-color: rgb(95, 175, 95);
      }
      &.error {
        background-color: red;
      }
    }
    .legend {
      font-size: 0;
      position: absolute;
      top: 10px;
      left: 0;
      li {
        margin-left: 10px;
        display: inline-block;
        font-size: 12px;
      }
    }
    .stateList {
      width: 100%;
      height: auto;
      padding: 0 10px;
      font-size: 0;
      white-space: nowrap;
      overflow-x: auto;
      .parentli {
        display: inline-block;
        width: auto;
        height: auto;
        vertical-align: top;
        margin-right: 15px;
        &:last-child {
          margin-right: 0;
        }

        .terminal {
          max-width: 140px;
          font-size: 12px;
          margin-bottom: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .devli {
          li {
            margin-bottom: 10px;
            .font {
              display: inline-block;
              max-width: 120px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
::v-deep .el-dialog {
  .el-dialog__body {
    .items {
      width: 100%;
      padding: 0 20px;
      font-size: 0;
      .item {
        display: inline-block;
        width: 50%;
        font-size: 10px;
        color: white;
        line-height: 30px;
      }
    }
    #chart {
      width: 100%;
      height: 195px;
      margin-top: 95px;
    }
  }
}
</style>
