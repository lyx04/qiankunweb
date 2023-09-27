<!--屏柜!-->
<template>
  <div class="panel">
    <div class="action">
      <el-button
        class="btn-none"
        type="primary"
        @click="addInterval"
        v-hasPermi="['ema:room:add']"
        >新增间隔</el-button
      >
      <el-button
        type="primary"
        class="btn-none"
        plain
        @click="panelModel = true"
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
        <li class="long" :title="panelInfo.name">
          <p>
            名称：<span>{{ panelInfo.name }}</span>
          </p>
        </li>
        <li>
          <p>
            运行状态：<span>{{
              panelInfo.state == "1" ? "停运" : "在运"
            }}</span>
          </p>
        </li>
        <li class="long">
          <p>
            投运日期：<span>{{ panelInfo.launchTime }}</span>
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
          <img :src="panelInfo.pic1" alt="" />
          <img :src="panelInfo.pic2" alt="" />
        </div>
        <ul class="infor">
          <li>
            <p class="inforTitle">设备信息</p>
            <div class="font">
              <p>
                设备类型：<span>{{ panelInfo.equipName }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                厂家：<span>{{ panelInfo.factory }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                品牌：<span>{{ panelInfo.brand }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                型号：<span>{{ panelInfo.modelNum }}</span>
              </p>
            </div>
            <div class="font">
              <p>
                备注：<span>{{ panelInfo.remark }}</span>
              </p>
            </div>
          </li>
          <li class="inline">
            <p class="inforTitle">设计参数</p>
            <div
              class="font"
              v-for="item in panelInfo.roomList"
              :key="item.equiptyeParamId"
            >
              <p>
                {{ item.paramName }}：<span
                  >{{ item.paramVal || item.defaultVal }}{{ item.unit }}</span
                >
              </p>
            </div>
            <div
              class="font"
              v-for="item in panelInfo.equipmentList"
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
          创建人：<span>{{ panelInfo.createBy }}</span>
        </li>
        <li>
          创建时间：<span>{{
            panelInfo.createTime ? panelInfo.createTime.substr(0, 10) : ""
          }}</span>
        </li>
        <br />
        <li>
          最后维护人：<span>{{ panelInfo.updateBy }}</span>
        </li>
        <li>
          最后维护时间：<span>{{
            panelInfo.updateTime ? panelInfo.updateTime.substr(0, 10) : ""
          }}</span>
        </li>
      </ul>
    </div>
    <!-- 分割线 -->
    <new-model
      v-if="IntervalModal"
      :active="IntervalModal"
      :category="14"
      title="新建间隔"
      :map="false"
      @subForm="subInterval"
      @cancelForm="IntervalModal = false"
      :orgid="panelInfo.orgId"
    ></new-model>
    <!-- 修改屏柜 -->
    <device-model
      v-if="panelModel"
      :active="panelModel"
      :id="parId"
      :category="5"
      euqiptreeId="5"
      categoryName="屏柜"
      @cancelForm="cancelForm"
      @subForm="editPanel"
      :orgid="panelInfo.orgId"
      title="修改屏柜"
    ></device-model>
  </div>
</template>
<script>
import * as deviceServe from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import newModel from "./component/newModel";
import DeviceModel from "./component/deviceModel";
import { mapMutations } from "vuex";
export default {
  components: { newModel, DeviceModel },
  data() {
    return {
      tabActive: 1,
      IntervalModal: false,
      panelInfo: "",
      panelModel: false
    };
  },
  computed: {
    parId() {
      return this.decode(this.$route.params.query).split("-")[2];
    }
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus"]),

    //初始化获取屏柜
    initPanel() {
      var par = this.parId;
      deviceServe.GET_DEVICE_INFO(par).then(e => {
        this.panelInfo = e.data;
      });
    },
    //删除屏柜
    delect() {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除当前屏柜!",
        showCancelButton: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          deviceServe
            .DELETE_ELE_ROOM(
              this.decode(this.$route.params.query).split("-")[2]
            )
            .then(e => {
              if (e.code == 200) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                var routeArr = this.decode(this.$route.params.query)
                  .split("-")
                  .slice(0, 2);
                this.$router.push({
                  params: {
                    query: this.encode(String(routeArr.join("-")))
                  }
                });
                this.deviceTreeStatus(true);
              }
            });
        })
        .catch(e => {
          console.log(e);
        });
    },
    //新增间隔
    addInterval() {
      this.IntervalModal = true;
    },
    //提交间隔
    subInterval(e) {
      deviceServe.ADD_ELEROOM(e).then(e => {
        if (e.code == 200) {
          this.IntervalModal = false;
          this.deviceTreeStatus(true);
        }
      });
    },
    //修改屏柜
    editPanel(e) {
      deviceServe.EDIT_DEVICE(e).then(e => {
        if (e.code == 200) {
          this.panelModel = false;
          this.initPanel();
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.deviceTreeStatus(true);
        }
      });
    },
    cancelForm() {
      this.panelModel = false;
    },
    tabChange(active) {
      this.tabActive = active;
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
