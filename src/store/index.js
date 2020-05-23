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
    UPDATE_MENU_LIST,
    PERSIST_STATE,
    LOAD_STATE,
    UPDATE_ACCOUNT
} from "./mutations.type";
import {STATE_INFORMATION, TOKEN_INFORMATION} from "../constant/system";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        rootRouter: '/home',
        fileRoot: 'http://192.168.100.2:80',
        style: {
            contentStyle: {
                margin: '16px 24px',
                backgroundColor: '#ffffff',
                padding: '16px',
                overflow: 'auto',
                position: 'relative'
            }
        },
        user: {
            id: -1,
            username: '',
            userIcon: '',
            // 关注的用户列表
            followList: [],
        },
        tab: {
            activeTab: '',
            openedTabList: []
        },
        menu: {
            openMenuName: 1,
            activeMenuName: '',
            menuList: []
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
        // 获取打开的菜单项
        activeMenuItem: state => {
            let menuItem = null;
            state.menu.menuList.forEach(menu => {
                menu.itemList.forEach(item => {
                    if (item.id !== state.menu.activeMenuName) return;
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
        [ADD_ACCOUNT](state, data) { // 第一个参数为 state 用于变更状态 登录
            localStorage.setItem(TOKEN_INFORMATION, data.tokenInfo);

            state.user.username = data.username;
        },
        [UPDATE_ACCOUNT](state, user) {
            state.user.id = user.id
            state.user.username = user.username
            state.user.followList = user.followIdList
        },
        [REMOVE_ACCOUNT](state) { // 退出登录
            console.log('REMOVE_ACCOUNT ' + state);
            localStorage.removeItem(TOKEN_INFORMATION);
        },
        [UPDATE_MENU_LIST](state, data) {
            // 1、递归data生成菜单树
            let parentMenuList = data.data.filter(item => item.parentId === 0 && item.showType === 0);
            parentMenuList.forEach(item => {
                item['itemList'] = [];
                data.data.filter(temp => temp.parentId === item.id).forEach(temp => {
                    let tempItem = temp;
                    // 将itemList的id转换成parentId-childId的形式
                    tempItem.id = `${item.id}-${temp.id}`;
                    tempItem.url = `${state.rootRouter}/${temp.component.url}`;
                    item.itemList.push(tempItem);
                });
            });
            console.log(parentMenuList);

            // 更新菜单状态
            state.menu.menuList = parentMenuList;
            let activeMenuItem = parentMenuList[0].itemList[0];
            state.menu.activeMenuName = activeMenuItem.id;
            state.menu.openMenuName = parentMenuList[0].id;

            // 更新打开的Tab页签的状态
            state.tab.activeTab = activeMenuItem.id;
            state.tab.openedTabList = [];
            state.tab.openedTabList.push({
                label: activeMenuItem.name, name: activeMenuItem.id, component: activeMenuItem.component
            });
        },
        [PERSIST_STATE](state) {
            localStorage.setItem(STATE_INFORMATION, JSON.stringify(state));
        },
        [LOAD_STATE](state) {
            let item = localStorage.getItem(STATE_INFORMATION);
            if (!item && state.user.username) return;

            Object.assign(state, JSON.parse(item));
            localStorage.removeItem(STATE_INFORMATION);
        }
    },
    actions: {},
    modules: {}
})
