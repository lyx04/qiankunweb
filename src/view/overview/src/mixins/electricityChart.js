export default {
  methods: {
    //  电量构成
    electricityConstituteChart() {
      this.$nextTick(() => {
        let data = this.spWorkList;
        // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
        const sliceNumber = 0.01;
        // 自定义 other 的图形，增加两条线
        this.registerShape("interval", "slice-shape", {
          draw(cfg, container) {
            const points = cfg.points;
            let path = [];
            path.push(["M", points[0].x, points[0].y]);
            path.push(["L", points[1].x, points[1].y - sliceNumber]);
            path.push(["L", points[2].x, points[2].y - sliceNumber]);
            path.push(["L", points[3].x, points[3].y]);
            path.push("Z");
            path = this.parsePath(path);
            return container.addShape("path", {
              attrs: {
                fill: cfg.color,
                path
              }
            });
          }
        });
        this.chart8.data(data);
        this.chart8.coordinate("theta", {
          radius: 1,
          innerRadius: 0.88
        });
        this.chart8.tooltip({
          showTitle: false,
          showMarkers: false
        });
        var color = ["#A158F0", "#0271F2", "#488CF7", "#00F6F5"];
        this.chart8.legend("name", {
          position: "right",
          custom: true, // 关键字段，告诉 G2，要使用自定义的图例
          items: data.map((obj, index) => {
            return {
              name: obj.name, // 对应 itemName
              marker: {
                symbol: "square", // marker 的形状
                style: {
                  fill: color[index] // marker 颜色，使用默认颜色，同图形对应
                }
              }
            };
          }),
          itemName: {
            style: {
              fontSize: 12,
              fill: "#FFFFFF" // 文本颜色
            }
          }
        });
        this.chart8
          .interval()
          .adjust("stack")
          .position("value")
          .color("name", color)
          .shape("slice-shape")
          .tooltip("type*value*proportion", (type, value, proportion) => {
            var percent =
              value + "（" + Number((proportion * 100).toFixed(2)) + "%）";
            var name;
            if (type == "01") {
              name = "尖";
            } else if (type == "02") {
              name = "峰";
            } else if (type == "03") {
              name = "平";
            } else if (type == "04") {
              name = "谷";
            }
            return {
              name: name,
              value: percent
            };
          });
        this.chart8.render();
      });
    },
    // 电量曲线
    MonthElectricityChart() {
      this.$nextTick(() => {
        let data = this.thisMonth.concat(this.lastMonth);
        data.push({
          date: "",
          value: "",
          type: "本年"
        });
        this.chart9.data(data);
        var thisMonth = this.thisMonth.concat([]);
        var lastMonth = this.lastMonth.concat([]);
        this.chart9.removeInteraction("legend-filter");
        this.chart9.legend("type", {
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
            }
          },
          itemValue: {
            style: {
              fontSize: 12,
              fill: "#ffffff" // 文本颜色
            },
            formatter: obj => {
              if (obj == "本月") {
                return this.thisElectricity + "kWh";
              } else if (obj == "上月") {
                return this.lastElectricity + "kWh";
              } else if (obj == "本年") {
                return this.yearElectricity + "kWh";
              }
            }
          }
        });
        this.chart9.axis("date", {
          line: null,
          label: {
            autoRotate: false,
            autoHide: true,
            style: {
              fill: "#CCCCCC"
            }
          },
          tickLine: null,
          grid: {
            line: {
              type: "line",
              style: {
                stroke: "#FFFFFF", // 网格线颜色
                strokeOpacity: 0.2
              }
            }
          }
        });
        this.chart9.axis("value", {
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
        this.chart9.tooltip({
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
        this.chart9.scale({
          value: {
            min: 0,
            nice: true,
            alias: "单位/kWh"
          },
          date: {
            range: [0, 1],
            tickCount: 20
          }
        });
        this.chart9
          .area({
            sortable: true,
            startOnZero: true
          })
          .position("date*value")
          .color("type");
        this.chart9
          .line({
            sortable: true
          })
          .position("date*value")
          .color("type");
        if (
          thisMonth.length > 0 &&
          thisMonth.sort(this.compare("value"))[thisMonth.length - 1].value
        ) {
          this.chart9.annotation().dataMarker({
            top: true,
            position: [
              thisMonth.sort(this.compare("value"))[thisMonth.length - 1].date,
              thisMonth.sort(this.compare("value"))[thisMonth.length - 1].value
            ],
            text: {
              content:
                "本月: " +
                thisMonth.sort(this.compare("value"))[thisMonth.length - 1]
                  .value +
                "kWh",
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
          lastMonth.length > 0 &&
          lastMonth.sort(this.compare("value"))[lastMonth.length - 1].value
        ) {
          this.chart9.annotation().dataMarker({
            top: false,
            position: [
              lastMonth.sort(this.compare("value"))[lastMonth.length - 1].date,
              lastMonth.sort(this.compare("value"))[lastMonth.length - 1].value
            ],
            text: {
              content:
                "上月: " +
                lastMonth.sort(this.compare("value"))[lastMonth.length - 1]
                  .value +
                "kWh",
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
        this.chart9.render();
      });
    }
  }
};
