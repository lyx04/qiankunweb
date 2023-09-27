var cellOption = [
  {
    submenu: "基本形状",
    children: [
      {
        iconname: "icon-rect",
        iconFamily: "drawfont",
        title: "正方形",
        data: {
          name: "div"
        }
      },
      {
        iconname: "icon-rectangle",
        iconFamily: "drawfont",
        title: "长方形",
        data: {
          name: "rectangle"
        }
      },
      {
        iconname: "icon-diamond",
        iconFamily: "drawfont",
        title: "四边形",
        data: {
          name: "diamond"
        }
      },
      {
        iconname: "icon-triangle",
        iconFamily: "drawfont",
        title: "三角形",
        data: {
          name: "triangle"
        }
      },
      {
        iconname: "icon-circle",
        iconFamily: "drawfont",
        title: "圆形",
        data: {
          name: "circle"
        }
      },
      {
        iconname: "icon-pentagon",
        iconFamily: "drawfont",
        title: "五边形",
        data: {
          name: "pentagon"
        }
      },
      {
        iconname: "icon-hexagon",
        iconFamily: "drawfont",
        title: "六边形",
        data: {
          name: "hexagon"
        }
      },
      {
        iconname: "icon-arrow-left",
        iconFamily: "drawfont",
        title: "左箭头",
        data: {
          name: "leftArrow"
        }
      },
      {
        iconname: "icon-arrow-right",
        iconFamily: "drawfont",
        title: "右箭头",
        data: {
          name: "rightArrow"
        }
      },
      {
        iconname: "icon-line",
        iconFamily: "drawfont",
        title: "直线",
        data: {
          name: "line"
        }
      },
      {
        iconname: "icon-line",
        iconFamily: "drawfont",
        style: "transform:rotate(90deg);display:inline-block",
        title: "横线",
        data: {
          name: "line",
          rotate: 90
        }
      },
      {
        iconname: "icon-text",
        iconFamily: "drawfont",
        title: "文本框",
        data: {
          name: "text",
          text: "链接到接线图"
        }
      }
    ]
  },
  {
    submenu: "数据标签",
    children: [
      {
        iconname: "icon-jiange",
        iconFamily: "iconfont",
        title: "数据标签",
        data: {
          name: "ltee",
          text: "间隔",
          fontColor: "white",
          rect: {
            width: 200,
            height: 100
          },
          data: {
            type: "interval"
          }
        }
      },
      {
        iconname: "icon-donghuan",
        iconFamily: "iconfont",
        title: "动环的数据标签",
        data: {
          name: "ltee",
          fontColor: "white",
          text: "动环",
          rect: {
            width: 200,
            height: 100
          },
          data: {
            type: "ambientData"
          }
        }
      }
    ]
  },
  {
    submenu: "动环监控",
    children: [
      {
        iconname: "icon--donghuan",
        iconFamily: "iconfont",
        title: "动环监控",
        data: {
          name: "image",
          data: {
            type: "monitor"
          },
          rect: {
            width: 200,
            height: 30
          },
          font: {
            lineHeight: 1.5
          },
          text: "输入动环监控",
          lineWidth: null,
          hideAnchor: true,
          strokeStyle: "black",
          children: [
            {
              rectInParent: {
                x: 0,
                y: "50%",
                width: 10,
                height: 10,
                marginTop: -5
              },
              bkType: 0,
              fillStyle: "white",
              name: "circle",
              stand: false,
              hideInput: false,
              hideSizeCP: true,
              hideAnchor: true
            }
          ]
        }
      }
    ]
  },
  {
    submenu: "互感器",
    children: [
      {
        iconname: "te-dianqiyuanqijian_huaban1fuben",
        iconFamily: "ltee",
        title: "电流互感器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue61f"
        }
      },
      {
        iconname: "te-dianqiyuanqijian-02",
        iconFamily: "ltee",
        title: "电流互感器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue61e"
        }
      },
      {
        iconname: "te-dianqiyuanqijian-08",
        iconFamily: "ltee",
        title: "电压互感器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue625"
        }
      }
    ]
  },
  {
    submenu: "显示器",
    children: [
      {
        iconname: "te-dianqiyuanqijian-03",
        iconFamily: "ltee",
        title: "带电显示器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue620"
        }
      }
    ]
  },
  {
    submenu: "避雷器",
    children: [
      {
        iconname: "te-dianqiyuanqijian-04",
        iconFamily: "ltee",
        title: "避雷器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue621"
        }
      }
    ]
  },
  {
    submenu: "开关",
    children: [
      {
        iconname: "te-dianqiyuanqijian-05",
        iconFamily: "ltee",
        title: "接地开关",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue622",
          data: {
            type: "switch"
          }
        }
      }
    ]
  },
  {
    submenu: "出线",
    children: [
      {
        iconname: "te-dianqiyuanqijian-07",
        iconFamily: "ltee",
        title: "电缆出线",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue624"
        }
      }
    ]
  },
  {
    submenu: "变压器",
    children: [
      {
        iconname: "te-dianqiyuanqijian-10",
        iconFamily: "ltee",
        title: "变压器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue627",
          data: {
            type: "transformer"
          }
        }
      },
      {
        iconname: "te-dianqiyuanqijian-09",
        iconFamily: "ltee",
        title: "变压器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue626",
          data: {
            type: "transformer"
          }
        }
      }
    ]
  },
  {
    submenu: "断路器",
    children: [
      {
        iconname: "te-duanluqi",
        iconFamily: "ltee",
        title: "断路器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue628",
          data: {
            type: "switch"
          }
        }
      },
      {
        iconname: "te-duanluqi--2",
        iconFamily: "ltee",
        title: "断路器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue619",
          data: {
            type: "switch"
          }
        }
      },
      {
        iconname: "te-1-1",
        iconFamily: "ltee",
        title: "手车开关",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue629",
          data: {
            type: "switch"
          }
        }
      }
    ]
  },
  {
    submenu: "触点",
    children: [
      {
        iconname: "te-changbichudian",
        iconFamily: "ltee",
        title: "常闭触点",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue616",
          data: {
            type: "switch"
          }
        }
      },
      {
        iconname: "te-changkaichudian",
        iconFamily: "ltee",
        title: "常开触点",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue617",
          data: {
            type: "switch"
          }
        }
      }
    ]
  },
  {
    submenu: "按钮",
    children: [
      {
        iconname: "te-dianqi--anniu",
        iconFamily: "ltee",
        title: "按钮",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue614",
          data: {
            type: "switch"
          }
        }
      }
    ]
  },
  {
    submenu: "指示灯",
    children: [
      {
        iconname: "te-zhishideng",
        iconFamily: "ltee",
        title: "指示灯",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue61b"
        }
      }
    ]
  },
  {
    submenu: "其他",
    children: [
      {
        iconname: "te-dianrongqi",
        iconFamily: "ltee",
        title: "电容器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue618"
        }
      },
      {
        iconname: "te-lvboqi",
        iconFamily: "ltee",
        title: "滤波器",
        data: {
          iconColor: "#ffffff",
          iconFamily: "ltee",
          name: "image",
          icon: "\ue61a"
        }
      }
    ]
  }
];
export default cellOption;
