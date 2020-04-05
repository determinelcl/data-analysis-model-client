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

router.beforeEach((to, from, next) => {
    // this.LoadingBar.start(); //loading 效果

    store.state.user.token = sessionStorage.getItem('token');//获取本地存储的token

    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (store.state.user.token != null && store.state.user.token !== '') {  // 通过vuex state获取当前的token是否存
            next();
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        next();
    }
});

router.afterEach(route => {
    // this.LoadingBar.finish();
    console.log(route);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
