// 修改型号与查看型号
<template>
  <div class="editandlook">
    <common-modal
      width="1200px"
      @on-closed="$emit('update:show', false)"
      :visible="show"
      customClass="Maxform"
    >
      <template slot="head">
        <span>{{ editOrLook ? "查看" : "编辑" }}型号</span>
      </template>
      <template slot="body">
        <modal-head
          headType="e"
          ref="modalhead"
          :active.sync="active"
          :devType="devType"
          :editbasic="editbasic"
        ></modal-head>
        <div class="center" :class="{ nocenter: active != 1 }">
          <!-- 基本信息 -->
          <el-form
            class="paddingTop"
            v-show="active == 1"
            :rules="editOrLook ? [] : InfoRules"
            :model="InfoForm"
            label-width="120px"
            ref="Info"
          >
            <el-form-item prop="euqiptreeId" label="设备类型：">
              <template v-if="editOrLook">
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
              <template v-if="editOrLook">
                <template v-if="!devType">
                  <span>{{ filterGroup(InfoForm.factory) }}</span>
                </template>
                <template v-else>
                  <span>{{ InfoForm.factory }}</span>
                </template>
              </template>
              <template v-else>
                <template v-if="devType">
                  <el-input
                    v-model.trim="InfoForm.factory"
                    maxlength="20"
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
              </template>
            </el-form-item>
            <el-form-item label="品牌：" prop="brand">
              <template v-if="editOrLook">
                <span>{{ InfoForm.brand }}</span>
              </template>
              <template v-else>
                <el-input
                  v-model.trim="InfoForm.brand"
                  maxlength="8"
                ></el-input>
              </template>
            </el-form-item>
            <el-form-item label="型号：" prop="modelNum">
              <template v-if="editOrLook">
                <span>{{ InfoForm.modelNum }}</span>
              </template>
              <template v-else>
                <el-input
                  v-model.trim="InfoForm.modelNum"
                  maxlength="20"
                ></el-input>
              </template>
            </el-form-item>
            <el-form-item label="设备图片：">
              <span
                v-if="!editOrLook"
                style="color:white;font-size:10px;margin-bottom:20px;display:block;"
                >图片大小不能超过8MB,最多可上传2张<br />
                <span>支持格式:JPEG,BMP,GIF,PNG</span></span
              >
              <el-upload
                v-if="!editOrLook"
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
                v-if="!editOrLook"
                class="avatar-uploader"
                action=""
                :data="{ imgUrl: 'pic2' }"
                :http-request="uploadFile"
                :show-file-list="false"
              >
                <img v-if="InfoForm.pic2" :src="InfoForm.pic2" class="avatar" />
                <span v-else>上传</span>
              </el-upload>
              <template v-if="editOrLook">
                <el-image
                  v-if="InfoForm.pic1"
                  :src="InfoForm.pic1"
                  class="avatar"
                  fit="contain"
                  :preview-src-list="[InfoForm.pic1, InfoForm.pic2]"
                ></el-image>
                <el-image
                  fit="contain"
                  v-if="InfoForm.pic2"
                  :src="InfoForm.pic2"
                  :preview-src-list="[InfoForm.pic1, InfoForm.pic2]"
                  class="avatar"
                ></el-image>
              </template>
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
                  <template v-if="!editOrLook && scope.row.isMust == 1">
                    <span style="color:#d81e06;margin-right:4px">*</span>
                    {{ scope.row.paramName }}
                  </template>
                  <template v-else>
                    {{ scope.row.paramName }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="参数值">
                <template slot-scope="scope">
                  <el-form-item
                    :inline-message="true"
                    :prop="scope.row.prop"
                    :rules="
                      editOrLook
                        ? {}
                        : scope.row.isMust == 1
                        ? {
                            required: true,
                            message: '请输入' + scope.row.paramName,
                            trigger: 'blur'
                          }
                        : {}
                    "
                  >
                    <template v-if="scope.row.paramType == 1">
                      <template v-if="editOrLook">
                        <span>{{ ParForm[scope.row.prop] || "--" }}</span>
                      </template>
                      <template v-else>
                        <el-date-picker
                          v-model="ParForm[scope.row.prop]"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                      </template>
                    </template>
                    <template v-if="scope.row.paramType == 2">
                      <template v-if="editOrLook">
                        <span>{{ ParForm[scope.row.prop] || "--" }}</span>
                      </template>
                      <template v-else>
                        <el-input
                          type="number"
                          min="0"
                          v-model.trim="ParForm[scope.row.prop]"
                          placeholder="请输入内容"
                        ></el-input>
                      </template>
                    </template>
                    <template v-if="scope.row.paramType == 3">
                      <template v-if="editOrLook">
                        <span>{{ ParForm[scope.row.prop] || "--" }}</span>
                      </template>
                      <template v-else>
                        <el-input
                          v-model.trim="ParForm[scope.row.prop]"
                          placeholder="请输入内容"
                        ></el-input>
                      </template>
                    </template>
                    <template v-if="scope.row.paramType == 4">
                      <template v-if="editOrLook">
                        <span>{{ ParForm[scope.row.prop] || "--" }}</span>
                      </template>
                      <template v-else>
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
            :editOrLook="editOrLook"
            :markId="InfoForm.id"
          ></common-measure>
          <!-- 告警参数 -->
          <common-alarm
            v-if="active == 4"
            :editOrLook="editOrLook"
            :markId="InfoForm.id"
          ></common-alarm>
        </div>
      </template>
      <template slot="foot">
        <template v-if="editOrLook || params.params">
          <el-button @click="$emit('update:show', false)">关闭</el-button>
        </template>
        <template v-else>
          <el-button @click="$emit('update:show', false)">取消</el-button>
          <el-button type="primary" @click="commonSub"> 保存</el-button>
        </template>
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
    commonMeasure,
    commonAlarm
  },

  props: {
    show: {
      type: Boolean,
      default: false
    },
    /**
     * false是编辑
     * true查看
     */
    editOrLook: {
      type: Boolean,
      default: false
    },
    //当前所属分类
    classify: Number,
    //点击的信息行
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
    },

    //过滤厂家
    filterGroup() {
      return val => {
        if (this.InfoData.factory.length) {
          var value = this.InfoData.factory.filter(i => {
            return i.id == val;
          });
          if (value.length) {
            return value[0].factoryName;
          }
        } else {
          return "";
        }
      };
    }
  },
  mounted() {
    if (this.editOrLook) {
      this.initLook();
    } else {
      this.initEdit();
    }
  },
  methods: {
    initEdit() {
      if (this.params.params) {
        this.editbasic = "measure";
        this.getEquipmentEptInfo(this.params.id).then(() => {
          this.active = 3;
        });
      } else {
        this.active = 1;
        this.editbasic = "basic";
        this.getTreeNodeSelect().then(() => {
          this.getEquipmentEptInfo(this.params.id).then(() => {
            this.restParForm();
            this.getRenderData(this.InfoForm.id, this.InfoForm.euqiptreeId);
          });
        });
      }
    },
    initLook() {
      // 获取叶子节点渲染设备类型
      this.getTreeNodeSelect().then(() => {
        this.getEquipmentEptInfo(this.params.id).then(() => {
          this.restParForm();
          this.getRenderData(this.InfoForm.id, this.InfoForm.euqiptreeId);
        });
      });
      this.editbasic = "look";
      this.active = 1;
    },
    //  查询基本信息详情
    getEquipmentEptInfo(id) {
      return new Promise(resolue => {
        equipmnetServe.GET_EQUIPMENT_QUERYEPTINFO(id).then(res => {
          if (!this.devType) {
            res.data.factory = Number(res.data.factory);
          }
          this.InfoForm = res.data;
          resolue();
        });
      });
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
        console.log(arr);
        this.TableData = arr;
      });
    },
    //基础信息提交
    CommonInfor() {
      return new Promise(resolve => {
        // 提交基本信息页面
        this.$refs.Info.validate(e => {
          if (e) {
            equipmnetServe.ADD_DEP_INFO(this.InfoForm).then(e => {
              if (e.code == 200) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                resolve();
              }
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
            this.$emit("getEquipment");
            this.$emit("update:show", false);
            this.$message({
              message: "修改成功",
              type: "success"
            });
          });
        }
      });
    },
    // 提交
    commonSub() {
      this.CommonInfor().then(() => {
        this.CommonData();
      });
    }
  },
  data() {
    return {
      that: this,
      active: 1,
      editbasic: true,

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
