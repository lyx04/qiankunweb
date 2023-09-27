<!--公司页面-->
<template>
  <div class="company">
    <div class="action" v-if="external">
      <el-button
        type="primary"
        class="btn-none"
        @click="addPower"
        v-hasPermi="['ema:room:add']"
        >新增配电室</el-button
      >
    </div>
    <div class="device_infor">
      <ul class="baseInfo">
        <li class="long" :title="companyInfo.name">
          <p>
            名称：<span>{{ companyInfo.name }}</span>
          </p>
        </li>
        <!-- <li>
          <p>
            运行状态：<span>{{
              companyInfo.state == "1" ? "正常" : "停用"
            }}</span>
          </p>
        </li>
        <li class="long">
          <p>
            投运日期：<span>{{ companyInfo.substationDate }}</span>
          </p>
        </li> -->
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
        <li class="active">
          <span>基本信息</span>
        </li>
      </ul>
      <div class="common_infors">
        <div class="company_top">
          <div class="company_infor">
            <ul>
              <li>
                单位类型: {{ filterOrgType(companyInfo.orgType, "org_type") }}
              </li>
              <li>单位地址: {{ companyInfo.address }}</li>
              <li>联系人: {{ companyInfo.manager }}</li>
              <li>联系电话: {{ companyInfo.phone }}</li>
              <li>经度: {{ companyInfo.lng }}</li>
              <li>纬度: {{ companyInfo.lat }}</li>
              <li>简介: {{ companyInfo.introduction }}</li>
            </ul>
            <div class="company_map" v-if="external">
              <el-amap :zoom="zoom" :center="center">
                <el-amap-marker :position="center"></el-amap-marker>
              </el-amap>
            </div>
          </div>
          <template v-if="external">
            <div class="device_num device">
              <p>设备数量统计</p>
              <ul>
                <li v-for="(item, index) in companyInfo.deviceSum" :key="index">
                  {{ item.name }}：<span>{{ item.count }}个</span>
                </li>
              </ul>
            </div>
            <div class="device_total device">
              <p>合计</p>
              <ul>
                <li
                  v-for="(item, index) in companyInfo.deviceSortSum"
                  :key="index"
                >
                  {{ item.name }}： <span>{{ item.count }}个</span>
                </li>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="device_num device">
              <ul>
                <li
                  v-for="(item, index) in companyInfo.capacityStatistice"
                  :key="index"
                >
                  {{ item.name }}：<span>{{ item.value }}</span>
                </li>
              </ul>
            </div>
          </template>
          <div class="company_map external" v-if="!external">
            <el-amap :zoom="zoom" :center="center">
              <el-amap-marker :position="center"></el-amap-marker>
            </el-amap>
          </div>
        </div>
      </div>
    </div>
    <!-- 分割线 -->
    <new-model
      @subForm="powerSub"
      @cancelForm="cancel"
      :active="addModal"
      v-if="addModal"
      :category="13"
      :map="true"
      :orgid="companyInfo.orgId"
    ></new-model>
  </div>
