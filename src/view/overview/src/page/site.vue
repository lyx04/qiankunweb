<template>
  <el-container>
    <div class="h-container">
      <el-main style="height:100%;width: 100%;left:0;">
        <div class="main-index">
          <div class="refresh">
            数据更新：{{ updateTime
            }}<i class="el-icon-refresh" @click="refreshClick"></i>
          </div>
          <el-row>
            <el-col :span="19">
              <el-row>
                <!--基本情况-->
                <el-col :span="8">
                  <div class="main-col">
                    <div class="basic-situation">
                      <div class="chart_title">
                        <div class="org-select">
                          <el-select
                            v-model.trim="orgId"
                            placeholder="请选择用电单位"
                            @change="orgChange"
                            filterable
                          >
                            <el-option
                              v-for="item in orgList"
                              :key="item.orgId"
                              :label="item.name"
                              :value="item.orgId"
                            >
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                      <!--内容-->
                      <div class="basic-situation-content">
                        <div class="basic-situation-content-info">
                          <div class="basic-situation-content-capacity">
                            <q>{{ basicSituation.capacity }}</q
                            ><span>kVA</span>
                            <p>运行容量</p>
                          </div>
                          <div
                            class="basic-situation-content-capacity color-blue"
                          >
                            <q>{{ basicSituation.roomcount }}</q
                            ><span>个</span>
                            <p>配电室</p>
                          </div>
                          <div
                            class="basic-situation-content-capacity color-green"
                          >
                            <q>{{ basicSituation.transformercount }}</q
                            ><span>个</span>
                            <p>变压器</p>
                          </div>
                        </div>
                        <!--安全运行-->
                        <div class="org-info-content-num">
                          <div class="org-info-content-num-img">
                            <img
                              src="~@/assets/img/site/num.png"
                              alt=""
                            />
                          </div>
                          <div class="org-info-content-num-text">
                            <div>安全运行</div>
                            <span>{{
                              safeDays > 9999 ? "1万+" : safeDays
                            }}</span
                            ><label>天</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="equipment-composition">
                    <div class="overview_title">
                      <img
                        src="@/assets/img/overview/title02.png"
                        alt=""
                        class="overview-title-img-left"
                      />
                      <span>设备构成</span>
                      <img
                        src="@/assets/img/overview/title01.png"
                        alt=""
                        class="overview-title-img-right"
                      />
                    </div>
                    <div
                      id="site_c1"
                      ref="site_c1"
                      class="equipment-composition-chart"
                    ></div>
                  </div>
                </el-col>
                <!--功率因数-->
                <el-col :span="8">
                  <div class="power-factor">
                    <div
                      class="overview_title"
                      style="cursor: pointer"
                      @click="
                        jumpRouter(
                          '/index/statistical/run',
                          'report:run:list',
                          '5'
                        )
                      "
                    >
                      <img
                        src="@/assets/img/overview/title02.png"
                        alt=""
                        class="overview-title-img-left"
                      />
                      <span>功率因数</span>
                      <img
                        src="@/assets/img/overview/title01.png"
                        alt=""
                        class="overview-title-img-right"
                      />
                    </div>
                    <div class="power-factor-content">
                      <ul>
                        <li>
                          <!--四角-->
                          <div class="angle angle-left-top"></div>
                          <div class="angle angle-left-bottom"></div>
                          <div class="angle angle-right-top"></div>
                          <div class="angle angle-right-bottom"></div>
                          <span>上月平均</span>
                          <img
                            src="~@/assets/img/site/divider.png"
                            alt=""
                          />
                          <div class="alarm-list-content-num">
                            {{ lastMonthPowerFactorNum || 0 }}
                          </div>
                        </li>
                        <li>
                          <!--四角-->
                          <div class="angle angle-left-top"></div>
                          <div class="angle angle-left-bottom"></div>
                          <div class="angle angle-right-top"></div>
                          <div class="angle angle-right-bottom"></div>
                          <span>上月无功电量<i>(kVarh)</i></span>
                          <img
                            src="~@/assets/img/site/divider.png"
                            alt=""
                          />
                          <div class="alarm-list-content-num">
                            {{ Number(lastMonthReactive).toFixed(2) || 0.0 }}
                          </div>
                        </li>
                        <li>
                          <!--四角-->
                          <div class="angle angle-left-top"></div>
                          <div class="angle angle-left-bottom"></div>
                          <div class="angle angle-right-top"></div>
                          <div class="angle angle-right-bottom"></div>
                          <span>本月平均</span>
                          <img
                            src="~@/assets/img/site/divider.png"
                            alt=""
                          />
                          <div class="alarm-list-content-num">
                            {{ currentPowerFactorNum || 0.0 }}
                          </div>
                        </li>
                        <li>
                          <!--四角-->
                          <div class="angle angle-left-top"></div>
                          <div class="angle angle-left-bottom"></div>
                          <div class="angle angle-right-top"></div>
                          <div class="angle angle-right-bottom"></div>
                          <span>本月无功电量<i>(kVarh)</i></span>
                          <img
                            src="~@/assets/img/site/divider.png"
                            alt=""
                          />
                          <div class="alarm-list-content-num">
                            {{ Number(currentReactive).toFixed(2) || 0 }}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <!--告警统计-->
                  <div class="alarm">
                    <div
                      class="overview_title"
                      style="cursor: pointer"
                      @click="
                        jumpRouter(
                          '/index/all/monitor/alarm',
                          'monitor:alarm:list'
                        )
                      "
                    >
                      <img
                        src="@/assets/img/overview/title02.png"
                        alt=""
                        class="overview-title-img-left"
                      />
                      <span>告警统计</span>
                      <img
                        src="@/assets/img/overview/title01.png"
                        alt=""
                        class="overview-title-img-right"
                      />
                    </div>
                    <div class="alarm-content">
                      <div class="alarm-content-top">
                        <span
                          >本月告警<i>{{ alarmInfo.alarmTotal }}</i
                          >个</span
                        ><span
                          >待处理<i>{{ alarmInfo.untreatNum }}</i
                          >个</span
                        >
                      </div>
                      <div id="site_c4" ref="site_c4" class="alarm-chart"></div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="load">
                    <!--负荷曲线-->
                    <div
                      class="overview_title"
                      style="cursor: pointer"
                      @click="
                        jumpRouter(
                          '/index/statistical/load',
                          'report:load:list'
                        )
                      "
                    >
                      <img
                        src="@/assets/img/overview/title02.png"
                        alt=""
                        class="overview-title-img-left"
                      />
                      <span>负荷曲线</span>
                      <img
                        src="@/assets/img/overview/title01.png"
                        alt=""
                        class="overview-title-img-right"
                      />
                    </div>
                    <div class="load-content">
                      <div class="load-rate-content">
                        <div
                          id="site_c6"
                          ref="site_c6"
                          class="load-rate-chart"
                        ></div>
                        <div
                          class="load-rate-content-title"
                          v-if="this.todayList.length > 0"
                        >
                          负荷<i>{{ loadNum || 0 }}</i
                          >kW
                        </div>
                      </div>
                      <div class="load-day-content">
                        <div id="site_c7" ref="site_c7"></div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <!--工单统计-->
                <el-col :span="8">
                  <div class="alarm">
                    <div
                      class="overview_title"
                      style="cursor: pointer"
                      @click="
                        jumpRouter(
                          '/index/smart/repairOrder',
                          'maintain:workOrder:list'
                        )
                      "
                    >
                      <img
                        src="@/assets/img/overview/title02.png"
                        alt=""
                        class="overview-title-img-left"
                      />
                      <span>工单统计</span>
                      <img
                        src="@/assets/img/overview/title01.png"
                        alt=""
                        class="overview-title-img-right"
                      />
                    </div>
                    <div class="alarm-content">
                      <div class="alarm-content-top">
                        <span
                          >本月工单<i>{{ workerOrderInfo.total }}</i
                          >个</span
                        ><span
                          >待处理<i>{{ workerOrderInfo.undisposed }}</i
                          >个</span
                        >
                      </div>
                      <div id="site_c5" ref="site_c5" class="alarm-chart"></div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="16">
                  <!--电量曲线-->
                  <div class="electricity">
                    <div
                      class="overview_title"
                      style="cursor: pointer"
                      @click="
                        jumpRouter(
                          '/index/statistical/electricity',
                          'report:electricity:list',
                          '4'
                        )
                      "
                    >
                      <img
                        src="@/assets/img/overview/title02.png"
                        alt=""
                        class="overview-title-img-left"
                      />
                      <span>电量曲线</span>
                      <img
                        src="@/assets/img/overview/title01.png"
                        alt=""
                        class="overview-title-img-right"
                      />
                    </div>
                    <div class="electricity-content">
                      <div class="electricity-month-content">
                        <div id="site_c9" ref="site_c9"></div>
                      </div>
                      <div class="electricity-constitute-content">
                        <div
                          id="site_c8"
                          ref="site_c8"
                          class="electricity-constitute-chart"
                        ></div>
                        <div class="electricity-constitute-content-title">
                          电量构成
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <!--通讯工况-->
            <el-col :span="5">
              <div class="communication">
                <div
                  class="overview_title"
                  style="cursor: pointer"
                  @click="
                    jumpRouter(
                      '/index/all/monitor/wcquery',
                      'monitor:condition:list'
                    )
                  "
                >
                  <img
                    src="@/assets/img/overview/title02.png"
                    alt=""
                    class="overview-title-img-left"
                  />
                  <span>通讯工况</span>
                  <img
                    src="@/assets/img/overview/title01.png"
                    alt=""
                    class="overview-title-img-right"
                  />
                </div>
                <div class="communication-content">
                  <div class="proess">
                    <div
                      id="site_c10"
                      ref="site_c10"
                      class="communication-chart"
                    ></div>
                  </div>
                  <div class="proessNum">
                    <div class="item">
                      <p>
                        <q>{{ communication.gatewayNum }}</q
                        ><span class="num">台</span>
                      </p>
                      <span>网关</span>
                    </div>
                    <div class="item">
                      <p>
                        <q>{{ communication.meterNum }}</q
                        ><span class="num">台</span>
                      </p>
                      <span>表计</span>
                    </div>
                    <div class="item">
                      <p class="active">
                        <q
                          >{{
                            (communication.onlineRate * 100).toFixed(2) || 0
                          }}%</q
                        >
                      </p>
                      <span>网关在线率</span>
                    </div>
                  </div>
                </div>
              </div>
              <!--本月点电量排行-->
              <div class="main-electricity">
                <div
                  class="overview_title"
                  style="cursor: pointer"
                  @click="
                    jumpRouter(
                      '/index/statistical/electricity',
                      'report:electricity:list',
                      '4',
                      '20'
                    )
                  "
                >
                  <img
                    src="@/assets/img/overview/title02.png"
                    alt=""
                    class="overview-title-img-left"
                  />
                  <span>本月电量排行</span>
                  <img
                    src="@/assets/img/overview/title01.png"
                    alt=""
                    class="overview-title-img-right"
                  />
                </div>
                <ul class="company">
                  <li v-for="(item, index) in powerRankingsList" :key="index">
                    <div class="index">{{ index + 1 }}</div>
                    <div class="linear">
                      <div class="linear_title">
                        <span :title="item.m">{{ item.m || "--" }}</span
                        ><span
                          class="num"
                          :title="String(item.v.toFixed(2)) || '--'"
                          >{{ String(item.v.toFixed(2)) || "--" }}kWh</span
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
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </div>
  </el-container>
