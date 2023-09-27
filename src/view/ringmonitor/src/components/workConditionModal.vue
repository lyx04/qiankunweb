<template>
  <div>
    <modal
      :visible="dialogVisibleWorkCondition"
      customClass="customer-modal Miniform"
      :width="width"
      @on-closed="workConditionClosed"
    >
      <template slot="head">
        <span>工况详情</span>
      </template>
      <template slot="body">
        <div class="detail-title">
          {{ detailInfo.name }}({{ detailInfo.status }})
        </div>
        表计
        <el-table class="modal" stripe :data="tableData" style="width:100%;">
          <el-table-column
            prop="name"
            align="center"
            label="表计名称"
            :show-overflow-tooltip="true"
            min-width="200"
          >
          </el-table-column>
          <el-table-column align="center" label="状态" width="80">
            <template slot-scope="scope">
              <span
                :style="
                  scope.row.state == 1 ? 'color:#2589EE;' : 'color:#D9260E;'
                "
              >
                <!-- 1表示设备和网关通讯正常 0表示通讯失败-->
                <span v-if="scope.row.state && scope.row.state == 1">在线</span>
                <span v-else-if="scope.row.state && scope.row.state == 0"
                  >离线</span
                >
                <span v-else>--</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关联设备"
            :show-overflow-tooltip="true"
            min-width="200"
          >
            <template slot-scope="scope">
              {{ scope.row.intervalName || "--" }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "hlcx-qiankun-commonservice/components/Modal";
import { GET_METERS_BY_GATE } from "hlcx-qiankun-commonservice/utils/api/monitor/wcquery";

export default {
  name: "WorkConditionModal",
  components: { modal },
  props: {
    detailInfo: {
      type: Object
    },
    dialogVisibleWorkCondition: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "650px"
    }
  },
  data() {
    return {
      tableData: [],
      topic: ""
    };
  },
  watch: {
    dialogVisibleWorkCondition() {
      if (this.dialogVisibleWorkCondition) {
        this.getMetersByGate(this.detailInfo.id);
        this.topic =
          "/edge/" + this.detailInfo.pkey + "/" + this.detailInfo.sn + "/rtg";
      } else {
        if (this.topic) {
          window.mqttClient.unsubscribe(this.topic);
        }
        this.tableData = [];
        this.topic = "";
      }
    }
  },
  methods: {
    //  关闭弹框
    workConditionClosed() {
      this.$emit("workConditionClosed");
      window.mqttClient.removeListener("message", this.mqttMessage);
    },
    //获取网关下的所有表计及其关联的设备
    getMetersByGate(gateId) {
      GET_METERS_BY_GATE(gateId).then(res => {
        res.data.forEach(item => {
          item.state = undefined;
        });
        this.tableData = res.data;
        if (this.tableData.length > 0) {
          this.subscribe();
        }
      });
    },
    // 订阅mqtt列表
    subscribe() {
      if (this.topic) {
        this.connectMqtt();
        window.mqttClient.unsubscribe(this.topic);
        window.mqttClient.unsubscribe("alarm/001/#");
        window.mqttClient.subscribe(this.topic);
        window.mqttClient.subscribe("alarm/001/#");
        var str = {
          ver: "v2.2.2",
          pKey: this.topic.split("/")[2],
          sn: this.topic.split("/")[3],
          type: "rtg",
          seq: new Date().getTime()
        };
        window.mqttClient.publish(
          `/cloud/${this.topic.split("/")[2]}/${
            this.topic.split("/")[3]
          }/rtg/call`,
          JSON.stringify(str)
        );
      } else {
        return false;
      }
    },
    // 接受mqtt返回数据
    connectMqtt() {
      window.mqttClient.addListener("message", this.mqttMessage);
    },
    mqttMessage(topic, message) {
      if (topic.indexOf("edge") >= 0) {
        var data = this.jstool.jshandle.mqttAdapter(topic, message);
        this.gatewayToDraw(data);
      }
      if (topic.indexOf("alarm") != -1) {
        var res = JSON.parse(message.toString());
        if (res.dev) {
          //量测量告警数据会有dev
          this.meterWcqueryAlarm(res);
        } else {
          //网关 01掉线
          this.gatewayWcqueryAlarm(res);
        }
      }
    },
    //  处理mqtt数据
    gatewayToDraw(message) {
      var res = message;
      var topic = "/edge/" + res.pKey + "/" + res.sn + "/rtg";
      // 详情基本量测量
      if (this.topic == topic) {
        res.devs.forEach(i => {
          let mydevs = this.tableData.filter(j => {
            return j.dev == i.dev;
          });
          if (mydevs.length > 0) {
            mydevs.forEach(devItem => {
              i.d.forEach(ElemItem => {
                if (ElemItem.m == "通信状态") {
                  if (ElemItem.dq && ElemItem.dq == 1) {
                    devItem.state = "";
                  } else {
                    devItem.state = ElemItem.v;
                  }
                }
              });
            });
          }
        });
      }
    },
    //表计掉线告警
    meterWcqueryAlarm(message) {
      var res = message;
      if (res.alarmType == "01") {
        // 表计
        if (this.topic && this.topic.indexOf(res.clientId) >= 0) {
          if (this.tableData.length) {
            this.tableData.forEach(item => {
              if (item.dev == res.dev) {
                item.state = "";
              }
            });
          }
        }
      }
    },
    //  网关掉线
    gatewayWcqueryAlarm(message) {
      var res = message;
      if (res.alarmType == "01") {
        // 表计
        if (this.topic && this.topic.indexOf(res.clientId) >= 0) {
          if (this.tableData.length) {
            this.tableData.forEach(item => {
              item.state = "";
            });
          }
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep.el-dialog__wrapper {
  .el-dialog__header {
    margin-bottom: 0;
  }
  .el-dialog__body {
    padding: 0 20px;
    color: #ffffff;
    min-height: 220px;
    .detail-title {
      text-align: center;
      margin: 14px 0 11px;
    }
  }
  .modal {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
