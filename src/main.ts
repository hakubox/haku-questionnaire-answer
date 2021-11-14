import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vant from 'vant';
import components from '@/common/register-global-components';
import axios from "axios";

import '@/assets/less/main.less';
import 'vant/lib/index.less';

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = document.location.href.substr(0, document.location.href.lastIndexOf('ivt/ivtanswer'));
} else {
  // axios.defaults.baseURL = 'https://hlw.cenboomh.com/hlw_tytest/';
  axios.defaults.baseURL = 'https://hlw.cenboomh.com/base-dev/app-gateway-server/';
}

const app = createApp(App);

app.use(components);

app.use(Vant).use(store).use(router).mount("#app");
