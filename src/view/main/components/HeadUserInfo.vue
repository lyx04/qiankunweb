<template>
  <div>
    <div class="header-user-info">
      <ul>
        <li class="header-user-info-item">
          <div class="info-content">
            <el-dropdown @command="changeCommand">
              <div style="cursor: pointer">
                <i class="iconfont icon-icontouxiang header-icon"></i>
                <span>{{ userInfo.nickName || "--" }}</span>
                <em class="el-icon-arrow-down"></em>
              </div>
              <el-dropdown-menu
                slot="dropdown"
                class="userInfo-dropdown-menu"
                popper-append-to-body="false"
              >
                <el-dropdown-item command="1">修改密码</el-dropdown-item>
                <el-dropdown-item command="2">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </li>
        <li class="header-user-info-item">
          <!---->
          <div class="info-content" id="myPanel" ref="showPanel">
            <el-badge :is-dot="isDot">
              <i
                class="el-icon-message-solid header-icon"
                @click="messageModals"
              ></i>
              <!--消息弹框messageModal-->
              <div class="message-content" v-show="messageIsShowModal">
                <div class="message-list">
                  <ul v-if="messageTotal > 0">
                    <li
                      v-for="(item, index) in messageList"
                      :key="index"
                      @click="messageChange(item, index)"
                    >
                      <div class="message-modal-title">
                        <i class="el-icon-message-solid"></i>{{ item.title }}
                      </div>
                      <el-tooltip
                        :content="item.content"
                        :disabled="
                          item.content && item.content.length > 40
                            ? false
                            : true
                        "
                        class="item"
                        effect="dark"
                        :visible-arrow="false"
                        :open-delay="1000"
                        placement="bottom"
                      >
                        <span>{{ item.content | ellipsis(40) }}</span>
                      </el-tooltip>
                      <label>{{ item.sendTime }}</label>
                    </li>
                  </ul>
                  <div
                    v-if="messageTotal == 0"
                    class="not-message"
                    style="padding: 10px 0"
                  >
                    <i class="iconfont icon-xiaoxi2"></i
                    ><span>还没有新消息</span>
                  </div>
                </div>
                <div class="message-setup">
                  <div class="message-setup-icon" @click="isMessageChange">
                    <i class="iconfont icon-shezhi1"></i>设置
                  </div>
                  <div class="message-mall" @click="messageRouter">
                    全部消息
                  </div>
                </div>
              </div>
            </el-badge>
          </div>
        </li>
        <li class="header-user-info-item">
          <div class="info-content">
            <i class="iconfont icon-bangzhu header-icon"></i>
          </div>
        </li>
        <li
          v-hasPermi="['overview:screen:list']"
          class="btn-none header-user-info-item"
        >
          <div class="info-content" @click="routeOpen('/screen')">
            <i class="iconfont icon-diannao header-icon"></i>
          </div>
        </li>
      </ul>
    </div>
    <modal
      :visible="dialogVisibleChangePassword"
      customClass="customer-modal Miniform"
      @on-closed="dialogVisibleChangePassword = false"
    >
      <template slot="head">
        <span>修改密码</span>
      </template>
      <template slot="body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="164px"
          class="cusomer-ruleForm change-password"
        >
          <el-form-item label="原密码：" prop="password">
            <el-input
              v-model.trim="ruleForm.password"
              :type="flag[0] ? 'text' : 'password'"
              ref="password"
              maxlength="12"
              @copy.native.capture.prevent="handlePaste"
              show-password="true"
              autocomplete="new-password"
            ></el-input>
          </el-form-item>
          <!--请输入新密码-->
          <el-form-item label="请输入新密码：" prop="newPassword">
            <el-input
              v-model.trim="ruleForm.newPassword"
              minlength="8"
              maxlength="12"
              :type="flag[1] ? 'text' : 'password'"
              ref="newPassword"
              @copy.native.capture.prevent="handlePaste"
              show-password="true"
              autocomplete="new-password"
            ></el-input>
          </el-form-item>
          <!--请再次输入新密码-->
          <el-form-item label="请再次输入新密码：" prop="newPassword2">
            <el-input
              v-model.trim="ruleForm.newPassword2"
              minlength="8"
              maxlength="12"
              :type="flag[2] ? 'text' : 'password'"
              ref="newPassword2"
              @copy.native.capture.prevent="handlePaste"
              show-password="true"
              autocomplete="new-password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleChangePassword = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </modal>
    <!--消息设置-->
    <modal
      :visible="isMessage"
      customClass="message-config-modal Miniform"
      @on-closed="isMessage = false"
    >
      <template slot="head">
        <span>消息通知设置</span>
      </template>
      <template slot="body">
        <ul>
          <li v-for="(item, index) in messageConfigList" :key="index">
            <div>{{ item.name }}</div>
            <el-switch
              v-model="item.isReceive"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="0"
              inactive-value="1"
              @change="messageConfigChange(item, index)"
            >
            </el-switch>
          </li>
        </ul>
      </template>
      <template slot="foot">
        <el-button @click="isMessage = false">关闭</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
