import { GET_ALARMINFO } from "hlcx-qiankun-commonservice/utils/api/overview/all";
import { Chart } from "@antv/g2";

export default {
  data() {
    return {
      //告警统计
      alarmInfo: {},
    };
  },
  methods: {
    //获取告警统计
    getAlarm() {
      GET_ALARMINFO().then((e) => {
        if (e.data) {
          e.data.typesNum.forEach((item) => {
            item.proportion = Number(
              (item.count / e.data.alarmTotal).toFixed(4)
            );
          });
          this.alarmInfo = e.data;
          this.initalarm();
        } else {
          this.mapVibled = true;
        }
      });
    },
    initalarm() {
      var data = this.alarmInfo.typesNum;
      if (!this.refreshFilter()) {
        this.legend.alarm = new Chart({
          container: "site_c4", // 指定图表容器 ID
          autoFit: true,
          height: 130,
          padding: [0, 0, 0, 130],
        });
      }
      this.legend.alarm.coordinate("theta", {
        radius: 1,
        innerRadius: 0.6,
      });
      this.legend.alarm.data(data);
      var color = ["#A158F0", "#488CF7", "#00F6F5"];
      this.legend.alarm.legend("name", {
        position: "left",
        offsetX: -10,
        custom: true, // 关键字段，告诉 G2，要使用自定义的图例
        items: data.map((obj, index) => {
          return {
            name: obj.name, // 对应 itemName
            value: obj.count + "个",
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
      this.legend.alarm.tooltip({
        showTitle: false,
        showMarkers: false,
      });
      this.legend.alarm
        .interval()
        .adjust("stack")
        .position("count")
        .color("name", ["#A158F0", "#488CF7", "#00F6F5"])
        .tooltip("name*count*proportion", (name, count, proportion) => {
          var percent =
            count + "个（" + Number((proportion * 100).toFixed(2)) + "%）";
          return {
            name: name,
            value: percent,
          };
        });
      // 仪表盘信息
      this.legend.alarm.annotation().text({
        position: ["50%", "50%"],
        content: `${this.alarmInfo.alarmTotal}个`,
        style: {
          fontSize: 17,
          fill: "#ffffff",
          textAlign: "center",
        },
      });
      this.legend.alarm.interaction("element-active");
      if (data.length) {
        this.legend.alarm.render();
      }
      this.mapVibled = true;
    },
  },
};
