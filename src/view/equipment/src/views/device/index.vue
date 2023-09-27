<!--设备管理-->
<template>
  <div class="device">
    <company v-if="companyflag" ref="company"></company>
    <power v-if="powerflag" ref="power"></power>
    <panel v-if="panelflag" ref="panel"></panel>
    <interval v-if="intervalflag" ref="interval"></interval>
    <device v-if="deviceflag" ref="device"></device>
    <voltage v-if="voltageflag" ref="voltage"></voltage>
  </div>
</template>
<script>
// 配电设备 3
// 监控设备 7
// 通讯设备 10
// 变压器 4
// 屏柜 5
// 底层设备 6
// 表计 8
// 动环监控 9
// 通讯终端 11
// 配电室 13
// 间隔 14
import company from "./company";
import power from "./power";
import panel from "./panel";
import interval from "./interval";
import device from "./device";
import voltage from "./voltage";
// import * as deviceServe from "@/common/api/device/device";
export default {
  mounted() {
    var to = this.$route;
    if (to.params.action != "updata") {
      this.initcomponent();
      if (!to.params.query) return;
      var decodeQuery = this.decode(to.params.query);
      var queryArray = decodeQuery.split("-");
      if (queryArray[decodeQuery.split("-").length - 1] != "") {
        this.paramsId = queryArray;
      } else {
        this.paramsId = queryArray.filter((i) => {
          return i != "";
        });
      }
      switch (this.paramsId.length) {
        case 1:
          this.companyflag = true;
          this.$nextTick(() => {
            this.$refs.company.initCompany();
          });
          break;
        case 2:
          this.powerflag = true;
          this.$nextTick(() => {
            this.$refs.power.initPower();
          });
          break;
        case 3:
          var category = sessionStorage.getItem("category");
          //这里要多做判断,变压器、动环监控
          if (category == 4) {
            this.voltageflag = true;
            this.$nextTick(() => {
              this.$refs.voltage.initvoltage();
            });
          } else if (category == 9 || category == 11) {
            console.log("清空");
          } else {
            this.panelflag = true;
            this.$nextTick(() => {
              this.$refs.panel.initPanel();
            });
          }
          break;
        case 4:
          this.intervalflag = true;
          this.$nextTick(() => {
            this.$refs.interval.initInterval();
          });
          break;
        case 5:
          this.deviceflag = true;
          this.$nextTick(() => {
            this.$refs.device.initDevice();
          });
          break;
      }
    }
  },
  beforeRouteUpdate(to, form, next) {
    next();
    var decodeQuery = this.decode(to.params.query);

    if (to.params.action != "updata") {
      this.initcomponent();
      if (!decodeQuery) return;
      var queryArray = decodeQuery.split("-");
      if (queryArray[decodeQuery.split("-").length - 1] != "") {
        this.paramsId = queryArray;
      } else {
        this.paramsId = queryArray.filter((i) => {
          return i != "";
        });
      }

      this.$nextTick(() => {
        switch (this.paramsId.length) {
          case 1:
            this.companyflag = true;
            this.$nextTick(() => {
              this.$refs.company.initCompany();
            });
            break;
          case 2:
            this.powerflag = true;
            this.$nextTick(() => {
              this.$refs.power.initPower();
            });
            break;
          case 3:
            var category = sessionStorage.getItem("category");
            //这里要多做判断,变压器、动环监控
            if (category == 4) {
              this.voltageflag = true;
              this.$nextTick(() => {
                this.$refs.voltage.initvoltage();
              });
            } else if (category == 9 || category == 11) {
              console.log("清空");
            } else {
              this.panelflag = true;
              this.$nextTick(() => {
                this.$refs.panel.initPanel();
              });
            }
            break;
          case 4:
            this.intervalflag = true;
            this.$nextTick(() => {
              this.$refs.interval.initInterval();
            });
            break;
          case 5:
            this.deviceflag = true;
            this.$nextTick(() => {
              this.$refs.device.initDevice();
            });
            break;
        }
      });
    }
  },
  components: { company, power, panel, interval, device, voltage },
  data() {
    return {
      paramsId: "",
      //企业
      companyflag: "",
      //配电室
      powerflag: "",
      //屏柜
      panelflag: "",
      //间隔
      intervalflag: "",
      //设备
      deviceflag: "",
      //变压器
      voltageflag: "",
    };
  },
  methods: {
    initcomponent() {
      this.companyflag = "";
      //配电室
      this.powerflag = "";
      //屏柜
      this.panelflag = "";
      //间隔
      this.intervalflag = "";
      //设备
      this.deviceflag = "";
      //变压器
      this.voltageflag = "";
    },
  },
};
</script>
<style lang="scss" scoped>
.device {
  padding: 15px 20px 20px 20px;
  ::v-deep .action {
    margin-bottom: 10px;
    .el-button {
      min-height: 31.6px;
      span {
        font-weight: normal;
        font-size: 14px;
      }
    }
  }
  ::v-deep .device_infor {
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
  ::v-deep .device_table {
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
}
</style>
<style lang="scss">
.el-dialog__wrapper.device {
  .el-dialog__header {
    margin-bottom: 20px;
  }
  .el-dialog__body {
    padding: 0 20px;
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
              .avatar-uploader {
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
            }
            .el-input {
              width: 130px;
            }
          }
        }
      }
      .el-form-item {
        .el-form-item__label {
          line-height: 30px;
          padding-left: 10px;
        }
        .el-form-item__content {
          .el-input {
            .el-input__inner {
              height: 30px;
              line-height: 30px;
            }

            .el-input__icon {
              line-height: 30px;
            }
          }
        }
      }
    }
    .division {
      border-bottom: 1px solid #2a80b1;
      padding-bottom: 10px;
      color: #0ceaf3;
      font-size: 12px;
      margin-bottom: 20px;
    }
  }
}
</style>
