import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Vuelidate from 'vuelidate';
import Vuetify from 'vuetify'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'
import 'vuetify/dist/vuetify.min.css'

// router setup
import routes from './routes/routes'
import { store } from './Store/Store'
import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.200.147:8087/';

// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(Vuelidate)
Vue.use(Vuetify)

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

router.beforeEach((to, from, next) => {
    next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App),
  router
})
