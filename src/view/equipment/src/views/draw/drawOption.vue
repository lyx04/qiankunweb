<template>
  <ul class="draw-header">
    <li class="fatherli">
      <ul class="action operation">
        <li
          @click="menuOption('draft')"
          :class="{ disable: parent.drawInfo.isDraft != '1' }"
        >
          <i class="icon-xinjian"></i>
          <p>存为草稿</p>
        </li>
        <li @click="menuOption('save')">
          <i class="icon-baocun"></i>
          <p>提交</p>
        </li>
        <li
          @click="menuOption('template')"
          v-hasPermi="['ema:cdc:add']"
          class="btn-none"
        >
          <i class="icon-wenjian"></i>
          <p>存为模板</p>
        </li>
        <li @click="menuOption('export')">
          <i class="icon-daochu"></i>
          <p>导出</p>
        </li>
        <!-- <li @click="menuOption('print')">
          <i class="icon-dayin"></i>
          <p>打印</p>
        </li> -->
      </ul>
      <div class="introduce">操作</div>
    </li>
    <li class="fatherli">
      <ul class="action behavior">
        <li title="全屏" @click="fullpage"><i class="icon-fangda"></i></li>
        <li title="撤销" @click="menuOption('undo')">
          <i class="icon-huitui"></i>
        </li>
        <!-- <li><i class="icon-qianjin"></i></li> -->
        <li title="删除" @click="menuOption('delete')">
          <i class="icon-huishou nomargin"></i>
        </li>
        <br />
        <!-- <li class="top"><i class=" icon-iconfontxuanzefangfa01"></i></li> -->
        <!-- <li><i class="icon-shou"></i></li> -->
        <li title="复制" @click="menuOption('copy')" class="top">
          <i class="icon-fuzhi"></i>
        </li>
        <li title="粘贴" @click="menuOption('paste')" class="nomargin">
          <i class="icon-niantie"></i>
        </li>
      </ul>
      <div class="introduce">行为</div>
    </li>
    <li class="fatherli">
      <ul class="action font">
        <!-- settingFont -->
        <li title="图标颜色" class="fontColor">
          <el-color-picker
            :disabled="disabledFlag()"
            @change="iconColor"
            v-model="iconcolor"
          ></el-color-picker>
        </li>
        <li title="字体大小" class="fontSize">
          <el-select
            @change="sizeChage"
            v-model="fontSize"
            placeholder="字体大小"
          >
            <el-option value="10"> </el-option>
            <el-option value="12"> </el-option>
            <el-option value="14"> </el-option>
            <el-option value="16"> </el-option>
            <el-option value="18"> </el-option>
            <el-option value="20"> </el-option>
          </el-select>
        </li>
        <li title="字体颜色" class="fontColor">
          <el-color-picker
            @change="fontcolorChage"
            v-model="fontcolor"
          ></el-color-picker>
        </li>
        <br />
        <li title="左对齐" class="iconli" @click="menuOption('textleft')">
          <i class="icon-iconspace_AllignmentLeft_px"></i>
        </li>
        <li title="右对齐" class="iconli" @click="menuOption('textright')">
          <i class="icon-youduiqi"></i>
        </li>
        <li title="居中" class="iconli" @click="menuOption('textcenter')">
          <i class="icon-iconspace_AllignmentCenter_px"></i>
        </li>
        <li title="加粗" class="iconli" @click="menuOption('textWeight')">
          <i class="icon-jiacu"></i>
        </li>
        <li title="斜体" class="iconli" @click="menuOption('textstyle')">
          <i class="icon-xieti"></i>
        </li>
        <li title="行高" class="iconli">
          <el-dropdown trigger="click" @command="lineHchange">
            <span class="el-dropdown-link">
              <i class="icon-xinggao"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">1.0</el-dropdown-item>
              <el-dropdown-item command="1.5">1.5</el-dropdown-item>
              <el-dropdown-item command="2">2.0</el-dropdown-item>
              <el-dropdown-item command="3">3.0</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
      <div class="introduce">文字</div>
    </li>
    <li class="fatherli">
      <ul class="action style">
        <li title="线条样式">
          <div>
            <el-select
              placeholder="线条样式"
              :disabled="disabledFlag()"
              v-model="line"
              @change="lineChage"
            >
              <el-option label="直线" value="0,0">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g
                    _ngcontent-ehr-c51=""
                    fill="none"
                    stroke="black"
                    stroke-width="1"
                  >
                    <path stroke-dasharray="0,0" d="M0 17 l85 0"></path>
                  </g>
                </svg>
              </el-option>
              <el-option label="虚线" value="5,5">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g
                    _ngcontent-ehr-c51=""
                    fill="none"
                    stroke="black"
                    stroke-width="1"
                  >
                    <path stroke-dasharray="5,5" d="M0 17 l85 0"></path>
                  </g>
                </svg>
              </el-option>
              <el-option label="宽虚线" value="10,10">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10,10" d="M0 17 l85 0"></path>
                  </g>
                </svg>
              </el-option>
              <el-option label="点虚线" value="10,10,2,10">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                  <g fill="none" stroke="black" stroke-width="1">
                    <path stroke-dasharray="10,10,2,10" d="M0 17 l85 0"></path>
                  </g>
                </svg>
              </el-option>
            </el-select>
            <el-color-picker
              :disabled="disabledFlag()"
              title="边框颜色"
              v-model="linecolor"
              @change="changelinecolor"
            ></el-color-picker>
          </div>
        </li>
        <li title="线条粗细">
          <div>
            <el-select
              :disabled="disabledFlag()"
              v-model="thickness"
              @change="thicknessChage"
              placeholder="线条粗细"
            >
              <el-option label="正常" :value="1"> </el-option>
              <el-option label="加粗" :value="2"> </el-option>
            </el-select>
            <el-color-picker
              :disabled="disabledFlag()"
              title="填充色"
              v-model="linethickness"
              @change="changelinethickness"
            ></el-color-picker>
          </div>
        </li>
      </ul>
      <div class="introduce">样式</div>
    </li>
    <li class="fatherli">
      <ul class="action line">
        <li>
          <el-select
            v-model="lineType"
            @change="lineTypeChange"
            placeholder="连线类型"
          >
            <template slot="prefix">
              <i :class="'t-icon t-' + lineType"></i>
            </template>
            <el-option
              v-for="(item, index) in lineTypeList"
              :key="index"
              :value="item.value"
            >
              {{ item.label }} <i :class="'t-icon t-' + item.value"></i>
            </el-option>
          </el-select>
          <!-- <el-dropdown
            title=""
            @command=""
            trigger="click"
          >
            <span class="el-dropdown-link">
              <i :class="'t-icon t-' + lineType"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="!nodeprops.line"
                :command="item.value"
                v-for="(item, index) in lineTypeList"
                :key="index"
              >
                {{ item.label }} <i :class="'t-icon t-' + item.value"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-dropdown
            title="开始箭头"
            @command="fromArrowChange"
            trigger="click"
            placeholder="开始箭头"
          >
            <span class="el-dropdown-link">
              <i :class="'t-icon t-from-' + fromArrow"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="!nodeprops.line"
                :command="item.value"
                v-for="(item, index) in ArrowList"
                :key="index"
                ><i :class="'t-icon t-from-' + item.value"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <br />
        <li title="结束箭头">
          <el-dropdown
            placeholder="结束箭头"
            @command="toArrowChange"
            trigger="click"
          >
            <span class="el-dropdown-link">
              <i :class="'t-icon t-to-' + toArrow"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :disabled="!nodeprops.line"
                :command="item.value"
                v-for="(item, index) in ArrowList"
                :key="index"
                ><i :class="'t-icon t-to-' + item.value"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
      <div class="introduce">连接方式</div>
    </li>
    <li class="fatherli">
      <ul class="action align">
        <li title="左对齐" @click="menuOption('nodeleft')">
          <img src="@/assets/img/left.png" alt="" />
        </li>
        <li title="右对齐" @click="menuOption('noderight')">
          <img src="@/assets/img/right.png" alt="" />
        </li>
        <li title="底部对齐" @click="menuOption('nodebottom')">
          <img src="@/assets/img/bottom.png" alt="" />
        </li>
        <li title="水平居中" @click="menuOption('nodemiddle')">
          <img src="@/assets/img/center.png" alt="" />
        </li>
        <li title="顶部对齐" @click="menuOption('nodetop')">
          <img src="@/assets/img/top.png" alt="" />
        </li>
        <br />
        <li
          style="margin-top: 5px"
          title="垂直居中"
          @click="menuOption('nodecenter')"
        >
          <img
            style="transform: rotate(-90deg)"
            src="@/assets/img/center.png"
            alt=""
          />
        </li>
        <li title="水平分布" @click="menuOption('nodehorizontal')">
          <img
            src="@/assets/img/vertical.png"
            alt=""
            style="transform: rotate(90deg)"
          />
        </li>
        <li title="垂直分布" @click="menuOption('nodevertical')">
          <img src="@/assets/img/vertical.png" alt="" />
        </li>
      </ul>
      <div class="introduce">对齐</div>
    </li>
  </ul>