</template>

<script>
import { Chart, registerShape } from "@antv/g2";
import * as METERTIME from "hlcx-qiankun-commonservice/utils/config/meterTime";
import { mapState } from "vuex";
import site from "../mixins/site";
import situationchart from "../mixins/basicSituationchart";
import alarmChart from "../mixins/alarmChart";
import workOrder from "../mixins/workOrder";
import loadChart from "../mixins/loadChart";
import electricityChart from "../mixins/electricityChart";
import conditionChart from "../mixins/conditionChart";

export default {
  name: "site",
  mixins: [
    site,
    situationchart,
    alarmChart,
    workOrder,
    loadChart,
    electricityChart,
    conditionChart,
  ],
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    })
  },
  data() {
    return {
      updateTime: this.jstool.jshandle.getcurrentTime("yyyy-MM-dd HH:mm:ss"), // 更新时间
      orgId: "", // 用电单位id
      orgList: [], // 用电单位list
      interval: {
        currentInterval: [], // 本月抄表日
        lastMonthInterval: [], // 上月
        fullYearInterval: [] // 本年
      }, // 抄表日
      // 基本情况
      basicSituation: {
        equipments: [], // 设备
        capacity: 0, // 容量
        roomcount: 0, // 配电室数量
        transformercount: 0 // 变压器数量
      },
      chart1: {}, // 基本情况chart
      registerShape: registerShape,
      currentPowerFactorNum: 0.0, // 本月功率因数
      currentReactive: 0, // 本月无功电量
      lastMonthPowerFactorNum: 0.0, // 上月功率因数
      lastMonthReactive: 0, // 上月无功电量
      chart4: {}, // 告警统计
      alarmInfo: {
        alarmTotal: 0, // 本月告警总数
        untreatNum: 0, // 本月告警待处理
        typesNum: []
      },
      chart5: {}, // 工单统计
      workerOrderInfo: {
        total: 0,
        undisposed: 0,
        statisticsParticularsVo: []
      },
      chart6: {}, // 负荷率chart
      loadRate: {
        // 负荷率
        percent: 0,
        capacity: 0
      },
      loadNum: "0", // 负荷
      meterTime: METERTIME.meterTime, // 24小时
      meterTimeFilter: [], // 24小时96个点
      chart7: {}, // 负荷曲线
      todayList: [], // 今日负荷
      yesterdayList: [], // 昨日负荷
      chart8: {}, // 电量构成
      spWorkList: [], // 电量构成数据
      chart9: {}, // 电量曲线
      thisMonth: [], // 本月电量
      thisElectricity: 0, // 本月电量和
      lastMonth: [], // 上月电量曲线
      lastElectricity: 0, // 上月电量和
      yearElectricity: 0, // 本年电量和
      chart10: {}, // 通讯工况
      chart11: {}, //
      communication: {
        // 通讯工况数据
        meterNum: 0, // 表计
        gatewayNum: 0, // 网关
        connectGatewayNum: 0, // 网关在线个数
        onlineRate: 0
      },
      //  电量排行
      powerRankingsList: [],
      safeDays: 0 // 天数
    };
  },
  methods: {
    //跳转
    jumpRouter(url, perm, cycle, tabsActiveId) {
      var per = perm;
      var permissions = JSON.parse(sessionStorage.getItem("permissions"));
      if (permissions.indexOf(per) >= 0 || permissions.indexOf("*:*:*") >= 0) {
        sessionStorage.removeItem("indexId");
        let newUrl = this.$router.resolve({
          path: url
        });
        // 缓存orgid共报表使用
        this.resetSetItem("report-orgId", this.orgId);
        // 工单-告警等
        this.resetSetItem("orgId", this.orgId);
        if (cycle) {
          this.resetSetItem("report-cycle", cycle);
        } else {
          sessionStorage.removeItem("report-cycle");
        }
        if (tabsActiveId) {
          this.resetSetItem("report-tabsActiveId", tabsActiveId);
        } else {
          sessionStorage.removeItem("report-tabsActiveId");
        }
        window.open(newUrl.href, "_blank");
      } else {
        this.$message({
          message: "暂无权限",
          type: "error",
          duration: 2 * 1000
        });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.dict);
      this.chart1 = new Chart({
        container: "site_c1", // 指定图表容器 ID
        autoFit: true,
        height: 180
      });
      this.chart4 = new Chart({
        container: "site_c4", // 指定图表容器 ID
        autoFit: true,
        height: 160
      });
      this.chart5 = new Chart({
        container: "site_c5", // 指定图表容器 ID
        autoFit: true,
        height: 160
      });
      this.chart6 = new Chart({
        container: "site_c6", // 指定图表容器 ID
        autoFit: true,
        height: 132
      });
      this.chart7 = new Chart({
        container: "site_c7", // 指定图表容器 ID
        autoFit: true,
        height: 230,
        appendPadding: [0, 0, 0, 20]
      });
      this.chart8 = new Chart({
        container: "site_c8", // 指定图表容器 ID
        autoFit: true,
        height: 136
      });
      this.chart9 = new Chart({
        container: "site_c9", // 指定图表容器 ID
        autoFit: true,
        height: 230
      });
      this.chart11 = new Chart({
        container: "site_c10", // 指定图表容器 ID
        autoFit: true,
        height: 180
      });
      this.getOrgList();
    });
  },
  beforeDestroy() {
    this.chart1.destroy();
    this.chart4.destroy();
    this.chart5.destroy();
    this.chart6.destroy();
    this.chart7.destroy();
    this.chart8.destroy();
    this.chart9.destroy();
    this.chart11.destroy();
    this.chart1 = null;
    this.chart4 = null;
    this.chart5 = null;
    this.chart6 = null;
    this.chart7 = null;
    this.chart8 = null;
    this.chart9 = null;
    this.chart11 = null;
  }
};
</script>

<style scoped lang="scss">
@import "@/assets/css/site";
</style>
