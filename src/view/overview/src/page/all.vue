<template>
  <div class="all">
    <div class="renderTime">
      <p>数据更新:{{ getTime }}</p>
      <i @click="refresh" class="el-icon-refresh-left"></i>
    </div>
    <div class="row">
      <div class="col left">
        <div class="linear_chart border">
          <ul class="allNum nopaddingborder">
            <li>
              <div class="icon"><i class="icon-bumen1"></i></div>
              <p class="num">
                <q>{{ overviewInfo.orgNum ? overviewInfo.orgNum : 0 }}</q>
              </p>
              <p class="font">用户数<span>(户)</span></p>
            </li>
            <li>
              <div class="icon"><i class="icon-peidianshi"></i></div>
              <p class="num">
                <q>{{ overviewInfo.roomNum ? overviewInfo.roomNum : 0 }}</q>
              </p>
              <p class="font">配电室<span>(个)</span></p>
            </li>
            <li>
              <div class="icon"><i class="icon-rongliangguanli"></i></div>
              <p class="num">
                <q>{{ overviewInfo.capacity ? overviewInfo.capacity : 0 }}</q>
              </p>
              <p class="font">总容量<span>(kVA)</span></p>
            </li>
          </ul>

          <div class="chart_title">
            <p>企业容量统计</p>
          </div>
          <div id="companyInterval">
            <!-- companyList -->
          </div>
        </div>
        <div class="linear_img_chart border">
          <div class="chart_title">
            <p>月用电量TOP5</p>
          </div>
          <ul class="company">
            <li v-for="item in topfiveList" :key="item.index">
              <div class="index">{{ item.index }}</div>
              <div class="linear">
                <div class="linear_title">
                  <span class="title" :title="item.m">{{ item.m }}</span
                  ><span class="num" :title="item.v"
                    >{{ item.v ? item.v.toFixed(2) : item.v }}kWh</span
                  >
                </div>
                <div class="linear_img">
                  <div
                    class="progress"
                    :style="{ width: item.percent + '%' }"
                  ></div>
                </div>
              </div>
            </li>
            <li
              v-for="(nodataitem, nodataindex) in 5 - topfiveList.length"
              :key="nodataindex + topfiveList.length"
              class="noborder"
            ></li>
          </ul>
        </div>
      </div>
      <div class="col center">
        <div class="line_chart_box border">
          <div class="line_chart">
            <div class="chart_title">
              <p>用电曲线</p>
            </div>
            <div class="option">
              <span>{{ tabActive == 1 ? "(kW)" : "(kWh)" }}</span>
              <ul class="tab">
                <li @click="tabChange(1)" :class="{ active: tabActive == 1 }">
                  <p>负荷</p>
                </li>
                <li @click="tabChange(2)" :class="{ active: tabActive == 2 }">
                  <p>电量</p>
                </li>
              </ul>
              <el-select
                v-if="tabActive == 2"
                @change="dateChange"
                v-model="dateSelect"
                placeholder="请选择"
                class="line_select"
              >
                <el-option label="年" value="1"></el-option>
                <el-option label="月" value="2"></el-option>
              </el-select>
            </div>
            <div id="linechart" class="linechart" v-show="tabActive == 2"></div>
            <div
              id="chargechart"
              class="linechart"
              v-show="tabActive == 1"
            ></div>
          </div>
        </div>
      </div>
      <div class="col right">
        <div class="communication border">
          <div
            class="chart_title url"
            @click="
              jumpRouter('/index/all/monitor/wcquery', 'monitor:condition:list')
            "
          >
            <p>通讯工况</p>
          </div>
          <div class="proess_box">
            <div class="proess" ref="proess">
              <div id="Liquid"></div>
            </div>
          </div>
          <div class="proessNum">
            <div class="item">
              <p>
                <q>{{ workInfo.gatewayNum ? workInfo.gatewayNum : 0 }}</q
                ><span class="num">台</span>
              </p>
              <span>网关</span>
            </div>
            <div class="item">
              <p>
                <q>{{ workInfo.meterNum ? workInfo.meterNum : 0 }}</q
                ><span class="num">台</span>
              </p>
              <span>表计</span>
            </div>
            <div class="item">
              <p class="active">
                <q>{{ workInfo.percent ? workInfo.percent : 0 }}%</q>
              </p>
              <span>网关在线率</span>
            </div>
          </div>
        </div>
        <!--告警统计-->
        <div class="main-col border">
          <div class="chart_title url">
            <p
              style="cursor: pointer"
              @click="
                jumpRouter('/index/all/monitor/alarm', 'monitor:alarm:list')
              "
            >
              告警统计
            </p>
          </div>
          <!---->
          <div class="alarm-content">
            <div class="alarm-content-top">
              <span
                >本月告警<q>{{
                  alarmInfo.alarmTotal ? alarmInfo.alarmTotal : 0
                }}</q
                >个</span
              >
              <!-- <span
                >待处理<q>{{ alarmInfo.untreatNum }}</q
                >个</span
              > -->
            </div>
            <div id="site_c4" ref="site_c4" class="alarm-chart"></div>
          </div>
        </div>
        <div class="main-cols border">
          <div class="chart_title url">
            <p
              style="cursor: pointer"
              @click="
                jumpRouter(
                  '/index/smart/repairOrder',
                  'maintain:workOrder:list'
                )
              "
            >
              工单统计
            </p>
          </div>
          <div class="alarm-content">
            <div class="alarm-content-top">
              <span
                >本月工单<q>{{
                  this.workorderInfo.total ? this.workorderInfo.total : 0
                }}</q
                >个</span
              ><span
                >待处理<q>{{
                  this.workorderInfo.undisposed
                    ? this.workorderInfo.undisposed
                    : 0
                }}</q
                >个</span
              >
            </div>
            <div id="site_c5" ref="site_c5" class="alarm-chart"></div>
          </div>
        </div>
      </div>
      <div class="map" v-if="mapVibled">
        <el-amap
          ref="map"
          class="amap-demo"
          :mapStyle="mapParam.mapStyle"
          :events="mapParam.events"
        >
          <el-amap-marker
            v-for="(marker, index) in mapParam.markers"
            :position="marker.position"
            :events="marker.events"
            :visible="marker.visible"
            :draggable="marker.draggable"
            :vid="index"
            :icon="marker.icon"
            :key="index"
            :extData="marker.extdata"
          ></el-amap-marker>

          <el-amap-info-window
            v-if="mapParam.currentWindow.visible"
            :position="mapParam.currentWindow.position"
          >
            <h5 @click="urlTosite(mapParam.currentWindow.orgid)">
              {{ mapParam.currentWindow.name }}
            </h5>
            <p>配电室：{{ mapParam.currentWindow.roomName }}</p>
            <p>
              地址：{{
                mapParam.currentWindow.address
                  ? mapParam.currentWindow.address
                  : "无"
              }}
            </p>
            <p>
              运行容量：<span class="fontcolor">{{
                mapParam.currentWindow.capacity
              }}</span
              >kVA
            </p>
          </el-amap-info-window>
        </el-amap>
      </div>
    </div>
  </div>
