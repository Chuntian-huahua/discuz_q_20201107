import Vue from "vue";
import VueRouter from "vue-router";
import DefaultLayout from "../layouts/default.vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Default",
    component: DefaultLayout,
    children: [
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
    ],
  },
  {
    path: "/author",
    name: "Author",
    component: () =>
      import(/* webpackChunkName:"Author" */ "../layouts/author.vue"),
    children: [
      {
        path: "/author",
        name: "AuthorIndex",
        component: () =>
          import(/* webpackChunkName: "Author" */ "../views/Author/Index.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
