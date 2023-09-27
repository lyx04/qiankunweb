export default {
  methods: {
    //  企业容量统计
    orgCapacityChart() {
      this.$nextTick(() => {
        var data = this.distributionList;
        var index = 0;
        var colors = ["#16E3E2", "#1166FF", "#16E3E2", "#1166FF"];
        this.chart1.data(data);
        this.chart1.legend(false);
        this.chart1.tooltip({
          showCrosshairs: true,
          showTitle: false,
          shared: true,
          domStyles: {
            "g2-tooltip": {
              background: "rgba(0, 174, 239, 0.26)",
              border: "1px solid #43DBF1",
              borderRadius: "5px",
              minWidth: "52px",
              minHeight: "33px",
              padding: "0 5px"
            },
            "g2-tooltip-title": {
              display: "none"
            },
            "g2-tooltip-list-item": {
              color: "white"
            },
            "g2-tooltip-value": {
              margin: "0"
            }
          },
          itemTpl:
            '<li class="g2-tooltip-list-item" data-index=1><span class="g2-tooltip-name">单位</span>:<span class="g2-tooltip-value">{value}个</span></li>'
        });
        this.chart1.axis("name", {
          line: {
            style: {
              stroke: "white",
              lineDash: [5]
            }
          },
          label: {
            style: {
              fill: "white"
            }
          },
          tickLine: null
        });
        this.chart1.axis("count", {
          label: {
            style: {
              fill: "white"
            }
          },
          grid: {
            line: {
              style: {
                lineDash: [5]
              }
            }
          }
        });
        data.forEach((item, index) => {
          this.chart1.annotation().text({
            position: [item.name, item.count],
            content: item.percent ? item.percent + "%" : "0%",
            style: {
              textAlign: "center",
              fill: colors[index]
            },
            offsetY: -12
          });
        });
        this.chart1
          .interval()
          .position("name*count")
          .color("name", () => {
            var color = `l(90) 0:${
              colors[index % colors.length]
            } 1:rgba(0,0,0,0)`;
            index++;
            return color;
          });
        this.chart1.scale({
          count: {
            nice: true,
            tickCount: 4,
            formatter: value => {
              return value ? Number(Math.round(value)) : value;
            }
          }
        });
        this.chart1.render();
      });
    }
  }
};
