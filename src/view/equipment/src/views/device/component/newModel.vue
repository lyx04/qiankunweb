<template>
  <div>
    <commonModal
      class="device"
      @on-closed="cancelForm"
      customClass="Maxform"
      :visible="addModal"
    >
      <template slot="head">
        <span>{{ title }}</span>
      </template>
      <template slot="body">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          label-width="100px"
          :inline="true"
          ref="addPower"
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
          <p class="division">设计参数</p>
          <el-form-item
            :rules="
              item.isMust == 1
                ? {
                    required: true,
                    message: '请输入' + item.paramName,
                    trigger: 'blur'
                  }
                : {}
            "
            v-for="(item, index) in paramsList"
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
          </el-form-item>
          <el-form-item label="备注" class="remarks" prop="remark">
            <el-input type="textarea" v-model.trim="addForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="地址" class="map" v-if="map">
            <el-input disabled v-model.trim="addForm.address"></el-input>
            <el-button plain @click="mapModal = true"> 选择定位</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="powerSub">确认</el-button>
      </template>
    </commonModal>
<!--    <map-modal-->
<!--      :dialogVisibleMap="mapModal"-->
<!--      @submit-address="MapSub"-->
<!--      @on-closed="MapClose"-->
<!--    ></map-modal>-->
  </div>
</template>
<script>
import commonModal from "hlcx-qiankun-commonservice/components/Modal";
// import MapModal from "@/system/components/AddMapModal";
import * as deviceServer from "hlcx-qiankun-commonservice/utils/api/equipment/device";
export default {
  components: { commonModal, },
  props: {
    active: Boolean,
    id: String,
    category: Number,
    title: {
      type: String,
      default: "新增配电室"
    },
    map: Boolean,
    orgid: String
  },
  mounted() {
    this.addModal = this.active;
    this.addPower();
  },
  data() {
    return {
      addModal: false,
      //地图模态框
      mapModal: false,
      addForm: {
        name: "",
        state: "",
        launchTime: "",
        address: "",
        //经度
        lng: "",
        //维度
        lat: "",
        remark: ""
      },
      //模态框校验
      addFormRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        state: [{ required: true, message: "请选择运行状态", trigger: "blur" }]
      }
    };
  },
  methods: {
    //打开弹框之前获取对应的设备参数
    addPower() {
      if (this.id) {
        deviceServer.QUERY_ROOM_INFO(this.id).then(e => {
          this.addForm = e.data;
          this.paramsList = this.addForm.paramList;
          this.paramsList.forEach(i => {
            this.$set(i, "prop", "domains-" + i.equiptypeParamId);
            this.$set(
              this.addForm,
              "domains-" + i.equiptypeParamId,
              i.paramVal || i.defaultVal
            );
          });
          this.addModal = true;
        });
      } else {
        deviceServer.QUERY_PARAMS_INFO(this.category).then(e => {
          this.paramsList = e.data;
          this.paramsList.forEach(i => {
            this.$set(i, "prop", "domains-" + i.equiptypeParamId);
            this.$set(
              this.addForm,
              "domains-" + i.equiptypeParamId,
              i.paramVal || i.defaultVal
            );
          });
          this.addModal = true;
        });
      }
    },
    //新增配电室
    powerSub() {
      console.warn(this.decode(this.$route.params.query).split("-")[0]);
      // eslint-disable-next-line no-unused-vars
      this.$refs.addPower.validate(e => {
        if (e) {
          var parent = this.decode(this.$route.params.query).split("-");
          this.addForm.paramList = [];
          this.addForm.category = this.category;
          this.addForm.euqiptreeId = this.paramsList[0].euqiptreeId;
          this.addForm.orgId = this.orgid;
          this.addForm.parentId = this.id
            ? parent[parent.length - 2]
            : parent[parent.length - 1];
          this.addForm["id"] = this.id ? this.id : "";
          for (var i in this.addForm) {
            if (i.indexOf("domains") > -1) {
              var obj = {
                equiptypeParamId: i.split("-")[1],
                paramVal: this.addForm[i]
              };
              this.addForm.paramList.push(obj);
            }
          }
          this.$emit("subForm", this.addForm);
          // deviceServer.ADD_ELEROOM(this.addForm).then(e => {
          //   if (e.code == 200) {
          //     this.addModal = false;
          //     this.$router.push({
          //       params: {
          //         action: "updata"
          //       }
          //     });
          //   }
          // });
        }
      });
    },
    cancelForm() {
      this.$emit("cancelForm");
    },
    //地图点击搜索回显
    MapSub(e) {
      this.addForm.address = e.address;
      this.addForm.lng = e.longitude;
      this.addForm.lat = e.latitude;
    },
    //关闭地图弹窗
    MapClose() {
      this.mapModal = false;
    },
    //字符串转数组
    strToArray(str) {
      return str.split(",");
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog__wrapper {
  ::v-deep .Maxform {
  }
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
</style>
