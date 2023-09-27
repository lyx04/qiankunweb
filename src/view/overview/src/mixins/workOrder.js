export default {
  methods: {
    //  工单统计
    workOrderChart() {
      this.$nextTick(() => {
        let data = this.workerOrderInfo.statisticsParticularsVo;
        // 自定义 other 的图形，增加两条线
        let max = 0;
        data.forEach(function(obj) {
          if (obj.num > max) {
            max = obj.num;
          }
        });
        this.chart5.coordinate("theta", {
          radius: 1,
          innerRadius: 0.3
        });
        this.chart5.data(data);
        var color = ["#A158F0", "#4ADFCB", "#488CF7", "#0271F2"];
        this.chart5.legend("typeName", {
          position: "right",
          custom: true, // 关键字段，告诉 G2，要使用自定义的图例
          items: data.map((obj, index) => {
            return {
              name: obj.typeName, // 对应 itemName
              value: obj.num + "个",
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
        this.chart5.tooltip({
          showTitle: false,
          showMarkers: false
        });
        this.chart5
          .interval()
          .adjust("stack")
          .position("num")
          .color("typeName", color)
          .tooltip("typeName*num*proportion", (typeName, num, proportion) => {
            var percent =
              num + "个（" + Number((proportion * 100).toFixed(2)) + "%）";
            return {
              name: typeName,
              value: percent
            };
          });
        if (this.workerOrderInfo.total > 0) {
          this.chart5.annotation().text({
            position: ["50%", "70%"],
            content: `${this.workerOrderInfo.total}个`,
            style: {
              fontSize: 17,
              fill: "#ffffff",
              textAlign: "center"
            },
            offsetX: 0,
            offsetY: -34
          });
        }
        this.chart5.interaction("element-active");
        this.chart5.render();
      });
    }
  }
};