// import Vue from "vue";
import modal from "hlcx-qiankun-commonservice/components/Modal";
import { logout } from "hlcx-qiankun-commonservice/utils/api/login";
import { GET_CHECKPWD, PUT_PWD } from "hlcx-qiankun-commonservice/utils/api/system/user";
import qs from "querystring";
import jstool from "hlcx-jstool";
import lastDayMonth from "hlcx-qiankun-commonservice/utils/mixins/lastMonth";
import { GET_MESSAGE_LIST, PUT_MESSAGE_READ } from "hlcx-qiankun-commonservice/utils/api/index";
import { mapState } from "vuex";
import {
  GET_MESSAGE_CONFIG_LIST,
  ADD_MESSAGE_CONFIG_LIST,
} from "hlcx-qiankun-commonservice/utils/api/system/message";

export default {
  name: "headerUserInfo",
  components: {
    modal,
  },
  mixins: [lastDayMonth],
  data() {
    let validateNewPassword = (rule, value, callback) => {
      if (value === this.ruleForm.password) {
        callback(new Error("新密码不能与原密码相同!"));
      } else {
        callback();
      }
    };
    let validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.ruleForm.newPassword) {
        callback(new Error("与新密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisibleChangePassword: false, // 修改密码弹框
      ruleForm: {},
      rules: {
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "长度在 8 到 12 个字符",
            trigger: "blur",
          },
          { validator: validateNewPassword, trigger: "blur" },
        ],
        newPassword2: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "长度在 8 到 12 个字符",
            trigger: "blur",
          },
          { validator: validateNewPassword2, trigger: "blur" },
        ],
      },
      flag: [false, false, false],
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      isDot: false,
      messageIsShowModal: false, // 消息弹框
      request: {
        pageNum: 1,
        pageSize: 5,
      },
      messageList: [], // 消息列表
      messageTotal: 0, // 未读消息数量
      isMessage: false, // 是否开启消息设置弹框
      messageConfigList: [],
    };
  },
  computed: {
    ...mapState(["messageModal", "messageReadall"]),
    mqttWatch() {
      return this.messageModal;
    },
    messageRead() {
      return this.messageReadall;
    },
  },
  watch: {
    mqttWatch() {
      this.isDot = true;
      if (this.messageIsShowModal) {
        this.getnoReadMessageList(true);
      }
    },
    messageRead() {
      this.isDot = false;
      if (this.messageIsShowModal) {
        this.getnoReadMessageList(true);
      }
    },
  },
  methods: {
    // 跳转
    routeOpen(val) {
      let newUrl = this.$router.resolve({
        path: val,
      });
      window.open(newUrl.href, "_blank");
    },
    handlePaste() {},
    // 重置密码
    reset() {
      this.ruleForm = {
        password: undefined,
        newPassword: undefined,
        newPassword2: undefined,
      };
      this.resetForm("ruleForm");
    },
    //  确认修改
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let pwd = {
            pwd: this.ruleForm.password,
          };
          GET_CHECKPWD(qs.stringify(pwd)).then(() => {
            let params = {
              userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
              password: this.ruleForm.newPassword,
            };
            PUT_PWD(params).then(() => {
              this.$message({
                message: "修改密码成功，请重新登录",
                type: "success",
              });
              this.changeCommand("2");
              this.dialogVisibleChangePassword = false;
            });
          });
        } else {
          return false;
        }
      });
    },
    // 眼睛
    hangePassword(index) {
      this.flag[index] = this.flag[index] ? false : true;
      if (index === 0) {
        if (this.flag[0]) {
          this.$refs.password.$el.children[0].type = "text";
        } else {
          this.$refs.password.$el.children[0].type = "password";
        }
      } else if (index === 1) {
        if (this.flag[1]) {
          this.$refs.newPassword.$el.children[0].type = "text";
        } else {
          this.$refs.newPassword.$el.children[0].type = "password";
        }
      } else if (index === 2) {
        if (this.flag[2]) {
          this.$refs.newPassword2.$el.children[0].type = "text";
        } else {
          this.$refs.newPassword2.$el.children[0].type = "password";
        }
      }
    },
    // 点击用户退出。修改密码
    changeCommand(val) {
      if (val === "1") {
        this.reset();
        this.dialogVisibleChangePassword = true;
      } else if (val === "2") {
        window.mqttClient.end(true);
        Vue.prototype.mqFlag = true;
        logout().then(() => {
          sessionStorage.clear();
          this.$router.push({
            path: "/login",
          });
          this.$notify.closeAll();
        });
      }
    },
    //  点击消息
    messageModals() {
      this.messageIsShowModal = !this.messageIsShowModal;
      this.getnoReadMessageList(true);
    },
    //  查询未读消息列表
    getnoReadMessageList(empty) {
      if (empty) {
        this.request.pageNum = 1;
        this.messageList = [];
        this.messageTotal = 0;
      }
      let data = {
        startTime: this.lastDayMonth(
          jstool.jshandle.getcurrentTime("yyyy-MM-dd"),
          "yyyy-MM-dd"
        ),
        endTime: jstool.jshandle.getcurrentTime("yyyy-MM-dd"),
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
        isRead: 0,
        pageNum: this.request.pageNum,
        pageSize: this.request.pageSize,
      };
      GET_MESSAGE_LIST(data).then((res) => {
        this.messageList = res.rows;
        this.messageTotal = res.total;
        if (res.rows.length > 0) {
          this.isDot = true;
        } else {
          this.isDot = false;
        }
      });
    },
    // 点击消息变已读并跳转
    messageChange(item) {
      this.putMessageRead(item.id);
      sessionStorage.removeItem("indexId");
      this.$router.push({
        path: item.redictUrl,
      });
    },
    // 消息设置已读
    putMessageRead(id) {
      PUT_MESSAGE_READ([id]).then(() => {
        this.getnoReadMessageList(true);
      });
    },
    //  点击全部消息跳转
    messageRouter() {
      sessionStorage.removeItem("indexId");
      this.$router.push({
        path: "/index/system/message",
      });
    },
    //  消息开关
    isMessageChange() {
      this.isMessage = true;
      this.messageConfigList = [];
      var data = {
        platform: "pc",
        tenantId: JSON.parse(sessionStorage.getItem("userInfo")).tenantId,
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
      };
      GET_MESSAGE_CONFIG_LIST(data).then((res) => {
        this.messageConfigList = res.data;
      });
    },
    //  消息提交
    messageConfigChange(val, index) {
      var data = {
        configId: val.id,
        isReceive: val.isReceive,
        platform: "pc",
        tenantId: JSON.parse(sessionStorage.getItem("userInfo")).tenantId,
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
      };
      ADD_MESSAGE_CONFIG_LIST(qs.stringify(data))
        .then(() => {
          this.$message({
            message: val.isReceive == 0 ? "开启成功" : "关闭成功",
            type: "success",
          });
        })
        .catch(() => {
          this.messageConfigList[index].isReceive =
            val.isReceive == 0 ? "1" : "0";
        });
    },
  },
  mounted() {
    document.addEventListener("click", (e) => {
      if (this.$refs.showPanel) {
        let isSelf = this.$refs.showPanel.contains(e.target);
        if (!isSelf) {
          this.messageIsShowModal = false;
        }
      }
    });
    this.getnoReadMessageList(true);
  },
};
</script>

