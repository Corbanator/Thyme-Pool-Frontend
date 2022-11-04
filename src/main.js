import Vue from 'vue'
import {BootstrapVue, IconsPlugin} from "bootstrap-vue"
import { createPinia, PiniaVuePlugin } from 'pinia'

// eslint-disable-next-line no-unused-vars
import App from './App.vue'
import App2 from './App2.vue'
import router from './router'

//import './assets/main.css'
import './app.scss'
Vue.use(PiniaVuePlugin)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App2)
}).$mount('#app')
