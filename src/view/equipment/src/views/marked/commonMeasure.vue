// 弹框中的量测量列表
<template>
  <div class="commonMeasure measure_table">
    <template v-if="!editOrLook">
      <div class="tab_option">
        <el-button type="primary" @click="openTransfer">新增</el-button>
        <!-- <el-button type="primary">批量导入参数地址</el-button> -->
        <!--<el-button style="float:right">导出</el-button>-->
      </div>
    </template>
    <el-table
      class="modal"
      :data="measure.TableData"
      stripe
      style="width: 100%"
    >
      <el-table-column
        fixed
        width="120"
        prop="name"
        align="center"
        label="测量参数"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <!-- <el-table-column
        width="140"
        prop="identify"
        align="center"
        label="参数标识"
        :show-overflow-tooltip="true"
      >
      </el-table-column> -->
      <el-table-column
        prop="type"
        width="60"
        align="center"
        :formatter="typeFormatter"
        label="分类"
      >
      </el-table-column>
      <el-table-column
        prop="equipName"
        width="140"
        align="center"
        label="所属量测集"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="labels"
        width="60"
        align="center"
        label="标签"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="unit"
        width="60"
        align="center"
        label="单位"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="ratioTransfer"
        :show-overflow-tooltip="true"
        align="center"
        width="60"
        label="平台系数"
      >
        <template slot-scope="scope">
          <el-input-number
            :min="0.001"
            :max="1000"
            v-if="scope.row.editflag"
            placeholder="请输入内容"
            v-model.trim="scope.row.ratioTransfer"
            class="table_input"
            type="number"
          >
          </el-input-number>
          <template v-else>
            {{ scope.row.ratioTransfer }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="ratioModbus"
        :show-overflow-tooltip="true"
        align="center"
        label="协议系数"
      >
        <template slot-scope="scope">
          <el-input-number
            :min="0.001"
            :max="1000"
            v-if="scope.row.editflag"
            placeholder="请输入内容"
            v-model.trim="scope.row.ratioModbus"
            class="table_input"
            type="number"
          >
          </el-input-number>
          <template v-else>
            {{ scope.row.ratioModbus }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="agreeParam"
        align="center"
        label="参数地址"
        min-width="120"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-input-number
            :min="0"
            :max="49999"
            v-if="scope.row.editflag"
            placeholder="请输入内容"
            v-model.trim="scope.row.agreeParam"
            class="table_input"
          >
          </el-input-number>
          <template v-else>
            {{ scope.row.agreeParam || "--" }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="dataType"
        align="center"
        label="数据类型"
        min-width="120"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.dataType"
            class="table_input"
            v-if="scope.row.editflag"
          >
            <el-option
              v-for="item in getDict('data_type')"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="Number(item.dictValue)"
            ></el-option>
          </el-select>
          <template v-else>
            {{ dataTypeFormatter(scope.row.dataType) || "--" }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="bitIndex"
        align="center"
        label="Bit位"
        min-width="120"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-input-number
            class="table_input"
            v-model="scope.row.bitIndex"
            :min="0"
            :max="15"
            v-if="scope.row.editflag"
          ></el-input-number>
          <template v-else>
            {{ scope.row.bitIndex == null ? "--" : scope.row.bitIndex }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="registerType"
        align="center"
        label="寄存器类型"
        min-width="120"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.registerType"
            class="table_input"
            v-if="scope.row.editflag"
          >
            <el-option
              v-for="item in registerTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <template v-else>
            {{ registerTypeFormatter(scope.row.registerType) || "--" }}
          </template>
        </template>
      </el-table-column>

      <el-table-column
        v-if="!editOrLook"
        align="center"
        label="操作"
        fixed="right"
        width="175"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.editflag">
            <el-button
              class="nomargin"
              type="primary"
              plain
              @click="checkaddress(scope.row)"
              >保存</el-button
            >
            <el-button class="nomargin" type="danger" plain @click="cancelRow()"
              >取消</el-button
            >
          </template>
          <template v-else>
            <el-button
              class="nomargin"
              type="primary"
              plain
              @click="rowEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              class="nomargin"
              @click="delectmeasure(scope.row)"
              type="danger"
              plain
              >删除</el-button
            >
            <template v-if="scope.row.hasAlarm">
              <el-button disabled class="nomargin" type="warning" plain
                >已加预设</el-button
              >
            </template>
            <template v-else>
              <el-button
                class="nomargin"
                type="warning"
                plain
                @click="addEptAlarm(scope.row)"
                >预设阈值</el-button
              >
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pageSize="measure.pageSize"
      :currentPage1.sync="measure.pageNum"
      :total="measure.totalNum"
      @handleCurrent="measureCurrent"
      @size-change="handleSizeChange"
    ></pagination>
    <measur-select-modal
      v-if="transferModal"
      :show.sync="transferModal"
      :params="{
        id: markId
      }"
      @measurSub="getEquipmentEptMeasure"
    ></measur-select-modal>
  </div>
</template>
<script>
import pagination from "hlcx-qiankun-commonservice/components/pagination";
import measurSelectModal from "./measurSelectModal";
import {
  UPDATE_EPT_MEASURE,
  ADD_EPT_ALARM,
  DEL_MEASERE,
  GET_EQUIPMENT_QUERYEPT_MEASURE
} from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";
import { mapState } from "vuex";
export default {
  components: {
    measurSelectModal,
    pagination
  },
  props: {
    /**
     * false是编辑
     * true查看
     */
    editOrLook: {
      type: Boolean,
      default: false
    },
    markId: String
  },
  mounted() {
    this.getEquipmentEptMeasure();
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    }),
    getDict() {
      return dictname => {
        return this.dict[dictname];
      };
    }
  },
  methods: {
    //寄存器类型转换
    registerTypeFormatter(value) {
      let dictLabel = "";
      this.registerTypeList.forEach(item => {
        if (item.value == value) {
          dictLabel = item.label;
        }
      });
      return dictLabel;
    },
    // 数据类型转字符串
    dataTypeFormatter(value) {
      let dictLabel = "";
      this.dict.data_type.forEach(item => {
        if (item.dictValue == value) {
          dictLabel = item.dictLabel;
        }
      });
      return dictLabel;
    },
    rowEdit(value) {
      if (this.editrow) {
        value.editflag = true;
        this.editrow = false;
      } else {
        this.$message({
          message: "请将现有的修改或者取消",
          type: "warning"
        });
      }
    },
    cancelRow() {
      this.editrow = true;
      this.getEquipmentEptMeasure();
    },
    // 量测量分类转字符串
    typeFormatter(row) {
      let dictLabel = "";
      this.dict.measurement_type.forEach(item => {
        if (item.dictValue == row.type) {
          dictLabel = item.dictLabel;
        }
      });
      return dictLabel;
    },
    //打开量测量的弹框
    openTransfer() {
      this.transferModal = true;
    },
    //参数地址修改
    checkaddress(data) {
      if (data.ratioTransfer < 0.001 || data.ratioTransfer > 1000) {
        this.$message.error({
          message: "请输入0.001~1000的数字",
          type: "success"
        });
      } else {
        UPDATE_EPT_MEASURE(data).then(e => {
          if (e.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            data.editflag = false;
            this.editrow = true;
          }
        });
      }
    },
    //新增预设告警量
    addEptAlarm(data) {
      var params = {
        equipmentId: data.equipmentId,
        equipmentMeasureId: data.id,
        measureParamId: data.measureParamId,
        type: data.type
      };
      ADD_EPT_ALARM(params).then(e => {
        if (e.code == 200) {
          data.hasAlarm = 1;
        }
      });
    },
    //删除选择的量测量
    delectmeasure(data) {
      data.editflag = false;
      this.editrow = true;
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "会删除相应的告警量",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          DEL_MEASERE(data.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getEquipmentEptMeasure();
          });
        })
        .catch(() => {});
    },

    //量测量参数分页
    measureCurrent(e) {
      this.measure.pageNum = e;
      this.getEquipmentEptMeasure();
    },
    handleSizeChange(val) {
      this.measure.pageNum = 1;
      this.measure.pageSize = val;
      this.getEquipmentEptMeasure();
    },
    //  查询测量参数列表
    getEquipmentEptMeasure(id = this.markId) {
      return new Promise(resolve => {
        GET_EQUIPMENT_QUERYEPT_MEASURE(id, {
          pageNum: this.measure.pageNum,
          pageSize: this.measure.pageSize
        }).then(res => {
          res.rows.forEach(i => {
            i["editflag"] = false;
          });
          this.measure.TableData = res.rows;
          this.measure.totalNum = res.total;
        });
        resolve();
      });
    }
  },
  data() {
    return {
      // 只能修改一个
      editrow: true,
      //穿梭框的信息
      transferModal: false,
      //测量参数的表格
      measure: {
        TableData: [],
        pageNum: 1,
        pageSize: 10,
        totalNum: 0
      },
      //寄存器类型列表
      registerTypeList: [
        {
          label: "线圈寄存器",
          value: 1
        },
        {
          label: "离散输入寄存器",
          value: 2
        },
        {
          label: "保持寄存器",
          value: 3
        },
        {
          label: "输入寄存器",
          value: 4
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
.measure_table {
  padding: 10px;
  ::v-deep table {
    .cell {
      font-size: 10px;
      color: white;
    }
  }
  .tab_option {
    margin-bottom: 8px;
    button {
      font-size: 10px;
    }
  }
}
</style>
