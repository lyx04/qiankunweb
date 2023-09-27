<!--间隔!-->
<template>
  <div class="interval">
    <div class="action">
      <el-dropdown
        @command="dropdownClick('配电设备', $event)"
        class="btn-none"
        trigger="click"
        v-hasPermi="['ema:room:add']"
      >
        <el-button type="primary"
          >新增配电设备<i class="el-icon-arrow-down el-icon--right"></i
        ></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in etmDeviceList"
            :key="item.id"
            :command="item"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        @command="dropdownClick('表计', $event)"
        class="btn-none"
        trigger="click"
        v-hasPermi="['ema:room:add']"
      >
        <el-button type="primary"
          >新增表计<i class="el-icon-arrow-down el-icon--right"></i
        ></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in meterDeviceList"
            :key="item.id"
            :command="item"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="primary"
        class="btn-none"
        plain
        @click="editInterval"
        v-hasPermi="['ema:room:update']"
        >编辑</el-button
      >
      <el-button
        class="btn-none"
        type="danger"
        plain
        @click="delectInterval"
        v-hasPermi="['ema:room:delete']"
        >删除</el-button
      >
    </div>
    <div class="device_infor">
      <ul class="baseInfo">
        <li class="long" :title="intervalInfo.name">
          <p>
            名称：<span>{{ intervalInfo.name }}</span>
          </p>
        </li>
        <li>
          <p>
            运行状态：<span>{{
              intervalInfo.state == "1" ? "停运" : "在运"
            }}</span>
          </p>
        </li>
        <li class="long">
          <p>
            投运日期：<span>{{ intervalInfo.launchTime }}</span>
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
          <span>量测量</span>
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
      <div class="interval_infors" v-show="tabActive == 1">
        <p class="intervalTitle">
          设计参数
        </p>
        <div
          class="font"
          v-for="item in intervalInfo.paramList"
          :key="item.equiptyeParamId"
        >
          <p>
            {{ item.paramName }}：<span
              >{{ item.paramVal || item.defaultVal }}{{ item.unit }}</span
            >
          </p>
        </div>

        <div class="font">
          <p>备注：{{ intervalInfo.remark }}</p>
        </div>
      </div>
      <!-- 附属信息 -->
      <ul class="common_auxiliary" v-show="tabActive == 5">
        <li>
          创建人：<span>{{ intervalInfo.createBy }}</span>
        </li>
        <li>
          创建时间：<span>{{
            intervalInfo.createTime ? intervalInfo.createTime.substr(0, 10) : ""
          }}</span>
        </li>
        <br />
        <li>
          最后维护人：<span>{{ intervalInfo.updateBy }}</span>
        </li>
        <li>
          最后维护时间：<span>{{
            intervalInfo.updateTime ? intervalInfo.updateTime.substr(0, 10) : ""
          }}</span>
        </li>
      </ul>
      <!-- 量测量 -->
      <div class="addmonitor" v-show="tabActive == 2">
        <!-- <div class="monitor_option">
          <el-button
            type="primary"
            @click="newmeasure = true"
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
            v-model="measure.value"
            @change="monitorChange"
            placeholder="请选择监控设备"
          >
            <el-option
              v-for="item in measure.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <el-table
          @selection-change="selectChange"
          :row-key="tableRowKey"
          :data="measure.tableData"
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
          :total="measure.total"
          @handleCurrent="measureCurrent"
        ></pagination> -->
        <measure-list
          category="8"
          :parId="parId"
          v-if="tabActive == 2"
        ></measure-list>
      </div>
      <!-- 阈值设置 -->
      <div class="report" v-show="tabActive == 3">
        <alarm-list
          v-if="tabActive == 3"
          placeholder="请选择监控设备"
          treeType="8"
          :orgid="intervalInfo.orgId"
          :id="parId"
        ></alarm-list>
      </div>
      <!-- 告警设置 -->
      <div class="report" v-show="tabActive == 4">
        <rule-list
          :id="parId"
          placeholder="请选择监控设备"
          treeType="8"
          :orgid="intervalInfo.orgId"
          v-if="tabActive == 4"
        ></rule-list>
      </div>
    </div>
    <!-- 分割线 -->
    <!-- 修改间隔 -->
    <new-model
      @cancelForm="cancelForm"
      @subForm="subInterval"
      v-if="IntervalModal"
      :active="IntervalModal"
      :id="parId"
      :category="14"
      title="修改间隔"
      :map="false"
      :orgid="intervalInfo.orgId"
    ></new-model>
    <!-- 新增配电设备 -->
    <device-model
      @cancelForm="devicecancelForm"
      @subForm="devSub"
      :category="addModal.row.parentId"
      :euqiptreeId="addModal.row.id"
      :categoryName="addModal.row.name"
      v-if="addModal.active"
      :active="addModal.active"
      :title="devTitle"
      :orgid="intervalInfo.orgId"
    ></device-model>
  </div>