<style scoped lang="scss">
.header-user-info {
  margin: 10px auto 0;
  width: fit-content;
  ul {
    display: flex;
    li {
      position: relative;
      .info-content {
        padding: 0 14px;
        position: relative;
        i.header-icon {
          font-size: 16px;
          position: relative;
          top: -3px;
          vertical-align: sub;
          cursor: pointer;
        }
        span {
          padding: 0 4px;
        }
        em {
          font-size: 12px;
        }
        ::v-deep.el-dropdown {
          color: #ffffff;
        }
      }
      &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 2px;
        height: 16px;
        background-color: #ffffff;
      }
      &:last-child:before {
        width: 0;
        height: 0;
        background-color: transparent;
      }
      &:first-child .info-content {
        padding-right: 18px;
      }
      .message-content {
        position: absolute;
        top: 32px;
        left: -230px;
        z-index: 7;
        width: 291px;
        background: #142d89;
        border: 1px solid #00ccff;
        border-radius: 4px;
        padding: 0 10px;
        &:after,
        &:before {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-bottom-color: #142d89;
          left: 81%;
          margin-left: -4px;
          top: -12px;
          z-index: 3;
        }
        &:after {
          border-bottom-color: #00ccff;
          z-index: 3;
          top: -13px;
          z-index: 2;
        }
        .message-list {
          max-height: 250px;
          overflow: auto;
          border-bottom: 1px dashed #ffffff;
          ul {
            display: block;
            li {
              font-size: 12px;
              border-bottom: 1px dashed #00ccff;
              margin-top: 10px;
              line-height: 14px;
              cursor: pointer;
              .message-modal-title {
                font-size: 12px;
                color: #eb8026;
                margin-bottom: 10px;
                i {
                  margin-right: 5px;
                  vertical-align: middle;
                }
              }
              span {
                padding: 0;
              }
              label {
                text-align: right;
                display: block;
                cursor: pointer;
                margin-bottom: 10px;
              }
              &:last-child {
                border: 0;
              }
            }
          }
        }
        .message-setup {
          display: flex;
          justify-content: space-between;
          color: #00ccff;
          font-size: 12px;
          padding: 10px 0;
          line-height: 18px;
          .message-setup-icon,
          .message-mall {
            cursor: pointer;
          }
          .message-setup-icon {
            i {
              margin-right: 4px;
              vertical-align: text-top;
            }
          }
        }
        .not-message {
          text-align: left !important;
          font-size: 12px;
          color: #ffffff;
          i {
            margin-right: 7px;
            vertical-align: sub;
          }
        }
      }
      &:first-child:hover {
        em {
          -webkit-transform: rotate(-180deg);
          transform: rotate(-180deg);
        }
      }
    }
  }
}
.userInfo-dropdown-menu {
  background: transparent;
  background-image: url("../assets/img/common/Rectangle.png");
  background-size: 100% 100%;
  border: 0;
  li {
    color: #ffffff;
    &:hover {
      background: transparent;
      color: #ffffff;
      background-image: url("../assets/img/common/menu_active.png");
      background-repeat: no-repeat;
      background-size: auto;
    }
  }
  ::v-deep.popper__arrow:after {
    border-bottom-color: #79caf1;
  }
}
.change-password {
  .icon-yanjing {
    color: rgba(255, 255, 255, 0.5) !important;
  }
}
::v-deep .message-config-modal {
  .el-dialog__body {
    padding: 0 30px;
    ul {
      li {
        display: flex;
        justify-content: space-between;
        color: #ffffff;
        margin-bottom: 21px;
      }
    }
  }
}
</style>
