import { createApp } from "vue"
import App from "./App.vue"
import { createRouter, createWebHashHistory } from "vue-router"
// import VueRouter from "vue-router";
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

const app = createApp(App)
app.use(router)
app.mount("#app")

;(function () {
  const idleDurationSecs = 60
  const redirectUrl = "/"
  let idleTimeout

  const resetIdleTimeout = function () {
    if (idleTimeout) clearTimeout(idleTimeout)
    idleTimeout = setTimeout(function () {
      location.href = redirectUrl
    }, idleDurationSecs * 1000)
  }

  // init on page load
  resetIdleTimeout()

  // reset the idle timeout on any of the events listed below
  ;["click", "touchstart", "mousemove"].forEach((evt) => document.addEventListener(evt, resetIdleTimeout, false))
})()
