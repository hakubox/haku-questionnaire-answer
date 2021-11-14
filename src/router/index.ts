import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import CallBack from "../views/CallBack.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/callback",
    name: "CallBack",
    component: CallBack,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
