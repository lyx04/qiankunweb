import app from "./App.vue";
import router from "./view/main/router/index";
import store from "@/common/store/index";
import "@/common/assets/css/index.scss";
import "@/common/assets/css/all.scss";
import directive from "hlcx-qiankun-commonservice/utils/directive";

import actions from "hlcx-qiankun-commonservice/utils/store/qiankunStore"
import  commonStore  from 'hlcx-qiankun-commonservice/utils/store/commonStore'
commonStore(store,actions)
// eslint-disable-next-line no-undef
Vue.prototype.mqFlag = true;
// eslint-disable-next-line no-undef,no-unused-vars
Vue.use(directive)
// eslint-disable-next-line no-undef,no-unused-vars
window.appvue = new Vue({
  render: (h) => h(app),
  router,
  store,
}).$mount("#app");