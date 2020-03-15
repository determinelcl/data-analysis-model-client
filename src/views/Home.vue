<template>
    <div class="layout">
        <Layout :style="{minHeight: '100vh'}">
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem name="1-1">
                        <Icon type="ios-navigate"></Icon>
                        <span>Option 1</span>
                    </MenuItem>
                    <MenuItem name="1-2">
                        <Icon type="ios-navigate"></Icon>
                        <span>Option 2</span>
                    </MenuItem>
                    <MenuItem name="1-3">
                        <Icon type="ios-navigate"></Icon>
                        <span>Option 3</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', padding: 0}">
                    <Row type="flex" justify="space-between" class="code-row-bg">
                        <Col :style="{display:'flex',  padding: 0}">
                            <Col class="col-flex col-cursor col-space" @click.native="collapsedSider">
                                <Icon :class="rotateIcon" type="ios-menu" size="22"/>
                            </Col>
                            <Col class="col-flex col-cursor col-space">
                                <Icon type="md-refresh" size="18"/>
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
                            <Col class="col-flex col-cursor col-space">
                                <Icon type="md-expand" size="18"/>
                                <!-- <Icon type="md-contract"  size="16"/> -->
                            </Col>
                            <Col class="col-flex col-cursor col-space">
                                <Icon type="md-notifications-outline" size="20"/>
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
                            <Col class="col-flex col-cursor col-space">
                                <Icon type="md-more" size="22"/>
                            </Col>
                        </Col>
                    </Row>
                </Header>
                <Content :style="{padding: '16px 16px 16px'}">
                    <!--                    <Card>-->
                    <!--                        <div style="height: 600px">Content</div>-->
                    <!--                    </Card>-->
                    <Tabs type="card" closable @on-tab-remove="handleTabRemove">
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

    export default {
        name: "Home",
        components: {Internationalization},
        data() {
            return {
                isCollapsed: false,
                tab0: true,
                tab1: true,
                tab2: true
            };
        },
        computed: {
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
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
            collapsedSider() {
                this.$refs.side1.toggleCollapse();
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-input {
        border: none !important;
    }
</style>

<style scoped>
    .col-cursor:hover {
        cursor: pointer;
        background-color: #E5E5E6;
    }

    .col-space {
        padding: 0 8px;
    }

    .col-flex {
        display: flex;
        align-items: center;
        height: 100%;
    }

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
</style>
