<template>
  <div class="drawadd ltee" v-show="contentshow">
    <drawoption
      :nodeprops.sync="props"
      @change="onUpdateProps"
      @menu="menuoption"
      @fullpage="fulldraw"
      ref="drawoption"
    ></drawoption>
    <div class="draw-content">
      <div class="content-nav">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="icon-yuanjian"></i> 元件</span>
            <el-menu
              :unique-opened="true"
              default-active="1"
              class="el-menu-vertical-demo"
            >
              <el-submenu
                :index="index + '1'"
                v-for="(item, index) in cell"
                :key="index"
              >
                <template slot="title">
                  <i class="icon-shezhi"></i>
                  <span>{{ item.submenu }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="(children, childrenindex) in item.children"
                    :index="index + '1' + '-' + childrenindex + '1'"
                    :key="childrenindex"
                    :title="children.title"
                  >
                    <i
                      :class="children.iconname + ' ' + children.iconFamily"
                      :style="children.style"
                      draggable="true"
                      @dragstart="onDrag($event, children)"
                    ></i>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label"><i class="icon-moban"></i> 模板</span>
            <el-menu
              :unique-opened="true"
              @open="menuSelect"
              default-active="1"
              class="el-menu-vertical-demo"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="icon-shezhi"></i>
                  <span>系统模板</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="item in systemMould"
                    :key="item.id"
                    :title="item.name"
                  >
                    <span
                      v-hasPermi="['ema:cdc:remove']"
                      class="deleteButton"
                      @click="deleteCdc(item.id, 1)"
                    >+</span
                    >
                    <img
                      @dragend="mouldDrag(item)"
                      :src="item.picPath"
                      alt=""
                    />
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="icon-shezhi"></i>
                  <span>单位模板</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    v-for="item in userMould"
                    :key="item.id"
                    :title="item.name"
                  >
                    <span
                      v-hasPermi="['ema:cdc:remove']"
                      class="deleteButton"
                      @click="deleteCdc(item.id, 2)"
                    >+</span
                    >
                    <img
                      @dragend="mouldDrag(item)"
                      :src="item.picPath"
                      alt=""
                    />
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="Drawing">
        <div id="draw"></div>
        <div class="powername">
          {{ powername }}
        </div>
        <div class="scaleNum">
          <span class="scale">
            {{ Math.floor(canvas ? canvas.data.scale * 100 : 0) }}%</span
          >
          <i @click="fulldraw" class="iconfont icon-fangda"></i>
        </div>
      </div>
    </div>
    <!-- 分割线 -->
    <template-modal :show.sync="temModal"></template-modal>
    <!-- 超链接的 -->
    <link-modal :show.sync="linkModal" ref="linkmodal"></link-modal>
    <!-- 开关关联遥信量 -->
    <switch-modal :show.sync="switchModal" ref="switchModal"></switch-modal>
    <!-- 变压器的 -->
    <voltage-modal
      :show.sync="voltageModal"
      v-if="voltageModal"
    ></voltage-modal>
    <!-- 间隔的 -->
    <interval-modal
      :show.sync="intervalModal"
      v-if="intervalModal"
    ></interval-modal>
    <!-- 动环监控的 -->
    <ambient-modal
      :show.sync="ambientModal"
      v-if="ambientModal"
    ></ambient-modal>
    <!-- 动环监控数据框 -->
    <anbient-data-modal
      :show.sync="ambientdataModal"
      v-if="ambientdataModal"
    ></anbient-data-modal>
  </div>
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
//利用data中的type判断当前电器的类型进行弹窗判断transformer(变压器)/switch(开关)
var canvas, scaleDom;
import { Topology, registerNode } from "@topology/core";
import templateModal from "./components/addtem";
import linkModal from "./components/addlink";
import switchModal from "./components/addSwitch";
import voltageModal from "./components/addvoltage";
import ambientModal from "./components/addambientDevice";
import intervalModal from "./components/addInterval";
import anbientDataModal from "./components/ambientData";
import drawoption from "./drawOption";
import jstool from "hlcx-jstool";
import cell from "./drawCell";
import * as pako from "pako";
import * as drawServe from "hlcx-qiankun-commonservice/utils/api/equipment/draw";
import { GET_METER_SELECT } from "hlcx-qiankun-commonservice/utils/api/equipment/device";
import { mapMutations, mapState } from "vuex";
registerNode(
  "ltee",
  jstool.customtopology.myShape,
  null,
  null,
  jstool.customtopology.myTextRect
);
var contextmenuel;
export default {
  components: {
    drawoption,
    templateModal,
    linkModal,
    switchModal,
    voltageModal,
    ambientModal,
    intervalModal,
    anbientDataModal
  },
  beforeRouteUpdate(to, form, next) {
    if (this.drawChange) {
      this.saveMesBox().then(() => {
        this.drawChangeAction(false);
        setTimeout(() => {
          next();
          if (to.params.params) {
            var params = to.params.params.split("-");
            if (params.length == 2) {
              if (canvas) {
                this.draw();
              } else {
                this.initDarw();
              }
            }
          }
        }, 500);
      });
    } else {
      next();
      if (to.params.params) {
        var params = to.params.params.split("-");
        if (params.length == 2) {
          if (canvas) {
            this.draw();
          } else {
            this.initDarw();
          }
        }
      }
    }
  },
  beforeRouteLeave(to, form, next) {
    if (this.drawChange) {
      this.saveMesBox().then(() => {
        this.drawChangeAction(false);
        setTimeout(() => {
          next();
        }, 500);
      });
    } else {
      console.log(22);
      next();
    }
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  },
  watch: {
    drawhandle() {
      var width = document.getElementById("draw").clientWidth;
      document
        .getElementById("draw")
        .getElementsByTagName("canvas")[0].style.width = width + "px";
      setTimeout(function() {
        canvas.fitView();
        canvas.canvasPos = canvas.divLayer.canvas.getBoundingClientRect();
      }, 500);
    }
  },
  computed: {
    ...mapState({
      drawhandle:state=>state.common.drawhandle,
      drawChange:state=>state.common.drawChange
    }),
    parId() {
      return this.$route.params.params.split("-")[1];
    },
    contentshow() {
      return (
        this.$route.params.params && this.$route.params.params.indexOf("-") >= 0
      );
    }
  },
  mounted() {
    scaleDom = document.querySelector(".scale");
    document.querySelector(".Drawing").onfullscreenchange = () => {
      if (!document.fullscreenElement) {
        canvas.lock(0);
      }
      this.$nextTick(() => {
        setTimeout(() => {
          canvas.canvasPos = canvas.divLayer.canvas.getBoundingClientRect();
        }, 500);
      });
    };
    var params = this.$route.params.params;
    if (params) {
      params = params.split("-");
      if (params.length == 2) {
        this.initDarw();
      }
    }
  },
  data() {
    return {
      //保存系统模板的开关
      temModal: false,
      switchModal: false,
      linkModal: false,
      voltageModal: false,
      //动环监控模块
      ambientModal: false,
      //动环监控数据框
      ambientdataModal: false,
      intervalModal: false,
      //系统模板的图片列表
      systemMould: [],
      //用户模板的图片列表
      userMould: [],
      //接线图节点对应信息
      drawNodeInfoList: {},
      //接线图信息
      drawInfo: {},
      //配电室的名字
      powername: "",
      rect: {
        width: 50,
        height: 50
      },
      props: {
        // 属性修改
        node: null,
        line: null,
        nodes: null,
        multi: false,
        expand: false,
        locked: false
      },
      cell: cell,
      mould: [],
      concatN: ""
    };
  },
  methods: {
    ...mapMutations('common',["deviceTreeStatus", "drawChangeAction"]),
    returnCanvas() {
      return canvas;
    },
    //弹出询问框
    saveMesBox() {
      return new Promise(resolve => {
        this.$msgbox({
          title: "",
          customClass: "iconmes",
          message: "是否保存接线图更改",
          showCancelButton: true,
          confirmButtonText: "保存",
          cancelButtonText: "不保存",
          type: "info",
          iconClass: "iconfont icon-gaojing1",
          closeOnClickModal: false,
          closeOnPressEscape: false,
          distinguishCancelAndClose: true
        })
          .then(() => {
            // 通过当前接线图状态判断走哪个接口isDraft=1草稿=0提交
            if (Number(this.drawInfo.isDraft)) {
              this.draft(canvas.data).then(() => {
                resolve();
              });
            } else {
              this.drawSave(canvas.data).then(() => {
                resolve();
              });
            }
          })
          .catch(action => {
            // close为关闭
            // cancel不保存
            switch (action) {
              case "cancel":
                resolve();
                break;
            }
          });
      });
    },
    initDarw() {
      this.$nextTick(() => {
        this.drawTime();
        var self = this;
        canvas = new Topology("draw", {
          on: self.onMessage,
          color: "#ffffff",
          activeColor: "yellow",
          // hoverColor: "#ffffff",
          fontColor: "#ffffff",
          minScale: 0.06
          // translateKey: "m"
        });
        var divsHtml = document
          .getElementById("draw")
          .getElementsByTagName("div");
        var divs = Array.prototype.slice.call(divsHtml);
        divs.forEach(i => {
          if (i.attributes["tabindex"]) {
            contextmenuel = i;
            i.oncontextmenu = () => {
              if (!document.fullscreen) {
                // this.props.node.data
                if (this.props.node) {
                  switch (this.props.node.name) {
                    case "text":
                      this.linkModal = true;
                      this.$refs.linkmodal.init();
                      break;
                    case "image":
                      this.iconType();
                      break;
                    case "ltee":
                      this.iconType();
                      break;
                  }
                }
              }

              return false;
            };
          }
        });
        this.draw();
      });
    },
    //放大接线图
    fulldraw() {
      if (!document.fullscreenElement) {
        document.querySelector(".Drawing").requestFullscreen();
        canvas.lock(1);
      } else {
        document.exitFullscreen();
        canvas.lock(0);
      }
    },
    drawFlag() {
      if ("power" in this.drawInfo) {
        return true;
      } else {
        this.$message.error("请选择接线图");
        return false;
      }
    },
    // 模板的选择
    menuSelect(index) {
      var params = {
        componentType: index
      };
      if (index == 2) {
        params["orgId"] = JSON.parse(sessionStorage.getItem("userInfo")).orgId;
      } else {
        params["orgId"] = 0;
      }
      drawServe.GET_CDC_LIST(params).then(e => {
        if (index == 1) {
          this.systemMould = e.rows;
        } else {
          this.userMould = e.rows;
        }
      });
    },
    //模板的拖拽
    mouldDrag(data) {
      drawServe.GET_CDC(data.id).then(e => {
        // this.drawNodeInfoList = {};
        var str = atob(e.data.jsonData);
        str = pako.inflate(str, { to: "string" });
        str = JSON.parse(str);
        // str = canvas
        canvas.data.pens = canvas.data.pens.concat(str.pens);
        canvas.open(canvas.data);
        canvas.render();
      });
    },
    //模板的删除
    deleteCdc(id, active) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除当前模板",
        showCancelButton: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
        .then(() => {
          drawServe.DELETE_CDC(id).then(e => {
            if (e.code == 200) {
              this.menuSelect(active);
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    iconType() {
      switch (this.props.node.data.type) {
        //变压器
        case "transformer":
          this.voltageModal = true;
          break;
        //间隔
        case "interval":
          this.intervalModal = true;
          break;
        //开关
        case "switch":
          this.switchModal = true;
          this.$refs.switchModal.init();
          break;
        //动环监控
        case "monitor":
          this.ambientModal = true;
          break;
        //动环监控数据框
        case "ambientData":
          this.ambientdataModal = true;
          break;
      }
    },
    drawTime() {
      //修改工具栏高度
      document.getElementsByClassName("el-tabs__content")[0].style.height =
        document.getElementsByClassName("h-content")[0].offsetHeight -
        100 -
        45 -
        38 +
        "px";
    },
    // 保存接线图
    drawSave(jsondata) {
      if (this.drawFlag()) {
        return new Promise(resolve => {
          canvas.data.locked = 1;
          var data = pako.deflate(JSON.stringify(jsondata), {
            to: "string",
            level: 9
          });
          var arr = [];
          for (var i in this.drawNodeInfoList) {
            this.drawNodeInfoList[i].forEach(item => {
              var node = canvas.find(i);
              if (!(node instanceof Array)) {
                arr.push(item);
              }
            });
          }
          var params = {
            id: this.parId,
            jsondata: btoa(data),
            list: arr,
            isDraft: "0"
          };
          drawServe.EDIT_DRAW(params).then(e => {
            if (e.code == 200) {
              this.drawInfo.isDraft = 0;
              this.$message.success("提交成功");
              canvas.data.locked = 0;
              this.deviceTreeStatus(true);
              this.drawChangeAction(false);
              resolve();
            }
          });
        });
      }
    },
    //存为草稿
    draft(jsondata) {
      if (this.drawFlag()) {
        return new Promise(resolve => {
          canvas.data.locked = 1;
          var data = pako.deflate(JSON.stringify(jsondata), {
            to: "string",
            level: 9
          });
          var arr = [];
          for (var i in this.drawNodeInfoList) {
            this.drawNodeInfoList[i].forEach(item => {
              arr.push(item);
            });
          }
          var params = {
            id: this.parId,
            jsondata: btoa(data),
            list: arr,
            isDraft: "1"
          };
          drawServe.EDIT_DRAW(params).then(e => {
            if (e.code == 200) {
              this.$message.success("保存成功");
              this.drawChangeAction(false);
              canvas.data.locked = 0;
              resolve();
            }
          });
        });
      }
    },
    //回显接线图
    draw() {
      drawServe.GET_CD(this.parId).then(e => {
        this.drawNodeInfoList = {};
        this.drawInfo = e.data;
        //查询接线图的配电室
        GET_METER_SELECT(e.data.orgId, 13).then(powerlist => {
          var power = powerlist.data.filter(i => {
            return i.id == e.data.power;
          });
          this.powername = power[0].name;
        });
        e.data.list.forEach(item => {
          if (item.parentId) {
            if (!(item.parentId in this.drawNodeInfoList)) {
              this.drawNodeInfoList[item.parentId] = [];
            }
            this.drawNodeInfoList[item.parentId].push(item);
          } else {
            if (!(item.drawNodeId in this.drawNodeInfoList)) {
              this.drawNodeInfoList[item.drawNodeId] = [];
            }
            this.drawNodeInfoList[item.drawNodeId].push(item);
          }
        });
        if (e.data.jsondata) {
          var str = atob(e.data.jsondata);
          str = pako.inflate(str, { to: "string" });
          str = JSON.parse(str);
          canvas.open(str);
          canvas.data.locked = 0;
          canvas.updateProps();
        } else {
          canvas.open();
          canvas.data.lineName = "polyline";
          canvas.data.bkColor = "black";
          canvas.data.toArrow = "";
          canvas.updateProps();
        }
      });
    },
    onDrag(e, children) {
      if (!("rect" in children.data)) {
        children.data["rect"] = this.rect;
      }
      children.data["fontSize"] = 20;
      children.data["font"] = {
        fontSize: 20
      };
      e.dataTransfer.setData("Topology", JSON.stringify(children.data));
    },

    //操作模块
    menuoption(e) {
      switch (e) {
        case "draft":
          this.draft(canvas.data);
          break;
        case "save":
          this.drawSave(canvas.data);
          break;
        case "template":
          if (this.drawFlag()) {
            if (canvas.data.pens.length) {
              this.temModal = true;
            } else {
              this.$message.error("请先绘制接线图");
            }
          }
          break;
      }
    },
    //重绘
    onUpdateProps(node) {
      // 如果是node属性改变，需要传入node，重新计算node相关属性值
      // 如果是line属性改变，无需传参
      canvas.updateProps(node);
    },
    //合并节点
    getLocked(node) {
      this.concatN = node.nodes;
    },
    onMessage(event, data) {
      //这些操作相当于修改了
      switch (event) {
        case "move":
        case "addNode":
        case "rotated":
        case "translate":
        case "delete":
        case "addLine":
          this.drawChangeAction(true);
          break;
      }
      switch (event) {
        case "node":
        case "addNode":
          console.log(data);
          this.props = {
            node: data,
            line: null,
            multi: false,
            expand: this.props.expand,
            nodes: null,
            locked: data.locked
          };
          break;
        case "line":
        case "addLine":
          this.props = {
            node: null,
            line: data,
            multi: false,
            nodes: null,
            locked: data.locked
          };
          break;
        case "multi":
          console.log(data);
          this.props = {
            node: null,
            line: null,
            multi: true,
            nodes: data.length > 1 ? data : null,
            locked: this.getLocked({ nodes: data })
          };
          break;
        case "space":
          this.props = {
            node: null,
            line: null,
            multi: false,
            nodes: null,
            locked: false
          };
          break;
        case "moveOut":
          break;
        case "moveNodes":
        case "resizeNodes":
          if (data.length > 1) {
            this.props = {
              node: null,
              line: null,
              multi: true,
              nodes: data,
              locked: this.getLocked({ nodes: data })
            };
          } else {
            this.props = {
              node: data[0],
              line: null,
              multi: false,
              nodes: null,
              locked: false
            };
          }
          break;
        case "resize":
        case "scale":
          if (data) {
            scaleDom.innerText = data * 100 + "%";
          }
          break;
        case "locked":
          break;
      }
    }
  },

  destroyed() {
    if (canvas) {
      canvas.destroy();
      canvas = null;
      contextmenuel.oncontextmenu = null;
    }
  }
};
</script>

<style scoped lang="scss">
.drawadd {
  width: 100%;
  height: 100%;

  .draw-content {
    width: 100%;
    height: calc(100% - 100px);
    font-size: 0;
    .content-nav {
      display: inline-block;
      width: 190px;
      height: 100%;
      i {
        font-family: "iconfont";
        font-size: 16px;
        color: white;
      }
      ::v-deep .el-tabs--border-card {
        height: 100%;
        box-shadow: none;
        border: none;
        background-color: #4878c8;
        .el-tabs__header {
          position: relative;
          &::after {
            position: absolute;
            width: 100%;
            height: 0px;
            content: "";
            border-bottom: 1px solid #5a84d4;
            bottom: -1px;
            left: 0;
          }
          background-color: transparent;
          border: none;
          .el-tabs__nav {
            border-bottom: 1px solid #416db4;
            .el-tabs__item {
              width: 95px;
              height: 38px;
              line-height: 38px;
              padding: 0;
              text-align: center;
              background-color: #4878c8;
              border: none;
              color: white;
              &.is-active {
                border: none;
                background-color: #2a58b4;
              }
            }
          }
        }
        .el-tabs__content {
          overflow-y: scroll;
          padding: 0;
          .el-menu {
            border: none;
            background-color: transparent;
            .el-submenu {
              .el-submenu__title {
                border-bottom: 1px solid #416db4;
                position: relative;
                &::after {
                  position: absolute;
                  width: 100%;
                  height: 0px;
                  content: "";
                  border-bottom: 1px solid #5a84d4;
                  bottom: -2px;
                  left: 0;
                }
                &:hover {
                  background-color: #3466cc;
                }
                i {
                  color: white;
                }
                span {
                  color: #e6e6e6;
                }
              }
              .el-menu {
                .el-menu-item-group {
                  .el-menu-item-group__title {
                    display: none;
                  }
                  ul {
                    font-size: 0;
                    li {
                      padding: 0 !important;
                      position: relative;
                      min-width: 0;
                      width: 33.33%;
                      text-align: center;
                      color: white;
                      display: inline-block;
                      .deleteButton {
                        display: none;
                        content: "+";
                        position: absolute;
                        color: white;
                        font-size: 18px;
                        transform: rotate(45deg);
                        top: -3px;
                        right: -4px;
                        width: auto;
                        height: auto;
                        line-height: 14px;
                      }
                      &:hover {
                        .deleteButton {
                          display: block;
                        }
                        background-color: #4878c8;
                      }
                      &:focus {
                        background-color: #4878c8;
                      }
                      img {
                        width: 90%;
                        height: 90%;
                        border: 1px solid white;
                      }
                      // &::after {
                      //   position: absolute;
                      //   width: 100%;
                      //   height: 0px;
                      //   content: "";
                      //   border-bottom: 1px solid #5a84d4;
                      //   bottom: -2px;
                      //   left: 0;
                      // }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .Drawing {
      vertical-align: top;
      display: inline-block;
      width: calc(100% - 190px);
      height: 100%;
      position: relative;
      #draw {
        height: 100%;
        width: 100%;
        font-size: 14px;
        overflow: hidden !important;
        // background-color: black;
      }
      .powername {
        position: absolute;
        right: 10px;
        top: 10px;
        color: white;
        font-size: 12px;
        z-index: 10;
      }
      .scaleNum {
        position: absolute;
        right: 10px;
        bottom: 30px;
        color: white;
        font-size: 12px;
        z-index: 10;
      }
    }
  }
}
// el-select-dropdown el-popper
::v-deep.el-dialog__wrapper {
  .el-dialog {
    .el-dialog__body {
      padding: 0 10px;
      .select {
        color: white;
        .el-select,
        .el-cascader {
          margin-bottom: 10px;
          .el-input {
            .el-input__inner {
              height: 30px;
              line-height: 30px;
            }
          }
          .el-input__icon {
            line-height: 30px;
          }
        }
      }
      .option {
        margin-bottom: 10px;
        .el-button {
          font-size: 10px;
          padding: 3px 20px;
        }
      }
      .el-table {
        margin-bottom: 10px;
        .cell {
          .el-select {
            margin-bottom: 10px;
            .el-input {
              .el-input__inner {
                height: 20px;
                line-height: 20px;
              }
            }
            .el-input__icon {
              line-height: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
