<template>
    <div>
        <Form ref="formInline" :model="searchForm" label-width="60">
            <Row type="flex" justify="center" align="middle" style="margin-top: 10px" :gutter="20">
                <Col span="8">
                    <FormItem label="名称：" prop="name" label-position="left">
                        <Input type="text" v-model="searchForm.name" placeholder="请输入"/>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="分组：" prop="version" label-position="left" >
                        <Select v-model="searchForm.groupId" filterable clearable>
                            <Option :value="0">线性回归</Option>
                            <Option :value="1">神经网络</Option>
                            <Option :value="2">支持向量机</Option>
                            <Option :value="3">图片识别</Option>
                            <Option :value="4">深度学习</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="类型：" prop="version" label-position="left">
                        <Select v-model="searchForm.collectionType" filterable clearable>
                            <Option :value="0">模型</Option>
                            <Option :value="1">博文</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="end" align="middle" style="height: 38px">
                <Col >
                    <FormItem>
                        <Button type="primary" style="margin-right: 20px" @click="searchModel()">查询</Button>
                        <Button @click="resetSearchModel()">重置</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Divider></Divider>
        <List>
            <ListItem v-for="(item, index) in data" :key="item.id">
                <ListItemMeta :title="item.name" :description="item.description"/>
                <Row type="flex" justify="center" align="middle" :gutter="38"
                     :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                    <Col>
                        <div style="width: 90px; align-content: center">发布者</div>
                        <div style="width: 90px; align-content: center">
                            <a>{{item.publisher}}</a>
                        </div>
                    </Col>
                    <Col>
                        <div style="width: 80px; align-content: center">组名</div>
                        <div style="width: 80px; align-content: center">{{item.group}}</div>
                    </Col>
                    <Col>
                        <div style="width: 60px; align-content: center">类型</div>
                        <div :style="{width: '60px', alignContent: 'center', color: `${item.type === 0 ? '#2d8cf0' : '#ff9900'}`}">
                            <a>{{item.type === 0 ? '模型' : '博文'}}</a>
                        </div>
                    </Col>
                    <Col>
                        <a style="color: #19be6b; margin: 0 3px" @click="showModelDetail(index)">详情</a>
                        |
                        <a style="color: #ed4014; margin: 0 3px" @click="showModelDetail(index)">取消</a>
                    </Col>
                </Row>
            </ListItem>
        </List>

        <Divider></Divider>
        <div style="display: flex; justify-content: center; margin-bottom: 20px">
            <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                  show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                  show-sizer show-total @on-page-size-change="changePageSize"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Collection",
        data() {
            return {
                modelInformation: false,
                searchForm: {
                    name: null,
                    groupId: null,
                    collectionType: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                tableColumns: [
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? 'success' : 'error';
                            const text = row.status === 0 ? '激活' : '禁用';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {title: '发布者', key: 'publisher'},
                    {title: '更新日期', key: 'updated'}
                ],
                data: [
                    {
                        id: 1,
                        name: '图像识别',
                        description: '这是一个图像识别的组件',
                        versionModel: 1,
                        status: 0,
                        group: '机器学习',
                        publisher: 'determination',
                        type: 0,
                        star: 123,
                        good: 456,
                        comment: 789,
                        versionList: [
                            {id: 1, name: '2.2.0', tag: 'lasted'},
                            {id: 2, name: '2.0.0', tag: 'GA'},
                            {id: 3, name: '1.0.0', tag: 'normal'}
                        ]
                    },
                    {
                        id: 2,
                        name: '支持向量机',
                        description: '这是一个分类器',
                        versionModel: 4,
                        status: 0,
                        group: '机器学习',
                        publisher: 'determination',
                        type: 0,
                        star: 123,
                        good: 456,
                        comment: 789,
                        versionList: [
                            {id: 4, name: '2.2.0', tag: 'lasted'},
                            {id: 5, name: '2.0.0', tag: 'GA'},
                            {id: 6, name: '1.0.0', tag: 'normal'}
                        ]
                    },
                    {
                        id: 3,
                        name: '文字识别',
                        description: '这是一个神经网络模型',
                        versionModel: 7,
                        status: 1,
                        group: '机器学习',
                        publisher: 'determination',
                        type: 0,
                        star: 123,
                        good: 456,
                        comment: 789,
                        versionList: [
                            {id: 7, name: '2.2.0', tag: 'lasted'},
                            {id: 8, name: '2.0.0', tag: 'GA'},
                            {id: 9, name: '1.0.0', tag: 'normal'}
                        ]
                    },
                    {
                        id: 4,
                        name: '语音识别',
                        description: '这是一个神经网络模型',
                        versionModel: 7,
                        status: 1,
                        group: '机器学习',
                        publisher: 'determination',
                        type: 1,
                        star: 123,
                        good: 456,
                        comment: 789,
                        versionList: [
                            {id: 7, name: '2.2.0', tag: 'lasted'},
                            {id: 8, name: '2.0.0', tag: 'GA'},
                            {id: 9, name: '1.0.0', tag: 'normal'}
                        ]
                    },
                    {
                        id: 5,
                        name: '视觉识别',
                        description: '这是一个神经网络模型',
                        versionModel: 7,
                        status: 1,
                        group: '机器学习',
                        publisher: 'determination',
                        type: 1,
                        star: 123,
                        good: 456,
                        comment: 789,
                        versionList: [
                            {id: 7, name: '2.2.0', tag: 'lasted'},
                            {id: 8, name: '2.0.0', tag: 'GA'},
                            {id: 9, name: '1.0.0', tag: 'normal'}
                        ]
                    },
                    {
                        id: 6,
                        name: '数据挖掘',
                        description: '这是一个神经网络模型',
                        versionModel: 7,
                        status: 1,
                        group: '机器学习',
                        publisher: 'determination',
                        type: 1,
                        star: 123,
                        good: 456,
                        comment: 789,
                        versionList: [
                            {id: 7, name: '2.2.0', tag: 'lasted'},
                            {id: 8, name: '2.0.0', tag: 'GA'},
                            {id: 9, name: '1.0.0', tag: 'normal'}
                        ]
                    }
                ]
            }
        },
        methods: {
            searchModel() {

            },
            resetSearchModel() {

            },
            showModelDetail(index) {
                console.log(index);
                this.modelInformation = true;
            },
            // 切换页面
            changePage(page) {
                this.page.current = page;
                // this.loadTableData();
            },
            changePageSize(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.page.size = pageSize;
                this.page.current = 1;

                // this.loadTableData()
            },
        }
    }
</script>

<style lang="less" scoped>
    .list-description {
        width: 50px;
        align-content: center;
        color: rgba(0, 0, 0, .45);
    }
</style>
