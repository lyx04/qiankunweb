export default {
  methods: {
    //  负荷率
    loadRateChart() {
      this.$nextTick(() => {
        let data = Number(this.loadRate.percent);
        this.chart6.data(data);
        this.chart6.legend(false);
        this.chart6.coordinate("polar", {
          radius: 0.9
        });
        this.chart6.point().position("value");
        this.chart6.annotation().arc({
          top: false,
          start: [0, 1],
          end: [1, 1],
          style: {
            stroke: "#1F3446",
            lineWidth: 10
          }
        });
        this.chart6.annotation().arc({
          start: [0, 1],
          end: [data, 1],
          style: {
            stroke: "l(0) 0:#24F0E4 1:#0BA0D7",
            lineWidth: 10
          }
        });
        this.chart6.annotation().text({
          position: ["50%", "50%"],
          content: "负载率",
          style: {
            fontSize: 14,
            fill: "#ffffff",
            textAlign: "center"
          },
          offsetY: -20
        });
        this.chart6.annotation().text({
          position: ["50%", "50%"],
          content: (this.loadRate.percent * 100).toFixed(2) + "%",
          style: {
            fontSize: 25,
            fill: "#00FFFF",
            textAlign: "center"
          },
          offsetY: 10
        });
        this.chart6.render();
      });
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    // 负荷曲线
    loadCurveChart() {
      this.$nextTick(() => {
        let data = this.todayList.concat(this.yesterdayList);
        data.forEach(item => {
          if (item.value) {
            item.value = Number(item.value.toFixed(2));
          }
        });
        this.chart7.data(data);
        var todayList = this.todayList.concat([]);
        var yesterdayList = this.yesterdayList.concat([]);
        this.chart7.removeInteraction("legend-filter");
        this.chart7.legend("type", {
          position: "top",
          marker: {
            symbol: "circle",
            style: {
              fillOpacity: 1
            }
          },
          itemName: {
            style: {
              fontSize: 12,
              fill: "#ffffff" // 文本颜色
            },
            formatter: obj => {
              return obj == "今日" ? "今日最高" : "昨日最高";
            }
          },
          itemValue: {
            style: {
              fontSize: 12,
              fill: "#ffffff" // 文本颜色
            },
            formatter: obj => {
              return obj == "今日"
                ? (todayList.sort(this.compare("value"))[todayList.length - 1]
                    .value || 0) + "kW"
                : (yesterdayList.sort(this.compare("value"))[
                    yesterdayList.length - 1
                  ].value || 0) + "kW";
            }
          }
        });
        this.chart7.axis("date", {
          line: null,
          label: {
            autoRotate: false,
            autoHide: true,
            style: {
              fill: "#CCCCCC"
            }
          },
          tickLine: null
        });
        this.chart7.axis("value", {
          title: {
            style: {
              fill: "#CCCCCC"
            }
          },
          label: {
            style: {
              fill: "#CCCCCC"
            }
          },
          grid: {
            line: {
              style: {
                stroke: "#FFFFFF",
                strokeOpacity: 0.2
              }
            }
          }
        });
        this.chart7.tooltip({
          showCrosshairs: true,
          shared: true,
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
        this.chart7
          .area({
            sortable: true,
            startOnZero: true
          })
          .position("date*value")
          .color("type")
          .shape("smooth");
        this.chart7
          .line({
            sortable: true
          })
          .position("date*value")
          .color("type")
          .shape("smooth");
        this.chart7.scale({
          value: {
            nice: true,
            alias: "单位/kW",
            formatter: value => {
              return value ? Number(value.toFixed(2)) : value;
            }
          },
          date: {
            range: [0, 1],
            tickCount: 20
          }
        });
        if (
          todayList.length > 0 &&
          todayList.sort(this.compare("value"))[todayList.length - 1].value
        ) {
          this.chart7.annotation().dataMarker({
            top: true,
            position: [
              todayList.sort(this.compare("value"))[todayList.length - 1].date,
              todayList.sort(this.compare("value"))[todayList.length - 1].value
            ],
            text: {
              content:
                "今日: " +
                todayList.sort(this.compare("value"))[todayList.length - 1]
                  .value +
                "kW",
              background: {
                padding: 7,
                style: {
                  fill: "#1198B9",
                  fillOpacity: 1
                }
              },
              style: {
                fill: "#ffffff",
                fontSize: 12,
                textBaseline: "top"
              }
            },
            line: {
              length: 30
            }
          });
        }
        if (
          yesterdayList.length > 0 &&
          yesterdayList.sort(this.compare("value"))[yesterdayList.length - 1]
            .value
        ) {
          this.chart7.annotation().dataMarker({
            top: false,
            position: [
              yesterdayList.sort(this.compare("value"))[
                yesterdayList.length - 1
              ].date,
              yesterdayList.sort(this.compare("value"))[
                yesterdayList.length - 1
              ].value
            ],
            text: {
              content:
                "昨日: " +
                yesterdayList.sort(this.compare("value"))[
                  yesterdayList.length - 1
                ].value +
                "kW",
              background: {
                padding: 7,
                style: {
                  fill: "#1198B9",
                  fillOpacity: 1
                }
              },
              style: {
                fill: "#ffffff",
                fontSize: 12,
                textBaseline: "top"
              }
            },
            line: {
              length: 0
            }
          });
        }
        this.chart7.render();
      });
    }
  }
};
