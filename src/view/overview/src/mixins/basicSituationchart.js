export default {
  methods: {
    // 基本信息
    basicSituationchart() {
      this.$nextTick(() => {
        let data = this.basicSituation.equipments;
        this.chart1.coordinate("theta", {
          radius: 1
        });
        this.chart1.data(data);
        this.chart1.legend("name", {
          position: "left",
          marker: {
            symbol: "square"
          },
          itemName: {
            style: {
              fontSize: 12,
              fill: "rgba(255, 255, 255, 0.7)" // 文本颜色
            }
          }
        });
        this.chart1.tooltip({
          showTitle: false,
          showMarkers: false
        });
        this.chart1
          .interval()
          .adjust("stack")
          .position("count")
          .color("name");
        this.chart1.interaction("element-active");
        this.chart1.render();
      });
    }
  }
};
