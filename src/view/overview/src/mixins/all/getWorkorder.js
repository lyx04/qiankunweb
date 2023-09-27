import { GET_MAINTAIN_STATIS } from "hlcx-qiankun-commonservice/utils/api/overview/all";
import { Chart } from "@antv/g2";

export default {
  data() {
    return {
      //工单统计
      workorderInfo: {},
    };
  },
  methods: {
    //获取工单统计
    getWorkorder() {
      GET_MAINTAIN_STATIS().then((e) => {
        if (e.data) {
          e.data.statisticsParticularsVo.forEach((item) => {
            item.proportion = Number((item.num / e.data.total).toFixed(4));
          });
          this.workorderInfo = e.data;
          this.initworkorder();
        }
      });
    },
    initworkorder() {
      var data = this.workorderInfo.statisticsParticularsVo;
      if (!this.refreshFilter()) {
        this.legend.workorder = new Chart({
          container: "site_c5", // 指定图表容器 ID
          autoFit: true,
          height: 130,
          syncViewPadding: true,
        });
      }

      this.legend.workorder.coordinate("theta", {
        radius: 1,
        innerRadius: 0.6,
      });
      this.legend.workorder.data(data);
      var color = ["#A158F0", "#4ADFCB", "#488CF7", "#0271F2"];
      this.legend.workorder.legend("typeName", {
        position: "right",
        offsetX: -9,
        custom: true, // 关键字段，告诉 G2，要使用自定义的图例
        items: data.map((obj, index) => {
          return {
            name: obj.typeName, // 对应 itemName
            value: obj.num + "个",
            marker: {
              symbol: "square", // marker 的形状
              style: {
                fill: color[index], // marker 颜色，使用默认颜色，同图形对应
              },
            },
          };
        }),
        itemName: {
          style: {
            fontSize: 12,
            fill: "rgba(255, 255, 255, 0.7)", // 文本颜色
          },
        },
        itemValue: {
          style: {
            fontSize: 14,
            fontWeight: 600,
            fill: "#40D5D3", // 文本颜色
          },
        },
      });
      this.legend.workorder.tooltip({
        showTitle: false,
        showMarkers: false,
      });
      this.legend.workorder
        .interval()
        .adjust("stack")
        .position("num")
        .color("typeName", color)
        .tooltip("typeName*num*proportion", (typeName, num, proportion) => {
          var percent =
            num + "个（" + Number((proportion * 100).toFixed(2)) + "%）";
          return {
            name: typeName,
            value: percent,
          };
        });
      this.legend.workorder.annotation().text({
        position: ["50%", "50%"],
        content: `${this.workorderInfo.total}个`,
        style: {
          fontSize: 17,
          fill: "#ffffff",
          textAlign: "center",
        },
      });
      this.legend.workorder.interaction("element-active");
      if (data.length) {
        this.legend.workorder.render();
      }
    },
  },
};