</template>
<script>
import * as deviceServer from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { GET_SYSTEM_ORG } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import newModel from "./component/newModel";
import { mapMutations, mapState } from "vuex";
export default {
  components: { newModel },
  props: {
    external: {
      type: Boolean,
      default: true,
    },
    paramsNum: Number,
  },
  data() {
    return {
      //模态框的开关
      addModal: false,
      activeName: "",
      //公司基本信息
      companyInfo: "",
      //配电室参数列表
      paramsList: [],
      center: [112.648705, 37.832466],
      zoom: 12,
      mapflag: false,
      addForm: {
        name: "",
        state: "",
        launchTime: "",
        address: "",
        //经度
        lng: "",
        //维度
        lat: "",
        remark: "",
      },
    };
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    }),
    // 过滤
    filterOrgType() {
      return function (orgvalue, type) {
        console.log(this.dict);
        var org = this.dict[type].filter((e) => {
          return e.dictValue == orgvalue;
        });
        if (org.length) {
          return org[0].dictLabel;
        }
        return "";
      };
    },
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus"]),
    //初始化公司页面
    initCompany() {
      var record = this.external
        ? this.decode(this.$route.params.query).split("-")[0]
        : this.paramsNum;
      GET_SYSTEM_ORG(record).then((e) => {
        this.companyInfo = e.data;
        this.center = [e.data.lng, e.data.lat];
        this.addForm.address = e.data.addres;
        this.addForm.lng = e.data.lng;
        this.addForm.lat = e.data.lat;
        if (this.external) {
          // 在设备管理的模块中请求的接口
          //设备的统计
          deviceServer.GET_DEVICE_SUM(record).then((e) => {
            this.$set(this.companyInfo, "deviceSum", e.data);
          });
          //获取设备分类的合计
          deviceServer.GET_DEVICE_SORT_SUM(record).then((e) => {
            this.$set(this.companyInfo, "deviceSortSum", e.data);
          });
        } else {
          // 在运行概况中请求的接口
          deviceServer.GET_ORG_CAPACITY_STATISTICE(record).then((e) => {
            //             capacity: 2000 容量
            // roomNum: 1 配电室数量
            // transformerCapacity: "1000kVA、1000kVA" 变压器容量
            // transformerNum:  变压器数量
            e.data["capacity"] = {
              name: "运行容量",
              value: e.data.capacity ? e.data.capacity + "kVA" : "",
            };
            e.data["roomNum"] = {
              name: "配电室数量",
              value: e.data.roomNum + "个",
            };
            e.data["transformerCapacity"] = {
              name: "变压器容量",
              value: e.data["transformerCapacity"],
            };
            e.data["transformerNum"] = {
              name: "变压器数量",
              value: e.data.transformerNum + "个",
            };
            this.$set(this.companyInfo, "capacityStatistice", e.data);
          });
        }
      });
    },

    //打开配电室弹框
    addPower() {
      this.addModal = true;
    },
    //关闭弹窗
    cancel() {
      this.addModal = false;
    },
    //新增配电室
    powerSub(e) {
      if (!(e.lat && e.lng)) {
        e.lat = this.companyInfo.lat;
        e.lng = this.companyInfo.lng;
      }
      deviceServer.ADD_ELEROOM(e).then((e) => {
        if (e.code == 200) {
          this.addModal = false;
          this.deviceTreeStatus(true);
        }
      });
    },
    //字符串转数组
    strToArray(str) {
      return str.split(",");
    },
  },
};
</script>
<style lang="scss" scoped>
.device_infor {
  height: 90px;
  margin-bottom: 10px;
  font-size: 0;
  .baseInfo {
    width: 33.33%;
    height: 100%;
    display: inline-block;
    padding: 24px 0 0 3%;
    background-color: rgba(255, 255, 255, 0.09);
    border-radius: 0px 10px 10px 0px;
    border-left: 3px solid rgba(48, 185, 227, 1);
    &.all {
      width: 100%;
    }
    li {
      vertical-align: top;
      display: inline-block;
      width: auto;
      margin-bottom: 8px;
      line-height: 1.5;
      p {
        color: #4cd964;
        font-size: 14px;
        span {
          font-size: 14px;
          color: white;
        }
      }
      &.long {
        // margin-right: 5%;
        width: 65%;
        p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .systemInfo {
    width: 65.66%;
    height: 100%;
    display: inline-block;
    font-size: 0;
    float: right;
    background-color: rgba(255, 255, 255, 0.09);
    border-radius: 10px;
    li {
      width: 16.66%;
      height: 100%;
      display: inline-block;
      position: relative;
      text-align: center;
      padding-top: 10px;
      i {
        font-family: iconfont;
        font-size: 26px;
        color: #4cd964;
        display: inline-block;
        margin-bottom: 10px;
      }
      p {
        font-size: 22px;
        color: #4cd964;
        margin-bottom: 5px;
        span {
          font-size: 12px;
        }
      }
      span {
        color: white;
        font-size: 12px;
      }
      &::after {
        position: absolute;
        content: "";
        width: 2px;
        height: 62px;
        background: -webkit-linear-gradient(0deg, #84fab0 0%, #8fd3f4 100%);
        right: 0;
        top: 50%;
        margin-top: -30px;
        border-radius: 50%;
      }
      &:last-child {
        &::after {
          content: "";
          background: none;
        }
      }
      &:hover {
        background-size: cover;
        background-image: url("~@/assets/img/systemInfo.png");
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
.device_table {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  min-height: 340px;
  background-color: rgba(255, 255, 255, 0.09);
  .table_head {
    width: 100%;
    height: 45px;
    font-size: 0;
    background-image: url("~@/assets/img/background.png");
    li {
      display: inline-block;
      width: 145px;
      height: 100%;
      line-height: 45px;
      font-size: 16px;
      text-align: center;
      color: white;
      position: relative;
      cursor: pointer;
      &::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 24px;
        background-color: white;
        right: 0;
        top: 50%;
        margin-top: -12px;
      }
      &:last-child {
        &::after {
          background-color: transparent;
        }
      }
      &.active {
        color: #0ceaf3;
        background-color: #24388e;
      }
    }
  }
  .common_infors {
    padding: 60px 0 50px 50px;
  }
  .common_auxiliary {
    padding: 40px 0 0 50px;
    li {
      min-width: 185px;
      text-align: left;
      font-size: 14px;
      margin-bottom: 30px;
      color: white;
      display: inline-block;
    }
  }
}
.common_infors {
  .company_top {
    width: 100%;
    height: auto;
    display: inline-block;
    .device {
      width: auto;
      display: inline-block;
      padding-left: 95px;
      vertical-align: top;
      p {
        font-size: 20px;
        color: #0ceaf3;
        margin-bottom: 20px;
      }
      ul {
        font-size: 0;
        li {
          font-size: 14px;
          color: white;
          margin-bottom: 20px;
        }
      }
    }
    .company_infor {
      width: 500px;
      display: inline-block;
      position: relative;
      &::after {
        content: "";
        width: 1px;
        height: 400px;
        background-color: #172e9f;
        position: absolute;
        top: -15px;
        right: 0;
      }
      .company_map {
        width: 400px;
        height: 160px;
      }
      ul {
        font-size: 0;
        li {
          font-size: 14px;
          color: white;
          margin-bottom: 20px;
        }
      }
    }
    .company_map {
      width: 400px;
      height: 160px;
      &.external {
        margin-top: 16px;
        width: 969px;
        height: 350px;
      }
    }
  }
}
</style>
