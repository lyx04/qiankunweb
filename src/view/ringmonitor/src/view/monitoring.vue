<template>
  <div class="main-content">
    <el-form
      :model="request"
      ref="request"
      label-width="auto"
      clss="filter-form"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item label="所在区域:" prop="area">
            <el-cascader
              ref="cascader"
              :props="{
                label: 'areaName',
                value: 'areaId',
                children: 'childs',
                checkStrictly: true
              }"
              :options="areaList"
              v-model="request.area"
              :show-all-levels="false"
              placeholder="请选择所在区域"
              @change="areaChange"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="用电单位:" prop="orgId">
            <el-select
              v-model="request.orgId"
              placeholder="请选择用电单位"
              @change="orgChange"
              filterable
            >
              <el-option
                v-for="item in orgList"
                :key="item.orgId"
                :label="item.name"
                :value="item.orgId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="配电室:" prop="orderSwitchroom">
            <el-select
              v-model="request.orderSwitchroom"
              placeholder="请选择配电室"
              @change="orderSwitchroomChange"
            >
              <el-option
                v-for="item in roomList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-if="tabsActiveId == 20">
          <el-form-item label="屏柜:" prop="cabinets">
            <el-select
              v-model="request.cabinets"
              placeholder="请选择屏柜"
              @change="cabinetsChange"
            >
              <!--<el-option label="全部" value=""></el-option>-->
              <el-option
                v-for="item in cabinetsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <div class="transformer-capacity">变压器容量：{{ capacity }}kVA</div>
      </el-row>
    </el-form>
    <!--tab-->
    <div class="tab-father">
      <tabs
        :tabsData="tabsData"
        :tabsActiveId="tabsActiveId"
        @tabs-change="tabsChange"
      ></tabs>
    </div>
    <!--变压器-->
    <div class="tab-menus" v-show="tabsActiveId == 10">
      <ul class="tab-menus-ul" ref="tabmenus" v-if="transformerList.length > 0">
        <li
          class="tab-menus-li"
          v-for="(item, index) in transformerList"
          :key="index"
        >
          <div class="border-line border-line1"></div>
          <div class="border-line border-line2"></div>
          <div class="border-dot border-dot1"></div>
          <div class="border-dot border-dot2"></div>
          <div class="border-dot border-dot3"></div>
          <div class="border-dot border-dot4"></div>
          <div class="equipment-title">
            <div class="equipment-title-left" :title="item.name">
              <i :class="item.icon + ' iconfont'"></i>{{ item.name }}
            </div>
            <div
              class="equipment-title-right"
              v-if="item.topic"
              @click="details(item)"
            >
              <i class="icon-wenjian iconfont"></i>详情
            </div>
          </div>
          <div class="parameter-list" v-if="item.topic">
            <ul>
              <li v-for="(val, index) in item.parameterList" :key="index">
                <div class="parameter-list-border">
                  <label>{{ val.label }}</label
                  ><span :title="String(val.value) || '--'">{{
                    String(val.value) || "--"
                  }}</span>
                </div>
                <div class="parameter-list-unit">{{ val.unit }}</div>
              </li>
            </ul>
          </div>
          <!--<div class="transformer-stats" v-if="item.topic">开关状态/关闭</div>-->
          <div v-if="!item.topic" class="el__empty-block">
            <span>未关联监控设备</span>
          </div>
        </li>
      </ul>
      <div v-else-if="!request.orderSwitchroom" class="el__empty-block">
        <span>暂无配电室</span>
      </div>
      <div v-else-if="transformerList.length == 0" class="el__empty-block">
        <span>暂无变压器</span>
      </div>
    </div>
    <!--间隔-->
    <div class="tab-menus" v-show="tabsActiveId == 20">
      <ul class="tab-menus-ul" ref="tabmenus" v-if="intervalList.length > 0">
        <li
          class="tab-menus-li"
          v-for="(item, index) in intervalList"
          :key="index"
        >
          <div class="border-line border-line1"></div>
          <div class="border-line border-line2"></div>
          <div class="border-dot border-dot1"></div>
          <div class="border-dot border-dot2"></div>
          <div class="border-dot border-dot3"></div>
          <div class="border-dot border-dot4"></div>
          <div class="equipment-title">
            <div class="equipment-title-left" :title="item.name">
              <i :class="item.icon + ' iconfont'"></i>{{ item.name }}
            </div>
            <div
              class="equipment-title-right"
              v-if="item.topic"
              @click="details(item)"
            >
              <i class="icon-wenjian iconfont"></i>详情
            </div>
          </div>
          <div class="parameter-list" v-if="item.topic">
            <ul>
              <li v-for="(val, ind) in item.parameterList" :key="ind">
                <div class="parameter-list-border">
                  <label>{{ val.label }}</label
                  ><span :title="String(val.value) || '--'">{{
                    String(val.value) || "--"
                  }}</span>
                </div>
                <div class="parameter-list-unit">{{ val.unit }}</div>
              </li>
            </ul>
          </div>
          <!--<div class="transformer-stats" v-if="item.topic">开关状态/关闭</div>-->
          <div v-if="!item.topic" class="el__empty-block">
            <span>未关联监控设备</span>
          </div>
        </li>
      </ul>
      <div v-else-if="!request.orderSwitchroom" class="el__empty-block">
        <span>暂无配电室</span>
      </div>
      <div v-else-if="transformerList.length == 0" class="el__empty-block">
        <span>暂无变压器</span>
      </div>
    </div>
  </div>
