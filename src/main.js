import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from "vue-router"
import HomeScreen from "./views/HomeScreen.vue"
import CreateSoup from "./views/CreateSoup.vue"
import "./app.css"

const routes = [
  {
    component: HomeScreen,
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