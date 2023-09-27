<!-- 配电室页面-->
<template>
  <div class="power">
    <div class="action">
      <el-button
        type="primary"
        class="btn-none"
        @click="addPanel"
        v-hasPermi="['ema:room:add']"
        >新增屏柜</el-button
      >
      <el-button
        type="primary"
        class="btn-none"
        @click="addVoltage"
        v-hasPermi="['ema:room:add']"
        >新增变压器</el-button
      >
      <el-dropdown
        class="btn-none"
        trigger="click"
        @command="dropdownClick"
        v-hasPermi="['ema:room:add']"
      >
        <el-button type="primary">
          动环监控<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :command="item.id"
            v-for="item in dropdownList"
            :key="item.id"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        class="btn-none"
        type="primary"
        @click="addtermainal"
        v-hasPermi="['ema:room:add']"
        >新增通讯终端</el-button
      >
      <el-button
        type="primary"
        class="btn-none"
        @click="addvideo"
        v-hasPermi="['ema:room:add']"
        >新增视频</el-button
      >
      <el-button
        type="primary"
        class="btn-none"
        plain
        @click="editPower"
        v-hasPermi="['ema:room:update']"
        >编辑</el-button
      >
      <el-button
        type="danger"
        class="btn-none"
        plain
        @click="delectPower"
        v-hasPermi="['ema:room:delete']"
        >删除</el-button
      >
    </div>
    <div class="device_infor">
      <ul class="baseInfo">
        <li class="long" :title="powerInfo.name">
          <p>
            名称：<span>{{ powerInfo.name }}</span>
          </p>
        </li>
        <li>
          <p>
            运行状态：<span>{{
              powerInfo.state == "1" ? "停运" : "在运"
            }}</span>
          </p>
        </li>
        <li class="long">
          <p>
            投运日期：<span>{{ powerInfo.launchTime }}</span>
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
        <li
          @click="tabChange('1')"
          v-hasPermi="['ema:room:info']"
          :class="{ active: tabActive == 1 }"
        >
          <span>基本信息</span>
        </li>
        <li
          @click="tabChange('2')"
          v-hasPermi="['ema:room:info']"
          :class="{ active: tabActive == 2 }"
        >
          <span>动环监控</span>
        </li>
        <li
          @click="tabChange('3')"
          v-hasPermi="['ema:room:info']"
          :class="{ active: tabActive == 3 }"
        >
          <span>阈值设置</span>
        </li>
        <li
          @click="tabChange('4')"
          v-hasPermi="['ema:room:info']"
          :class="{ active: tabActive == 4 }"
        >
          <span>告警设置</span>
        </li>
        <li
          @click="tabChange('5')"
          v-hasPermi="['ema:room:info']"
          :class="{ active: tabActive == 5 }"
        >
          <span>附属信息</span>
        </li>
      </ul>
      <!-- 基本信息 -->
      <div class="common_infors" v-show="tabActive == 1">
        <div class="company_top">
          <div class="company_infor">
            <ul>
              <li v-for="(item, index) in powerInfo.paramList" :key="index">
                {{ item.paramName }}:{{ item.paramVal || item.defaultVal }}
              </li>
              <li>
                地址：<span>{{ powerInfo.address }}</span>
              </li>
              <li>
                备注：<span>{{ powerInfo.remark }}</span>
              </li>
            </ul>
            <div class="company_map">
              <el-amap :center="center" :zoom="zoom">
                <el-amap-marker :position="center"></el-amap-marker>
              </el-amap>
            </div>
          </div>
          <div class="device_num device">
            <p>设备数量统计</p>
            <ul>
              <ul>
                <li v-for="(item, index) in powerInfo.deviceSum" :key="index">
                  {{ item.name }}：<span>{{ item.count }}个</span>
                </li>
              </ul>
            </ul>
          </div>
          <div class="device_total device">
            <p>合计</p>
            <ul>
              <li v-for="(item, index) in powerInfo.deviceSortSum" :key="index">
                {{ item.name }}： <span>{{ item.count }}个</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 附属信息 -->
      <ul class="common_auxiliary" v-show="tabActive == 5">
        <li>
          创建人：<span>{{ powerInfo.createBy }}</span>
        </li>
        <li>
          创建时间：<span>{{ powerInfo.createTime }}</span>
        </li>
        <br />
        <li>
          最后维护人：<span>{{ powerInfo.updateBy }}</span>
        </li>
        <li>
          最后维护时间：<span>{{ powerInfo.updateTime }}</span>
        </li>
      </ul>
      <!-- 动环监控 -->
      <div class="addmonitor" v-show="tabActive == 2">
        <!-- <div class="monitor_option">
          <el-button
            type="primary"
            @click="
              newmeasure = true;
              newmeasureselect = '';
              addMeasureModule.list = [];
            "
            v-hasPermi="['ema:elemeasure:add']"
            >新增量测量</el-button
          >
          <el-button
            type="danger"
            plain
            :disabled="!checkedList.length"
            @click="delectMonitor"
            v-hasPermi="['ema:elemeasure:delete']"
            >删除</el-button
          >
          <el-select
            v-model="powerQuery"
            @change="tablemeasure"
            placeholder="请选择动环监控"
          >
            <el-option
              v-for="item in powerQueryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <el-table
          @selection-change="selectChange"
          :row-key="tableRowKey"
          :data="measuremodule.list"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection" align="center"> </el-table-column>
          <el-table-column type="index" align="center" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="name" align="center" label="量测量名称">
          </el-table-column>
          <el-table-column prop="identify" align="center" label="量测量标识">
          </el-table-column>
          <el-table-column
            prop="type"
            :formatter="typeFormatter"
            align="center"
            label="量测量分类"
          >
          </el-table-column>
          <el-table-column prop="equipName" align="center" label="所属量测集">
          </el-table-column>
          <el-table-column prop="labels" align="center" label="标签">
          </el-table-column>
          <el-table-column prop="unit" align="center" label="单位">
          </el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <template v-if="scope.row.hasAlarm">
                <el-button disabled class="nomargin" type="warning" plain
                  >已加预设</el-button
                >
              </template>
              <template v-else>
                <el-button
                  type="primary"
                  v-hasPermi="['ema:elealarm:add']"
                  plain
                  @click="addwarning(scope.row)"
                  >加入告警</el-button
                >
              </template>

              <el-button
                type="danger"
                v-hasPermi="['ema:elemeasure:delete']"
                plain
                @click="monitorDelect(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :pageSize="10"
          :total="measuremodule.total"
          @handleCurrent="meausercurrent"
        ></pagination> -->
        <measure-list
          category="9"
          :parId="parId"
          v-if="tabActive == 2"
        ></measure-list>
      </div>
      <!-- 阈值设置 -->
      <div class="report" v-show="tabActive == 3">
        <alarm-list
          :id="parId"
          :orgid="powerInfo.orgId"
          v-if="tabActive == 3"
        ></alarm-list>
      </div>
      <!-- 告警设置 -->
      <div class="report" v-show="tabActive == 4">
        <rule-list
          :id="parId"
          :orgid="powerInfo.orgId"
          v-if="tabActive == 4"
        ></rule-list>
      </div>
    </div>
    <!-- 分割线 -->
    <device-modal
      v-if="addModal.active"
      :active="addModal.active"
      :category="addModal.category"
      :euqiptreeId="addModal.euqiptreeId"
      :categoryName="addModal.categoryName"
      @cancelForm="cancelForm"
      @subForm="subForm"
      :title="devTitle"
      :orgid="powerInfo.orgId"
    ></device-modal>
    <!-- 修改配电室 -->
    <new-model
      @subForm="powerSub"
      @cancelForm="cancel"
      v-if="editPowerModal"
      :active="editPowerModal"
      :id="parId"
      :category="13"
      :map="true"
      :orgid="powerInfo.orgId"
      title="修改配电室"
    ></new-model>
  </div>
