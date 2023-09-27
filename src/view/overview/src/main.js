import App from "@/page/App.vue";
import { initRouter } from "./router/index";
import store from "./store/index";
import { render } from "hlcx-qiankun-commonservice/utils/childRender";
import VueAMap from "vue-amap";
import "./public-path";
import hlcxtool from 'hlcx-jstool'
const isNotQiankun = !window.__POWERED_BY_QIANKUN__;
// eslint-disable-next-line no-undef
Vue.config.productionTip = false;
// eslint-disable-next-line no-undef
Vue.prototype.jstool = hlcxtool
VueAMap.initAMapApiLoader({
  key: "548152141dc625e4768f56722e253f50",
  plugin: [
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.Geolocation",
    "AMap.Geocoder",
    "AMap.AMapManager",
    "AMap.Marker",
    "AMap.MarkerClusterer"
  ],
  v: "1.4.4", //版本
  uiVersion: "1.0" //ui版本
});
// eslint-disable-next-line no-undef
Vue.use(VueAMap);
// 如果独立运行时，则会执行这里
if (isNotQiankun) {
  // 独立运行时，应该干点什么事
  console.log("项目自己独立运行");
  render({
    // eslint-disable-next-line no-undef
    Vue,
    App,
    storeInstance:store,
    env:process.env,
    initRouter
  });
}


// eslint-disable-next-line no-unused-vars
export async function bootstrap(props) {
  // console.log(props);
  // Vue.prototype.$mainBus = props.bus
}

export async function mount(props) {
  render({
    props,
    // eslint-disable-next-line no-undef
    Vue,
    App,
    storeInstance:store,
    env:process.env,
    initRouter
  });
}

export async function unmount() {
}
