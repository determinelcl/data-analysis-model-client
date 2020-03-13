import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";

Vue.use(VueRouter);

const routes = [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login}
    // {path: '/about', name: 'About', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')}

];

const router = new VueRouter({
    routes
});

export default router
