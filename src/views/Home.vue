<template>
    <div class="layout">
        <Layout :style="{minHeight: '100vh'}">
            <Sider ref="side" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" width="256px"
                   :style="{background: '#191a23', boxShadow: '2px 0 6px rgba(0,21,41,.35)', zIndex: 3}">
                <Logo height="65px" font-size="20px" logo-space="3px" logo-size="50px" font-color="#ffffff"
                      :style="{borderBottom: '1px solid #0E0E12'}" :is-show="showLogoContent"/>

                <Menu ref="sideMenu" :active-name="menu.activeMenuName" theme="dark" width="auto" accordion
                      :open-names="[menu.openMenuName]" :class="menuitemClasses" :style="{background: '#191a23'}"
                      @on-select="selectedMenu" @on-open-change="changeOpenedMenu">
                    <Submenu :name="submenu.id" v-show="!isCollapsed"
                             v-for="submenu in menu.menuList" :key="submenu.id">
                        <template slot="title">
                            <Icon :type="submenu.icon"/>
                            <span>{{ submenu.name }}</span>
                        </template>
                        <MenuItem :name="menuItem.id" v-for="menuItem in submenu.itemList" :key="menuItem.id">
                            {{ menuItem.name }}
                        </MenuItem>
                    </Submenu>

                    <Submenu :name="submenu.id + 1024" v-show="isCollapsed"
                             v-for="submenu in menu.menuList" :key="submenu.id + 1024"
                             :class="menu.openMenuName === submenu.id ? 'collapsed-menu-item-selected' : ''">
                        <template slot="title">
                            <Dropdown placement="right-start" @on-click="selectedDropdownMenu">
                                <Icon :type="submenu.icon" size="22"/>
                                <DropdownMenu slot="list">
                                    <DropdownItem :name="menuItem.id"
                                                  v-for="menuItem in submenu.itemList" :key="menuItem.id">
                                        {{ menuItem.name }}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </template>
                    </Submenu>

                </Menu>
            </Sider>
            <Layout>
                <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', padding: 0}">
                    <Row type="flex" justify="space-between" class="code-row-bg">
                        <Col :style="{display:'flex',  padding: 0}">
                            <Col class="col-flex col-cursor col-space" @click.native="collapsedSide">
                                <Icon :class="rotateIcon" type="ios-menu" size="22"/>
                            </Col>
                            <Col class="col-flex col-cursor col-space" @click.native="refreshContent">
                                <Icon :class="rotateRefreshIcon" type="md-refresh" size="18"/>
                            </Col>
                            <Col class="col-flex col-space">
                                <Breadcrumb>
                                    <BreadcrumbItem>主页</BreadcrumbItem>
                                    <BreadcrumbItem>数据分析组件</BreadcrumbItem>
                                    <BreadcrumbItem>状态管理</BreadcrumbItem>
                                </Breadcrumb>
                            </Col>
                        </Col>
                        <Col :style="{display:'flex',  padding: 0, alignItems:'center'}">
                            <Col :style="{display:'flex', alignItems:'center', margin: '0 15px'}">
                                <Input type="text" placeholder="搜索">
                                    <Icon type="md-search" slot="suffix" size="18"/>
                                </Input>
                            </Col>
                            <Col class="col-flex col-cursor col-space">
                                <Icon type="md-radio-button-on" size="18"/>
                            </Col>
                            <Col class="col-flex col-cursor col-space" @click.native="toggleFullscreen">
                                <Icon :type="isScreenFull ? 'md-contract' : 'md-expand'" size="18"/>
                            </Col>
                            <Col class="col-flex col-cursor col-space notifications-poptip">
                                <Poptip placement="bottom" width="300" padding="8px 0">
                                    <Icon type="md-notifications-outline" size="20"/>
                                    <Tabs :animated="false" slot="content">
                                        <TabPane label="标签一">标签一的内容</TabPane>
                                        <TabPane label="标签二">标签二的内容</TabPane>
                                        <TabPane label="标签三">标签三的内容</TabPane>
                                    </Tabs>
                                </Poptip>
                            </Col>
                            <Col class="col-flex col-cursor col-space">
                                <Dropdown>
                                    <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"
                                            :style="{height: '23px', width: '23px'}"/>
                                    <span :style="{margin: '0 0 0 8px'}">Jack</span>
                                    <DropdownMenu slot="list">
                                        <DropdownItem>
                                            <div :style="{display: 'flex', alignItems: 'center'}">
                                                <Icon type="ios-person-outline" slot="prefix" size="20"/>
                                                <span :style="{marginLeft: '5px'}">个人中心</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <div :style="{display: 'flex', alignItems: 'center'}">
                                                <Icon type="ios-settings-outline" slot="prefix" size="20"/>
                                                <span :style="{marginLeft: '5px'}">设置</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem divided>
                                            <div :style="{display: 'flex', alignItems: 'center'}">
                                                <Icon type="ios-log-out" slot="prefix" size="20"/>
                                                <span :style="{marginLeft: '5px'}">退出登录</span>
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                            <Col class="col-flex col-cursor col-space">
                                <Internationalization></Internationalization>
                            </Col>
                            <Col class="col-flex col-cursor col-space" @click.native="showMoreInformation = true">
                                <Icon type="md-more" size="22"/>
                                <Drawer title="More Information Preview" :closable="false" v-model="showMoreInformation">
                                    <p>Some contents...</p>
                                    <p>Some contents...</p>
                                    <p>Some contents...</p>
                                </Drawer>
                            </Col>
                        </Col>
                    </Row>
                </Header>
                <Content :style="{padding: '16px 16px 16px'}" class="tabs-style">
                    <Tabs type="card" closable @on-tab-remove="handleTabRemove" :animated="false">
                        <TabPane label="标签一" v-if="tab0">标签一的内容</TabPane>
                        <TabPane label="标签二" v-if="tab1">标签二的内容</TabPane>
                        <TabPane label="标签三" v-if="tab2">标签三的内容</TabPane>
                    </Tabs>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>