</template>
<script>
import { mapState } from "vuex";
import * as deviceServe from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { QUERY_TREE_NODE_SELECT } from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";
import newModel from "./component/newModel";
import deviceModel from "./component/deviceModel";
import alarmList from "./component/alarmList";
import measureList from "./component/measureList";
import ruleList from "./component/ruleList";
import { mapMutations } from "vuex";
export default {
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
  components: {
    newModel,
    deviceModel,
    alarmList,
    measureList,
    ruleList
  },
  computed: {
    ...mapState(["dict"]),
    parId() {
      return this.decode(this.$route.params.query).split("-")[3];
    }
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus"]),
    // 获取配电设备和监控设备
    getDeviceNodeSelect(id) {
      QUERY_TREE_NODE_SELECT(id).then(e => {
        if (id == 8) {
          this.meterDeviceList = e.data;
        } else {
          this.etmDeviceList = e.data;
        }
      });
    },
    //提交新设备
    devSub(data) {
      deviceServe.ADD_ELE_ROOM_TYPE(data).then(e => {
        if (e.code == 200) {
          this.addModal.active = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.deviceTreeStatus(true);
        }
      });
    },
    //初始化间隔
    initInterval() {
      this.tabActive = 1;
      deviceServe.QUERY_ROOM_INFO(this.parId).then(e => {
        this.intervalInfo = e.data;
      });
      this.getDeviceNodeSelect(6);
      this.getDeviceNodeSelect(8);
    },
    // 修改间隔
    editInterval() {
      this.IntervalModal = true;
    },
    // 修改间隔
    subInterval(e) {
      deviceServe.UPDATE_ELE_ROOM(e).then(e => {
        if (e.code == 200) {
          this.IntervalModal = false;
          this.initInterval();
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.deviceTreeStatus(true);
        }
      });
    },
    cancelForm() {
      this.IntervalModal = false;
    },
    devicecancelForm() {
      this.addModal.active = false;
    },
    //删除间隔
    delectInterval() {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除当前间隔!",
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
              var routeArr = this.decode(this.$route.params.query)
                .split("-")
                .slice(0, 3);
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
    //切换
    tabChange(action) {
      this.tabActive = action;
    },
    //下拉框菜单项点击
    dropdownClick(name, e) {
      this.devTitle = "新增" + name;
      this.addModal.row = e;
      this.addModal.active = true;
    }
  },
  data() {
    return {
      that: this,
      devTitle: "",
      addModal: {
        active: false,
        row: ""
      },
      intervalInfo: "",
      IntervalModal: false,
      tabActive: 1,
      //监控设备列表
      meterDeviceList: [],
      //配电设备列表
      etmDeviceList: []
    };
  }
};
</script>

<style lang="scss" scoped>
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
.interval {
  .action {
    .el-dropdown {
      margin-right: 10px;
    }
  }
  .interval_infors {
    padding: 40px 0 0 50px;
    .intervalTitle {
      font-size: 20px;
      color: #0ceaf3;
      margin-bottom: 30px;
    }
    .font {
      margin-bottom: 30px;
      display: inline-block;
      margin-right: 20px;
      color: white;
      font-size: 14px;
    }
  }
  .addmonitor {
    padding: 20px 20px 0 20px;
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
