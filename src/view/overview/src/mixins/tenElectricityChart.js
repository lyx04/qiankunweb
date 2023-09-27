export default {
  methods: {
    // 近10日用电量
    tenElectricityChart() {
      this.$nextTick(() => {
        var data = this.tenElectricityList;
        this.chart7.data(data);
        this.chart7.axis("date", {
          line: {
            style: {
              stroke: "white"
            }
          },
          label: {
            autoRotate: false,
            autoHide: true,
            style: {
              fill: "#ffffff"
            }
          },
          tickLine: null,
          grid: {
            line: {
              style: {
                stroke: "#00FFFF",
                strokeOpacity: 0.58,
                lineDash: [5]
              }
            }
          }
        });
        this.chart7.axis("v", {
          line: {
            style: {
              stroke: "white"
            }
          },
          title: {
            style: {
              fill: "#ffffff"
            }
          },
          label: {
            style: {
              fill: "#ffffff"
            }
          },
          grid: {
            line: {
              style: {
                stroke: "#00FFFF",
                lineDash: [5],
                strokeOpacity: 0.58
              }
            }
          }
        });
        this.chart7.tooltip({
          showCrosshairs: false,
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
        this.chart7.scale({
          v: {
            min: 0,
            nice: true,
            alias: "单位/kWh",
            range: [0, 1]
          },
          date: {
            tickCount: 15
          }
        });
        var dataList = data.concat([]);
        if (
          dataList.length > 0 &&
          dataList.sort(this.compare("v"))[dataList.length - 1].v
        ) {
          this.chart7.annotation().text({
            position: [
              dataList.sort(this.compare("v"))[dataList.length - 1].date,
              dataList.sort(this.compare("v"))[dataList.length - 1].v
            ],
            content: dataList.sort(this.compare("v"))[dataList.length - 1].v,
            style: {
              textAlign: "center",
              fill: "#00FFFF"
            },
            offsetY: -12
          });
        }
        if (dataList.length > 0 && dataList.sort(this.compare("v"))[0].v) {
          this.chart7.annotation().text({
            position: [
              dataList.sort(this.compare("v"))[0].date,
              dataList.sort(this.compare("v"))[0].v
            ],
            content: dataList.sort(this.compare("v"))[0].v,
            style: {
              textAlign: "center",
              fill: "#00FFFF"
            },
            offsetY: -12
          });
        }
        this.chart7
          .interval()
          .position("date*v")
          .color("#02D0E7");
        this.chart7.render();
      });
    }
  }
};
