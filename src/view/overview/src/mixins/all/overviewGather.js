import { GET_OVERVIEWINFO, GET_DISTRIBUTION } from "hlcx-qiankun-commonservice/utils/api/overview/all";
import { Chart } from "@antv/g2";

export default {
  data() {
    return {
      //用电单位分布
      companyList: [],
      //全局概况的基本信息
      overviewInfo: {},
    };
  },
  methods: {
    //基本信息
    overviewGather() {
      GET_OVERVIEWINFO().then((e) => {
        this.overviewInfo = e.data;
        this.distribution();
      });
    },
    //用电单位分布
    distribution() {
      GET_DISTRIBUTION()
        .then((e) => {
          var num = 0;
          if (e.data.length) {
            e.data.forEach((i) => {
              num += i.count;
            });
            e.data.forEach((i) => {
              i.percent = Math.round((i.count / num) * 100);
            });

            this.companyList = e.data;

            this.initCompanyInterval();
          }
        })
        .catch(() => {
          this.companyList = [];
        });
    },
    initCompanyInterval() {
      var data = this.companyList;
      var index = 0;
      if (!this.refreshFilter()) {
        this.legend.companyInterval = new Chart({
          container: "companyInterval",
          appendPadding: [20, 0, 0, 0],
          autoFit: true,
        });
      }
      var colors = ["#16E3E2", "#1166FF"];
      this.legend.companyInterval.data(data);
      this.legend.companyInterval.legend(false);
      this.legend.companyInterval.tooltip({
        showTitle: false,
        domStyles: {
          "g2-tooltip": {
            background: "rgba(0, 174, 239, 0.26)",
            border: "1px solid #43DBF1",
            borderRadius: "5px",
            minWidth: "52px",
            minHeight: "33px",
            padding: "0 5px",
          },
          "g2-tooltip-title": {
            display: "none",
          },
          "g2-tooltip-list-item": {
            color: "white",
          },
          "g2-tooltip-value": {
            margin: "0",
          },
          "g2-tooltip-marker": {
            display: "none",
          },
        },
        itemTpl:
          '<li class="g2-tooltip-list-item" data-index=1><span class="g2-tooltip-name">单位</span>:<span class="g2-tooltip-value">{value}个</span></li>',
      });
      this.legend.companyInterval.scale("name", {
        alias: "(kVA)",
      });
      this.legend.companyInterval.scale({
        count: {
          nice: true,
          tickCount: 4,
          formatter: (value) => {
            return Number(Math.round(value));
          },
        },
      });
      this.legend.companyInterval.axis("name", {
        line: {
          style: {
            stroke: "white",
            lineDash: [5],
          },
        },
        label: {
          style: {
            fill: "white",
            fontSize: 10,
          },
          // rotate: 0.19
        },
        title: {
          offset: 30,
          style: {
            fill: "white",
            fontSize: 14,
          },
        },
        tickLine: null,
      });
      this.legend.companyInterval.axis("count", {
        label: {
          style: {
            fill: "white",
          },
        },
        grid: {
          line: {
            style: {
              lineDash: [5],
            },
          },
        },
      });
      data.forEach((item, index) => {
        this.legend.companyInterval.annotation().text({
          position: [item.name, item.count],
          content: item.percent ? item.percent + "%" : "0%",
          style: {
            textAlign: "center",
            fill: colors[index],
          },
          offsetY: -12,
        });
      });
      this.legend.companyInterval
        .interval()
        .position("name*count")
        // .tooltip("count*percent")
        .color("name", () => {
          var color = `l(90) 0:${
            colors[index % colors.length]
          } 1:rgba(0,0,0,0)`;
          index++;
          return color;
        });
      this.legend.companyInterval.render();
    },
  },
};
