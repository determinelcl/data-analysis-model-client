import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/iview.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import {TOKEN_INFORMATION} from "./constant/system";

Vue.config.productionTip = false;

axios.defaults.baseURL = "http://localhost:9000/";
console.log(axios.defaults.baseURL);

axios.interceptors.request.use(config => {
    // 获取token
    let tokenInformation = localStorage.getItem(TOKEN_INFORMATION);
    if (tokenInformation && JSON.parse(tokenInformation).access_token)
        config.headers.Authorization = `Bearer ${JSON.parse(tokenInformation).access_token}`;

    return config;
}, error => {
    return Promise.reject(error);
});

Vue.use(VueAxios, axios);

router.beforeEach((to, from, next) => {

    let token = localStorage.getItem(TOKEN_INFORMATION);//获取本地存储的token

    // 如果不需要登录，则直接放行
    if (!to.meta.requireAuth) {
        next();
        return;
    }

    console.log("beforeEach路由守卫验证Token：" + token);
    // 如果用户未登录，则跳转至登录页面
    if (!token) {
        next({path: '/login', query: {redirect: to.fullPath}});
        return;
    }

    console.log("==================beforeEach路由守卫验证Token开始==================");

    // 验证Token是否合法
    let jsonToken = JSON.parse(token);
    axios.post('/oauth2-server/oauth/check_token', qs.stringify({token: jsonToken.access_token}), {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(({data}) => {
        if (!data.active) return Promise.reject(data.error);
        // 如果合法，则进行跳转
        next();
    }).catch(error => {
        // 如果token不合法，则需要进行重新登录
        console.log("beforeEach：异常 " + error);
        next({path: '/login', query: {redirect: to.fullPath}})
    });
});

router.afterEach(route => {
    console.log("afterEach路由守卫的验证：" + route);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
