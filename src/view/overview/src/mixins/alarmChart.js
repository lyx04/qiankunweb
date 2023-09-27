export default {
  methods: {
    //  告警统计
    alarmInfoChart() {
      this.$nextTick(() => {
        let data = this.alarmInfo.typesNum;
        this.chart4.coordinate("theta", {
          radius: 1,
          innerRadius: 0.6
        });
        this.chart4.data(data);
        var color = ["#A158F0", "#488CF7", "#00F6F5"];
        this.chart4.legend("name", {
          position: "left",
          custom: true, // 关键字段，告诉 G2，要使用自定义的图例
          items: data.map((obj, index) => {
            return {
              name: obj.name, // 对应 itemName
              value: obj.count > 999 ? 999 + "+个" : obj.count + "个",
              marker: {
                symbol: "square", // marker 的形状
                style: {
                  fill: color[index] // marker 颜色，使用默认颜色，同图形对应
                }
              }
            };
          }),
          offsetX: -15,
          itemName: {
            style: {
              fontSize: 12,
              fill: "rgba(255, 255, 255, 0.7)" // 文本颜色
            }
          },
          itemValue: {
            style: {
              fontSize: 14,
              fontWeight: 600,
              fill: "#40D5D3" // 文本颜色
            }
          }
        });
        this.chart4.tooltip({
          showTitle: false,
          showMarkers: false
        });
        this.chart4
          .interval()
          .adjust("stack")
          .position("count")
          .color("name", ["#A158F0", "#488CF7", "#00F6F5"])
          .tooltip("name*count*proportion", (name, count, proportion) => {
            var percent =
              count + "个（" + Number((proportion * 100).toFixed(2)) + "%）";
            return {
              name: name,
              value: percent
            };
          });
        // 仪表盘信息
        if (this.alarmInfo.alarmTotal > 0) {
          this.chart4.annotation().text({
            position: ["50%", "70%"],
            content: `${this.alarmInfo.alarmTotal}个`,
            style: {
              fontSize: 17,
              fill: "#ffffff",
              textAlign: "center"
            },
            offsetX: 0,
            offsetY: -34
          });
        }
        this.chart4.interaction("element-active");
        this.chart4.render();
      });
    }
  }
};
