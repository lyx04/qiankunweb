import App from "@/App.vue";
import { initRouter } from "./router/index";
import store from "./store/index";
import { render } from "hlcx-qiankun-commonservice/utils/childRender";
import "./public-path";
import { encode, decode } from "js-base64";
import "hlcx-qiankun-commonservice/components/assets/css/drawfont.css"
import hlcxtool from 'hlcx-jstool'
import { resetForm } from "hlcx-qiankun-commonservice/utils/hlcx"
const isNotQiankun = !window.__POWERED_BY_QIANKUN__;
// eslint-disable-next-line no-undef
Vue.config.productionTip = false;
// eslint-disable-next-line no-undef
Vue.prototype.jstool = hlcxtool
// eslint-disable-next-line no-undef
Vue.prototype.encode = encode;
// eslint-disable-next-line no-undef
Vue.prototype.decode = decode;
// eslint-disable-next-line no-undef
Vue.prototype.resetForm = resetForm;
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
