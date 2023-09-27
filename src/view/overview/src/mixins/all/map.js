import { GET_SYSTEM_ORG_LIST } from "hlcx-qiankun-commonservice/utils/api/system/organization";
import { GET_ORG_ROOM_INFO } from "hlcx-qiankun-commonservice/utils/api/overview/all";

export default {
  data() {
    return {
      mapParam: {
        zoom: 13,
        center: [0, 0],
        mapStyle: "amap://styles/9145b18e7d4d1e18c700b9dcb4be9f61",
        resizeEnable: true, // 是否监控地图容器尺寸变化
        events: {
          init: (o) => {
            this.initMap().then(() => {
              new window.AMap.MarkerClusterer(o, this.mapParam.markerRefs, {
                renderClusterMarker: this._renderCluserMarker,
                minClusterSize: 3,
              });

              this.$nextTick(() => {
                this.mapRender();
              });
            });
          },
        },
        currentWindow: {
          visible: false,
        },
        markers: [],
        markerRefs: [],
      },
    };
  },
  methods: {
    initMap() {
      return new Promise((resolve) => {
        GET_SYSTEM_ORG_LIST().then((e) => {
          var icon = "/platform/common/map/map_icon.png";
          var mapArray = [];
          this.jstool.jshandle.getFilterALlOrgList(e.data).forEach((i) => {
            var obj = {
              extdata: {
                orgid: i.orgId,
                address: i.address,
                name: i.name,
                position: [i.lng, i.lat],
                orgType: i.orgType,

                visible: true,
              },
              position: [i.lng, i.lat],
              icon: icon,
              events: {
                click: (e) => {
                  this.mapParam.currentWindow = {
                    visible: false,
                  };
                  var extdata = e.target.w.extData;
                  //请求单个客户信息
                  GET_ORG_ROOM_INFO(extdata.orgid).then((e) => {
                    var roomInfo = e.data;
                    var roomName = "";
                    roomInfo.rooms.forEach((i) => {
                      roomName = roomName ? roomName + "、" + i.name : i.name;
                    });
                    extdata["roomName"] = roomName;
                    extdata["capacity"] = roomInfo.capacity;
                    extdata["address"] = e.data.address;
                    this.mapParam.currentWindow = extdata;
                  });
                },
                init: (o) => {
                  this.mapParam.markerRefs.push(o);
                },
              },
              draggable: false,
            };
            mapArray.push(obj);
          });
          this.mapParam.markers = mapArray;
          resolve();
        });
      });
    },
    _renderCluserMarker(context) {
      const count = this.mapParam.markers.length;
      let bgImg = "";
      if (context.count < 10) {
        bgImg = "/platform/common/map/samll_map.png";
      } else {
        bgImg = "/platform/common/map/big_map.png";
      }
      let div = document.createElement("div");
      let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
      div.style.width = div.style.height = size + "px";
      div.style.borderRadius = size / 2 + "px";
      div.innerHTML = context.count;
      div.style.backgroundImage = "url(" + bgImg + ")";
      div.style.backgroundRepeat = "no-repeat";
      div.style.backgroundSize = "100%";
      div.style.lineHeight = size + "px";
      div.style.color = "white";
      div.style.fontSize = "14px";
      div.style.textAlign = "center";
      context.marker.setOffset(new window.AMap.Pixel(-size / 2, -size / 2));
      context.marker.setContent(div);
    },
    //单个跳转站点概况
    urlTosite(orgid) {
      const newhref = this.$router.resolve({
        path: "/index/overview/site/" + orgid,
      });
      window.open(newhref.href, "_blank");
    },
  },
};
