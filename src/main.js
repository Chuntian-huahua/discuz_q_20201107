import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import State from "./state";
import Config from "./config";

Vue.prototype.$state = Vue.observable(State);
Vue.nextTick(function() {
  console.log("next tick");
});

import Antd, { Button, message, Icon, Row, Col } from "ant-design-vue";
Vue.use(Antd);
import "ant-design-vue/dist/antd.less";
Vue.use(Button);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.prototype.$message = message;

import CIcon from "./components/CIcon";
Vue.component("c-icon", CIcon);
import "./common.css";
import "./assets/iconfont/iconfont.css";

Vue.config.productionTip = true;

import CDiscuzQ from "./function/CDiscuzQ";
Vue.prototype.$dzq = CDiscuzQ;
Vue.prototype.$state = Vue.observable({
  user: {
    isLogin: false,
  },
});
CDiscuzQ.request.setReuqestUrl(Config.ApiUrl);
CDiscuzQ.user.authentication().then((userInfo) => {
  userInfo["isLogin"] = true;
  Vue.prototype.$state.user = userInfo;
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
