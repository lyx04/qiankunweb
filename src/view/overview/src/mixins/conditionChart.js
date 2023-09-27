import { Liquid } from "@antv/g2plot";
import { RingProgress } from "@antv/g2plot/lib/index";

export default {
  methods: {
    // 通讯工况
    communicationChart() {
      this.$nextTick(() => {
        this.chart10 = new Liquid("site_c10", {
          outline: {
            border: 0
          },
          autoFit: true,
          percent: this.communication.onlineRate || 0.0,
          liquidStyle: {
            fill: "l(90) 0:#4383F4 0.5:#AD52EF  1:#AD52EF",
            fillOpacity: 1
          },
          wave: {
            length: 128
          }
        });
        this.chart10.render();
      });
    },
    communicationChartG2() {
      this.$nextTick(() => {
        this.chart10 = new RingProgress("site_c10", {
          autoFit: true,
          percent: 1,
          innerRadius: 0.95,
          radius: 1,
          statistic: {
            title: false,
            content: false
          },
          color: ["l(90) 0:#55E2FE  1:#0707FF", "rgba(0,0,0,0)"]
        });
        this.chart10.render();
      });
    }
  }
};
