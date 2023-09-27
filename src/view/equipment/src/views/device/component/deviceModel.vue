<template>
  <commonModal
    class="device"
    @on-closed="cancelForm"
    customClass="Maxform"
    :visible="addModal.active"
  >
    <template slot="head">
      <span>{{ title }}</span>
    </template>
    <template slot="body">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="deviceForm"
        label-width="100px"
        :inline="true"
      >
        <el-form-item label="名称" prop="name">
          <el-input maxlength="20" v-model.trim="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="运行状态" prop="state">
          <el-select v-model="addForm.state">
            <el-option label="在运" value="0"></el-option>
            <el-option label="停运" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投运日期" prop="launchTime">
          <el-date-picker
            v-model="addForm.launchTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <p class="division"></p>
        <div class="custom">
          <div class="imgs">
            <el-form-item label="">
              <template v-if="id >= 0">
                <img :src="addForm.pic1" class="avatar" />
              </template>
              <template v-else>
                <img :src="etmParam.pic1" class="avatar" />
              </template>
            </el-form-item>
            <el-form-item label="">
              <template v-if="id >= 0">
                <img :src="addForm.pic2" class="avatar" />
              </template>
              <template v-else>
                <img :src="etmParam.pic2" class="avatar" />
              </template>
            </el-form-item>
          </div>
          <div class="device_infor">
            <p>设备信息</p>
            <el-form-item label="设备类型" prop="categoryName">
              <el-input disabled v-model.trim="addForm.categoryName"></el-input>
            </el-form-item>
            <el-form-item label="厂家" prop="factory">
              <el-select v-model="addForm.factory" @change="factoryChange">
                <el-option
                  v-for="(item, index) in addModal.factoryList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="addForm.brand" @change="brandChange">
                <el-option
                  v-for="(item, index) in addModal.brandList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="型号" prop="modelNum">
              <el-select v-model="addForm.modelNum" @change="modelChange">
                <el-option
                  v-for="(item, index) in addModal.modelList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="params">
            <p>设计参数</p>
            <el-form-item
              :title="item.paramName"
              :rules="
                item.isMust == 1
                  ? {
                      required: true,
                      message:
                        (item.paramType == 2 || item.paramType == 3
                          ? '请输入'
                          : '请选择') + item.paramName,
                      trigger: 'blur'
                    }
                  : {}
              "
              v-for="(item, index) in eleParamList"
              :key="index"
              :label="item.paramName"
              :prop="item.prop"
            >
              <template v-if="item.paramType == 1">
                <el-date-picker
                  v-model="addForm[item.prop]"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </template>
              <template v-if="item.paramType == 2">
                <el-input
                  type="number"
                  min="0"
                  v-model.trim="addForm[item.prop]"
                  placeholder="请输入内容"
                ></el-input>
              </template>
              <template v-if="item.paramType == 3">
                <el-input
                  v-model.trim="addForm[item.prop]"
                  placeholder="请输入内容"
                ></el-input>
              </template>
              <template v-if="item.paramType == 4">
                <el-select v-model="addForm[item.prop]" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in strToArray(item.dataLimitVal)"
                    :key="index"
                    :value="item"
                  ></el-option>
                </el-select>
              </template>
              <template v-if="item.paramType == 5">
                <template v-if="category == 32">
                  <el-select
                    @visible-change="videoParamsChange"
                    v-model="addForm[item.prop]"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in termainalList"
                      :key="item.id"
                      :label="item.deviceName"
                      :value="item.deviceSerial"
                      :disabled="item.allocation == 1 ? true : false"
                    >
                      <span style="float: left">{{ item.deviceName }}</span>
                      <span
                        style="float: right; color: white; font-size: 13px"
                        >{{ item.status == 1 ? "在线" : "离线" }}</span
                      >
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  <el-select
                    v-model="addForm[item.prop]"
                    @change="termainaChange"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in termainalList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </template>
              </template>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                v-model.trim="addForm.remark"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="item.paramName"
              v-for="item in etmParam.equipmentList"
              :key="item.equiptypeParamId"
              :title="item.paramName"
            >
              <div class="el-input is-disabled">
                <input
                  type="text"
                  class="el-input__inner"
                  disabled
                  :value="item.paramVal || item.defaultVal"
                />
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </template>
    <template slot="foot">
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="deviceSub">保存</el-button>
    </template>
  </commonModal>
