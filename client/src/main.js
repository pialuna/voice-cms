import Vue from 'vue'
import VueRouter from 'vue-router';

import ElementUI from 'element-ui';
import 'element-theme-chalk';
import locale from 'element-ui/lib/locale/lang/en';
import './index.css'

import App from './App.vue'
import { routes } from './routes';
import { store } from './store/index';

Vue.use(VueRouter);

Vue.use(ElementUI, { locale });

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
