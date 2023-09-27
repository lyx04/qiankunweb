// 新建型号与复制型号
<template>
  <div class="newandcopy">
    <common-modal
      width="1200px"
      @on-closed="$emit('update:show', false)"
      :visible="show"
      customClass="Maxform"
    >
      <template slot="head">
        <span>{{ newOrCopy ? "复制" : "新建" }}型号</span>
      </template>
      <template slot="body">
        <modal-head
          ref="modalhead"
          :active.sync="active"
          :devType="devType"
        ></modal-head>
        <div class="center" :class="{ nocenter: active != 1 }">
          <!-- 基本信息 -->
          <el-form
            class="paddingTop"
            v-show="active == 1"
            :rules="InfoRules"
            :model="InfoForm"
            label-width="120px"
            ref="Info"
          >
            <el-form-item prop="euqiptreeId" label="设备类型：">
              <template v-if="newOrCopy">
                <span>{{ InfoForm.equipName }}</span>
              </template>
              <template v-else>
                <el-select v-model="InfoForm.euqiptreeId" placeholder="请选择">
                  <el-option
                    v-for="item in InfoData.euqiptreeId"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  ></el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item prop="factory" class="font" label="厂家：">
              <template v-if="devType">
                <el-input
                  maxlength="20"
                  v-model.trim="InfoForm.factory"
                ></el-input>
                <p>提示：请填写完整厂家名称</p>
              </template>
              <template v-else>
                <el-select v-model="InfoForm.factory">
                  <el-option
                    v-for="item in InfoData.factory"
                    :key="item.id"
                    :value="item.id"
                    :label="item.factoryName"
                  ></el-option>
                </el-select>
                <p>提示：新增厂家请先到量测量管理中维护映射关系</p>
              </template>
            </el-form-item>
            <el-form-item label="品牌：" prop="brand">
              <el-input v-model.trim="InfoForm.brand" maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="型号：" prop="modelNum">
              <el-input
                v-model.trim="InfoForm.modelNum"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备图片：">
              <span
                style="color:white;font-size:10px;margin-bottom:20px;display:block;"
                >图片大小不能超过8M,最多可上传2张<br />
                <span>支持格式:JPEG,BMP,PNG</span></span
              >
              <el-upload
                class="avatar-uploader"
                action=""
                :http-request="uploadFile"
                :data="{ imgUrl: 'pic1' }"
                :show-file-list="false"
              >
                <img v-if="InfoForm.pic1" :src="InfoForm.pic1" class="avatar" />
                <span v-else>上传</span>
              </el-upload>
              <el-upload
                class="avatar-uploader"
                action=""
                :data="{ imgUrl: 'pic2' }"
                :http-request="uploadFile"
                :show-file-list="false"
              >
                <img v-if="InfoForm.pic2" :src="InfoForm.pic2" class="avatar" />
                <span v-else>上传</span>
              </el-upload>
            </el-form-item>
          </el-form>
          <!-- 设计参数 -->
          <el-form
            class="tableform paddingTop"
            label-width="0"
            :model="ParForm"
            ref="ParForm"
            v-show="active == 2"
          >
            <el-table
              class="modal"
              stripe
              :data="TableData"
              style="width:100%;"
            >
              <el-table-column prop="paramName" label="参数名称">
                <template slot-scope="scope">
                  <span style="display:none;"></span>
                  <span
                    v-if="scope.row.isMust == 1"
                    style="color:#d81e06;margin-right:4px"
                    >*</span
                  >
                  {{ scope.row.paramName || "--" }}
                </template>
              </el-table-column>
              <el-table-column label="参数值">
                <template slot-scope="scope">
                  <el-form-item
                    :inline-message="true"
                    :prop="scope.row.prop"
                    :rules="
                      scope.row.isMust == 1
                        ? {
                            required: true,
                            message: '请输入' + scope.row.paramName,
                            trigger: 'blur'
                          }
                        : {}
                    "
                  >
                    <template v-if="scope.row.paramType == 1">
                      <el-date-picker
                        v-model="ParForm[scope.row.prop]"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                      >
                      </el-date-picker>
                    </template>
                    <template v-if="scope.row.paramType == 2">
                      <el-input
                        type="number"
                        min="0"
                        v-model.trim="ParForm[scope.row.prop]"
                        placeholder="请输入内容"
                      ></el-input>
                    </template>
                    <template v-if="scope.row.paramType == 3">
                      <el-input
                        v-model.trim="ParForm[scope.row.prop]"
                        placeholder="请输入内容"
                      ></el-input>
                    </template>
                    <template v-if="scope.row.paramType == 4">
                      <el-select
                        v-model="ParForm[scope.row.prop]"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(item, index) in strToArray(
                            scope.row.dataLimitVal
                          )"
                          :key="index"
                          :value="item"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位">
                <template slot-scope="scope">
                  {{ scope.row.unit || "--" }}
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <!-- 测量参数 -->
          <common-measure
            v-if="active == 3"
            :editOrLook="false"
            :markId="InfoForm.id"
          ></common-measure>
          <!-- 告警参数 -->
          <common-alarm
            v-if="active == 4"
            :editOrLook="false"
            :markId="InfoForm.id"
          ></common-alarm>
        </div>
      </template>
      <template slot="foot">
        <el-button @click="cancelModal">取消</el-button>
        <el-button type="primary" v-if="active != 1" @click="before"
          >上一步</el-button
        >
        <el-button type="primary" @click="commonSub">下一步</el-button>
      </template>
    </common-modal>
  </div>
