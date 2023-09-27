<template>
  <div style="width:100%;height:100%;position: relative;">
    <div id="draw"></div>
    <div class="powername">
      {{ parent.powername }}
    </div>
    <i @click="fulldraw" class="iconfont icon-fangda fangda"></i>
  </div>
</template>

<script>
import { Topology, registerNode } from "@topology/core";
import { mapState } from "vuex";
registerNode(
  "ltee",
  // eslint-disable-next-line no-undef
  Vue.prototype.jstool.customtopology.myShape,
  null,
  null,
  // eslint-disable-next-line no-undef
  Vue.prototype.jstool.customtopology.myTextRect
);
var canvas;
import * as pako from "pako";
export default {
  computed: {
    ...mapState(["drawhandle"])
  },
  watch: {
    drawhandle() {
      var width = document.getElementById("draw").clientWidth;
      document
        .getElementById("draw")
        .getElementsByTagName("canvas")[0].style.width = width + "px";
      this.drawspanflag = true;
      setTimeout(() => {
        canvas.fitView();
        canvas.canvasPos = canvas.divLayer.canvas.getBoundingClientRect();
      }, 500);
    }
  },
  data() {
    return {
      canvas: "",
      parent: this.$parent,
      canvasMoveflag: false,
      drawspanflag: false
    };
  },
  destroyed() {
    window.onresize = null;
    console.log(canvas);
    canvas.destroy();
    this.canvasMoveflag = false;
    canvas = null;
  },
  beforeRouteLeave(to, from, next) {
    canvas.destroy();
    this.canvasMoveflag = false;
    next();
  },
  mounted() {
    var t;
    this.initDraw();
    window.onresize = null;
    window.onresize = function() {
      clearTimeout(t);
      t = setTimeout(function() {
        canvas.canvasPos = canvas.divLayer.canvas.getBoundingClientRect();
      }, 500);
    };
  },
  methods: {
    //放大接线图
    fulldraw() {
      if (!document.fullscreenElement) {
        document.querySelector("#draw").requestFullscreen();
        setTimeout(() => {
          canvas.fitView();
          canvas.canvasPos = canvas.divLayer.canvas.getBoundingClientRect();
        }, 500);
      } else {
        document.exitFullscreen();
        setTimeout(() => {
          canvas.fitView();
          canvas.canvasPos = canvas.divLayer.canvas.getBoundingClientRect();
        }, 500);
      }
    },
    drawRender(message) {
      /** 
        利用接线图的节点列表去寻找messageArray中的网关表计
        只根据数据进行渲染，不进行任何逻辑处理
      */
      this.parent.devList.forEach(i => {
        var node = canvas.find(i.drawNodeId);
        if (node.length == 0) return false;
        var meter = message[i.sn][i.commId][i.labels];
        var nodecolor = "green";
        var nodevalue = meter.v;
        if (message[i.sn].state) {
          nodecolor = "green";
          if (message[i.sn][i.commId].state) {
            nodecolor = "green";
            if (message[i.sn][i.commId][i.labels].dq) {
              nodecolor = "red";
            } else {
              nodecolor = "green";
            }
          } else {
            nodecolor = "red";
            nodevalue = "";
          }
        } else {
          nodecolor = "red";
          nodevalue = "";
        }
        if (i.parentId) {
          node.children[0].fontColor = nodecolor;
          node.children[2].fontColor = nodecolor;
          node.children[1].fontColor = nodecolor;
          node.children[1].text = String(nodevalue);
        } else {
          if (node.data.type == "switch") {
            node.iconColor = nodecolor;
          }
          if (node.data.type == "monitor") {
            node.fontColor = nodecolor;
            node.children[0].fillStyle = nodecolor;
          }
        }
      });
      canvas.render();
    },
    returnCanvas() {
      return canvas;
    },
    //画图
    paint(json) {
      canvas.resize();
      var str = null;
      if (json != null) {
        str = atob(json);
        str = pako.inflate(str, { to: "string" });
        str = JSON.parse(str);
      }
      canvas.open(str);
      canvas.render();
      this.drawspanflag = true;
      canvas.fitView();
      canvas.canvasPos = canvas.divLayer.canvas.getBoundingClientRect();
      this.parent.startTimeout();
    },
    // 初始化接线图
    initDraw() {
      var self = this;
      if (!canvas) {
        this.$nextTick(() => {
          canvas = new Topology("draw", {
            on: self.onMessage,
            minScale: 0.06
          });
          // canvas.data.lineName = "polyline";
          // canvas.data.bkColor = "black";
          // canvas.render();
        });
      }
    },
    //量测量告警
    // measureAlarm(message) {
    //   var res = message;
    //   // clientId网关标识
    //   var measure = [];
    //   if (res.measure == "通信状态") {
    //     measure = this.parent.devList.filter(i => {
    //       return i.sn == res.clientId && res.dev == i.commId;
    //     });
    //   } else {
    //     measure = this.parent.devList.filter(i => {
    //       return (
    //         i.sn == res.clientId &&
    //         i.commId == res.dev &&
    //         i.labels == res.measure
    //       );
    //     });
    //   }

    //   if (measure.length) {
    //     measure.forEach(i => {
    //       var node = canvas.find(i.drawNodeId);
    //       if (node) {
    //         if (i.parentId) {
    //           node.children[0].fontColor = "red";
    //           node.children[1].text = " ";
    //           node.children[1].fontColor = "red";
    //           node.children[2].fontColor = "red";
    //         } else {
    //           if (node.data.type == "switch") {
    //             node.iconColor = "red";
    //           }
    //           if (node.data.type == "monitor") {
    //             node.fontColor = "red";
    //             node.children[0].fillStyle = "red";
    //           }
    //         }
    //       }
    //       canvas.updateProps(node);
    //     });
    //   }
    // },
    //网关告警
    // gatewayAlarm(message) {
    //   // alarmType:00上线，01掉线
    //   var res = message;
    //   //先处理网关及以下表计的颜色
    //   var gateway = this.parent.metersList.filter(i => {
    //     return i.sn == res.clientId;
    //   });
    //   if (gateway.length) {
    //     gateway = gateway[0];
    //     var measureColor = "";
    //     switch (res.alarmType) {
    //       case "00":
    //         gateway.status = "client_connected";
    //         gateway.devs.forEach(i => {
    //           i.status = "active";
    //         });
    //         measureColor = "green";
    //         break;
    //       case "01":
    //         gateway.status = "client_disconnected";
    //         gateway.devs.forEach(i => {
    //           i.status = "error";
    //         });
    //         measureColor = "red";
    //         break;
    //     }
    //     //处理量测量变色
    //     var measure = this.parent.devList.filter(i => {
    //       return i.sn == gateway.sn;
    //     });
    //     if (measure.length) {
    //       measure.forEach(i => {
    //         var node = canvas.find(i.drawNodeId);
    //         if (node) {
    //           if (i.parentId) {
    //             node.children[0].fontColor = measureColor;
    //             node.children[1].fontColor = measureColor;
    //             node.children[1].text = "";
    //             node.children[2].fontColor = measureColor;
    //           } else {
    //             if (node.data.type == "switch") {
    //               node.iconColor = measureColor;
    //             }
    //             if (node.data.type == "monitor") {
    //               node.fontColor = measureColor;
    //               node.children[0].fillStyle = measureColor;
    //             }
    //           }
    //         }
    //         canvas.updateProps(node);
    //       });
    //     }
    //   }
    // },
    //渲染通讯工况（因为默认都是错误的，所以只修改有数据的）
    renderState(message) {
      // 通信状态1代表正常
      // 0代表异常

      this.parent.metersList.forEach(i => {
        i.status = message[i.sn].state;
        if (i.devs.length) {
          i.devs.forEach(item => {
            item.status = message[i.sn][item.dev].state;
          });
        }
      });
      // this.parent.metersList.forEach(i => {
      //   if (i.status == "client_connected") {
      //     i.devs.forEach(dev => {
      //       dev.status = "error";
      //     });
      //   }
      // });
      // this.parent.dqList.forEach(dq => {
      //   var devPkeyorSn = dq.split("/")[1] + "/" + dq.split("/")[2];
      //   var meter = this.parent.metersList.filter(dev => {
      //     return dev.topic == devPkeyorSn;
      //   });
      //   if (meter.length) {
      //     var devName = dq.split("/")[0];
      //     var dev = meter[0].devs.filter(i => {
      //       return i.dev == devName;
      //     });
      //     if (dev.length) {
      //       dev.forEach(i => {
      //         i.status = "active";
      //       });
      //     }
      //   }
      // });
    },
    // 表计的上线变色（网关数据）
    // gatewayToMeter(message) {
    //   // 1表示设备和网关通讯正常
    //   // 0表示通讯失败
    //   var res = message;
    //   var devState;
    //   res.devs.forEach(i => {
    //     var devElem = i.d.filter(devD => {
    //       return devD.m == "通信状态";
    //     });
    //     if (devElem.length) {
    //       devState = i.dev + "/" + res.pKey + "/" + res.sn;
    //       if (this.parent.dqList.indexOf(devState) >= 0) {
    //         if (!devElem[0].v) {
    //           this.parent.dqList.splice(
    //             this.parent.dqList.indexOf(devState),
    //             1
    //           );
    //         }
    //       } else {
    //         if (devElem[0].v) {
    //           this.parent.dqList.push(devState);
    //         }
    //       }
    //       this.renderState();
    //     }
    //   });
    // },
    // 接线图的量测量（网关数据）
    // gatewayToDraw(message) {
    //   var res = message;
    //   res.devs.forEach(i => {
    //     var mydevs = this.parent.devList.filter(j => {
    //       return j.sn == res.sn && j.commId == i.dev;
    //     });
    //     if (mydevs.length) {
    //       mydevs.forEach(devItem => {
    //         var Elem = i.d.filter(ElemItem => {
    //           return ElemItem.m == devItem.labels;
    //         });
    //         if (Elem.length) {
    //           Elem = Elem[0];
    //           var node = canvas.find(devItem.drawNodeId);
    //           //node万一找不到
    //           if (node) {
    //             if (devItem.parentId) {
    //               if (Elem.dq) {
    //                 //设备有问题
    //                 node.children[0].fontColor = "red";
    //                 node.children[1].fontColor = "red";
    //                 node.children[2].fontColor = "red";
    //               } else {
    //                 node.children[0].fontColor = "green";
    //                 node.children[2].fontColor = "green";
    //                 node.children[1].fontColor = "green";
    //                 node.children[1].text = String(Elem.v);
    //               }
    //             } else {
    //               if (node.data.type == "switch") {
    //                 if (Elem.dq) {
    //                   node.iconColor = "red";
    //                 } else {
    //                   node.iconColor = "green";
    //                 }
    //               }
    //               if (node.data.type == "monitor") {
    //                 if (Elem.dq) {
    //                   node.fontColor = "red";
    //                   node.children[0].fillStyle = "red";
    //                 } else {
    //                   node.fontColor = "green";
    //                   node.children[0].fillStyle = "green";
    //                 }
    //               }
    //             }
    //             canvas.updateProps(node);
    //           }
    //         }
    //       });
    //     }
    //   });
    // },
    //接线图节点响应
    onMessage(data, node) {
      switch (data) {
        case "node":
          this.parent.monitor.button = false;
          //变压器和间隔
          if (!node.data) return false;
          if (node.data.type == "transformer" || node.data.type == "interval") {
            this.parent.monitor.button = true;
            var activeNode = this.parent.drawInfo.list.filter(i => {
              return i.parentId == node.id;
            });
            this.parent.monitor.node = activeNode;
            this.parent.$refs.monitorButton.style.left =
              node.rect.ex + 10 + "px";
            this.parent.$refs.monitorButton.style.top =
              node.rect.ey -
              node.rect.height / 2 -
              this.parent.$refs.monitorButton.offsetHeight / 2 +
              "px";
          }
          //链接
          if (node.name == "text") {
            if (node.data.customLink) {
              var routeArr = this.$route.params.query.split("-");
              routeArr[1] = node.data.customLink;
              this.$router.push({
                params: {
                  query: routeArr.join("-")
                }
              });
            }
          }
          break;
        case "translate":
          //移动
          if (!this.drawspanflag) {
            this.canvasMoveflag = true;
          }
          break;
        case "space":
          this.drawspanflag = false;
          this.parent.monitor.button = false;
          break;
      }
      //
    }
  }
};
</script>

<style lang="scss" scoped>
#draw {
  width: 100%;
  height: 100%;

  overflow: visible !important;
}
.fangda {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.powername {
  position: absolute;
  left: 10px;
  top: 10px;
  color: white;
  font-size: 12px;
  z-index: 10;
}
.scaleNum {
  position: absolute;
  right: 30px;
  bottom: 30px;
  color: white;
  font-size: 12px;
  z-index: 10;
}
</style>