</template>

<script>
import tabs from "hlcx-qiankun-commonservice/components/Tabs";
import * as ConstVal from "./config/parameterList";
import { GET_SYSTEM_ORG_LIST } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import { GET_TREE, GET_METER_SELECT } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { GET_INTERVAL_MEASURE } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { GET_AREA_TREE } from "hlcx-qiankun-commonservice/utils/api/system/area";

export default {
  name: "monitoring",
  components: {
    tabs
  },
  data() {
    return {
      request: {
        orgId: "", // 用电单位id,
        orgName: "",
        orderSwitchroom: "",
        roomName: "",
        cabinets: "",
        cabinetsName: "", // 屏柜名字
        area: [] // 所在区域
      },
      //区域列表
      areaList: [],
      orgList: [], // 用电单位列表
      roomList: [], // 配电室列表
      cabinetsList: [], // 屏柜列表
      // tab选中
      tabsActiveId: "10",
      // 变压器数据
      transformerList: [],
      // 间隔数据
      intervalList: [],
      subscribeList: [] // 订阅列表
    };
  },
  computed: {
    tabsData: function() {
      var transformerNum =
        this.transformerList.length > 999
          ? "999+"
          : this.transformerList.length;
      var intervalNum =
        this.intervalList.length > 999 ? "999+" : this.intervalList.length;
      var transformer = {},
        interval = {};
      transformer.label = "变压器（" + transformerNum + "）";
      transformer.value = "10";
      transformer.perms = "monitor:monitoring:list";
      interval.label = "间隔（" + intervalNum + "）";
      interval.value = "20";
      interval.perms = "monitor:monitoring:list";
      return [transformer, interval];
    },
    capacity: function() {
      var capacity = 0;
      this.transformerList.forEach(item => {
        capacity += Number(item.capacity);
      });
      return capacity;
    },
    topicList: function() {
      this.subscribe();
      return this.subscribeList;
    }
  },
  watch: {
    topicList() {}
  },
  methods: {
    // 区域
    areaChange() {
      this.$refs.cascader.dropDownVisible = false; //监听值发生变化就关闭它
      this.getOrgList();
    },
    // 所在区域
    initArea() {
      GET_AREA_TREE().then(e => {
        this.areaList = this.setListItem(e.data);
        if (e.data.length > 0) {
          this.request.area.push(e.data[0].areaId);
        }
        this.getOrgList();
      });
    },
    setListItem(tree) {
      tree.forEach(item => {
        const childs = item["childs"];
        if (childs && Array.isArray(childs) && childs.length > 0) {
          // childs.unshift({ areaId: "", areaName: "全部" });
          this.setListItem(childs);
        } else {
          delete item.childs; //true
        }
      });
      return tree;
    },
    // 查询组织list
    getOrgList() {
      var provincial, city, district;
      if (this.request.area[0]) {
        provincial = this.request.area[0];
      } else {
        provincial = "";
      }
      if (this.request.area[1]) {
        city = this.request.area[1];
      } else {
        city = "";
      }
      if (this.request.area[2]) {
        district = this.request.area[2];
      } else {
        district = "";
      }
      var data = {
        province: provincial,
        city: city,
        district: district
      };
      this.request.orgId = "";
      this.request.orgName = "";
      this.orgList = [];
      this.roomList = [];
      this.request.orderSwitchroom = "";
      this.request.roomName = "";
      this.transformerList = [];
      this.intervalList = [];
      this.request.cabinets = "";
      this.request.cabinetsName = "";
      this.cabinetsList = [];
      GET_SYSTEM_ORG_LIST(data).then(res => {
        // 只展示用电企业
        var data = res.data;
        this.orgList = data;
        if (data.length > 0) {
          this.request.orgId = data[0].orgId;
          this.request.orgName = data[0].name;
          // 查询配电室list
          GET_TREE(this.request.orgId).then(res => {
            this.roomList = res.data;
            this.request.orderSwitchroom =
              res.data.length > 0 ? res.data[0].id : "";
            this.request.roomName = res.data.length > 0 ? res.data[0].name : "";
            if (this.request.orderSwitchroom) {
              // 变压器
              this.getTransformerList();
              //  屏柜
              this.getcabinetsList();
            }
          });
        }
      });
    },
    // 屏柜查询
    getcabinetsList() {
      this.request.cabinets = "";
      this.request.cabinetsName = "";
      this.cabinetsList = [];
      GET_METER_SELECT(this.request.orderSwitchroom, 5).then(res => {
        this.cabinetsList = res.data;
        if (res.data.length > 0) {
          this.request.cabinets = res.data[0].id;
          this.request.cabinetsName = res.data[0].name;
          // 间隔
          this.getIntervalList(true);
        }
      });
    },
    // 变压器查询
    getTransformerList() {
      GET_METER_SELECT(this.request.orderSwitchroom, 4).then(res => {
        res.data.forEach(item => {
          item.parameterList = ConstVal.PARAMETER_LIST();
          item.topic = "";
          item.commId = "";
        });
        var topicList = [];
        let num = 0;
        res.data.forEach((item, index) => {
          topicList[index] = [];
          GET_INTERVAL_MEASURE(item.id, item.euqiptreeId).then(val => {
            val.data.forEach(item => {
              topicList[index].push(
                "/edge/" + item.pKey + "/" + item.sn + "/rtg"
              );
            });
            topicList[index] = [...new Set(topicList[index])];
            item.topic = topicList[index][0];
            item.parameterList.forEach(items => {
              val.data.forEach(val => {
                if (items.label == val.labels) {
                  items.commId = val.commId;
                  items.name = "变压器";
                }
              });
            });
            num++;
            if (res.data.length == num) {
              if (topicList.length > 0) {
                topicList.forEach(i => {
                  if (i.length > 0) {
                    this.subscribeList.push(i[0]);
                  }
                });
              }
            }
          });
        });
        this.transformerList = res.data;
      });
    },
    // 间隔查询
    getIntervalList(isCabinets) {
      GET_METER_SELECT(
        isCabinets && this.request.cabinets
          ? this.request.cabinets
          : this.request.orderSwitchroom,
        14
      ).then(res => {
        res.data.forEach(item => {
          item.parameterList = ConstVal.PARAMETER_LIST();
          item.topic = "";
          item.commId = "";
        });
        let num = 0;
        var topicList = [];
        res.data.forEach((item, index) => {
          topicList[index] = [];
          GET_INTERVAL_MEASURE(item.id, item.euqiptreeId).then(val => {
            val.data.forEach(item => {
              topicList[index].push(
                "/edge/" + item.pKey + "/" + item.sn + "/rtg"
              );
            });
            topicList[index] = [...new Set(topicList[index])];
            item.topic = topicList[index][0];
            item.parameterList.forEach(items => {
              val.data.forEach(val => {
                if (items.label == val.labels) {
                  items.commId = val.commId;
                  items.name = item.name;
                }
              });
            });
            num++;
            if (res.data.length == num) {
              if (topicList.length > 0) {
                topicList.forEach(i => {
                  if (i.length > 0) {
                    this.subscribeList.push(i[0]);
                  }
                });
              }
            }
          });
        });
        this.intervalList = res.data;
      });
    },
    // 切换用电单位
    orgChange(val) {
      // 查询配电室list
      this.roomList = [];
      this.request.orderSwitchroom = "";
      this.request.roomName = "";
      this.transformerList = [];
      this.intervalList = [];
      this.request.cabinets = "";
      this.request.cabinetsName = "";
      this.cabinetsList = [];
      this.subscribeList.forEach(i => {
        window.mqttClient.unsubscribe(i);
      });
      this.subscribeList = ["alarm/001/#"];
      GET_TREE(val).then(res => {
        this.roomList = res.data;
        if (res.data.length > 0) {
          this.request.orderSwitchroom = res.data[0].id;
          this.request.roomName = res.data[0].name;
          if (this.request.orderSwitchroom) {
            // 变压器
            this.getTransformerList();
            //  屏柜
            this.getcabinetsList();
          }
        }
      });
      this.request.orgName = this.orgList.filter(
        item => item.orgId == val
      )[0].name;
    },
    // 切换配电室
    orderSwitchroomChange(val) {
      this.transformerList = [];
      this.intervalList = [];
      this.subscribeList.forEach(i => {
        window.mqttClient.unsubscribe(i);
      });
      this.subscribeList = ["alarm/001/#"];
      this.request.orderSwitchroom = val;
      this.request.cabinets = "";
      this.request.cabinetsName = "";
      this.cabinetsList = [];
      // 变压器
      this.getTransformerList();
      //  屏柜
      this.getcabinetsList();
      this.request.roomName = this.roomList.filter(
        item => item.id == val
      )[0].name;
    },
    // 切换屏柜
    cabinetsChange(val) {
      // 间隔
      this.getIntervalList(true);
      let filterlist = this.cabinetsList.filter(item => {
        return item.id == val;
      });
      if (filterlist.length > 0) {
        this.request.cabinetsName = filterlist[0].name;
      } else {
        this.request.cabinetsName = "";
      }
    },
    //  tab切换
    tabsChange(val) {
      this.tabsActiveId = val;
    },
    //  详情
    details(val) {
      let newUrl = this.$router.resolve({
        path: `/monitor/details/${this.encode(
          String(val.id)
        )}/${this.encode(String(val.euqiptreeId))}/${encodeURIComponent(
          this.request.orgName
        )}/${encodeURIComponent(this.request.roomName)}/${encodeURIComponent(
          val.name
        )}/${this.encode(String(this.request.orgId))}/${
          val.euqiptreeId == 14
            ? encodeURIComponent(this.request.cabinetsName)
            : ""
        }`
      });
      window.open(newUrl.href, "_blank");
    },
    unique(arr) {
      return Array.from(new Set(arr));
    },
    // 订阅mqtt列表
    subscribe() {
      // 去重
      this.subscribeList = this.unique(this.subscribeList);
      if (this.subscribeList.length > 0) {
        this.connectMqtt();
        this.subscribeList.forEach(i => {
          window.mqttClient.unsubscribe(i);
        });
        this.subscribeList.forEach(item => {
          this.subscribeList.push(item);
          window.mqttClient.subscribe(item);
          var str = {
            ver: "v2.2.2",
            pKey: item.split("/")[2],
            sn: item.split("/")[3],
            type: "rtg",
            seq: new Date().getTime()
          };
          window.mqttClient.publish(
            `/cloud/${item.split("/")[2]}/${item.split("/")[3]}/rtg/call`,
            JSON.stringify(str)
          );
        });
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
        if (res.orgId == this.request.orgId) {
          if (res.dev) {
            //量测量告警数据会有dev
            this.meterMonitorAlarm(res);
          } else {
            //网关 01掉线
            this.gatewayMonitorAlarm(res);
          }
        }
      }
    },
    //  处理mqtt数据
    gatewayToDraw(message) {
      var res = message;
      var topic = "/edge/" + res.pKey + "/" + res.sn + "/rtg";
      // 变压器
      this.transformerList.forEach(item => {
        if (item.topic == topic) {
          res.devs.forEach(i => {
            let mydevs = item.parameterList.filter(j => {
              return j.commId == i.dev;
            });
            if (mydevs.length > 0) {
              mydevs.forEach(devItem => {
                i.d.forEach(ElemItem => {
                  if (ElemItem.m == devItem.label) {
                    if (ElemItem.dq && ElemItem.dq == 1) {
                      devItem.value = "";
                    } else {
                      devItem.value = ElemItem.v;
                    }
                  }
                });
              });
            }
          });
        }
      });
      // 间隔
      this.intervalList.forEach(item => {
        if (item.topic == topic) {
          res.devs.forEach(i => {
            let mydevs = item.parameterList.filter(j => {
              return j.commId == i.dev;
            });
            if (mydevs.length > 0) {
              mydevs.forEach(devItem => {
                i.d.forEach(ElemItem => {
                  if (ElemItem.m == devItem.label) {
                    if (ElemItem.dq && ElemItem.dq == 1) {
                      devItem.value = "";
                    } else {
                      devItem.value = ElemItem.v;
                    }
                  }
                });
              });
            }
          });
        }
      });
    },
    //表计掉线告警
    meterMonitorAlarm(message) {
      var res = message;
      if (res.alarmType == "01") {
        // 变压器判断sn
        var transformer = this.transformerList.filter(item => {
          if (item.topic) {
            return item.topic.indexOf(res.clientId) >= 0;
          }
        });
        // 间隔判断sn
        var interval = this.intervalList.filter(item => {
          if (item.topic) {
            return item.topic.indexOf(res.clientId) >= 0;
          }
        });
        if (transformer.length) {
          transformer.forEach(item => {
            item.parameterList.forEach(val => {
              if (val.commId == res.dev) {
                val.value = "";
              }
            });
          });
        }
        if (interval.length) {
          interval.forEach(item => {
            item.parameterList.forEach(val => {
              if (val.commId == res.dev) {
                val.value = "";
              }
            });
          });
        }
      }
    },
    //  网关掉线
    gatewayMonitorAlarm(message) {
      var res = message;
      if (res.alarmType == "01") {
        // 变压器判断sn
        var transformer = this.transformerList.filter(item => {
          if (item.topic) {
            return item.topic.indexOf(res.clientId) >= 0;
          }
        });
        // 间隔判断sn
        var interval = this.intervalList.filter(item => {
          if (item.topic) {
            return item.topic.indexOf(res.clientId) >= 0;
          }
        });
        if (transformer.length) {
          transformer.forEach(item => {
            item.parameterList.forEach(val => {
              val.value = "";
            });
          });
        }
        if (interval.length) {
          interval.forEach(item => {
            item.parameterList.forEach(val => {
              val.value = "";
            });
          });
        }
      }
    }
  },
  created() {
    // this.getOrgList();
    this.initArea();
  },
  destroyed() {
    window.mqttClient.removeListener("message", this.mqttMessage);
    this.subscribeList = [...new Set(this.subscribeList)];
    if (this.subscribeList.length) {
      this.subscribeList.forEach(i => {
        window.mqttClient.unsubscribe(i);
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    window.mqttClient.removeListener("message", this.mqttMessage);
    this.subscribeList = [...new Set(this.subscribeList)];
    if (this.subscribeList.length) {
      this.subscribeList.forEach(i => {
        window.mqttClient.unsubscribe(i);
      });
    }
    next();
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
::v-deep.main-content {
  margin-top: 25px;
  font-size: 14px;
  .transformer-capacity {
    margin-bottom: 22px;
    margin-left: 30px;
  }
  .tab-father {
    margin-left: 30px;
  }
  .tab-menus {
    padding-left: 48px;
    ul.tab-menus-ul {
      display: flex;
      justify-content: flex-start;
      flex-flow: wrap;
      margin-bottom: 30px;
      li.tab-menus-li {
        .el__empty-block {
          min-height: 140px;
          span {
            font-size: 14px;
            top: 20px;
            &::before {
              font-size: 80px;
              margin-bottom: 20px;
            }
          }
        }
        width: 386px;
        min-height: 208px;
        margin-top: 30px;
        margin-right: 56px;
        border: 1px solid #47709a;
        position: relative;
        .border-line {
          position: absolute;
          width: 380px;
          height: 4px;
          margin: auto;
          background: linear-gradient(
            90deg,
            rgba(13, 99, 140, 0),
            rgba(6, 182, 255, 0.5),
            rgba(13, 99, 140, 0)
          );
          z-index: 2;
          &.border-line2 {
            bottom: 0;
          }
        }
        .border-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #8dddff;
          border: 1px solid #0d638c;
          border-radius: 50%;
          z-index: 3;
          &.border-dot1 {
            top: -3px;
            left: -3px;
          }
          &.border-dot2 {
            top: -3px;
            right: -3px;
          }
          &.border-dot3 {
            bottom: -3px;
            right: -3px;
          }
          &.border-dot4 {
            bottom: -3px;
            left: -3px;
          }
        }
        .equipment-title {
          display: flex;
          justify-content: space-between;
          width: 100%;
          height: 38px;
          background: linear-gradient(
            92deg,
            rgba(8, 37, 183, 0.29),
            rgba(1, 180, 255, 0.29)
          );
          margin-top: 4px;
          color: #1ff1ff;
          padding: 8px 20px;
          .equipment-title-left {
            max-width: 80%;
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            i {
              display: inline-block;
              margin-right: 8px;
            }
          }
          .equipment-title-right {
            width: 49px;
            height: 22px;
            line-height: 18px;
            text-align: center;
            background: rgba(0, 180, 255, 0.4);
            border: 1px solid #01e7e9;
            border-radius: 2px;
            font-size: 12px;
            cursor: pointer;
            i {
              display: inline-block;
              margin-right: 4px;
              font-size: 12px;
            }
          }
        }
        .parameter-list {
          ul {
            display: flex;
            justify-content: space-between;
            flex-flow: wrap;
            padding: 0 30px;
            padding-right: 24px;
            li {
              display: flex;
              position: relative;
              width: calc(34% - 12px);
              font-size: 12px;
              color: #b0cdfd;
              padding: 14px 0 0;
              &:nth-child(7),
              &:nth-child(9) {
                width: 50%;
              }
              &:nth-child(10) {
                .parameter-list-unit {
                  position: absolute;
                  right: -14px;
                }
              }
              .parameter-list-border {
                display: flex;
                justify-content: space-between;
                position: relative;
                width: 86px;
                padding: 0 3px 3px 4px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.5);
                margin-right: 4px;
                position: relative;
                &::after {
                  content: "";
                  width: 50%;
                  position: absolute;
                  bottom: -1px;
                  left: 0;
                  height: 1px;
                  background-color: #ffffff;
                }
                label {
                  line-height: 16px;
                }
                span {
                  width: 54px;
                  height: 17px;
                  line-height: 17px;
                  padding: 0 4px;
                  background: #0a398f;
                  border-radius: 2px;
                  color: #ffffff;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .parameter-list-unit {
                line-height: 18px;
              }
            }
          }
        }
        .transformer-stats {
          margin-left: 30px;
          font-size: 12px;
          margin-top: 11px;
          margin-bottom: 9px;
          color: #c6f6fe;
        }
      }
    }
  }
}
</style>