<script>
    import Internationalization from "../components/Internationalization";
    import Logo from "../components/Logo";
    import screenfull from "screenfull"

    export default {
        name: "Home",
        components: {Logo, Internationalization},
        data() {
            return {
                isCollapsed: false,
                tab0: true,
                tab1: true,
                tab2: true,
                showLogoContent: true,
                rotateRefreshIcon: 'menu-icon',
                isScreenFull: false,
                showMoreInformation: false,
                menu: {
                    openMenuName: 1,
                    activeMenuName: '1-2',
                    menuList: [
                        {
                            id: 1, icon: 'ios-paper', name: '内容管理',
                            itemList: [
                                {id: '1-1', name: '文章管理', url: ''},
                                {id: '1-2', name: '评论管理', url: ''},
                                {id: '1-3', name: '举报管理', url: ''}
                            ]
                        },
                        {
                            id: 2, icon: 'ios-people', name: '用户管理',
                            itemList: [
                                {id: '2-1', name: '新增用户', url: ''},
                                {id: '2-2', name: '活跃用户', url: ''}
                            ]
                        },
                        {
                            id: 3, icon: 'ios-stats', name: '统计分析',
                            itemList: [
                                {id: '3-1', name: '新增和启动', url: ''},
                                {id: '3-2', name: '活跃分析', url: ''},
                                {id: '3-3', name: '时段分析', url: ''},
                                {id: '3-4', name: '用户留存', url: ''},
                                {id: '3-5', name: '流失用户', url: ''}
                            ]
                        },
                    ]
                }
            };
        },
        computed: {
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : '',
                    // 实现关闭二级菜单项
                    this.isCollapsed ? 'collapsed-menu-item' : ''
                ]
            },
            rotateIcon() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            }
        },
        methods: {
            handleTabRemove(name) {
                this['tab' + name] = false;
            },
            collapsedSide() {
                let _this = this;

                // 响应过渡动画
                if (!_this.isCollapsed) {
                    setTimeout(function () {
                        _this.$refs.side.toggleCollapse();
                    }, 600);
                    _this.showLogoContent = !_this.showLogoContent;
                } else {
                    setTimeout(function () {
                        _this.showLogoContent = !_this.showLogoContent;
                    }, 500);
                    _this.$refs.side.toggleCollapse();
                    _this.updateChangedMenu();
                }
            },
            refreshContent() {
                // 用户旋转刷新的图标
                this.rotateRefreshIcon = 'rotate-refresh-icon';
                let _this = this;
                setTimeout(function () {
                    _this.rotateRefreshIcon = 'menu-icon';
                }, 1000);
            },
            toggleFullscreen() {
                // 用于实现全屏展示
                if (!screenfull.isEnabled) {
                    this.$Message.warning('您的浏览器不支持全屏！');
                    return false;
                }

                screenfull.toggle();
                return true;
            },
            // 更新改变的展开后的菜单项目的展示
            updateChangedMenu() {
                let _this = this;
                _this.$refs.sideMenu.openedNames = this.menu.openMenuName;
                this.$nextTick(() => {
                    _this.$refs.sideMenu.updateOpened();
                    _this.$refs.sideMenu.updateActiveName();
                });
            },
            // 获取开启的菜单项
            changeOpenedMenu(menuNo) {
                console.log(menuNo);
            },
            // 获取选中的菜单项
            selectedMenu(menuItemName) {
                if (menuItemName === '' || menuItemName === null) return;

                let number = menuItemName.slice(0, menuItemName.indexOf('-'));
                this.menu.openMenuName = parseInt(number);
                this.menu.activeMenuName = menuItemName;

                console.log(this.$refs.sideMenu);
            },
            // 获取选中的下拉菜单项
            selectedDropdownMenu(menuItemName) {
                console.log(menuItemName);
                this.selectedMenu(menuItemName)
            }
        },

        mounted() {
            // 处理全屏切换的图标的切换
            let _this = this;
            let resizeTimer = null;
            window.onresize = () => {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    _this.isScreenFull = !_this.isScreenFull;
                }, 100);
            }
        }
    }
