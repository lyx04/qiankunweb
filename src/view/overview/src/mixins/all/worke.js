import { GET_COMMINICATIONiNFO } from "hlcx-qiankun-commonservice/utils/api/overview/all";
import { Liquid, RingProgress } from "@antv/g2plot";

export default {
  data() {
    return {
      //通讯工况信息
      workInfo: {},
    };
  },
  methods: {
    //获取通讯工况
    getWorke() {
      GET_COMMINICATIONiNFO().then((e) => {
        if (e.data) {
          var num = Number(e.data.connectGatewayNum / e.data.gatewayNum)
            ? (e.data.connectGatewayNum / e.data.gatewayNum) * 100
            : 0;
          e.data.percent = num.toFixed(2);
          this.workInfo = e.data;
          if (this.refreshFilter()) {
            this.legend.liquidPlot.changeData(this.workInfo.percent / 100);
          } else {
            this.initliquid();
          }
        }
      });
    },
    initliquid() {
      this.legend.liquidPlot = new Liquid("Liquid", {
        // statistic: {
        //   content: {
        //     formatter: () => {
        //       return this.workInfo.percent + "%";
        //     }
        //   }
        // },
        outline: {
          border: 0,
        },
        autoFit: true,
        percent: this.workInfo.percent / 100,
        liquidStyle: {
          fill: "l(90) 0:#4383F4 0.5:#AD52EF  1:#AD52EF",
          fillOpacity: 1,
        },
        wave: {
          length: 128,
        },
      });
      this.legend.liquidPlot.render();
      this.legend.ringProgress = new RingProgress("Liquid", {
        autoFit: true,
        percent: 1,
        innerRadius: 0.95,
        radius: 1,
        statistic: {
          title: false,
          content: false,
        },
        color: ["l(90) 0:#55E2FE  1:#0707FF", "rgba(0,0,0,0)"],
      });
      this.legend.ringProgress.render();
    },
  },
};