</template>
<script>
import mapMinxi from "../mixins/all/map";
import topFive from "../mixins/all/topfive";
import p15Min from "../mixins/all/p15min";
import overviewGather from "../mixins/all/overviewGather";
import alarm from "../mixins/all/alarm";
import getWorkorder from "../mixins/all/getWorkorder";
import worke from "../mixins/all/worke";
import jstool from "hlcx-jstool";
export default {
  mixins: [
    // orgFilter,
    // currentTime,
    mapMinxi,
    topFive,
    p15Min,
    overviewGather,
    alarm,
    getWorkorder,
    worke,
    // lastMonth,
  ],
  mounted() {
    this.renderDom();
    this.p15DomRender();
    this.main();
    window.onresize = () => {
      this.p15DomRender();
      this.mapRender();
    };
  },
  destroyed() {
    window.onresize = null;
  },
  data() {
    return {
      jstool: jstool,
      getTime: "",
      refreshFlag: false,
      dateSelect: "2",
      tabActive: 1,
      legend: {
        //企业容量统计
        companyInterval: "",
        //通讯工况
        liquidPlot: "",
        //通讯工况
        ringProgress: "",
        //告警统计
        alarm: "",
        //工单统计
        workorder: "",
        //电量负荷曲线
        chargeLine: "",
        //电量曲线
        yearLine: "",
      },
      systemListStr: "",
    };
  },
  methods: {
    p15DomRender() {
      // if (document.body.clientWidth < 1920) {
      //   var windowHeight = document.body.clientHeight;
      //   for (
      //     var i = 0;
      //     i < document.querySelectorAll(".linechart").length;
      //     i++
      //   ) {
      //     document.querySelectorAll(".linechart")[i].style.height =
      //       windowHeight * 0.4 * 0.7 + "px";
      //   }
      // }
      // var linechartWidth = 0;
      // var child = document.querySelector(".row").children;
      // for (var i = 0; i < child.length; i++) {
      //   linechartWidth += child[i].clientWidth;
      // }
      // var width = document.body.clientWidth - linechartWidth + "px";
      // document.querySelector(".line_chart").style.width = width;
      // document.querySelector("#linechart").style.width = width;
      // document.querySelector("#chargechart").style.width = width;
      // if (document.body.clientWidth < 1920) {
      //   document.querySelector(".line_chart").style.marginLeft =
      //     document.querySelector(".row").children[0].clientWidth + 10 + "px";
      // } else {
      //   document.querySelector(".line_chart").style.marginLeft = null;
      // }
      // if (document.body.clientHeight >= 1080) {
      //   document.querySelector(".line_chart_box").style.paddingBottom = "70px";
      // } else {
      //   document.querySelector(".line_chart_box").style.paddingBottom = null;
      // }
    },
    mapRender() {
      this.$refs.map.$$getInstance().setFitView(null, false, null, 6);
    },
    renderDom() {
      //基本信息li的间距
      var parent = document.querySelectorAll(".allNum")[0];
      var parentWidth = parent.clientWidth * 0.07;
      parent.children[1].style.margin = "0 " + parentWidth + "px";
    },
    refresh() {
      this.refreshFlag = true;
      for (var i in this.legend) {
        if (i != "liquidPlot" && i != "ringProgress") {
          if (this.legend[i]) {
            this.legend[i].clear();
          }
        }
      }
      this.main();
    },
    refreshFilter() {
      return this.refreshFlag;
    },
    main() {
      this.getTime = this.jstool.jshandle.getcurrentTime("yyyy-MM-dd HH:mm:ss");
      this.tabActive = 1;
      this.topfive();
      this.p15min();
      new Promise((resolve) => {
        resolve();
      }).then(() => {
        this.overviewGather();
        this.getWorke();
        this.getAlarm();
        this.getWorkorder();
      });
    },

    jumpRouter(url, per) {
      var permissions = JSON.parse(sessionStorage.getItem("permissions"));
      if (permissions.indexOf(per) >= 0 || permissions.indexOf("*:*:*") >= 0) {
        sessionStorage.removeItem("indexId");
        let newUrl = this.$router.resolve({
          path: url,
        });
        window.open(newUrl.href, "_blank");
      } else {
        this.$message({
          message: "暂无权限",
          type: "error",
          duration: 2 * 1000,
        });
      }
    },
    tabChange(value) {
      if (this.tabActive == value) {
        return false;
      }
      this.tabActive = value;
      switch (value) {
        case 1:
          this.refreshFlag = true;
          this.legend.yearLine.clear();
          this.p15min();
          break;
        case 2:
          this.refreshFlag = true;
          this.legend.chargeLine.clear();
          this.getQualityDay();
          this.dateSelect = "2";
          break;
      }
    },
    dateChange(e) {
      // 1-年/2-月
      switch (e) {
        case "1":
          this.getSummeMonth();
          break;
        case "2":
          this.getQualityDay();
          break;
      }
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .chart_title {
  width: 100%;
  height: auto;
  font-size: 0;
  &::before {
    content: "";
    vertical-align: top;
    width: 33px;
    height: 22px;
    display: inline-block;
    margin-right: 10px;
    background-image: url("~@/assets/img/overview/title02.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  &::after {
    content: "";
    width: 37%;
    height: 7px;
    display: inline-block;
    margin-left: 10px;
    background-image: url("~@/assets/img/overview/title01.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  &.url {
    cursor: pointer;
  }
  p {
    display: inline-block;
    font-size: 16px;
    vertical-align: sub;
    line-height: 22px;
  }
}
::v-deep.el-container {
  margin: 0;
  padding: 0;
  .h-container {
    border: 0;
    border-radius: 0;
  }
}
.all {
  // padding: 10px 30px 20px 30px;
  position: relative;
  height: auto;
  min-height: 100%;
  .map {
    width: 100%;
    padding: 0 1.5% 0 1.5%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    .amap-demo {
      width: 100%;
      height: 100%;
      ::v-deep .amap-container {
        .amap-logo {
          display: none !important;
        }
      }
    }
    ::v-deep .amap-info-sharp {
      border-top-color: #142d89;
    }
    ::v-deep .amap-info-content {
      border: 1px solid #00a0e9;
      background-color: #142d89;
      padding: 15px;
      .amap-info-close {
        right: 5px !important;
      }
      * {
        font-size: 12px;
      }
      p {
        margin-bottom: 3px;
        color: #b9e9ff;
        .fontcolor {
          color: #00fffe;
        }
      }
      h5 {
        cursor: pointer;
        margin-bottom: 3px;
        color: white;
      }
    }
  }
  .row {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0 1.5% 0 1.5%;
    &::after {
      content: "";
      display: inline-block;
      clear: both;
      width: 100%;
    }
  }
  .col {
    display: inline-block;
    width: 22%;
    z-index: 11;
    vertical-align: top;
    height: 100%;
    &.right {
      float: right;
    }
    &.center {
      width: 53%;
      height: auto;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      .border {
        padding: 23px 3% 0% 10px;
      }
    }
    &.left {
      margin-right: 1%;
    }
    .border {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 23px 4% 6% 5%;
      position: relative;
      z-index: 2;
    }
    .nopaddingborder {
      padding: 0 !important ;
    }
  }
  .line_chart_box {
    width: 100%;
    height: 100%;
    background-image: url("~@/assets/img/overview/all-center.png");
    .line_chart {
      margin: 0 auto;
      height: 100%;
      position: relative;
      .chart_title {
        margin-bottom: 10px;
        &::after {
          background-image: none;
        }
      }
      .option {
        width: 100%;
        position: absolute;
        z-index: 1;
        line-height: 25px;
        span {
          font-size: 12px;
          color: #8a9ecf;
          float: left;
          padding-left: 3px;
        }
        .tab {
          padding-left: 43px;
          font-size: 0;
          li {
            width: 70px;
            height: 25px;
            cursor: pointer;
            display: inline-block;
            margin-right: 5px;
            background-image: url("~@/assets/img/overview/tab.png");
            background-size: 100% 100%;
            &.active {
              background-image: url("~@/assets/img/overview/tab_active.png");
              p {
                color: #06f0b8;
              }
            }
            p {
              font-size: 14px;
              line-height: 25px;
              text-align: center;
              color: white;
            }
          }
        }
        .line_select {
          width: 90px;
          position: absolute;
          right: 0;
          top: 0;
          ::v-deep .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
          ::v-deep .el-input__icon {
            line-height: 30px;
          }
        }
      }
      .linechart {
        width: 100%;
        height: 287px;
      }
    }
  }

  .main-col {
    width: 100%;
    margin-bottom: 10px;
    padding-bottom: 7% !important;
    height: 304px;
    background-image: url("~@/assets/img/overview/all-right-item.png");
    .chart_title {
      margin-bottom: 27px;
    }
    /*告警统计*/
  }
  .main-cols {
    width: 100%;
    height: 304px;
    background-image: url("~@/assets/img/overview/all-right-item.png");
    .chart_title {
      margin-bottom: 20px;
    }
  }
  .main-col,
  .main-cols {
    .alarm-content {
      .alarm-content-top {
        font-size: 16px;
        color: #ffffff;
        display: flex;
        margin-bottom: 39px;
        padding-left: 5%;
        span {
          margin-left: 30px;
          &:first-child {
            margin: 0;
          }
        }
        i {
          color: #00f6f5;
        }
      }
      .alarm-chart {
        padding: 0 0 0 6%;
      }
      #site_c5 {
        padding: 0;
      }
    }
  }
  .communication {
    width: 100%;
    height: 304px;
    font-size: 0;
    margin-bottom: 10px;
    padding-bottom: 14% !important;
    background-image: url("~@/assets/img/overview/all-right-item.png");
    .chart_title {
      margin-bottom: 49px;
    }
    .proess_box {
      display: inline-block;
      width: 50%;
      padding-left: 9%;
    }
    .proess {
      width: 100%;
      height: 160px;
      border-radius: 50%;
      margin: 0 auto;
      position: relative;
      #Liquid {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        & > ::v-deep div {
          width: 105%;
          height: 105%;
          position: absolute !important;
          top: 0;
          right: 0;
          bottom: 0;
          left: -4px;
          margin: auto;
          canvas {
            width: 100% !important;
            height: 100% !important;
          }
          .g2-html-annotation {
            font-size: 26px !important;
            opacity: 1 !important;
            background-image: linear-gradient(#55e2fe, #4aacf7, #0707ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: none !important;
          }
        }
      }
    }
    .proessNum {
      width: 50%;
      // padding-left: 5%;
      display: inline-block;
      height: auto;

      padding-left: 9%;
      vertical-align: text-bottom;
      .item {
        margin-bottom: 20px;
        font-size: 0;
        p {
          // max-width: 70px;
          margin-right: 10px;
          display: inline-block;
          color: #0063ff;
          q {
            font-size: 28px;
          }
          .num {
            color: #0063ff;
            font-size: 14px;
          }
          &.active {
            q {
              color: #54defe;
            }
          }
        }

        span {
          display: inline-block;
          color: white;
          font-size: 14px;
        }
      }
    }
  }
  .allNum {
    width: 100%;
    height: auto;
    font-size: 0;
    text-align: center;
    padding: 0 1.1% 0 1.2%;
    margin-bottom: 48px;
    li {
      width: 26%;
      text-align: center;
      background-image: url("~@/assets/img/overview/num_background.png");
      background-repeat: no-repeat;
      background-size: contain;
      display: inline-block;
      padding-top: 18px;
      .icon {
        margin-bottom: 10px;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        margin: 0 auto;
        background: linear-gradient(0deg, #1738c1, #74effb 100%);
        text-align: center;
        line-height: 52px;
        position: relative;
        &::after {
          position: absolute;
          content: "";
          border-radius: 50%;
          background: #183b7a;
          width: 90%;
          height: 90%;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          margin: auto;
        }
        i {
          position: relative;
          z-index: 1;
          font-family: iconfont;
          font-size: 27px;
          color: white;
        }
      }
      .font {
        font-size: 12px;
        color: white;
        span {
          font-size: 12px;
        }
      }
      .num {
        font-size: 25px;
        color: #00ccff;
        margin-bottom: 5px;
      }
    }
  }
  .linear_chart {
    width: 100%;
    height: 451px;
    margin-bottom: 10px;
    background-image: url("~@/assets/img/overview/all-left-top.png");

    .chart_title {
      margin-bottom: 36px;
      padding-left: 5px;
    }
    #companyInterval {
      width: 100%;
      height: 186px;
      padding: 0 1% 0 1%;
    }
  }
  .linear_img_chart {
    width: 100%;
    height: 474px;
    background-image: url("~@/assets/img/overview/all-left-bottom.png");
    padding-left: 6% !important;
    padding-right: 6% !important;

    .chart_title {
      margin-bottom: 44px;
    }
    .company {
      li {
        width: 100%;
        height: auto;
        margin-bottom: 22px;
        border-bottom: 1px dashed #243978;
        padding-bottom: 8px;
        &:last-child {
          margin-bottom: 0;
        }
        &.noborder {
          border: none;
        }
        font-size: 0;
        .index {
          width: 38px;
          height: 38px;
          text-align: center;
          line-height: 38px;
          color: white;
          font-size: 18px;
          background-color: #243978;
          display: inline-block;
        }
        .linear {
          width: calc(100% - 41px);
          margin-left: 3px;
          vertical-align: top;
          display: inline-block;
          .linear_title {
            padding-left: 10px;
            // margin-bottom: 10px;
            span {
              color: white;
              font-size: 14px;
              overflow: hidden; /*内容超出后隐藏*/

              text-overflow: ellipsis; /* 超出内容显示为省略号*/

              white-space: nowrap; /*文本不进行换行*/
              &.title {
                display: inline-block;
                width: 100%;
              }
              &.num {
                color: #68f1ff;
                font-size: 12px;
                display: block;
                line-height: 1.9;
                // width: 20%;
              }
            }
          }
          .linear_img {
            width: 100%;
            height: 12px;
            background-color: #18275b;
            .progress {
              max-width: 100%;
              background-image: url("~@/assets/img/overview/linear.png");
              width: 100%;
              background-repeat: no-repeat;
              height: 100%;
              background-size: 100% 100%;
              transition: width 3s ease;
            }
          }
        }
      }
    }
  }
  .renderTime {
    text-align: right;
    z-index: 12;
    padding-right: 1.8%;
    padding-top: 10px;
    margin-bottom: 8px;
    // &::after {
    //   position: absolute;
    //   z-index: 1;
    //   content: "";
    //   left: 0;
    //   right: 0;
    //   top: 0;
    //   height: 59%;
    //   background-image: linear-gradient(
    //     to bottom,
    //     #081148,
    //     #181b4a,
    //     rgba(0, 0, 0, 0)
    //   );
    // }
    p {
      font-size: 14px;

      position: relative;
      display: inline-block;
      margin-right: 5px;
      z-index: 11;
    }
    .el-icon-refresh-left {
      font-size: 16px;

      z-index: 11;
      position: relative;
    }
  }
}
</style>