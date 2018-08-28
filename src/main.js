import Vue from 'vue';
import axios from 'axios';
import VModal from 'vue-js-modal';

import App from './App.vue';
import router from './router';


Vue.config.productionTip = false;

Vue.prototype.$http = axios.create({
  baseURL: 'http://192.168.100.199/v2',
});

Vue.use(VModal, { dialog: true });

// https://api.account.otau.org - Server otau


new Vue({
  render: h => h(App),
  router,
  axios,
}).$mount('#app');
