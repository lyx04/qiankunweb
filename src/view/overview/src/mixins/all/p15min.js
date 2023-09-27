import { GET_ELECQUALITY_DAY, GET_SUMME_MONTH } from "hlcx-qiankun-commonservice/utils/api/overview/all";
import { GET_15_MIN_ORGID } from "hlcx-qiankun-commonservice/utils/api/overview/site";
import { Chart } from "@antv/g2";
import { meterTime } from "hlcx-qiankun-commonservice/utils/config/meterTime";
export default {
  data() {
    return {
      yearList: [],
      chargeList: [],
      chargeMax: {
        today: {
          v: 0,
        },
        yesterday: {
          v: 0,
        },
      },
    };
  },
  methods: {
    //获取负荷曲线
    p15min() {
      this.chargeList = [];
      var data = new Date();
      var datastr = `${this.jstool.jshandle.getcurrentTime("yyyy-MM-dd")}`;
      var params = {
        date: datastr,
        orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
      };
      var allTime = [];
      meterTime.forEach((i) => {
        allTime.push(i.split("-")[1]);
      });
      GET_15_MIN_ORGID(params).then((today) => {
        var yeasToday = new Date(new Date(datastr).getTime() - 86400000);
        var year = yeasToday.getFullYear();
        var month =
          yeasToday.getMonth() + 1 < 10
            ? "0" + (yeasToday.getMonth() + 1)
            : yeasToday.getMonth() + 1;
        var day =
          yeasToday.getDate() < 10
            ? "0" + yeasToday.getDate()
            : yeasToday.getDate();
        params.date = year + "-" + month + "-" + day;
        var toDatyObj;
        allTime.forEach((i) => {
          if (today.data && i + "_sum" in today.data) {
            toDatyObj = {
              data: String(data.getDate()),
              time: i,
              v: Number(today.data[i + "_sum"].toFixed(2)),
            };
            if (toDatyObj.v > this.chargeMax.today.v) {
              this.chargeMax.today = toDatyObj;
            }
          } else {
            toDatyObj = {
              data: String(data.getDate()),
              time: i,
              v: null,
            };
          }
          this.chargeList.push(toDatyObj);
        });
        GET_15_MIN_ORGID(params).then((yesterday) => {
          var yesterObj;
          allTime.forEach((i) => {
            if (yesterday.data && i + "_sum" in yesterday.data) {
              yesterObj = {
                data: String(day),
                time: i,
                v: Number(yesterday.data[i + "_sum"].toFixed(2)),
              };
              if (yesterObj.v > this.chargeMax.yesterday.v) {
                this.chargeMax.yesterday = yesterObj;
              }
            } else {
              yesterObj = {
                data: String(day),
                time: i,
                v: null,
              };
            }
            this.chargeList.push(yesterObj);
          });
          this.initChargeLine();
        });
      });
    },
    //电量负荷图
    initChargeLine() {
      var data = this.chargeList;
      var day = new Date().getDate();
      if (!this.refreshFilter()) {
        this.legend.chargeLine = new Chart({
          container: "chargechart",
          autoFit: true,
          appendPadding: [30, 30, 50, 50],
        });
      }
      this.legend.chargeLine.data(data);
      if (data.length) {
        this.legend.chargeLine.removeInteraction("legend-filter");
        this.legend.chargeLine.legend("data", {
          position: "top",
          marker: {
            symbol: "circle",
            style: {
              fillOpacity: 1,
            },
          },
          itemName: {
            style: {
              fill: "#ffffff",
            },
          },
        });
      } else {
        this.legend.chargeLine.legend(false);
      }

      this.legend.chargeLine.axis("time", {
        // line: null,
        label: {
          style: {
            fill: "#8A9ECF",
          },
        },
        tickLine: null,
      });
      this.legend.chargeLine.axis("v", {
        title: {
          style: {
            fill: "#8A9ECF",
          },
        },
        label: {
          style: {
            fill: "#8A9ECF",
          },
          formatter: (text) => {
            if (text > 10000) {
              return text / 10000 + "万";
            } else {
              return text;
            }
          },
        },
        grid: {
          line: {
            style: {
              stroke: "#1F63A3",
            },
          },
        },
      });
      this.legend.chargeLine.scale({
        v: {
          alias: "(kW)",
        },
        data: {
          formatter: (data) => {
            var sysdata = new Date().getDate();
            if (sysdata == data) {
              return "今日";
            } else {
              return "昨日";
            }
          },
        },
        time: {
          tickCount: 20,
        },
      });
      this.legend.chargeLine.tooltip({
        showCrosshairs: true,
        shared: true,
        domStyles: {
          "g2-tooltip-title": {
            color: "white",
          },
          "g2-tooltip-marker": {
            display: "none",
          },
          "g2-tooltip": {
            background: "#01133B",
            boxShadow: "none",
          },
          "g2-tooltip-list-item": {
            color: "white",
          },
        },
      });
      this.legend.chargeLine
        .area({
          sortable: true,
          startOnZero: true,
        })
        .position("time*v")
        .color("data", (val) => {
          var color = "red";
          if (data.length) {
            if (val == day) {
              color = `l(90) 0:#0099ff 1:rgba(0,0,0,0)`;
            } else {
              color = `l(90) 0:#00FFF2 1:rgba(0,0,0,0)`;
            }
          }

          return color;
        })
        .shape("smooth");
      this.legend.chargeLine
        .line()
        .position("time*v")
        .color("data")
        .shape("smooth")
        .tooltip(false);
      if (this.chargeMax.today.v) {
        this.legend.chargeLine.annotation().dataMarker({
          top: true,
          position: this.chargeMax.today,
          text: {
            content: `今日:${
              this.chargeMax.today.v
                ? Number(Number(this.chargeMax.today.v).toFixed(2))
                : 0
            }kW`,
            background: {
              padding: 7,
              style: {
                fill: "#1198B9",
                fillOpacity: 1,
              },
            },
            style: {
              fill: "#ffffff",
              fontSize: 12,
              textBaseline: "top",
            },
          },
          line: {
            length: 30,
          },
        });
      }
      if (this.chargeMax.yesterday.v) {
        this.legend.chargeLine.annotation().dataMarker({
          top: true,
          position: this.chargeMax.yesterday,
          text: {
            content: `昨日:${
              this.chargeMax.yesterday.v
                ? Number(Number(this.chargeMax.yesterday.v).toFixed(2))
                : 0
            }kW`,
            background: {
              padding: 7,
              style: {
                fill: "#1198B9",
                fillOpacity: 1,
              },
            },
            style: {
              fill: "#ffffff",
              fontSize: 12,
              textBaseline: "top",
            },
          },
          line: {
            length: 0,
          },
        });
      }
      this.legend.chargeLine.render();
    },
    //获取月度曲线
    getQualityDay() {
      this.yearList = [];
      var dateList = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 26, 27, 28, 29, 30, 31,
      ];
      //本月和上月
      var params = {
        m: "Eptp",
      };
      var date = `${this.jstool.jshandle.getcurrentTime("yyyy-MM")}`;
      params.beginDate = `${date}-01`;
      params.endDate = `${date}-31`;
      GET_ELECQUALITY_DAY(params).then((day) => {
        dateList.forEach((i) => {
          var serDate = day.data.filter((ser) => {
            return i == ser.m.slice(8);
          });
          var obj = {};
          if (serDate.length) {
            obj["year"] = this.jstool.jshandle
              .getcurrentTime("yyyy-MM")
              .slice(5, 7);
            obj["m"] = Number(serDate[0].m.slice(8));
            obj["v"] = Number(Number(serDate[0].v).toFixed(2));
          } else {
            obj["year"] = this.jstool.jshandle
              .getcurrentTime("yyyy-MM")
              .slice(5, 7);
            obj["m"] = i;
            obj["v"] = null;
          }
          this.yearList.push(obj);
        });
        // day.data.forEach(i => {
        //   i["year"] = i.m.slice(5, 7);
        //   i.m = i.m.slice(8);
        // });
        params.beginDate = `${this.jstool.jshandle.lastMonth(
          date,
          "yyyy-MM"
        )}-01`;
        params.endDate = `${this.jstool.jshandle.lastMonth(
          date,
          "yyyy-MM"
        )}-31`;

        GET_ELECQUALITY_DAY(params).then((upday) => {
          dateList.forEach((i) => {
            var serDate = upday.data.filter((ser) => {
              return i == ser.m.slice(8);
            });
            var obj = {};
            if (serDate.length) {
              obj["year"] = this.jstool.jshandle.lastMonth(date, "MM");
              obj["m"] = Number(serDate[0].m.slice(8));
              obj["v"] = Number(Number(serDate[0].v).toFixed(2));
            } else {
              obj["year"] = this.jstool.jshandle.lastMonth(date, "MM");
              obj["m"] = i;
              obj["v"] = null;
            }
            this.yearList.push(obj);
          });
          // upday.data.forEach(i => {
          //   i["year"] = i.m.slice(5, 7);
          //   i.m = i.m.slice(8);
          //   this.yearList.push(i);
          // });
          this.initYearLine();
        });
      });
    },
    //获取年度曲线
    getSummeMonth() {
      this.yearList = [];
      var dateList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      var params = {
        m: "Eptp",
      };
      var date = `${this.jstool.jshandle.getcurrentTime("yyyy")}`;
      params.year = `${date}`;
      GET_SUMME_MONTH(params).then((year) => {
        dateList.forEach((i) => {
          var serDate = year.data.filter((ser) => {
            return i == ser.m.slice(5);
          });
          var obj = {};
          if (serDate.length) {
            obj["year"] = String(this.jstool.jshandle.getcurrentTime("yyyy"));
            obj["m"] = Number(serDate[0].m.slice(5));
            obj["v"] = Number(Number(serDate[0].v).toFixed(2));
          } else {
            obj["year"] = String(this.jstool.jshandle.getcurrentTime("yyyy"));
            obj["m"] = i;
            obj["v"] = null;
          }
          this.yearList.push(obj);
        });

        // year.data.forEach(i => {
        //   i["year"] = i.m.slice(0, 4);
        //   // i.m = i.m.slice(5);
        // });
        // this.yearList = year.data;
        params.year = date - 1;
        GET_SUMME_MONTH(params).then((oldyear) => {
          dateList.forEach((i) => {
            var serDate = oldyear.data.filter((ser) => {
              return i == ser.m.slice(0, 4);
            });
            var obj = {};
            if (serDate.length) {
              obj["year"] = String(params.year);
              obj["m"] = Number(serDate[0].m.slice(5));
              obj["v"] = Number(Number(serDate[0].v).toFixed(2));
            } else {
              obj["year"] = String(params.year);
              obj["m"] = i;
              obj["v"] = null;
            }
            this.yearList.push(obj);
          });
          // oldyear.data.forEach(i => {
          //   i["year"] = i.m.slice(0, 4);
          //   // i.m = i.m.slice(5);
          //   this.yearList.push(i);
          // });
          this.initYearLine();
        });
      });
    },
    initYearLine() {
      var data = this.yearList;

      var sysYear = new Date().getFullYear();
      var sysMonth = new Date().getMonth() + 1;
      if (!this.legend.yearLine) {
        this.legend.yearLine = new Chart({
          container: "linechart",
          autoFit: true,
          appendPadding: [30, 30, 50, 70],
        });
      }
      this.legend.yearLine.data(data);
      this.legend.yearLine.removeInteraction("legend-filter");
      this.legend.yearLine.legend("year", {
        position: "top",
        marker: {
          symbol: "circle",
          style: {
            fillOpacity: 1,
          },
        },
        itemName: {
          style: {
            fill: "#ffffff",
          },
        },
      });
      this.legend.yearLine.axis("m", {
        line: null,
        label: {
          style: {
            fill: "#8A9ECF",
          },
        },
        tickLine: null,
      });
      this.legend.yearLine.axis("v", {
        title: {
          style: {
            fill: "#8A9ECF",
          },
        },
        label: {
          style: {
            fill: "#8A9ECF",
          },
          formatter: (text) => {
            if (text > 10000) {
              return text / 10000 + "万";
            } else {
              return text;
            }
          },
        },
        grid: {
          line: {
            style: {
              stroke: "#1F63A3",
            },
          },
        },
      });
      this.legend.yearLine.scale({
        v: {
          alias: "(kWh)",
          min: 0,
        },
        m: {
          tickCount: this.dateSelect == 1 ? 12 : 31,
        },
        year: {
          formatter: (year) => {
            // 1-年/2-月
            if (this.dateSelect == 1) {
              if (sysYear == year) {
                return "本年";
              } else {
                return "上年";
              }
            } else {
              if (sysMonth == year) {
                return "本月";
              } else {
                return "上月";
              }
            }

            // if (sysYear == year) {
            //   return "本年";
            // } else {
            //   return "上年";
            // }
          },
        },
      });
      this.legend.yearLine.tooltip({
        showCrosshairs: true,
        shared: true,
        showTitle: false,
        // shared: true,
        domStyles: {
          "g2-tooltip-marker": {
            display: "none",
          },
          "g2-tooltip": {
            background: "#01133B",
            boxShadow: "none",
          },
          "g2-tooltip-list-item": {
            color: "white",
          },
        },
      });
      this.legend.yearLine
        .area({
          sortable: true,
          startOnZero: true,
        })
        .position("m*v")
        .color("year", (val) => {
          var color;
          // 1-年/2-月
          if (this.dateSelect == 1) {
            if (val == sysYear) {
              color = `l(90) 0:#0099ff 1:rgba(0,0,0,0)`;
            } else {
              color = `l(90) 0:#00FFF2 1:rgba(0,0,0,0)`;
            }
          } else {
            if (val == sysMonth) {
              color = `l(90) 0:#0099ff 1:rgba(0,0,0,0)`;
            } else {
              color = `l(90) 0:#00FFF2 1:rgba(0,0,0,0)`;
            }
          }
          return color;
        })
        .shape("smooth")
        .tooltip(false);
      this.legend.yearLine
        .line({
          sortable: true,
        })
        .position("m*v")
        .color("year")
        .shape("smooth");
      this.legend.yearLine.render();
    },
  },
};
