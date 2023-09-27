<template>
  <div class="main-content">
    <el-form :model="request" ref="request" class="wc-form">
      <el-row>
        <el-col :span="4" class="label-distance">
          <el-form-item label="用电单位:" prop="orgId" label-width="106px">
            <el-select
              v-model.trim="request.orgId"
              placeholder="请选择用电单位"
              filterable
            >
              <el-option label="全部" value=""> </el-option>
              <el-option
                v-for="item in orgList"
                :key="item.orgId"
                :label="item.name"
                :value="item.orgId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="label-distance">
          <el-form-item label="终端类型:" prop="clientType" label-width="106px">
            <el-select
              v-model.trim="request.clientType"
              placeholder="请选择终端类型"
            >
              <el-option label="全部" value=""> </el-option>
              <el-option label="网关" value="网关"> </el-option>
              <el-option label="350" value="350"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="label-distance">
          <el-form-item label="终端状态:" prop="status" label-width="106px">
            <el-select v-model.trim="request.status" placeholder="请选择协议">
              <el-option label="全部" value=""> </el-option>
              <el-option label="正常" value="client_connected"> </el-option>
              <el-option label="离线" value="client_disconnected"> </el-option>
              <el-option label="--" value="client_no"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="终端标识(SN):" prop="sn" label-width="134px">
            <div class="el-select">
              <el-input
                v-model.trim="request.sn"
                clearable
                placeholder="请输入网关标识"
              ></el-input>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="button-distance">
          <el-button type="primary" @click="search">查询</el-button>
          <!--<el-button>导 出</el-button>-->
        </el-col>
      </el-row>
    </el-form>
    <div class="main-content-data">
      <!--data展示-->
      <div class="wc-all-data">
        <ul>
          <li>
            <div class="wc-all-data-title">终端数</div>
            <div class="wc-all-data-num">
              <span
                ><q>{{ terminalNum }}</q></span
              >个
            </div>
          </li>
          <el-divider direction="vertical"></el-divider>
          <li>
            <div class="wc-all-data-title">在线数</div>
            <div class="wc-all-data-num">
              <span
                ><q>{{ onlineNum }}</q></span
              >个
            </div>
          </li>
          <el-divider direction="vertical"></el-divider>
          <li>
            <div class="wc-all-data-title">离线数</div>
            <div class="wc-all-data-num">
              <span
                ><q>{{ Number(terminalNum) - Number(onlineNum) }}</q></span
              >个
            </div>
          </li>
          <el-divider direction="vertical"></el-divider>
          <li>
            <div class="wc-all-data-title">在线率</div>
            <div class="wc-all-data-num">
              <span
                ><q>{{ onlineRate || 0 }}</q></span
              >%
            </div>
          </li>
        </ul>
      </div>
      <!---->
      <div class="h-table-content">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" align="center" label="序号" width="60">
          </el-table-column>
          <el-table-column
            prop="name"
            align="center"
            label="终端名称"
            :show-overflow-tooltip="true"
            min-width="120"
          >
          </el-table-column>
          <el-table-column
            prop="protocol"
            align="center"
            label="协议"
            :show-overflow-tooltip="true"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="clientType"
            align="center"
            label="终端类型"
            :show-overflow-tooltip="true"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="orgName"
            align="center"
            label="用电单位"
            :show-overflow-tooltip="true"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="roomName"
            align="center"
            label="配电室"
            :show-overflow-tooltip="true"
            min-width="200"
          >
          </el-table-column>
          <el-table-column
            prop="sn"
            align="center"
            label="终端标识（SN）"
            :show-overflow-tooltip="true"
            width="130"
          >
          </el-table-column>
          <el-table-column align="center" label="终端状态" width="80">
            <template slot-scope="scope">
              <span
                :style="
                  scope.row.status == '在线'
                    ? 'cursor:pointer;color:#2589EE;'
                    : 'color:#D9260E;cursor:pointer;'
                "
                v-if="scope.row.status"
                @click="wcDetailModal(scope.row)"
                v-track-event="{
                  category: 'condition',
                  action: 'detail'
                }"
              >
                {{ scope.row.status }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="最后通讯时间" width="170">
            <template slot-scope="scope">
              {{ scope.row.connectTime || "--" }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                @click="openpPairTime(scope.row)"
                v-hasPermi="['monitor:condition:pair']"
                class="btn-none"
                v-if="scope.row.clientType == '网关'"
                >校时</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <page
          :pageSize="request.pageSize"
          :currentPage1.sync="request.pageNum"
          :total="totalNum"
          @handleCurrent="handleCurrent"
          @size-change="handleSizeChange"
        ></page>
      </div>
    </div>
    <work-condition-modal
      :dialogVisibleWorkCondition="dialogVisibleWorkCondition"
      :detailInfo="detailInfo"
      @workConditionClosed="workConditionClosed"
    ></work-condition-modal>
    <!--校时-->
    <modal
      :visible="dialogVisiblePairTime"
      customClass="customer-modal Miniform"
      @on-closed="pairTimeClosed"
    >
      <template slot="head">
        <span>校时</span>
      </template>
      <template slot="body">
        <div class="pairTime-title">
          <i class="el-icon-warning-outline"></i
          >当前设置时间为对时预计延时时间，设置后将对网关或者表计按照“当前时间+延时时间”进行设置。可能会存在时间误差。
        </div>
        <el-form ref="form" :model="form" label-width="106px">
          <el-col :span="20">
            <el-form-item label="延迟时间：" prop="second">
              <el-input-number
                v-model="form.second"
                controls-position="right"
                :min="0"
              /><span style="color: #FFFFFF;font-size: 12px;margin-left: 6px;"
                >秒</span
              >
            </el-form-item>
          </el-col>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="pairTimeClosed">取消</el-button>
        <el-button type="primary" @click="pairTime">提交</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import page from "hlcx-qiankun-commonservice/components/pagination";
import modal from "hlcx-qiankun-commonservice/components/Modal";
import WorkConditionModal from "../components/workConditionModal";
import { GET_SYSTEM_ORG_LIST } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import { GET_WAY_BY_ORG, IOT_TIMING } from "hlcx-qiankun-commonservice/utils/api/monitor/wcquery";
import { GET_COMMUNICATION_INFO } from "hlcx-qiankun-commonservice/utils/api/overview/screen";
import { mapState } from "vuex";

export default {
  name: "workingCondition",
  components: {
    page,
    WorkConditionModal,
    modal
  },
  data() {
    return {
      request: {
        orgId: "",
        orgIds: [],
        clientType: "",
        status: "",
        sn: "",
        pageNum: 1,
        pageSize: 10
      },
      orgList: [], // 用电单位
      totalNum: 0, // 总数
      onlineNum: 0, // 在线数
      terminalNum: 0, // 终端数
      tableData: [],
      dialogVisibleWorkCondition: false, // 工况详情
      detailInfo: {}, // 当前信息
      dialogVisiblePairTime: false, // 校时弹框
      pairTimeRow: undefined, // 校时信息
      form: {
        second: 0
      }
    };
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    }),
    // 在线率
    onlineRate: function() {
      var num = 0;
      if (this.onlineNum && this.terminalNum) {
        num = (
          (Number(this.onlineNum) / Number(this.terminalNum)) *
          100
        ).toFixed(2);
      }
      return num;
    }
  },
  methods: {
    /** 搜索按钮*/
    search() {
      this.request.pageNum = 1;
      this.getOrgList();
    },
    // 查询组织list
    getOrgList() {
      GET_SYSTEM_ORG_LIST().then(res => {
        // 只展示用电企业
        var data = res.data;
        this.orgList = data;
        if (sessionStorage.getItem("orgId")) {
          this.request.orgId = Number(sessionStorage.getItem("orgId"));
          sessionStorage.removeItem("orgId");
        }
        this.getWayList();
      });
    },
    // 打开工况详情弹框
    wcDetailModal(row) {
      if (row.clientType != "350") {
        this.dialogVisibleWorkCondition = true;
        this.detailInfo = row;
      }
    },
    //  关闭弹框
    workConditionClosed() {
      this.dialogVisibleWorkCondition = false;
    },
    //  工况列表
    getWayList() {
      this.totalNum = 0;
      this.tableData = [];
      GET_WAY_BY_ORG(this.request).then(res => {
        this.totalNum = res.total;
        this.tableData = res.rows;
        let data = {
          orgId: this.request.orgId
        };
        GET_COMMUNICATION_INFO(data).then(res => {
          this.terminalNum = res.data.gatewayNum;
          this.onlineNum = res.data.connectGatewayNum;
        });
      });
    },
    //  工况翻页
    handleCurrent(val) {
      this.request.pageNum = val;
      this.getWayList();
    },
    handleSizeChange(val) {
      this.request.pageNum = 1;
      this.request.pageSize = val;
      this.getWayList();
    },
    //  对时
    pairTime() {
      var data = {
        ver: "v2.2.2",
        pkey: this.pairTimeRow.pkey,
        sn: this.pairTimeRow.sn,
        type: "timing",
        seq: 1012800,
        second: this.form.second
      };
      IOT_TIMING(data).then(() => {
        this.$message({
          message: "校时成功",
          type: "success"
        });
        this.dialogVisiblePairTime = false;
      });
    },
    // 打开校时
    openpPairTime(row) {
      this.pairTimeRow = undefined;
      this.dialogVisiblePairTime = true;
      this.pairTimeRow = row;
      this.form.second = 0;
    },
    // 关闭校时
    pairTimeClosed() {
      this.pairTimeRow = undefined;
      this.dialogVisiblePairTime = false;
    }
  },
  created() {
    this.getOrgList();
  }
};
</script>

