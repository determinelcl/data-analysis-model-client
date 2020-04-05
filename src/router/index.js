import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Register from "../views/Register";
import Home from "../views/Home";

Vue.use(VueRouter);

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'login', component: Login},
    {path: '/register', name: 'register', component: Register},
    {path: '/home', name: 'home', component: Home, meta: {requireAuth: true}}
    // {path: '/about', name: 'About', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')}

];

const router = new VueRouter({
    routes
});

// 解决跳转相同路由的问题：Unhandled Promise Rejection: NavigationDuplicated: Navigating to current location (url)
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

// 自定义动态添加路由的方法，解决了路由重复创建的问题
router.$addRoutes = (route) => {
    router.matcher = new VueRouter().matcher;
    router.addRoutes(route)
};

export default router
