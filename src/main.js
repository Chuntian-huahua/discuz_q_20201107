import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import State from "./state";

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
CDiscuzQ.request.setReuqestUrl("http://127.0.0.83/api");
CDiscuzQ.request.setAuthorization(
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIiLCJqdGkiOiI1MGUwYTkwMzc1YTIzZWRjMWNkNmNjMzFlMzExOGFjYmQ2ZmZmOGU5ZDRkMzQxZTU1OTRlODdhMDAyNzcxMGQxMWUwZWE5YjExZDI3MTY1YyIsImlhdCI6MTYwMzk4MTY3OSwibmJmIjoxNjAzOTgxNjc5LCJleHAiOjE2MDY1NzM2NzksInN1YiI6IjEiLCJzY29wZXMiOltudWxsXX0.NyzHbpX6vYMyRifjRFU73KyjYq-Y9p4Z3ztIV1KMqwAbLAC9KRg0C4z-UREjArgoMHQZ0_K-kYHBDFhOQGRVGhlc3mlIZHkH-SgBm8j8-sk3VFRyGuXUvpyznY3iEWprDVARP-SufikDN6MEa4RAsAee-ydMW2mkBsXMoxux9cu7uUb8_tjfj9Nli916nRZdo59Vr_8jbk_QpnmqwS74nFLB6osRjFDsUJWyaYv0u9PUrr40lVwUmsWhh62vZrv7MgtecchcAv-ckDBnPblLfXGecjRf5eXiuZneLBtNZ3NIlBA5p4jQ_YeUGjefMWY_rLUiBiaNwkywGlb-44BUFA"
);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
