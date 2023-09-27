<!--设备!-->
<template>
  <div class="panel">
    <div class="action">
      <el-button
        type="primary"
        class="btn-none"
        plain
        @click="editDevice"
        v-hasPermi="['ema:room:update']"
        >编辑</el-button
      >
      <el-button
        type="danger"
        class="btn-none"
        plain
        @click="delect"
        v-hasPermi="['ema:room:delete']"
        >删除</el-button
      >
    </div>
    <div class="device_infor">
      <ul class="baseInfo">
        <li class="long" :title="deviceInfo.name">
          <p>
            名称：<span>{{ deviceInfo.name }}</span>
          </p>
        </li>
        <li>
          <p>
            运行状态：<span>{{ deviceInfo.state == 1 ? "停运" : "在运" }}</span>
          </p>
        </li>
        <li class="long">
          <p>
            投运日期：<span>{{ deviceInfo.launchTime }}</span>
          </p>
        </li>
      </ul>
      <!-- <ul class="systemInfo">
        <li>
          <i class="icon-kaoshishichang"></i>
          <p>3<span>年</span></p>
          <span>运行时间</span>
        </li>
        <li>
          <i class="icon-gaojing"></i>
          <p>3<span>年</span></p>
          <span>历史警告</span>
        </li>
        <li>
          <i class="icon-baogao"></i>
          <p>3<span>年</span></p>
          <span>巡视报告</span>
        </li>
        <li>
          <i class="icon-guzhangquexian"></i>
          <p>3<span>年</span></p>
          <span>累计缺陷</span>
        </li>
        <li>
          <i class="icon-winfo-icon-chakanbaogao"></i>
          <p>3<span>年</span></p>
          <span>实验报告</span>
        </li>
        <li>
          <i class="icon-qiangxiuyujing"></i>
          <p>3<span>年</span></p>
          <span>检修(抢修)</span>
        </li>
      </ul> -->
    </div>
    <div class="device_table">
      <ul class="table_head">
        <li @click="tabChange('1')" :class="{ active: tabActive == 1 }">
          <span>基本信息</span>
        </li>
        <li @click="tabChange('2')" :class="{ active: tabActive == 2 }">
          <span>附属信息</span>
        </li>
      </ul>
      <!-- 基本信息 -->
      <div class="common_infors" v-show="tabActive == 1">
        <div class="imgs">
          <img :src="deviceInfo.pic1" alt="" />
          <img :src="deviceInfo.pic2" alt="" />
        </div>
        <ul class="infor">
          <li>
            <p class="inforTitle">设备信息</p>
            <div class="font">
              <p>
                设备类型：<span>{{ deviceInfo.equipName }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                厂家：<span>{{ deviceInfo.factory }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                品牌：<span>{{ deviceInfo.brand }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                型号：<span>{{ deviceInfo.modelNum }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                备注：<span>{{ deviceInfo.remark }}</span>
              </p>
            </div>
          </li>
          <li class="inline">
            <p class="inforTitle">设计参数</p>
            <div
              class="font"
              v-for="item in deviceInfo.equipmentList"
              :key="item.id"
            >
              <p>
                {{ item.paramName }}：<span
                  >{{ item.paramVal || item.defaultVal }}{{ item.unit }}</span
                >
              </p>
            </div>
            <div
              class="font"
              v-for="item in deviceInfo.roomList"
              :key="item.id"
            >
              <p>
                {{ item.paramName }}：<span
                  >{{ item.paramVal || item.defaultVal }}{{ item.unit }}</span
                >
              </p>
            </div>
          </li>
        </ul>
      </div>
      <!-- 附属信息 -->
      <ul class="common_auxiliary" v-show="tabActive == 2">
        <li>
          创建人：<span>{{ deviceInfo.createBy }}</span>
        </li>
        <li>
          创建时间：<span>{{
            deviceInfo.createTime ? deviceInfo.createTime.substr(0, 10) : ""
          }}</span>
        </li>
        <br />
        <li>
          最后维护人：<span>{{ deviceInfo.updateBy }}</span>
        </li>
        <li>
          最后维护时间：<span>{{
            deviceInfo.updateTime ? deviceInfo.updateTime.substr(0, 10) : ""
          }}</span>
        </li>
      </ul>
    </div>
    <!-- 修改设备 -->
    <device-modal
      v-if="deviceModal.active"
      :active="deviceModal.active"
      :id="deviceModal.row.id"
      :category="deviceModal.row.category"
      :euqiptreeId="deviceModal.row.euqiptreeId"
      :categoryName="deviceModal.row.equipName"
      @cancelForm="cancelForm"
      @subForm="deviceSub"
      title="修改设备"
      :orgid="deviceInfo.orgId"
    ></device-modal>
  </div>
</template>
<script>
import deviceModal from "./component/deviceModel";
import * as deviceServe from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { mapMutations } from "vuex";
import { GET_FACTORY_SELECT } from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";
export default {
  components: { deviceModal },
  computed: {
    parId() {
      return this.decode(this.$route.params.query).split("-")[4];
    }
  },
  data() {
    return {
      // 为了视频的设备接口，保存厂家ID
      factoryId: "",
      deviceInfo: "",
      tabActive: 1,
      deviceModal: {
        active: false
      }
    };
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus"]),
    initDevice() {
      var par = this.parId;
      deviceServe.GET_DEVICE_INFO(par).then(e => {
        this.deviceInfo = e.data;

        if (this.deviceInfo.category == 32) {
          this.getVideoDeviceList(e.data.factory);
        }
        if (
          this.deviceInfo.category == 8 ||
          this.deviceInfo.category == 9 ||
          this.deviceInfo.category == 32
        ) {
          this.getFactorySelect();
          this.getTerminal();
        }
      });
    },
    getTerminal() {
      deviceServe
        .GET_METER_SELECT(
          this.decode(this.$route.params.query).split("-")[1],
          11
        )
        // eslint-disable-next-line no-unused-vars
        .then(e => {
          this.deviceInfo.roomList.filter(i => {
            e.data.forEach(teritem => {
              if (i.paramVal == teritem.id) {
                i.paramVal = teritem.name;
              }
            });
          });
        });
    },
    //获取厂家
    getFactorySelect() {
      GET_FACTORY_SELECT(this.deviceInfo.euqiptreeId).then(e => {
        var factorName = e.data.filter(i => {
          return i.id == this.deviceInfo.factory;
        });
        this.deviceInfo.factory = factorName[0].name;
      });
    },
    //获取视频对应的设备
    getVideoDeviceList(factoryId) {
      var AppKey = this.deviceInfo.roomList.filter(i => {
        return i.paramName == "AppKey";
      });
      var Secret = this.deviceInfo.roomList.filter(i => {
        return i.paramName == "Secret";
      });
      var selectDevice = this.deviceInfo.roomList.filter(i => {
        return i.paramName == "视频设备";
      });
      deviceServe
        .GET_YINGSHI_DEV_LIST(factoryId, AppKey[0].paramVal, Secret[0].paramVal)
        .then(e => {
          var devname = e.data.filter(i => {
            return i.deviceSerial == selectDevice[0].paramVal;
          });
          if (devname.length) {
            selectDevice[0].paramVal = devname[0].deviceName;
          }
        });
    },
    //删除设备
    delect() {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除当前设备!",
        showCancelButton: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          deviceServe.DELETE_ELE_ROOM(this.parId).then(e => {
            if (e.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.deviceTreeStatus(true);

              var routeArr = this.decode(this.$route.params.query)
                .split("-")
                .slice(0, 4);
              while (routeArr[routeArr.length - 1] == "") {
                routeArr.pop();
              }
              console.log(routeArr);
              this.$router.push({
                params: {
                  query: this.encode(String(routeArr.join("-")))
                }
              });
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    tabChange(active) {
      this.tabActive = active;
    },
    //修改设备
    editDevice() {
      this.deviceModal.active = true;
      this.deviceModal.row = this.deviceInfo;
    },
    cancelForm() {
      this.deviceModal.active = false;
    },
    deviceSub(e) {
      deviceServe.EDIT_DEVICE(e).then(e => {
        if (e.code == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.initDevice();
          this.deviceModal.active = false;
          this.deviceTreeStatus(true);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.common_infors {
  font-size: 0;
  .imgs {
    width: 300px;
    height: auto;
    padding-right: 100px;
    position: relative;
    display: inline-block;
    margin-right: 100px;
    &::after {
      content: "";
      position: absolute;
      width: 1px;
      height: 400px;
      right: 0;
      top: 0;
      background: #172e9f;
    }
    img {
      width: 200px;
      height: 200px;
      border-radius: 10px;
      border-color: #01cdf6;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .infor {
    width: calc(100% - 400px);
    display: inline-block;
    vertical-align: top;
    li {
      display: inline-block;
      vertical-align: top;
      margin-right: 50px;
      width: 200px;
      &:last-child {
        margin-right: 0;
      }
      .inforTitle {
        font-size: 20px;
        color: #0ceaf3;
        margin-bottom: 30px;
      }
      .font {
        word-break: break-all;
        p {
          font-size: 14px;
          color: white;
        }
        margin-bottom: 20px;
      }
      &.inline {
        width: calc(100% - 250px);
        .font {
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
