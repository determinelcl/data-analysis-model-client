import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Register from "../views/Register";

Vue.use(VueRouter);

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', name: 'login', component: Login},
    {path: '/register', name: 'register', component: Register}
    // {path: '/about', name: 'About', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')}

];

const router = new VueRouter({
    routes
});

export default router