</template>
<script>
import { alignNodes, spaceBetween } from "@topology/layout";
export default {
  props: {
    nodeprops: {
      type: Object,
      require: true,
    },
  },
  watch: {
    nodeprops(newVal) {
      if (newVal.line || newVal.node) {
        this.nodeprops = newVal;
        this.initNodeProp();
      } else {
        this.line = "";
        this.linecolor = "#409EFF";
        this.fontFamily = "";
        this.fontSize = "20";
        this.fontcolor = "#409EFF";
        this.thickness = "";
        this.linethickness = "#409EFF";
        this.iconcolor = "#409EFF";
      }
    },
  },
  data() {
    return {
      line: "",
      linecolor: "#409EFF",
      fontFamily: "",
      fontSize: "20",
      fontcolor: "#409EFF",
      thickness: "",
      linethickness: "#409EFF",
      iconcolor: "#409EFF",
      parent: this.$parent,
      fromArrow: "",
      toArrow: "",
      ArrowList: [
        {
          value: "",
        },
        {
          value: "triangleSolid",
        },
        {
          value: "triangle",
        },
        {
          value: "diamondSolid",
        },
        {
          value: "diamond",
        },
        {
          value: "circleSolid",
        },
        {
          value: "circle",
        },
        {
          value: "line",
        },
        {
          value: "lineUp",
        },
        {
          value: "lineDown",
        },
      ],
      lineType: "",
      lineTypeList: [
        {
          label: "线段",
          value: "polyline",
        },
        {
          label: "直线",
          value: "line",
        },
      ],
    };
  },
  methods: {
    //连线方式
    lineTypeChange(e) {
      if (this.nodeprops.line) {
        this.nodeprops.line.name = e;
      }
      this.parent.returnCanvas().data.lineName = e;
      this.onChange();
    },
    //开始箭头
    fromArrowChange(e) {
      this.fromArrow = e;
      this.nodeprops.line.fromArrow = e;
      this.parent.returnCanvas().data.fromArrow = e;
      this.onChange();
    },
    //结束箭头
    toArrowChange(e) {
      this.toArrow = e;
      this.nodeprops.line.toArrow = e;
      this.parent.returnCanvas().data.toArrow = e;
      this.onChange();
    },
    initNodeProp() {
      var node = this.nodeprops.node;
      var line = this.nodeprops.line;
      this.line = node
        ? node.lineDash
          ? node.lineDash.join(",")
          : ""
        : line.lineDash
        ? line.lineDash.join(",")
        : "";
      this.linecolor = node ? node.strokeStyle : line.strokeStyle;
      this.fontFamily = node ? node.fontFamily : "";
      this.fontSize = node ? node.fontSize : line.fontSize;
      this.fontcolor = node ? node.fontColor : line.fontColor;
      this.thickness = node ? node.lineWidth : line.lineWidth;
      this.linethickness = node ? node.fillStyle : line.textBackground;
      this.iconcolor = node ? node.iconColor : "";
      this.lineType = line ? line.name : "";
      this.fromArrow = line ? line.fromArrow : "";
      this.toArrow = line ? line.toArrow : "";
    },
    // 禁用
    disabledFlag() {
      return false;
      // if (this.nodeprops.node && this.nodeprops.node.iconFamily == "ltee") {
      //   return false;
      // } else {
      //   return true;
      // }
    },
    //图标颜色修改
    iconColor() {
      if (this.nodeprops.nodes) {
        this.nodeprops.nodes.forEach((i) => {
          i.iconColor = this.iconcolor;
        });
      }
      if (this.nodeprops.node) {
        this.nodeprops.node.iconColor = this.iconcolor;
      }

      this.onChange();
    },
    //递归修改字体大小
    recursionSize(item) {
      if (this.nodeprops.node) {
        item.children.forEach((i) => {
          if (i.name == "text") {
            this.recursionSize(i);
          }
        });
      }

      item.fontSize = this.fontSize;
    },
    //字体大小修改
    sizeChage() {
      if (this.nodeprops.node) {
        this.recursionSize(this.nodeprops.node);
      }
      if (this.nodeprops.line) {
        this.recursionSize(this.nodeprops.line);
      }

      this.onChange();
    },
    //字体颜色修改
    fontcolorChage() {
      if (this.nodeprops.nodes) {
        this.nodeprops.nodes.forEach((i) => {
          i.fontColor = this.fontcolor;
        });
      }
      if (this.nodeprops.node) {
        this.nodeprops.node.fontColor = this.fontcolor;
      }
      if (this.nodeprops.line) {
        this.nodeprops.line.fontColor = this.fontcolor;
      }
      this.onChange();
    },
    //修改线条粗细
    thicknessChage() {
      if (this.nodeprops.nodes) {
        this.nodeprops.nodes.forEach((i) => {
          i.lineWidth = Number(this.thickness);
        });
      }
      if (this.nodeprops.node) {
        this.nodeprops.node.lineWidth = Number(this.thickness);
      }
      if (this.nodeprops.line) {
        this.nodeprops.line.lineWidth = Number(this.thickness);
      }
      this.onChange();
    },
    //修改背景颜色
    changelinethickness() {
      if (this.nodeprops.node) {
        this.nodeprops.node.bkType = 0;
        this.nodeprops.node.fillStyle = this.linethickness;
      }
      if (this.nodeprops.line) {
        this.nodeprops.line.bkType = 0;
        this.nodeprops.line.textBackground = this.linethickness;
      }
      this.onChange();
    },
    //线条改变
    lineChage() {
      var value = this.line.split(",");
      if (this.nodeprops.node) {
        this.nodeprops.node.lineDash = value;
      }
      if (this.nodeprops.line) {
        this.nodeprops.line.lineDash = value;
      }
      this.onChange();
    },
    //修改线条颜色
    changelinecolor() {
      if (this.nodeprops.nodes) {
        this.nodeprops.nodes.forEach((i) => {
          i.strokeStyle = this.linecolor;
        });
      }
      if (this.nodeprops.node) {
        this.nodeprops.node.strokeStyle = this.linecolor;
      }
      if (this.nodeprops.line) {
        this.nodeprops.line.strokeStyle = this.linecolor;
      }
      this.onChange();
    },
    //文字行高改变
    lineHchange(e) {
      this.nodeprops.node.lineHeight = e;
      this.onChange();
    },
    fullpage() {
      this.$emit("fullpage");
    },
    onChange() {
      this.$emit("change", this.nodeprops.node);
    },
    menuOption(e) {
      var parentcanvas = this.parent.returnCanvas();
      switch (e) {
        case "export":
          parentcanvas.overflow();
          parentcanvas.saveAsImage();
          break;
        case "print":
          window.print();
          break;
        case "undo":
          parentcanvas.undo();
          break;
        case "delete":
          parentcanvas.delete();
          break;
        case "copy":
          parentcanvas.copy();
          break;
        case "paste":
          parentcanvas.paste();
          break;
        case "textleft":
          this.nodeprops.node.textAlign = "left";
          this.onChange();
          break;
        case "textright":
          this.nodeprops.node.textAlign = "right";
          this.onChange();
          break;
        case "textcenter":
          this.nodeprops.node.textAlign = "center";
          this.onChange();
          break;
        case "textWeight":
          if (this.nodeprops.node.fontWeight == "bold") {
            this.nodeprops.node.fontWeight = "normal";
          } else {
            this.nodeprops.node.fontWeight = "bold";
          }
          this.onChange();
          break;
        case "textstyle":
          if (this.nodeprops.node.fontStyle == "italic") {
            this.nodeprops.node.fontStyle = "normal";
          } else {
            this.nodeprops.node.fontStyle = "italic";
          }
          this.onChange();
          break;

        // noderight
        // nodebottom
        // nodecenter
        // nodetop
        case "nodeleft":
          alignNodes(
            parentcanvas.activeLayer.pens,
            parentcanvas.activeLayer.rect,
            "left"
          );
          parentcanvas.updateProps();
          // 新增历史记录，方便undo
          parentcanvas.cache();
          break;
        case "noderight":
          alignNodes(
            parentcanvas.activeLayer.pens,
            parentcanvas.activeLayer.rect,
            "right"
          );
          parentcanvas.updateProps();
          // 新增历史记录，方便undo
          parentcanvas.cache();
          break;
        case "nodebottom":
          alignNodes(
            parentcanvas.activeLayer.pens,
            parentcanvas.activeLayer.rect,
            "bottom"
          );
          parentcanvas.updateProps();
          // 新增历史记录，方便undo
          parentcanvas.cache();
          break;
        case "nodemiddle":
          alignNodes(
            parentcanvas.activeLayer.pens,
            parentcanvas.activeLayer.rect,
            "middle"
          );
          parentcanvas.updateProps();
          // 新增历史记录，方便undo
          parentcanvas.cache();
          break;
        case "nodetop":
          alignNodes(
            parentcanvas.activeLayer.pens,
            parentcanvas.activeLayer.rect,
            "top"
          );
          parentcanvas.updateProps();
          // 新增历史记录，方便undo
          parentcanvas.cache();
          break;
        case "nodecenter":
          alignNodes(
            parentcanvas.activeLayer.pens,
            parentcanvas.activeLayer.rect,
            "center"
          );
          parentcanvas.updateProps();
          // 新增历史记录，方便undo
          parentcanvas.cache();
          break;
        case "nodehorizontal":
          var canvasWidth = parentcanvas.activeLayer.rect.width;
          spaceBetween(parentcanvas.activeLayer.pens, canvasWidth);

          parentcanvas.updateProps();
          // 新增历史记录，方便undo
          parentcanvas.cache();
          break;
        case "nodevertical":
          var nodesHeight = parentcanvas.activeLayer.rect.height;
          var nodeheightArray = [
            parentcanvas.activeLayer.pens[0].rect.height,
            parentcanvas.activeLayer.pens[
              parentcanvas.activeLayer.pens.length - 1
            ].rect.height,
          ];
          var otherNodesHeight = 0;
          for (var i = 1; i < parentcanvas.activeLayer.pens.length - 1; i++) {
            otherNodesHeight += parentcanvas.activeLayer.pens[i].rect.height;
          }
          var averag =
            (nodesHeight -
              nodeheightArray[0] -
              nodeheightArray[1] -
              otherNodesHeight) /
            (parentcanvas.activeLayer.pens.length - 1);
          for (var j = 1; j < parentcanvas.activeLayer.pens.length - 1; j++) {
            parentcanvas.activeLayer.pens[j].rect.y =
              parentcanvas.activeLayer.pens[j - 1].rect.ey + averag;
            parentcanvas.updateProps();
          }
          // layout(canvas.activeLayer.pens, {
          //   maxCount: 1,
          //   spaceHeight:
          //     (nodesHeight -
          //       nodeheightArray[0] -
          //       nodeheightArray[1] -
          //       otherNodesHeight) /
          //     (canvas.activeLayer.pens.length - 1)
          // });

          break;
        default:
          this.$emit("menu", e);
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import url("//at.alicdn.com/t/font_2030495_qjucevcilen.css");
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
.el-select-dropdown {
  ul {
    li {
      padding: 0 10px;
      text-align: center;
      // height: 20px;

      svg {
        width: 55px;
        height: 100%;
        line-height: 34px;
      }
    }
  }
}
.draw-header {
  font-size: 0;
  width: 100%;
  height: 100px;
  background-color: #4878c8;
  .fatherli {
    width: auto;
    height: 100%;
    display: inline-block;
    padding: 15px 20px 0 20px;
    position: relative;
    vertical-align: bottom;
    border-right: 1px solid #5a83d3;
    .action {
      font-size: 0;
      min-height: 43px;
      &.align {
        li {
          width: 25px;
          height: 25px;
          margin-right: 10px;
          &:last-child {
            margin-right: 0;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      &.style {
        li {
          display: block;
          div {
            ::v-deep .el-select {
              vertical-align: top;
              margin-bottom: 5px;
              margin-right: 5px;
              width: 88px;
              border: 1px solid #00d7ff;
              .el-input {
                .el-input__suffix {
                  right: -3px;
                  display: none;
                  .el-input__icon {
                    line-height: 17px;
                    color: #00d7ff;
                  }
                }
                input {
                  border: none;
                  color: white;
                  padding: 0;
                  padding-left: 3px;
                  height: 17px !important;
                  font-size: 14px;
                  border-radius: 0;
                  background-color: transparent;
                }
              }
            }
            ::v-deep .el-color-picker {
              height: 19px;
              overflow: hidden;
              border: 1px solid #00d7ff;
              width: 30px;
              .el-color-picker__mask {
                display: none;
              }
              .el-color-picker__trigger {
                width: 100%;
                height: 100%;
                padding: 0;
                border-radius: 0;
                border: none;
                .el-color-picker__color {
                  width: 100%;
                  height: 100%;
                  border: none;
                  border-radius: 0;
                  .el-icon-close {
                    display: none;
                  }
                }
                .el-color-picker__icon {
                  display: none;
                }
              }
            }
          }
        }
      }
      &.operation {
        padding-left: 12px;
        padding-right: 12px;
        li {
          margin-right: 20px;
          &:last-child {
            margin: 0;
          }
          text-align: center;
          p {
            font-size: 10px;
            color: #fff;
            margin-top: 8px;
          }
          i {
            font-size: 26px;
          }
          &.disable {
            pointer-events: none;
            p {
              color: #9a9a9a;
            }
            i {
              color: #9a9a9a;
            }
          }
        }
      }
      &.behavior {
        padding-top: 5px;
        li {
          margin-right: 10px;
          &.top {
            margin-top: 10px;
          }
          &.nomargin {
            margin-right: 0;
          }
          i {
            font-size: 15px;
          }
        }
      }
      &.font {
        .iconli {
          margin-right: 10px;
          &.nomargin {
            margin-right: 0;
          }
          i {
            font-size: 13px;
          }
        }
        .fontColor {
          margin-bottom: 10px;
          width: 30px;
          vertical-align: top;
          border: 1px solid #00d7ff;
          // padding-top: 1px;
          ::v-deep .el-color-picker {
            height: 17px;
            width: 100%;
            .el-color-picker__mask {
              display: none;
            }
            .el-color-picker__trigger {
              width: 100%;
              height: 99%;
              padding: 0;
              border: none;
              .el-color-picker__color {
                width: 100%;
                height: 100%;
                border: none;
                .el-icon-close {
                  display: none;
                }
              }
              .el-color-picker__icon {
                display: none;
              }
            }
          }
        }
        .settingFont {
          margin-right: 5px;
          border: 1px solid #00d7ff;
          width: 65px;
          ::v-deep .el-select {
            .el-input {
              .el-input__suffix {
                right: -3px;
                display: none;
                .el-input__icon {
                  line-height: 17px;
                  color: #00d7ff;
                }
              }
              input {
                border: none;
                color: white;
                padding: 0;
                padding-left: 3px;
                height: 17px;
                font-size: 14px;
                border-radius: 0;
                background-color: transparent;
              }
            }
          }
        }
        .fontSize {
          margin-left: 5px;
          margin-right: 5px;
          border: 1px solid #00d7ff;
          width: 30px;
          ::v-deep .el-select {
            .el-input {
              .el-input__suffix {
                display: none;
                right: -3px;
                .el-input__icon {
                  line-height: 17px;
                  color: #00d7ff;
                }
              }
              input {
                border: none;
                color: white;
                padding: 0;
                padding-left: 3px;
                height: 18px;
                font-size: 14px;
                border-radius: 0;
                background-color: transparent;
              }
            }
          }
        }
      }
      &.line {
        li {
          font-size: 0;
          width: auto;
          ::v-deep .el-select {
            vertical-align: top;
            margin-bottom: 5px;
            margin-right: 5px;
            width: 88px;
            border: 1px solid #00d7ff;
            .el-input {
              .el-input__prefix {
                left: 0;
                right: 0;
                margin: 0 auto;
                i {
                  font-size: 16px;
                }
              }
              .el-input__suffix {
                right: -3px;
                display: none;
                .el-input__icon {
                  line-height: 17px;
                  color: #00d7ff;
                }
              }
              input {
                border: none;
                color: transparent;
                padding: 0;
                padding-left: 3px;
                height: 17px !important;
                font-size: 14px;
                border-radius: 0;
                background-color: transparent;
              }
            }
          }
        }
        .el-dropdown {
          margin-bottom: 5px;
          width: 50px;
          margin-right: 5px;
          .el-dropdown-link {
            display: inline-block;
            width: 100%;
            height: 17px;
            text-align: center;
            border: 1px solid #00d7ff;
            line-height: 17px;
            i {
              width: 100%;
            }
          }
        }
      }

      li {
        display: inline-block;
        i {
          font-family: "iconfont";
          font-size: 24px;
          color: white;
        }
      }
    }
    .introduce {
      margin-top: 15px;
      width: 100%;
      height: auto;
      font-size: 12px;
      color: #00d7ff;
      text-align: center;
    }
  }
}
</style>
