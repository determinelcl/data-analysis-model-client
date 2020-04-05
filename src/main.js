import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview.js'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://localhost:9000/";
console.log(axios.defaults.baseURL);
Vue.use(VueAxios, axios);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