</template>
<script>
import modalHead from "./commonModalHead";
import { uploadFile } from "hlcx-qiankun-commonservice/utils/api/file";
import commonModal from "hlcx-qiankun-commonservice/components/Modal";
import commonAlarm from "./commonAlarm";
import commonMeasure from "./commonMeasure";
import * as equipmnetServe from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";
import { GET_EMA_FACTORY } from "hlcx-qiankun-commonservice/utils/api/EMA/mparam";
import { mapState } from "vuex";
export default {
  components: {
    modalHead,
    commonModal,
    commonAlarm,
    commonMeasure
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    /**
     * false是新建
     * true复制
     */
    newOrCopy: {
      type: Boolean,
      default: false
    },
    classify: Number,
    //复制时候传的参数
    params: Object
  },
  computed: {
    ...mapState({
      dict:state=>state.common.dict
    }),
    devType() {
      switch (this.classify) {
        case 3:
          return true;
        case 7:
          this.loadFactory();
          return false;
        case 10:
          return true;
        default:
          return true;
      }
    }
  },
  mounted() {
    if (this.newOrCopy) {
      this.initCopy();
    } else {
      this.initNew();
    }
  },
  methods: {
    initNew() {
      this.title = "新增";
      this.getTreeNodeSelect().then(() => {
        this.active = 1;
        this.restInfoForm();
        this.restParForm();
      });
    },
    initCopy() {
      this.title = "复制";
      this.active = 1;
      this.restInfoForm();
      this.restParForm();
      this.getTreeNodeSelect().then(() => {
        //基本信息
        this.getEquipmentEptInfo(this.params.id);
      });
    },
    //  查询基本信息详情
    getEquipmentEptInfo(id) {
      return new Promise(resolue => {
        equipmnetServe.GET_EQUIPMENT_QUERYEPTINFO(id).then(res => {
          if (!this.devType) {
            res.data.factory = Number(res.data.factory);
          }
          this.oldInfo = Object.assign({}, res.data);
          res.data.id = null;
          this.InfoForm = res.data;
          resolue();
        });
      });
    },
    //点击取消
    cancelModal() {
      if (this.InfoForm.id) {
        equipmnetServe
          .DELETE_EQUIPMENT_DELEQUIPMENT(this.InfoForm.id)
          .then(() => {
            this.$emit("getEquipment");
            this.$emit("update:show", false);
          });
      } else {
        this.$emit("update:show", false);
      }
    },
    //上一步
    before() {
      this.active -= 1;
      this.backFlag = true;
    },
    //  基本信息重置
    restInfoForm() {
      this.InfoForm = {};
      this.resetForm("Info");
    },
    // 设计参数重置
    restParForm() {
      this.TableData = [];
      this.ParForm = {};
    },
    //加载厂家
    loadFactory() {
      GET_EMA_FACTORY().then(e => {
        this.InfoData.factory = e.rows;
      });
    },

    //获取设备类型叶子节点列表
    getTreeNodeSelect() {
      return new Promise(resolve => {
        equipmnetServe.QUERY_TREE_NODE_SELECT(this.classify).then(e => {
          this.InfoData.euqiptreeId = e.data;
          resolve();
        });
      });
    },
    // 自定义上传
    uploadFile(params) {
      const isLt8M = params.file.size / 1024 / 1024 < 8;
      if (params.file.type.indexOf("image/") === -1) {
        this.$message.error("上传头像图片只能是gif,jpeg,jpg,png,bmp 格式!");
        return false;
      }
      if (!isLt8M) {
        this.$message.error("上传头像图片大小不能超过 8M!");
        return false;
      }
      let fd = new FormData();
      fd.append("file", params.file);
      fd.append("bucket", "equipment");
      uploadFile(fd).then(res => {
        this.$set(this.InfoForm, params.data.imgUrl, res.data);
      });
    },

    //字符串转数组
    strToArray(str) {
      return str.split(",");
    },

    // 设计参数详情
    getRenderData(id, euqiptreeId) {
      var arr = [];
      equipmnetServe.GET_EQUIPMENT_QUERYEPTPARAM(id, euqiptreeId).then(res => {
        arr = res.data;
        arr.forEach(item => {
          item["prop"] =
            "domains-" + this.InfoForm.id + "-" + item.equiptypeParamId;
          this.$set(
            this.ParForm,
            "domains-" + this.InfoForm.id + "-" + item.equiptypeParamId,
            item.paramVal || item.defaultVal
          );
        });
        this.TableData = arr;
      });
    },
    //基础信息提交
    CommonInfor() {
      return new Promise(resolve => {
        // 提交基本信息页面
        this.$refs.Info.validate(e => {
          if (e) {
            if (this.newOrCopy && !this.backFlag) {
              this.InfoForm.id = null;
            }
            equipmnetServe.ADD_DEP_INFO(this.InfoForm).then(e => {
              if (e.code == 200) {
                if (this.InfoForm.id) {
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                  this.active = 2;
                } else {
                  this.InfoForm.id = e.data;
                  if (this.newOrCopy) {
                    this.afterCopyInfor();
                  } else {
                    this.getRenderData(e.data, this.InfoForm.euqiptreeId);
                    this.active = 2;
                  }
                }
              }
              resolve();
            });
          }
        });
      });
    },
    //设计参数提交
    CommonData() {
      this.$refs.ParForm.validate(e => {
        if (e) {
          var subArray = [];
          for (var i in this.ParForm) {
            var paramsArr = i.split("-");
            subArray.push({
              equipmentId: paramsArr[1],
              equiptypeParamId: paramsArr[2],
              paramVal: this.ParForm[i]
            });
          }
          equipmnetServe.ADD_EPT_PARAM(subArray).then(() => {
            if (this.devType) {
              this.$emit("getEquipment");
              this.$emit("update:show", false);
              this.$message({
                message: "新增成功",
                type: "success"
              });
              // 这里是配电设备和监控设备的提交
            } else {
              this.active = 3;
            }
          });
        }
      });
    },
    //测量参数的下一步
    measureSub() {
      this.active = 4;
    },

    //告警参数提交
    alarmSub() {
      this.$emit("getEquipment");
      this.$emit("update:show", false);
    },
    // 复制操作基本信息提交后的操作
    afterCopyInfor() {
      this.getRenderData(this.oldInfo.id, this.oldInfo.euqiptreeId);
      this.active = 2;
      if (!this.devType) {
        equipmnetServe.COPY_MEASUR(this.oldInfo.id, this.InfoForm.id);
      }
    },
    // 提交
    commonSub() {
      switch (this.active) {
        case 1:
          //新增、修改设备类类型基础信息
          this.CommonInfor();
          break;
        case 2:
          //修改设备类类型型号层数据
          this.CommonData();
          break;
        case 3:
          this.measureSub();
          break;
        case 4:
          this.alarmSub();
          break;
      }
    }
  },
  data() {
    return {
      that: this,
      backFlag: false,
      active: 1,
      //复制操作，保存原数据的基本信息
      oldInfo: {},
      //基本信息填写的校验
      InfoRules: {
        euqiptreeId: [
          {
            required: true,
            message: "请选择设备类型",
            trigger: "blur"
          }
        ],
        factory: [
          { required: true, message: "请填写完整厂家名称", trigger: "blur" }
        ],
        brand: [{ required: true, message: "请输入品牌名称", trigger: "blur" }],
        modelNum: [{ required: true, message: "请输入型号", trigger: "blur" }]
      },
      //基本信息填写
      InfoForm: {},
      //基本信息源数据
      InfoData: {
        euqiptreeId: [],
        factory: []
      },

      //设计参数填写
      ParForm: {},
      //列表的数据
      tableData: []
    };
  }
};
</script>
<style lang="scss" scoped>
.report {
  padding: 0 15px;
  ::v-deep .el-select {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      font-size: 10px;
    }
    .el-input__icon {
      line-height: 30px;
    }
    margin-bottom: 20px;
  }
}
.avatar-uploader {
  display: inline-block;
}
.el-dialog__wrapper {
  ::v-deep .el-dialog__body {
    .el-tabs {
      padding: 0 10px;
    }
    .el-pagination {
      .el-pagination__rightwrapper {
        .el-pagination__total {
          font-size: 10px;
        }
        .el-pager li {
          font-size: 10px;
        }
        .el-pagination__jump {
          font-size: 10px;
          .el-input__inner {
            font-size: 10px;
          }
        }
      }
    }

    button {
      padding: 2px 8px;
    }
    table {
      .el-input {
        .el-input__icon {
          line-height: 20px;
        }
      }
    }
  }
}
</style>
