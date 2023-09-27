export default {
  methods: {
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
        this.chart6.data(data);
        var todayList = this.todayList.concat([]);
        var yesterdayList = this.yesterdayList.concat([]);
        this.chart6.removeInteraction("legend-filter");
        this.chart6.legend("type", {
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
        this.chart6.axis("date", {
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
        this.chart6.axis("value", {
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
        this.chart6.tooltip({
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
        this.chart6
          .area({
            sortable: true,
            startOnZero: true
          })
          .position("date*value")
          .color("type")
          .shape("smooth");
        this.chart6
          .line({
            sortable: true
          })
          .position("date*value")
          .color("type")
          .shape("smooth");
        this.chart6.scale({
          value: {
            nice: true,
            alias: "单位/kW"
          },
          date: {
            range: [0, 1],
            tickCount: 15
          }
        });
        if (
          todayList.length > 0 &&
          todayList.sort(this.compare("value"))[todayList.length - 1].value
        ) {
          this.chart6.annotation().dataMarker({
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
          this.chart6.annotation().dataMarker({
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
        this.chart6.render();
      });
    }
  }
};
