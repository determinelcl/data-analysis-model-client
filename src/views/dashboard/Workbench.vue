<template>
    <div>
        <div :style="{backgroundColor: '#ffffff', padding: 0}">
            <div :style="{padding: '16px 32px 10px 32px'}">
                <div :style="{fontSize: '22px', height: '30px', color:'#17233D', fontWeight: 500, margin: '0 0 18px 0'}">
                    工作台
                </div>
                <Row type="flex" justify="space-between">
                    <Col>
                        <Row type="flex" :gutter="12">
                            <Col>
                                <img src="@/assets/mine.jpg" style="height: 64px; width: 64px; border-radius: 50px">
                            </Col>
                            <Col>
                                <h2 style=" font-size: 20px">
                                    早安，determination，开始您一天的工作吧！
                                </h2>
                                <div style="margin-top: 12px">
                                    简洁既是美，简洁既是力量！
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row :gutter="20" type="flex">
                            <Col>
                                <div style="display: flex; align-items: center">
                                    <Icon type="md-analytics" :color="'rgb(64, 169, 255)'" size="23" style="margin-right: 8px" />
                                    模型数量
                                </div>
                                <div style="display: flex; justify-content: flex-end; font-size: 22px">20</div>
                            </Col>
                            <Col>
                                <div style="display: flex; align-items: center">
                                    <Icon type="logo-codepen" :color="'rgb(115, 209, 61)'" size="25" style="margin-right: 9px" />
                                    服务数量
                                </div>
                                <div style="display: flex; justify-content: flex-end; font-size: 22px">20</div>
                            </Col>
                            <Col>
                                <div style="display: flex; align-items: center">
                                    <Icon type="md-checkbox-outline" :color="'rgb(255, 169, 64)'" size="23" style="margin-right: 8px" />
                                    待办事项
                                </div>
                                <div style="display: flex; justify-content: flex-end; font-size: 22px">10</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
        <Row type="flex" :gutter="20" style="padding: 16px 24px">
            <Col span="15">
                <Card :bordered="false" :dis-hover="true" >
                    <p slot="title" style="display: flex; align-content: center">
                        <Icon type="md-analytics" :color="'rgb(64, 169, 255)'" size="20" style="margin-right: 5px" />
                        <span style="font-size: 14px; font-weight: normal; color: #515a6e">模型</span>
                    </p>
                    <a href="#" slot="extra">全部</a>
                    <List>
                        <ListItem v-for="(item, index) in data" :key="item.id">
                            <ListItemMeta :title="item.name" :description="item.description"/>
                            <Row type="flex" justify="center" align="middle" :gutter="38"
                                 :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                                <Col>
                                    <div style="width: 80px; align-content: center">组名</div>
                                    <div style="width: 80px; align-content: center">{{item.group}}</div>
                                </Col>
                                <Col>
                                    <div style="width: 60px; align-content: center">状态</div>
                                    <div :style="{width: '60px', alignContent: 'center', color: `${item.type === 0 ? '#2d8cf0' : '#ff9900'}`}">
                                        <a>{{item.type === 0 ? '启用' : '禁用'}}</a>
                                    </div>
                                </Col>
                                <Col>
                                    <a style="color: #19be6b; margin: 0 3px" @click="showModelDetail(index)">详情</a>
                                </Col>
                            </Row>
                        </ListItem>
                    </List>
                </Card>

                <Card :bordered="false" :dis-hover="true" style="margin-top: 16px">
                    <p slot="title" style="display: flex; align-content: center">
                        <Icon type="logo-codepen" :color="'rgb(115, 209, 61)'" size="20" style="margin-right: 9px" />
                        <span style="font-size: 14px; font-weight: normal; color: #515a6e">服务</span>
                    </p>
                    <a href="#" slot="extra">全部</a>
                    <List>
                        <ListItem v-for="(item, index) in data" :key="item.id">
                            <ListItemMeta :title="item.name" :description="item.description"/>
                            <Row type="flex" justify="center" align="middle" :gutter="38"
                                 :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                                <Col>
                                    <div style="width: 80px; align-content: center">组名</div>
                                    <div style="width: 80px; align-content: center">{{item.group}}</div>
                                </Col>
                                <Col>
                                    <div style="width: 60px; align-content: center">状态</div>
                                    <div :style="{width: '60px', alignContent: 'center', color: `${item.type === 0 ? '#2d8cf0' : '#ff9900'}`}">
                                        <a>{{item.type === 0 ? '正在运行' : '未运行'}}</a>
                                    </div>
                                </Col>
                                <Col>
                                    <a style="color: #19be6b; margin: 0 3px" @click="showModelDetail(index)">详情</a>
                                </Col>
                            </Row>
                        </ListItem>
                    </List>
                </Card>

                <Card :bordered="false" :dis-hover="true" style="margin-top: 16px">
                    <p slot="title" style="display: flex; align-content: center">
                        <Icon type="md-bulb" :color="'rgb(114, 46, 209)'" size="20" style="margin-right: 9px" />
                        <span style="font-size: 14px; font-weight: normal; color: #515a6e">动态</span>
                    </p>
                    <List>
                        <ListItem v-for="item in data" :key="item.id">
                            <ListItemMeta :description="item.created">
                                <template slot="avatar">
                                    <div style="height: 50px; width: 50px; display: flex; justify-content: center; align-items: center">
                                        <Icon type="md-notifications-outline" size="30" :color="'rgb(24, 144, 255)'"/>
                                    </div>
                                </template>
                                <template slot="title">
                                    <a href="#">{{item.who}}</a>
                                    {{item.what === 0 ? '点赞了' : '关注了'}}
                                    <a href="#" v-if="item.what === 0">
                                        {{`${item.which === 0 ? '模型' : '博文'}: ${item.model}`}}
                                    </a>
                                    <span v-if="item.what !== 0">您</span>
                                </template>
                            </ListItemMeta>
                        </ListItem>
                    </List>
                </Card>
            </Col>
            <Col span="9">
                <Card :bordered="false" :dis-hover="true">
                    <p slot="title" style="display: flex; align-content: center">
                        <Icon type="md-heart" :color="'rgb(255, 77, 79)'" size="20" style="margin-right: 9px" />
                        <span style="font-size: 14px; font-weight: normal; color: #515a6e">快捷操作</span>
                    </p>
                    <Icon type="md-settings" slot="extra" />
                    <Row type="flex" justify="space-around" align="center">
                        <Col class="shortcut" span="5">
                            <Icon type="md-speedometer" size="25" :color="'rgb(115, 209, 61)'"/>
                            <div style="margin-top: 8px">主控台</div>
                        </Col>
                        <Col class="shortcut" span="5">
                            <Icon type="md-analytics" size="25" :color="'rgb(24, 144, 255)'"/>
                            <div style="margin-top: 8px">模型授权</div>
                        </Col>
                        <Col class="shortcut" span="5">
                            <Icon type="logo-codepen" size="25" :color="'rgb(250, 173, 20)'"/>
                            <div style="margin-top: 8px">运行服务</div>
                        </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="center" style="margin-top: 15px">
                        <Col class="shortcut" span="5">
                            <Icon type="ios-keypad" size="25" :color="'rgb(235, 47, 150)'"/>
                            <div style="margin-top: 8px">插件服务</div>
                        </Col>
                        <Col class="shortcut" span="5">
                            <Icon type="ios-card" size="25" :color="'rgb(19, 194, 194)'"/>
                            <div style="margin-top: 8px">支付信息</div>
                        </Col>
                        <Col class="shortcut" span="5">
                            <Icon type="ios-cog" size="25" :color="'rgb(114, 46, 209)'"/>
                            <div style="margin-top: 8px">个人设置</div>
                        </Col>
                    </Row>
                </Card>
                <Card :bordered="false" :dis-hover="true" style="margin-top: 16px">
                    <p slot="title" style="display: flex; align-content: center">
                        <Icon type="md-checkbox-outline" :color="'rgb(255, 169, 64)'" size="20" style="margin-right: 9px" />
                        <span style="font-size: 14px; font-weight: normal; color: #515a6e">待办事项</span>
                    </p>
                    <List>
                        <ListItem v-for="item in data" :key="item.id">
                            <ListItemMeta :description="item.created">
                                <template slot="avatar">
                                    <div style="height: 50px; width: 50px; display: flex; justify-content: center; align-items: center">

                                        <Icon type="ios-ribbon-outline" size="30" :color="'rgb(255, 169, 64)'"/>
                                    </div>
                                </template>
                                <template slot="title">
                                    <a href="#">{{item.who}}</a>申请<a href="#">{{item.model}}</a>的权限
                                </template>
                            </ListItemMeta>
                            <template slot="action">
                                <li>
                                    <a style="color: #19be6b; margin: 0 3px" @click="showModelDetail(index)">详情</a>
                                </li>
                            </template>
                        </ListItem>
                    </List>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>

    export default {
        name: "Workbench",
        data() {
            return {
                data: [
                    {
                        id: 1,
                        who: 'Jack',
                        what: 0,
                        which: 0,
                        model: '图像识别',
                        name: '图像识别',
                        description: '这是一个数据分析组件',
                        created: '2020-05-20 00:00:00'
                    },
                    {
                        id: 2,
                        who: 'Jack',
                        what: 1,
                        which: 2,
                        model: '支持向量机',
                        name: '支持向量机',
                        description: '这是一个数据分析组件',
                        created: '2020-05-20 00:00:00'
                    },
                    {
                        id: 3,
                        who: 'Jack',
                        what: 0,
                        which: 1,
                        model: '文字识别',
                        name: '文字识别',
                        description: '这是一个数据分析组件',
                        created: '2020-05-20 00:00:00'
                    }
                ]
            }
        },
        methods: {
            showModelDetail(index) {
                console.log(index);
                this.modelInformation = true;
            },
        }
    }
</script>

<style scoped>
    .icon {
        width: 30px;
        height: 30px;
    }

    .shortcut {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    .shortcut:hover {
        cursor: pointer;
        color: #2d8cf0;
    }
</style>
