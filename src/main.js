import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from "vue-router"
// import VueRouter from "vue-router";
// import TestTouch from "./views/HomeScreen.vue"
import TestTouch from "./views/TestTouch.vue"
import CreateSoup from "./views/CreateSoup.vue"
import "./app.css"

const routes = [
  {
    component: TestTouch,
    path: "/",
  },
  {
    component: CreateSoup,
    path: "/create-soup",
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App);
app.use(router);
app.mount("#app");