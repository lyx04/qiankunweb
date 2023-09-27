import {
  GET_MAXPPERCENT,
  GET_OVERVIEW_INFO,
  GET_DISTRIBUTION,
  GET_COMRANKELECQUALITY,
  GET_COMMUNICATION_INFO,
  GET_ALARM_INFO,
  GET_MAINTAIN_STATIS,
  GET_15_MIN_ORGID,
  GET_ELECQUALITY_DAY,
  GET_SCREEN_TITLE,
  EDIT_SCREEN_TITLE,
  GET_ALARM_LIMIT_INFO
} from "@/common/api/overview/screen";
import { GET_SYSTEM_ORG_LIST } from "@/common/api/system/organization";

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
    // 前10天
    getTenDate() {
      var curDate = new Date();
      var today = new Date(curDate.getTime() - 9 * 24 * 60 * 60 * 1000);

      var month = today.getMonth() + 1;

      month = month < 10 ? "0" + month : month;

      var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      var now1 = today.getFullYear() + "-" + month + "-" + day;
      return now1;
    },
    // 刷新数据
    refreshClick() {
      this.updateTime = this.getcurrentTime("yyyy-MM-dd HH:mm:ss");
      this.getInfo();
    },
    //跳转
    jumpRouter(url, perm) {
      var per = perm;
      var permissions = JSON.parse(sessionStorage.getItem("permissions"));
      if (permissions.indexOf(per) >= 0 || permissions.indexOf("*:*:*") >= 0) {
        sessionStorage.removeItem("indexId");
        let newUrl = this.$router.resolve({
          path: url
        });
        window.open(newUrl.href, "_blank");
      } else {
        this.$message({
          message: "暂无权限",
          type: "error",
          duration: 2 * 1000
        });
      }
    },
    // 初始化
    getInfo() {
      this.getorgList();
      this.getMaxppercent();
      this.topfive();
      this.gettenElectricityList();
    },
    // 组织列表
    getorgList() {
      this.orgList = [];
      GET_SYSTEM_ORG_LIST().then(res => {
        this.orgList = res.data;
        // 负荷曲线
        this.meterTime.forEach(item => {
          this.meterTimeFilter.push(item.split("-")[1]);
        });
        // 企业用户数、配电室数量等
        this.getoverviewinfo();
        //  工况查询
        this.getCommunicationInfo();
        //  告警查询
        this.getAlarmInfo();
        //  工单统计
        this.getStatisticsWorkOrderByInterval();
        //  今日负荷曲线
        this.getTodayP15MinByOrgId();
        // 告警
        this.getalarmList();
      });
    },
    //  选取最大负荷率的n个企业，还可计算单个企业负荷率
    getMaxppercent() {
      var data = {
        flag: 1,
        num: 5,
        orgId: this.orgId
      };
      this.maxppercentList = [];
      GET_MAXPPERCENT(data).then(res => {
        if (res.data) {
          this.maxppercentList = res.data;
        }
      });
    },
    // 获取用户数、配电室、总容量
    getoverviewinfo() {
      GET_OVERVIEW_INFO().then(res => {
        this.overViewInfo.orgNum = res.data.orgNum;
        this.overViewInfo.roomNum = res.data.roomNum;
        this.overViewInfo.capacity = res.data.capacity;
        //  企业容量统计
        this.getdistribution();
      });
    },
    //  企业容量统计
    getdistribution() {
      GET_DISTRIBUTION().then(res => {
        var num = 0;
        if (res.data.length) {
          res.data.forEach(i => {
            num += i.count;
          });
          res.data.forEach(i => {
            i.percent = Math.round((i.count / num) * 100);
          });
          this.distributionList = res.data;
          this.chart1.clear();
          this.orgCapacityChart();
        }
      });
    },
    //获取top5
    topfive() {
      var params = {
        beginDate: `${this.getcurrentTime("yyyy-MM")}-01`,
        endDate: `${this.getcurrentTime("yyyy-MM")}-31`,
        m: "Eptp",
        orgId: this.orgId
      };
      GET_COMRANKELECQUALITY(params).then(e => {
        if (e.data.length) {
          // e.data.sort(() => {
          //   return -1;
          // });
          var max = e.data[0].v;
          e.data.forEach((i, v) => {
            i.index = v + 1;
            i.percent = max ? Math.round((i.v / max) * 100) : 0;
          });
          this.topfiveList = e.data;
        } else {
          this.topfiveList = [];
        }
      });
    },
    // 通讯工况
    getCommunicationInfo() {
      this.communication.meterNum = 0;
      this.communication.gatewayNum = 0;
      this.communication.connectGatewayNum = 0;
      this.communication.onlineRate = 0;
      GET_COMMUNICATION_INFO().then(res => {
        this.communication.meterNum = res.data.meterNum;
        this.communication.gatewayNum = res.data.gatewayNum;
        this.communication.connectGatewayNum = res.data.connectGatewayNum;
        this.communication.onlineRate = Number(
          (
            Number(this.communication.connectGatewayNum) /
            Number(this.communication.gatewayNum)
          ).toFixed(4)
        );
        if (this.chart2.chart) {
          this.chart2.changeData(this.communication.onlineRate);
        } else {
          this.communicationChart();
        }
      });
    },
    // 告警统计
    getAlarmInfo() {
      var params = {
        startTime: `${this.getcurrentTime("yyyy-MM")}-01`,
        endTime: `${this.getcurrentTime("yyyy-MM")}-31`
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
    getStatisticsWorkOrderByInterval() {
      this.workerOrderInfo.total = 0;
      this.workerOrderInfo.undisposed = 0;
      this.workerOrderInfo.statisticsParticularsVo = [];
      GET_MAINTAIN_STATIS().then(res => {
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
    // 今日负荷曲线
    getTodayP15MinByOrgId() {
      var params = {
        date: this.getDate(),
        orgId: this.orgId
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
      GET_15_MIN_ORGID(params)
        .then(res => {
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
          this.todayList = arr;
          this.chart6.clear();
          this.loadCurveChart();
          //  昨日负荷曲线
          this.getYesterdayP15MinByOrgId();
        })
        .catch(() => {
          //  昨日负荷曲线
          this.getYesterdayP15MinByOrgId();
        });
    },
    // 昨日负荷曲线
    getYesterdayP15MinByOrgId() {
      var params = {
        date: this.getBeforeDate(),
        orgId: this.orgId
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
        this.chart6.clear();
        this.loadCurveChart();
      });
    },
    //  告警列表
    getalarmList() {
      var query = {
        handleStatus: 0,
        limit: 4
      };
      GET_ALARM_LIMIT_INFO(query).then(res => {
        this.alarmList = res.data;
      });
    },
    // 近10日电量
    gettenElectricityList() {
      var data = {
        beginDate: this.getTenDate(),
        endDate: this.getDate(),
        flag: 0,
        m: "Eptp",
        orgId: this.orgId
      };
      GET_ELECQUALITY_DAY(data).then(res => {
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            item.date = this.filtertime(item.m, "MM-dd");
            item.v = Number(Number(item.v).toFixed(2));
          });
          this.tenElectricityList = res.data;
        }
        this.chart7.clear();
        this.tenElectricityChart();
      });
    },
    //  双击标题修改
    editTitle() {
      this.iseditTitle = true;
    },
    // 查询标题
    gettitleName() {
      GET_SCREEN_TITLE(this.orgId).then(res => {
        this.titleName = res.data.title;
      });
    },
    //  修改标题
    editScreenTitle() {
      var data = {
        orgId: this.orgId,
        title: this.titleName
      };
      EDIT_SCREEN_TITLE(data).then(() => {
        this.$message({
          type: "success",
          message: "修改成功"
        });
        this.iseditTitle = false;
        this.gettitleName();
      });
    },
    //  取消修改
    closeeditScreenTitle() {
      this.iseditTitle = false;
      this.gettitleName();
    }
  }
};
