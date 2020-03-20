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
    {path: '/home', name: 'home', component: Home}
    // {path: '/about', name: 'About', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')}

];

const router = new VueRouter({
    routes
});


// 自定义动态添加路由的方法，解决了路由重复创建的问题
router.$addRoutes = (route) => {
    router.matcher = new VueRouter().matcher;
    router.addRoutes(route)
};

export default router
