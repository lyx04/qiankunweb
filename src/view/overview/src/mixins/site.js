import { GET_SYSTEM_ORG_LIST } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import {
  GET_ORG_EQUIP_INFO,
  GET_PFBY_DAY_INTERVAL,
  GET_RANGE_ORGID,
  GET_ALARM_INFO,
  GET_WORK_ORDER_INFO,
  GET_MAX_PPERCENT,
  GET_ELECQUALITY_DAY,
  GET_15_MIN_ORGID,
  GET_SUMELECQUALITY_INTERVAL,
  GET_COMMUNICATION_INFO,
  GET_MAX_ELECQUALITY_DEV
} from "hlcx-qiankun-commonservice/utils/api/overview/site";
import { GET_SAFE_DAYS } from "hlcx-qiankun-commonservice/utils/api/ringMonitor/index";

export default {
  methods: {
    // 当前时间
    getDate() {
      var today = new Date();

      var month = today.getMonth() + 1;

      month = month < 10 ? "0" + month : month;

      var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      var now1 = today.getFullYear() + "-" + month + "-" + day;
      return now1;
    },
    // 前一天
    getBeforeDate() {
      var curDate = new Date();
      var today = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);

      var month = today.getMonth() + 1;

      month = month < 10 ? "0" + month : month;

      var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      var now1 = today.getFullYear() + "-" + month + "-" + day;
      return now1;
    },
    // 刷新数据
    refreshClick() {
      this.updateTime = this.getcurrentTime("yyyy-MM-dd HH:mm:ss");
      this.orgChange(this.orgId);
    },
    //  获取设备安全运行天数
    getSafeDays(orgId) {
      let data = {
        id: orgId,
        type: "01"
      };
      GET_SAFE_DAYS(data).then(res => {
        this.safeDays = res.data;
      });
    },
    // 切换用电单位
    orgChange(val) {
      // 缓存orgid共报表使用
      this.resetSetItem("report-orgId", val);
      if (this.chart1.canvas) {
        this.chart1.clear(); // 清理所有图形
      }
      if (this.chart4.canvas) {
        this.chart4.clear(); // 告警统计
      }
      if (this.chart5.canvas) {
        this.chart5.clear(); // 工单统计
      }
      if (this.chart6.canvas) {
        this.chart6.clear(); // 负荷率
      }
      if (this.chart7.canvas) {
        this.chart7.clear(); // 负荷曲线
      }
      if (this.chart8.canvas) {
        this.chart8.clear(); // 电量构成
      }
      if (this.chart9.canvas) {
        this.chart9.clear(); // 电量曲线
      }
      if (this.chart11.autoFit) {
        this.chart11.clear(); // 通讯工况
      }
      // 安全运行天数
      this.getSafeDays(val);
      // 基本情况
      this.getOrgequipinfo(val, false);
      //  通讯工况
      this.getCommunicationInfo(val, false);
      // 查询当前企业的抄表周期
      this.getRangeByOrgId(val, false);
      //  负荷率
      this.getMaxppercent(val, false);
      //  今日负荷曲线
      this.getTodayP15MinByOrgId(this.getDate(), val, false);
    },
    // 查询当前企业的抄表周期
    getRangeByOrgId(orgId, initialize) {
      GET_RANGE_ORGID(orgId).then(res => {
        this.interval.currentInterval = res.data.currentInterval.split(",");
        this.interval.lastMonthInterval = res.data.lastMonthInterval.split(",");
        this.interval.fullYearInterval = res.data.fullYearInterval.split(",");
        //  本月功率因数
        this.getcurrentpfbydayinterval(
          this.interval.currentInterval[0],
          this.interval.currentInterval[1],
          this.orgId,
          initialize
        );
        //  上月功率因数
        this.getlastMonthpfbydayinterval(
          this.interval.lastMonthInterval[0],
          this.interval.lastMonthInterval[1],
          this.orgId,
          initialize
        );
        //  告警统计
        this.getAlarmInfo(
          this.interval.currentInterval[0],
          this.interval.currentInterval[1],
          this.orgId,
          initialize
        );
        //  工单统计
        this.getStatisticsWorkOrderByInterval(
          this.interval.currentInterval[0],
          this.interval.currentInterval[1],
          this.orgId,
          initialize
        );
        // 本月电量曲线
        this.getThisMonthElectricityList(
          this.interval.currentInterval[0],
          this.interval.currentInterval[1],
          this.orgId,
          initialize
        );
        // 电量构成
        this.getelecqualitybyday(
          this.interval.currentInterval[0],
          this.interval.currentInterval[1],
          this.orgId,
          initialize
        );
        // 电量排行
        this.getmaxelecqualitybydev(
          this.interval.currentInterval[0],
          this.interval.currentInterval[1],
          this.orgId
        );
      });
    },
    // 查询组织list
    getOrgList() {
      GET_SYSTEM_ORG_LIST().then(res => {
        this.orgList = res.data;
        if (this.orgList.length > 0) {
          if (this.$route.params.orgId) {
            this.orgId = Number(this.$route.params.orgId);
            // 缓存orgid共报表使用
            this.resetSetItem("report-orgId", this.orgId);
          } else {
            this.orgId = this.orgList[0].orgId;
            // 缓存orgid共报表使用
            this.resetSetItem("report-orgId", this.orgId);
          }
          // 安全运行天数
          this.getSafeDays(this.orgId);
          // 负荷曲线
          this.meterTime.forEach(item => {
            this.meterTimeFilter.push(item.split("-")[1]);
          });
          // 查询当前企业的抄表周期
          this.getRangeByOrgId(this.orgId, true);
          // 基本情况
          this.getOrgequipinfo(this.orgId, true);
          //  负荷率
          this.getMaxppercent(this.orgId, true);
          //  今日负荷曲线
          this.getTodayP15MinByOrgId(this.getDate(), this.orgId, true);
          //  通讯工况
          this.getCommunicationInfo(this.orgId, true);
        }
      });
    },
    // 基本情况
    getOrgequipinfo(orgId) {
      GET_ORG_EQUIP_INFO(orgId).then(res => {
        this.basicSituation.equipments = res.data.equipments;
        this.basicSituation.capacity = res.data.capacity;
        this.basicSituation.roomcount = 0;
        this.basicSituation.transformercount = 0;
        this.chart1.clear();
        this.basicSituationchart();
        if (res.data.equipments.length > 0) {
          res.data.equipments.forEach(item => {
            if (item.name == "配电室") {
              this.basicSituation.roomcount = item.count;
            } else if (item.name == "变压器") {
              this.basicSituation.transformercount = item.count;
            }
          });
        } else {
          this.basicSituation.roomcount = 0;
          this.basicSituation.transformercount = 0;
        }
      });
    },
    // 本月功率因数
    getcurrentpfbydayinterval(beginDate, endDate, orgId) {
      // 有功/无功
      var params = {
        beginDate: beginDate,
        endDate: endDate,
        orgId: orgId,
        m: "Eptp",
        m1: "Eqtp",
        m2: "Tqtn"
      };
      this.currentPowerFactorNum = 0;
      this.currentReactive = 0;
      GET_PFBY_DAY_INTERVAL(params).then(res => {
        if (res.data) {
          this.currentPowerFactorNum = res.data.pf;
          this.currentReactive = res.data.v;
        }
      });
    },
    // 上月功率因数
    getlastMonthpfbydayinterval(beginDate, endDate, orgId) {
      // 有功/无功
      var params = {
        beginDate: beginDate,
        endDate: endDate,
        orgId: orgId,
        m: "Eptp",
        m1: "Eqtp",
        m2: "Tqtn"
      };
      GET_PFBY_DAY_INTERVAL(params).then(res => {
        if (res.data) {
          this.lastMonthPowerFactorNum = res.data.pf;
          this.lastMonthReactive = res.data.v;
        }
      });
    },
    // 告警统计
    getAlarmInfo(startTime, endTime, orgId) {
      var params = {
        orgId: orgId,
        startTime: startTime,
        endTime: endTime
      };
      this.alarmInfo.alarmTotal = 0;
      this.alarmInfo.untreatNum = 0;
      this.alarmInfo.typesNum = [];
      GET_ALARM_INFO(params).then(res => {
        this.alarmInfo.alarmTotal = res.data.alarmTotal;
        this.alarmInfo.untreatNum = res.data.untreatNum;
        res.data.typesNum.forEach(item => {
          item.proportion = Number(
            (item.count / res.data.alarmTotal).toFixed(4)
          );
        });
        this.alarmInfo.typesNum = res.data.typesNum;
        this.chart4.clear();
        this.alarmInfoChart();
      });
    },
    //工单统计
    getStatisticsWorkOrderByInterval(startTime, endTime, orgId) {
      this.workerOrderInfo.total = 0;
      this.workerOrderInfo.undisposed = 0;
      this.workerOrderInfo.statisticsParticularsVo = [];
      GET_WORK_ORDER_INFO(orgId, startTime, endTime).then(res => {
        this.workerOrderInfo.total = res.data.total;
        this.workerOrderInfo.undisposed = res.data.undisposed;
        res.data.statisticsParticularsVo.forEach(item => {
          item.proportion = Number((item.num / res.data.total).toFixed(4));
        });
        this.workerOrderInfo.statisticsParticularsVo =
          res.data.statisticsParticularsVo;
        this.chart5.clear();
        this.workOrderChart();
      });
    },
    // 负荷率
    getMaxppercent(orgId) {
      var params = {
        flag: 0,
        num: 1,
        orgId: orgId
      };
      this.loadRate.percent = 0;
      this.loadRate.capacity = 0;
      GET_MAX_PPERCENT(params)
        .then(res => {
          if (res.data && res.data.length > 0) {
            this.loadRate.percent = res.data[0].percent;
            this.loadRate.capacity = res.data[0].capacity;
          }
          this.chart6.clear();
          this.loadRateChart();
        })
        .catch(() => {
          this.chart6.clear();
          this.loadRateChart();
        });
    },
    // 今日负荷曲线
    getTodayP15MinByOrgId(date, orgId) {
      var params = {
        date: date,
        orgId: orgId
      };
      this.todayList = [];
      var arr = [];
      this.meterTimeFilter.forEach(item => {
        var o = {};
        o.date = item;
        o.type = "今日";
        o.value = null;
        arr.push(o);
      });
      this.loadNum = 0;
      GET_15_MIN_ORGID(params)
        .then(res => {
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
            this.loadNum = array[array.length - 1];
          }
          this.todayList = arr;
          this.chart7.clear();
          this.loadCurveChart();
          //  昨日负荷曲线
          this.getYesterdayP15MinByOrgId(this.getBeforeDate(), orgId);
        })
        .catch(() => {
          //  昨日负荷曲线
          this.getYesterdayP15MinByOrgId(this.getBeforeDate(), orgId);
        });
    },
    // 昨日负荷曲线
    getYesterdayP15MinByOrgId(date, orgId) {
      var params = {
        date: date,
        orgId: orgId
      };
      this.yesterdayList = [];
      var arr = [];
      this.meterTimeFilter.forEach(item => {
        var o = {};
        o.date = item;
        o.type = "昨日";
        o.value = null;
        arr.push(o);
      });
      GET_15_MIN_ORGID(params).then(res => {
        if (res.data) {
          arr.forEach(item => {
            for (let i in res.data) {
              if (item.date == i.split("_")[0]) {
                item.date = i.split("_")[0];
                item.value = Number(res.data[i].toFixed(2));
              }
            }
          });
        }
        this.yesterdayList = arr;
        this.chart7.clear();
        this.loadCurveChart();
      });
    },
    // 时间周期内每天
    getDayAll(begin, end) {
      var dateAllArr = new Array();
      var ab = begin.split("-");
      var ae = end.split("-");
      var db = new Date();
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
      var de = new Date();
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
      var unixDb = db.getTime();
      var unixDe = de.getTime();
      for (var k = unixDb; k <= unixDe; ) {
        dateAllArr.push(this.jstool.jshandle.getTimestampString(k, "dd").toString());
        k = k + 24 * 60 * 60 * 1000;
      }
      return dateAllArr;
    },
    // 本月电量曲线
    getThisMonthElectricityList(beginDate, endDate, orgId) {
      var params = {
        beginDate: beginDate,
        endDate: endDate,
        flag: 0,
        m: "Eptp",
        orgId: orgId
      };
      var arr = [];
      this.getDayAll(beginDate, endDate).forEach(item => {
        var o = {};
        o.date = item;
        o.type = "本月";
        o.value = null;
        arr.push(o);
      });
      this.thisMonth = [];
      this.thisElectricity = 0;
      GET_SUMELECQUALITY_INTERVAL(params)
        .then(res => {
          if (res.data) {
            this.thisElectricity = res.data.v.toFixed(2);
          }
          this.chart9.clear();
          this.MonthElectricityChart();
          GET_ELECQUALITY_DAY(params)
            .then(res => {
              this.thisMonth = arr;
              if (res.data && res.data.length > 0) {
                this.thisMonth.forEach(item => {
                  res.data.forEach(val => {
                    if (item.date == this.filtertime(val.m, "dd")) {
                      item.value = Number(val.v.toFixed(2));
                    }
                  });
                });
              }
              this.chart9.clear();
              this.MonthElectricityChart();
              // 上月电量曲线
              this.getLastMonthElectricityList(
                this.interval.lastMonthInterval[0],
                this.interval.lastMonthInterval[1],
                orgId
              );
            })
            .catch(() => {
              // 上月电量曲线
              this.getLastMonthElectricityList(
                this.interval.lastMonthInterval[0],
                this.interval.lastMonthInterval[1],
                orgId
              );
            });
        })
        .catch(() => {
          // 上月电量曲线
          this.getLastMonthElectricityList(
            this.interval.lastMonthInterval[0],
            this.interval.lastMonthInterval[1],
            orgId
          );
        });
    },
    // 上月电量曲线
    getLastMonthElectricityList(beginDate, endDate, orgId) {
      var params = {
        beginDate: beginDate,
        endDate: endDate,
        flag: 0,
        m: "Eptp",
        orgId: orgId
      };
      var arr = [];
      this.getDayAll(
        this.interval.currentInterval[0],
        this.interval.currentInterval[1]
      ).forEach(item => {
        var o = {};
        o.date = item;
        o.type = "上月";
        o.value = null;
        arr.push(o);
      });
      this.lastMonth = [];
      this.lastElectricity = 0;
      GET_SUMELECQUALITY_INTERVAL(params).then(res => {
        if (res.data) {
          this.lastElectricity = res.data.v.toFixed(2);
        }
        // 本年电量之和
        this.getsumelecqualitybydayinterval(
          this.interval.fullYearInterval[0],
          this.interval.fullYearInterval[1],
          orgId
        );
        GET_ELECQUALITY_DAY(params).then(res => {
          this.lastMonth = arr;
          if (res.data && res.data.length > 0) {
            this.lastMonth.forEach(item => {
              res.data.forEach(val => {
                if (item.date == this.filtertime(val.m, "dd")) {
                  item.value = Number(val.v.toFixed(2));
                }
              });
            });
          }
          this.chart9.clear();
          this.MonthElectricityChart();
        });
      });
    },
    // 本年电量之和
    getsumelecqualitybydayinterval(beginDate, endDate, orgId) {
      var params = {
        beginDate: beginDate,
        endDate: endDate,
        m: "Eptp",
        orgId: orgId
      };
      GET_SUMELECQUALITY_INTERVAL(params).then(res => {
        if (res.data) {
          this.yearElectricity = res.data.v.toFixed(2);
          this.chart9.clear();
          this.MonthElectricityChart();
        }
      });
    },
    // 电量构成
    getelecqualitybyday(beginDate, endDate, orgId) {
      var params = {
        beginDate: beginDate,
        endDate: endDate,
        flag: 1,
        m: "Eptp",
        orgId: orgId
      };
      this.spWorkList = [];
      this.dict.sp_work_type.forEach(item => {
        let obj = {};
        obj.name = item.dictLabel;
        obj.type = item.dictValue;
        obj.value = 0;
        obj.proportion = 0;
        this.spWorkList.push(obj);
      });
      var num = 0;
      GET_ELECQUALITY_DAY(params).then(res => {
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            num += Number(item.v);
            return num;
          });
          res.data.forEach(item => {
            this.spWorkList.forEach(val => {
              if (item.m == val.type) {
                val.value = Number(item.v.toFixed(2));
                val.proportion = Number((item.v / num).toFixed(4));
              }
            });
          });
        }
        this.chart8.clear();
        this.electricityConstituteChart();
      });
    },
    // 通讯工况
    getCommunicationInfo(orgId, inval) {
      var params = {
        orgId: orgId
      };
      this.communication.meterNum = 0;
      this.communication.gatewayNum = 0;
      this.communication.connectGatewayNum = 0;
      this.communication.onlineRate = 0;
      GET_COMMUNICATION_INFO(params).then(res => {
        this.communication.meterNum = res.data.meterNum;
        this.communication.gatewayNum = res.data.gatewayNum;
        this.communication.connectGatewayNum = res.data.connectGatewayNum;
        if (this.communication.connectGatewayNum) {
          this.communication.onlineRate = Number(
            (
              Number(this.communication.connectGatewayNum) /
              Number(this.communication.gatewayNum)
            ).toFixed(4)
          );
        } else {
          this.communication.onlineRate = 0;
        }
        this.communicationChartG2();
        if (inval) {
          this.communicationChart();
        } else {
          this.chart10.changeData(Number(this.communication.onlineRate) || 0);
        }
      });
    },
    // 电量排行
    getmaxelecqualitybydev(beginDate, endDate, orgId) {
      var params = {
        beginDate: beginDate,
        endDate: endDate,
        m: "Eptp",
        orgId: orgId,
        num: 10
      };
      this.powerRankingsList = [];
      GET_MAX_ELECQUALITY_DEV(params).then(res => {
        if (res.data.length > 0) {
          res.data.sort(() => {
            return -1;
          });
          var max = res.data[0].v;
          res.data.forEach((i, v) => {
            i.index = v + 1;
            i.percent = max ? Math.round((i.v / max) * 100) : 0;
          });
          this.powerRankingsList = res.data;
        }
      });
    }
  }
};
