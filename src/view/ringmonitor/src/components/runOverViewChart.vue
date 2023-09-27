<template>
  <div class="runOverViewChart">
    <div class="chartBox first">
      <div class="chartTitle">
        今日负荷(kW)
      </div>
      <div id="load"></div>
    </div>
    <div class="chartBox two">
      <div class="chartTitle">
        今日用电量(kWh)
      </div>
      <div id="electric"></div>
    </div>
    <div class="chartBox three">
      <div class="chartTitle">
        异常告警
      </div>
      <ul>
        <li v-for="item in alarmList" :key="item._id">
          <p>{{ item.typeName }}</p>
          <span>{{ item.num }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
var t1, t2;
/* eslint-disable no-unused-vars */
import { GET_15_MIN_ORGID } from "hlcx-qiankun-commonservice/utils/api/overview/site";
import { GET_HOUR_ORG_ELECTRIC } from "hlcx-qiankun-commonservice/utils/api/overview/all";
import { GET_DIAGRAM_ALARM } from "hlcx-qiankun-commonservice/utils/api/monitor/overview";
import { meterTime } from "hlcx-qiankun-commonservice/utils/config/meterTime";
import { Chart } from "@antv/g2";
export default {
  data() {
    return {
      loadList: [],
      electricList: [],
      alarmList: [],
      HourTime: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      meterMinuteTime: [], // 15分钟一个点
      chart: {
        load: "",
        electric: ""
      }
    };
  },
  mounted() {
    this.loadChart();
    this.electricChart();
    this.initAlarm();
    t1 = setInterval(() => {
      this.loadChart();
      this.electricChart();
    }, 15 * 60 * 1000);
    t2 = setInterval(() => {
      this.initAlarm();
    }, 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(t1);
    clearInterval(t2);
  },
  methods: {
    initAlarm() {
      GET_DIAGRAM_ALARM(this.$route.params.query.split("-")[0]).then(e => {
        this.alarmList = e.data;
      });
    },
    loadChart() {
      this.meterMinuteTime = [];
      meterTime.forEach(item => {
        this.meterMinuteTime.push(item.split("-")[1]);
      });
      var params = {
        date: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd"),
        orgId: this.$route.params.query.split("-")[0]
      };
      var arr = [];
      this.meterMinuteTime.forEach(item => {
        var o = {};
        o.date = item;
        o.value = null;
        arr.push(o);
      });
      GET_15_MIN_ORGID(params).then(res => {
        if (res.data) {
          var array = [];
          arr.forEach(item => {
            for (let i in res.data) {
              if (item.date == i.split("_")[0]) {
                item.date = i.split("_")[0];
                item.value = Number(res.data[i].toFixed(2));
                array.push(res.data[i].toFixed(2))[array.length - 1];
              }
            }
          });
        }
        this.loadList = arr;
        if (this.chart.load) {
          this.chart.load.destroy();
        }
        this.loadChartRender();
      });
    },
    electricChart() {
      var arr = [],
        sum = 0;
      this.HourTime.forEach(item => {
        var o = {};
        o.date = item;
        o.value = null;
        o.number = null;
        arr.push(o);
      });
      var params = {
        isCacuByReadingDay: 1,
        orgId: this.$route.params.query.split("-")[0],
        time: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd"),
        type: "02",
        endTime: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd")
      };
      GET_HOUR_ORG_ELECTRIC(params).then(e => {
        if (e.data) {
          arr.forEach(i => {
            var item = e.data.filter(resitem => {
              var time = resitem.time.slice(10, 13);
              return i.date == time;
            });
            if (item.length) {
              sum += item[0].v;
              i.value = item[0].v;
              i.number = Number(sum.toFixed(2));
            }
          });
          this.electricList = arr;
          if (this.chart.electric) {
            this.chart.electric.destroy();
          }
          this.electricChartRender();
        }
      });
    },
    electricChartRender() {
      this.chart.electric = new Chart({
        container: "electric",
        autoFit: true,
        appendPadding: [10, 30, 0, 0]
      });
      this.chart.electric.data(this.electricList);
      this.chart.electric.scale({
        value: {
          min: 0,
          alias: "实时电量"
        },
        number: {
          min: 0,
          alias: "累计电量"
        },
        date: {
          tickInterval: 4
        }
      });
      this.chart.electric.axis("number", {
        grid: null
      });
      this.chart.electric.tooltip({
        showCrosshairs: true,
        shared: true,
        title: (title, datum) => {
          return title + ":00";
        },
        domStyles: {
          "g2-tooltip-marker": {
            display: "none"
          },
          "g2-tooltip": {
            background: "#01133B",
            boxShadow: "none"
          },
          "g2-tooltip-title": {
            color: "white"
          },
          "g2-tooltip-list-item": {
            color: "white"
          }
        }
      });

      this.chart.electric
        .interval()
        .size(7)
        .position("date*value")
        .color("l(90) 0:#039EE6 0.75:#7006D9 1:#7006D9 ")
        .tooltip("value");
      this.chart.electric
        .line({
          connectNulls: true
        })
        .position("date*number")
        .color("#44F0FF")
        .tooltip("number");
      this.chart.electric
        .point()
        .position("date*number")
        .color("#44F0FF")
        .shape("circle")
        .style({
          stroke: "rgba(0,0,0,0)",
          lineWidth: 1
        });
      this.chart.electric.render();
    },
    loadChartRender() {
      this.chart.load = new Chart({
        container: "load",
        autoFit: true,
        appendPadding: [0, 30, 0, 0]
      });
      this.chart.load.data(this.loadList);
      this.chart.load.scale("value", {
        min: 0
      });
      this.chart.load
        .line()
        .position("date*value")
        .color("#44F0FF")
        .shape("smooth");
      this.chart.load
        .area()
        .position("date*value")
        .color("l(90) 0:#44F0FF  1:#021132 ");
      this.chart.load.tooltip({
        showCrosshairs: true,
        itemTpl:
          '<li class="g2-tooltip-list-item" ><span class="g2-tooltip-name">今日</span>：<span class="g2-tooltip-value" style="display: inline-block; float: right; margin-left: 30px;">{value}</span></li>',
        domStyles: {
          "g2-tooltip-marker": {
            display: "none"
          },
          "g2-tooltip": {
            background: "#01133B",
            boxShadow: "none"
          },
          "g2-tooltip-title": {
            color: "white"
          },
          "g2-tooltip-list-item": {
            color: "white"
          }
        }
      });
      this.chart.load.render();
    }
  }
};
</script>

<style lang="scss" scoped>
.chartBox {
  width: 99%;
}
.runOverViewChart {
  padding-left: 25px;
  overflow: auto;
}
.chartTitle {
  width: auto;
  display: inline-block;
  background-image: url("~@/assets/img/all_title.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 38px;
  font-size: 16px;
  line-height: 38px;
  padding-left: 5px;
  padding-right: 5px;
  text-shadow: 0 0 10px white;
}
.first {
  margin-bottom: 38px;
}
.two {
  margin-bottom: 23px;
}
.three {
  margin-bottom: 10px;
  .chartTitle {
    margin-bottom: 14px;
  }
  ul {
    padding-right: 30px;
    li {
      width: 100%;
      height: 24px;
      padding-left: 10px;
      line-height: 24px;
      font-size: 12px;
      p {
        display: inline-block;
      }
      span {
        float: right;
      }
      &:nth-child(odd) {
        background: linear-gradient(to right, #274088, rgba(0, 0, 0, 0));
      }
    }
  }
}
.chartTitle {
  margin-bottom: 30px;
}
#load {
  height: 218px;
}
#electric {
  height: 222px;
}
</style>
