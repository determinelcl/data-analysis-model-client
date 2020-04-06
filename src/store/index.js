import Vue from 'vue'
import Vuex from 'vuex'
import {
    CHANGE_ACTIVE_MENU,
    CHANGE_ACTIVE_TAG,
    CHANGE_OPENED_MENU,
    CHANGE_TAGS_LIST,
    REMOVE_TAB,
    ADD_ACCOUNT,
    REMOVE_ACCOUNT,
    UPDATE_MENU_LIST
} from "./mutations.type";
import {TOKEN_INFORMATION} from "../constant/system";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            username: '',
            userIcon: ''
        },
        tab: {
            activeTab: '1-2',
            openedTabList: [
                {label: '评论管理', name: '1-2', component: 'hello2'}
            ]
        },
        menu: {
            openMenuName: 1,
            activeMenuName: '1-2',
            menuList: [
                {
                    id: 1, icon: 'ios-paper', name: '内容管理',
                    itemList: [
                        {id: '1-1', name: '文章管理', url: '/home/hello', component: 'hello'},
                        {id: '1-2', name: '评论管理', url: '/home/hello2', component: 'hello2'},
                        {id: '1-3', name: '举报管理', url: '/home/hello3', component: 'hello3'}
                    ]
                },
                {
                    id: 2, icon: 'ios-people', name: '用户管理',
                    itemList: [
                        {id: '2-1', name: '新增用户', url: '/home/hello', component: 'hello'},
                        {id: '2-2', name: '活跃用户', url: '/home/hello', component: 'hello'}
                    ]
                },
                {
                    id: 3, icon: 'ios-stats', name: '统计分析',
                    itemList: [
                        {id: '3-1', name: '新增和启动', url: '/home/hello', component: 'hello'},
                        {id: '3-2', name: '活跃分析', url: '/home/hello', component: 'hello'},
                        {id: '3-3', name: '时段分析', url: '/home/hello', component: 'hello'},
                        {id: '3-4', name: '用户留存', url: '/home/hello', component: 'hello'},
                        {id: '3-5', name: '流失用户', url: '/home/hello', component: 'hello'}
                    ]
                },
            ]
        }
    },
    getters: {
        findMenuItemByItemId: state => (itemId) => {
            let menuItem = null;
            state.menu.menuList.forEach(menu => {
                menu.itemList.forEach(item => {
                    if (item.id !== itemId) return;
                    menuItem = item;
                })
            });
            return menuItem;
        },
        // 用于动态更新面包屑导航文本
        level2MenuName: state => {
            let menuName = '';

            state.menu.menuList.forEach(menu => {
                if (menu.id !== state.menu.openMenuName) return;
                menuName = menu.name;
            });

            return menuName;
        },
        // 用于动态更新面包屑导航文本
        level3MenuName: state => {
            let menuItem = null;
            state.menu.menuList.forEach(menu => {
                menu.itemList.forEach(item => {
                    if (item.id !== state.menu.activeMenuName) return;
                    menuItem = item;
                })
            });

            return menuItem.name;
        }
    },
    mutations: {
        [CHANGE_TAGS_LIST](state) {
            console.log('CHANGE_TAGS_LIST方法执行了');
            // 1、首先需要的打开一个新的标签页，这个标签页的
            // {label: 'hello2', name: 'hello2'}
            // label代表显示的标签名称，name表示被选中时的所标记的值，activeTab
            // 查看openedTabList是否包含当前打开的tab如果不包含，则新增
            let isExist = false;
            state.tab.openedTabList.forEach(tabItem => {
                if (tabItem.name !== state.menu.activeMenuName) return;
                isExist = true;
            });

            // 选中的tab标签等于选中的菜单项
            if (isExist) {
                state.tab.activeTab = state.menu.activeMenuName;
                return;
            }

            // 如果选中的菜单中不存在打开的tab列表中，则新建一个tab标签对象
            // 其中label等于active的name，
            let activeTabItemLabel = '';
            let activeTabRouterName = '';
            state.menu.menuList.filter(item => item.id === state.menu.openMenuName).forEach(menu => {
                menu.itemList.forEach(item => {
                    if (item.id !== state.menu.activeMenuName) return;
                    activeTabItemLabel = item.name;
                    activeTabRouterName = item.component;
                })
            });

            let tabItem = {
                label: activeTabItemLabel,
                name: state.menu.activeMenuName,
                component: activeTabRouterName
            };

            state.tab.openedTabList.push(tabItem);

            console.log(state.tab);
        },
        [CHANGE_ACTIVE_TAG](state, tabName) {
            state.tab.activeTab = tabName;
            state.menu.activeMenuName = tabName;
            let number = tabName.slice(0, tabName.indexOf('-'));
            state.menu.openMenuName = parseInt(number);
        },
        [REMOVE_TAB](state, tabName) {
            console.log(tabName);

            let index = state.tab.openedTabList.findIndex(tab => tab.name === tabName);

            state.tab.openedTabList.splice(index, 1);

            let activeMenuName = state.tab.activeTab;
            if (activeMenuName === -1) return;

            state.menu.activeMenuName = activeMenuName;
            let number = activeMenuName.slice(0, activeMenuName.indexOf('-'));
            state.menu.openMenuName = parseInt(number);
            console.log(activeMenuName);
            console.log(state.tab.openedTabList);
        },
        [CHANGE_ACTIVE_MENU](state, activeMenu) {
            state.menu.activeMenuName = activeMenu
        },
        [CHANGE_OPENED_MENU](state, openedMenu) {
            state.menu.openMenuName = openedMenu;
        },
        [ADD_ACCOUNT](state, tokenInfo) { // 第一个参数为 state 用于变更状态 登录
            localStorage.setItem(TOKEN_INFORMATION, tokenInfo);

            state.user.token = tokenInfo;
        },
        [REMOVE_ACCOUNT](state) { // 退出登录
            console.log('REMOVE_ACCOUNT ' + state);
            localStorage.removeItem(TOKEN_INFORMATION);
        },
        [UPDATE_MENU_LIST](state, {data}) {
            // todo: 用于更新menu
            console.log("UPDATE_MENU_LIST " + state.user);
            console.log(data);
        }
    },
    actions: {},
    modules: {}
})