</script>

<style lang="less" scoped>
    /*================================调整通知的tab页的居中：开始===================================*/
    /deep/ .ivu-layout-header .notifications-poptip div.ivu-poptip-arrow {
        display: none;
    }

    /deep/ .ivu-layout-header .notifications-poptip .ivu-poptip-popper {
        top: 60px !important;
    }

    /deep/ .ivu-layout-header .notifications-poptip .ivu-tabs-nav-scroll {
        margin-left: 23px;
    }
    /*================================调整通知的tab页的居中：结束===================================*/

    /*================================调整标签页的标签样式：开始================================*/
    /deep/ .ivu-layout-header {
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08) !important;
    }

    /deep/ .ivu-layout-content {
        padding: 0 !important;
    }

    /deep/ .ivu-layout-content .ivu-tabs-bar {
        padding: 6px 12px !important;
        margin: 0 !important;
    }

    /deep/ .ivu-layout-content .ivu-tabs-content {
        padding: 0 24px;
    }

    /deep/ .tabs-style > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
        border-color: transparent !important;
        background-color: #ffffff !important;
        border-radius: 3px !important;
    }

    /deep/ .tabs-style div.ivu-tabs-bar {
        border-color: transparent !important;
    }

    /*================================调整标签页的标签样式：结束================================*/

    /deep/ .ivu-input {
        border: none !important;
    }

    /deep/ .ivu-menu-submenu-title {
        background-color: #191a23 !important;
    }


    /deep/ .ivu-menu {
        background-color: #0E0E12 !important;
    }

    /*设置折叠后的菜单项的子菜单项目的隐藏*/
    /deep/ .collapsed-menu-item ul.ivu-menu {
        display: none;
    }

    /*设置折叠后的菜单项的箭头图标的隐藏*/
    /deep/ .collapsed-menu-item i.ivu-icon-ios-arrow-down {
        display: none;
    }

    /*设置折叠后的被选中的菜单项的背景颜色*/
    /deep/ .collapsed-menu-item-selected div.ivu-menu-submenu-title {
        background-color: #0E0E12 !important;
    }

    /*设置折叠后的下拉菜单项的位置及颜色*/
    /deep/ .collapsed-menu-item div.ivu-select-dropdown {
        top: 0px !important;
        left: 80px !important;
        background-color: #0E0E12 !important;
    }

    /*设置指针指向折叠后的下拉菜单项的字体颜色*/
    /deep/ .collapsed-menu-item li.ivu-dropdown-item {
        color: #ACADAF !important;
    }

    /*设置指针指向折叠后的下拉菜单项的字体和背景颜色*/
    /deep/ .collapsed-menu-item li.ivu-dropdown-item:hover {
        color: #ffffff !important;
        background-color: #2575EC !important;
    }
</style>

<style scoped>
    .col-cursor:hover {
        cursor: pointer;
        background-color: #f5f5f6;
    }

    .col-space {
        padding: 0 10px;
    }

    .col-flex {
        display: flex;
        align-items: center;
        height: 100%;
    }

    .layout {
        background: #f5f7f9;
        position: relative;
        overflow: hidden;
    }

    /*==========================设置侧边导航栏伸缩样式：开始============================*/
    .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }

    .menu-item i {
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu span {
        width: 0px;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

    /*==========================设置侧边导航栏伸缩样式：结束============================*/

    .menu-icon {
        transition: all .3s;
    }

    .rotate-icon {
        transform: rotate(-90deg);
    }

    /*实现旋转动画的样式*/
    .rotate-refresh-icon {
        outline: none;
        animation: rotate-refresh 1s;
    }

    @keyframes rotate-refresh {
        from {
            transform: rotate(0deg)
        }
        to {
            transform: rotate(360deg);
            transition: all 0.6s;
        }
    }
</style>