</template>
<script>
// 类型编码
// 变压器 4
// 屏柜 5
// 底层设备 6
// 表计 8
// 动环监控 9
// 通讯终端 11
// 配电室 13
// 间隔 14
import * as deviceServe from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { QUERY_TREE_NODE_SELECT } from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";
import DeviceModal from "./component/deviceModel";
import newModel from "./component/newModel";
import measureList from "./component/measureList";
import alarmList from "./component/alarmList";
import ruleList from "./component/ruleList";
import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
  components: { measureList, alarmList, DeviceModal, newModel, ruleList },
  filters: {
    nameFilter: (val, that, dictKey) => {
      if (val && that.dict[dictKey].length > 0) {
        for (let i in that.dict[dictKey]) {
          if (that.dict[dictKey][i].dictValue == val) {
            return that.dict[dictKey][i].dictLabel;
          }
        }
      }
    }
  },
  mounted() {
    this.initmonitor();
  },
  computed: {
    ...mapState(["dict"]),
    parId() {
      return this.decode(this.$route.params.query).split("-")[1];
    }
  },

  data() {
    return {
      devTitle: "",
      that: this,
      //配电室的基本信息
      powerInfo: "",

      tabActive: 1,
      dropdownList: [],
      editPowerModal: false,
      center: [112.529199, 37.85602],
      zoom: 12,
      addModal: {
        active: false,
        id: "",
        euqiptreeId: "",
        categoryName: "",
        category: ""
      }
    };
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus"]),
    //初始化配电室
    initPower() {
      this.tabActive = 1;
      deviceServe.QUERY_ROOM_INFO(this.parId).then(e => {
        e.data.createTime = e.data.createTime.slice(0, 10);
        e.data.updateTime = e.data.updateTime
          ? e.data.updateTime.slice(0, 10)
          : "";
        this.center = [e.data.lng, e.data.lat];
        this.powerInfo = e.data;
        //设备的统计
        deviceServe.GET_DEVICE_SUM(this.parId).then(e => {
          this.$set(this.powerInfo, "deviceSum", e.data);
        });
        //获取设备分类的合计
        deviceServe.GET_DEVICE_SORT_SUM(this.parId).then(e => {
          this.$set(this.powerInfo, "deviceSortSum", e.data);
        });
      });
    },
    //修改配电室
    editPower() {
      this.editPowerModal = true;
    },
    //关闭配电室弹框
    cancel() {
      this.editPowerModal = false;
    },
    //配电室提交
    powerSub(e) {
      deviceServe.UPDATE_ELE_ROOM(e).then(e => {
        if (e.code == 200) {
          this.editPowerModal = false;
          this.initPower();
          this.deviceTreeStatus(true);
        }
      });
    },
    //删除配电室
    delectPower() {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除当前配电室!",
        showCancelButton: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        deviceServe.DELETE_ELE_ROOM(this.parId).then(e => {
          if (e.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.$emit("delectChange");
            var routeArr = this.decode(this.$route.params.query)
              .split("-")
              .slice(0, 1);
            this.$router.push({
              params: {
                query: this.encode(String(routeArr.join("-")))
              }
            });
            this.deviceTreeStatus(true);
          }
        });
      });
    },

    //新增动环监控
    dropdownClick(e) {
      var item = this.dropdownList.filter(i => {
        return e == i.id;
      });
      item = item[0];
      this.addModal.category = 9;
      this.addModal.euqiptreeId = item.id;
      this.addModal.categoryName = item.name;
      this.addModal.active = true;
      this.devTitle = "新增动环监控";
    },
    //新增通讯终端
    addtermainal() {
      this.addModal.category = 11;
      this.addModal.euqiptreeId = 11;
      this.addModal.categoryName = "通讯终端";
      this.addModal.active = true;
      this.devTitle = "新增通讯终端";
    },
    //新增视频
    addvideo() {
      this.addModal.category = 32;
      this.addModal.euqiptreeId = 32;
      this.addModal.categoryName = "视频";
      this.addModal.active = true;
      this.devTitle = "新增视频";
    },
    //新增变压器
    addVoltage() {
      this.addModal.category = 4;
      this.addModal.euqiptreeId = 4;
      this.addModal.categoryName = "变压器";
      this.devTitle = "新增变压器";
      this.addModal.active = true;
    },
    //新增屏柜
    addPanel() {
      this.addModal.category = 5;
      this.addModal.euqiptreeId = 5;
      this.addModal.categoryName = "屏柜";
      this.devTitle = "新增屏柜";
      this.addModal.active = true;
    },
    //提交新建的设备
    subForm(e) {
      deviceServe.ADD_ELE_ROOM_TYPE(e).then(e => {
        if (e.code == 200) {
          this.cancelForm();
          this.deviceTreeStatus(true);
        }
      });
    },
    //关闭弹框
    cancelForm() {
      this.addModal.active = false;
    },
    //切换
    tabChange(action) {
      this.tabActive = action;
    },
    //初始化动环监控
    initmonitor() {
      // 这里使用动环监控的id
      QUERY_TREE_NODE_SELECT("9").then(e => {
        this.dropdownList = e.data;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.power {
  .device_table {
    .addmonitor {
      padding: 20px 20px 0 20px;
      .monitor_option {
        margin-bottom: 20px;
        .is-plain {
          width: 88px;
          height: 31.6px;
          &.is-disabled {
            color: #e97e62;
            background: transparent;
            border: 1px solid #e97e62;
          }
        }
        ::v-deep .el-select {
          float: right;
          .el-input {
            .el-input__inner {
              height: 31.6px;
              line-height: 31.6px;
            }
            .el-input__suffix {
              .el-input__suffix-inner {
                .el-input__icon {
                  line-height: 31.6px;
                }
              }
            }
          }
        }
      }
      ::v-deep table {
        .cell {
          font-weight: normal;
        }
      }
    }
    .report {
      padding: 30px 20px 0 20px;
      ::v-deep .el-form-item {
        &.is-error {
          .el-input__inner {
            border: 1px solid #f56c6c !important;
          }
        }
      }
      ::v-deep .el-input__inner {
        height: 28px !important;
        line-height: 30px;
        background-color: rgba(235, 235, 235, 0.15);
        border: 1px solid transparent;
        color: white;
      }
      ::v-deep .el-select {
        .el-input {
          &.is-disabled {
            .el-input__inner {
              background-color: rgba(235, 235, 235, 0.15);
            }
          }
        }
        .el-input__icon {
          line-height: 30px;
        }
      }
      ::v-deep table {
        .el-table__row {
          .cell {
            line-height: 30px;
            height: 30px;
          }
        }
        .cell {
          font-weight: normal;
          font-size: 14px;

          .el-form-item {
            margin-bottom: 0;
            .el-form-item__content {
              line-height: 30px;
            }
          }
          p {
            font-size: 14px;
            span {
              color: red;
            }
          }
          .required {
            color: red;
          }
        }
      }
    }
  }
}
.el-dropdown-menu {
  background-color: #297fb1;
  border-color: #297fb1;
  li {
    color: white;
    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      color: #0ceaf3;
    }
  }
  ::v-deep .popper__arrow {
    border-bottom-color: #297fb1 !important;

    &::after {
      border-bottom-color: #297fb1 !important;
    }
  }
}
.action {
  .el-dropdown {
    margin-left: 10px;
    margin-right: 10px;
  }
  .is-plain {
    min-width: 88px;
    min-height: 31.6px;
  }
}
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
}
.el-dialog__wrapper {
  ::v-deep .Maxform {
    .el-dialog__header {
      .el-select {
        float: right;
        margin-right: 20px;
        .el-input__inner {
          height: 25px;
          line-height: 25px;
        }
        .el-input--suffix {
          .el-input__icon {
            line-height: 25px;
          }
        }
      }
    }
    .el-dialog__body {
      table {
        .cell {
          padding: 0;
        }
      }
      .el-form {
      }
    }
  }
}
</style>