<style scoped lang="scss">
.pairTime-title {
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
  padding: 0 30px;
  vertical-align: middle;
  line-height: 20px;
  .el-icon-warning-outline {
    margin-right: 6px;
  }
}
::v-deep.main-content {
  .wc-form {
    margin-top: 25px;
    .el-form-item__label-wrap {
      margin-left: 32px !important;
    }
    .button-distance {
      margin-top: 4px;
      margin-left: 10px;
    }
  }
  .main-content-data {
    margin: 0 24px;
    .wc-all-data {
      width: 100%;
      height: 104px;
      background: rgba(37, 137, 238, 0.2);
      border-image: linear-gradient(0deg, rgba(25, 58, 165, 0.49), transparent)
        1 1;
      box-shadow: 0px -2px 0px 0px rgba(27, 47, 115, 0.66);
      ul {
        display: flex;
        justify-content: flex-start;
        li {
          color: #9ae0ff;
          font-size: 18px;
          padding: 16px 0 16px 48px;
          min-width: 288px;
          .wc-all-data-num {
            margin-top: 18px;
            span {
              font-size: 36px;
              color: #ffffff;
              line-height: 1;
            }
          }
        }
        .el-divider {
          width: 2px;
          height: 80px;
          margin-top: 12px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.1),
            rgba(12, 234, 243, 0.5),
            rgba(255, 255, 255, 0.1)
          );
        }
      }
    }
    .h-table-content {
      margin-top: 18px;
    }
  }
}
</style>