</template>
<script>
// 变压器 4
// 屏柜 5
// 底层设备 6
// 表计 8
// 动环监控 9
// 通讯终端 11
// 配电室 13
// 间隔 14
// 视频 32
import {
  GET_FACTORY_SELECT,
  GET_BRAND_SELECT,
  GET_MODEL_SELECT
} from "hlcx-qiankun-commonservice/utils/api/equipment/equipment";
import commonModal from "hlcx-qiankun-commonservice/components/Modal";
import * as deviceServe from "hlcx-qiankun-commonservice/utils/api/equipment/device";
export default {
  components: { commonModal },
  props: {
    id: String,
    category: Number,
    euqiptreeId: Number,
    categoryName: String,
    active: Boolean,
    orgid: String,
    title: {
      type: String,
      default: "新增屏柜"
    }
  },
  mounted() {
    this.addModal.active = this.active;
    this.addForm.euqiptreeId = this.euqiptreeId;
    this.addForm.category = this.category;
    this.addForm.categoryName = this.categoryName;
    this.getFactorySelect();
    if (this.id) {
      deviceServe.GET_DEVICE_INFO(this.id).then(e => {
        for (var i in e.data) {
          this.addForm[i] = e.data[i];
        }
        this.getEleParam();
        this.linkage();
      });
    } else {
      this.getEleParam();
    }
    if (this.category == 9 || this.category == 8) {
      deviceServe
        .GET_METER_SELECT(
          this.decode(this.$route.params.query).split("-")[1],
          11
        )
        .then(e => {
          e.data.forEach(i => {
            i.id = String(i.id);
          });
          this.termainalList = e.data;
        });
    }
  },

  methods: {
    //通过设备的厂家信息查询品牌型号
    linkage() {
      GET_BRAND_SELECT(this.addForm.euqiptreeId, this.addForm.factory).then(
        e => {
          this.addModal.brandList = e.data;
        }
      );
      GET_MODEL_SELECT(
        this.addForm.euqiptreeId,
        this.addForm.factory,
        this.addForm.brand
      ).then(e => {
        this.addModal.modelList = e.data;
      });
    },
    //关闭弹框
    cancelForm() {
      this.resetForm("deviceForm");
      this.etmParam = {};
      this.$emit("cancelForm");
    },
    // 获取类型下的厂家
    getFactorySelect() {
      GET_FACTORY_SELECT(this.addForm.euqiptreeId).then(e => {
        this.addModal.factoryList = e.data;
      });
    },
    //厂家选择后查询品牌
    factoryChange() {
      GET_BRAND_SELECT(this.addForm.euqiptreeId, this.addForm.factory).then(
        e => {
          this.addModal.brandList = e.data;
          this.addForm.brand = "";
          this.addForm.modelNum = "";
        }
      );
    },
    // 品牌选择后查询型号
    brandChange() {
      GET_MODEL_SELECT(
        this.addForm.euqiptreeId,
        this.addForm.factory,
        this.addForm.brand
      ).then(e => {
        this.addModal.modelList = e.data;
        this.addForm.modelNum = "";
      });
    },
    // 型号选择后查询型号参数
    modelChange() {
      deviceServe
        .GET_ETM_PARAM_INFO(
          this.addForm.factory,
          this.addForm.brand,
          this.addForm.modelNum
        )
        .then(e => {
          this.etmParam = e.data;
        });
    },
    //获取设备层参数
    getEleParam() {
      if (this.id) {
        this.eleParamList = this.addForm.roomList;
        this.eleParamList.forEach(i => {
          this.$set(i, "prop", "domains-" + i.equiptypeParamId);
          this.$set(
            this.addForm,
            "domains-" + i.equiptypeParamId,
            i.paramVal || i.defaultVal
          );
        });
        this.$set(this.etmParam, "equipmentList", this.addForm.equipmentList);
        //获取设备层参数后，假如是视频，进行序号列表的请求
        if (this.category == 32) {
          this.videoParamsChange(true);
        }
      } else {
        deviceServe.GET_ELE_ROOM_PARAM(this.addForm.euqiptreeId).then(e => {
          this.eleParamList = e.data;
          this.eleParamList.forEach(i => {
            this.$set(i, "prop", "domains-" + i.equiptypeParamId);
            this.$set(
              this.addForm,
              "domains-" + i.equiptypeParamId,
              i.paramVal || i.defaultVal
            );
          });
        });
      }
    },
    //视频序列号展开时通过参数的appkey和secret获取列表
    videoParamsChange(e) {
      if (e) {
        var AppKey = this.eleParamList.filter(i => {
          return i.paramName == "AppKey";
        });
        var Secret = this.eleParamList.filter(i => {
          return i.paramName == "Secret";
        });
        var factory = this.addForm.factory;
        if (
          this.addForm[AppKey[0].prop].length &&
          this.addForm[Secret[0].prop].length &&
          factory.length
        ) {
          deviceServe
            .GET_YINGSHI_DEV_LIST(
              factory,
              this.addForm[AppKey[0].prop],
              this.addForm[Secret[0].prop]
            )
            .then(e => {
              this.termainalList = e.data;
            });
        } else {
          this.$message.error("请选择厂家并填写appkey与secret");
        }
      }
    },
    //连接的通讯终端为350时要触发事件
    termainaChange(e) {
      var device = this.termainalList.filter(i => {
        return i.id == e;
      });
      var communication = this.eleParamList.filter(i => {
        return i.paramName == "通信ID";
      });
      if (device[0].type == "350") {
        this.addForm[communication[0].prop] = device[0].sn;
      }
    },
    //字符串转数组
    strToArray(str) {
      return str.split(",");
    },
    //设备提交
    deviceSub() {
      console.warn(this.decode(this.$route.params.query).split("-")[0]);

      // eslint-disable-next-line no-unused-vars
      this.$refs.deviceForm.validate(e => {
        if (e) {
          var parent = this.decode(this.$route.params.query).split("-");

          var subForm = {
            category: "",
            euqiptreeId: "",
            launchTime: "",
            name: "",
            orgId: this.orgid,
            parentId: this.id
              ? parent[parent.length - 2]
              : parent[parent.length - 1],
            remark: "",
            state: "",
            factory: "",
            brand: "",
            modelNum: "",
            paramList: [],
            id: this.id ? this.id : ""
          };
          for (var i in subForm) {
            if (this.addForm[i]) {
              subForm[i] = this.addForm[i];
            }
          }
          for (var j in this.addForm) {
            if (j.indexOf("domains") > -1) {
              var obj = {
                equiptypeParamId: j.split("-")[1],
                paramVal: this.addForm[j]
              };
              subForm.paramList.push(obj);
            }
          }
          this.$emit("subForm", subForm);
        }
      });
    }
  },
  data() {
    return {
      //设备的参数列表
      eleParamList: [],
      //设备的型号参数列表
      etmParam: {},
      //通讯终端列表
      termainalList: [],
      addModal: {
        active: false,
        title: "",
        factoryList: [],
        brandList: [],
        modelList: []
      },
      addForm: {
        name: "",
        state: "0",
        launchTime: "",
        pic1: "",
        pic2: "",
        category: "",
        euqiptreeId: "",
        categoryName: "",
        factory: "",
        brand: "",
        modelNum: "",
        remark: ""
      },
      addFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        state: [{ required: true, message: "请选择运行状态", trigger: "blur" }],

        factory: [{ required: true, message: "请选择厂家", trigger: "blur" }],
        brand: [{ required: true, message: "请选择品牌", trigger: "blur" }],
        modelNum: [{ required: true, message: "请选择型号", trigger: "blur" }]
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.el-select-dropdown__item.is-disabled:hover {
  background-color: transparent;
}
.el-dialog__wrapper {
  ::v-deep .Maxform {
    .el-dialog__body {
      table {
        .cell {
          padding: 0;
        }
      }
      .el-form {
        .custom {
          font-size: 0;
          padding-left: 20px;
          .imgs {
            display: inline-block;
            width: 100px;
            height: auto;
            .el-form-item {
              .el-form-item__content {
                .avatar {
                  width: 100px;
                  height: 100px;
                  border: 1px solid #01cdf6;
                  border-radius: 10px;
                }
              }
            }
          }
          .device_infor {
            display: inline-block;
            margin-left: 20px;
            width: 202px;
            vertical-align: top;
            height: auto;
            p {
              font-size: 12px;
              color: #0ceaf3;
              margin-bottom: 10px;
            }
            .el-form-item {
              margin-right: 0;
              .el-form-item__label {
                padding-left: 0;
                width: 70px !important;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .el-input {
                width: 130px;
              }
            }
          }
          .params {
            display: inline-block;
            margin-left: 10px;
            vertical-align: top;
            width: 400px;
            height: auto;
            p {
              font-size: 12px;
              color: #0ceaf3;
              margin-bottom: 10px;
            }
            .el-form-item {
              margin-right: 0;
              .el-textarea {
                width: 130px;
                .el-textarea__inner {
                  height: 45px;
                }
              }
              .el-form-item__label {
                padding-left: 0;
                width: 70px !important;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .el-input {
                width: 130px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
