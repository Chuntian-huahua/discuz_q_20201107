import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/v/:thread_id",
    name: "Video",
    component: () =>
      import(/* webpackChunkName: "video" */ "../views/Video/Video.vue"),
  },
  {
    path: "/channel/:channel_name",
    name: "VideoChannel",
    component: () =>
      import(/* webpackChunkName: "video" */ "../views/Video/Channel.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
