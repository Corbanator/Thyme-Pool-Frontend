import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import VueTest from "../views/VueTest.vue";
import RoomsList from "../views/RoomsList.vue"
import GameView from "../views/GameView.vue";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/test",
      name: "test",
      component: VueTest,
    },
    {
      path:'/roomslist',
      name:'rooms-list',
      component:RoomsList
    }/*,
    {
      path:'/gameview',
      name:'game-view',
      component:GameView
    }*/,
    {
      path:'/gameview/:roomID',
      name:'game-view',
      component:GameView,
      props:true
    }
  ],
});

export default router;
