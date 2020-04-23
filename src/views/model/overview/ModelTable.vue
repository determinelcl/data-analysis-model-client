<template>
    <div>
        <Drawer v-model="modelInformation" width="720" :closable="false">
            <ModelInformation :model-info="modelFormItem"></ModelInformation>

        </Drawer>

        <Form ref="formInline" :model="searchForm">
            <Row type="flex" :style="{padding: 0, height: '38px'}">
                <Col span="8">
                    <FormItem label="模型名称：" prop="name" label-position="left">
                        <Input type="text" v-model="searchForm.name" placeholder="请输入"
                               :style="{width: '252px'}"/>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="模型版本：" prop="version" label-position="left">
                        <Input type="text" v-model="searchForm.version" placeholder="请输入"
                               :style="{width: '252px'}"/>
                    </FormItem>
                </Col>
                <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                    <FormItem>
                        <Button type="primary" @click="searchModel()">查询</Button>
                    </FormItem>
                    <span :style="{width: '10px'}"></span>
                    <FormItem>
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
                        <div class="list-description">状态</div>
                        <div :style="{width: '30px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': '#ed4014'}` }">
                            {{item.status === 0 ? '启用': '禁用'}}
                        </div>
                    </Col>
                    <Col>
                        <div style="width: 90px; align-content: center">发布者</div>
                        <div style="width: 90px; align-content: center">
                            <a>{{item.publisher}}</a>
                        </div>
                    </Col>
                    <Col>
                        <div style="width: 138px; align-content: center">更新日期</div>
                        <div style="width: 138px; align-content: center">{{item.updated}}</div>
                    </Col>
                    <Col>
                        <div>动态</div>
                        <div style="display: flex;">
                            <a style="margin-right: 5px; color: rgba(0,0,0,.45)" @click="modelInformation = true">
                                <Icon type="ios-star-outline" size="15" :color="'#ff9900'"/>
                                {{item.star}}
                            </a>
                            <a style="margin-right: 5px; color: rgba(0,0,0,.45)" @click="modelInformation = true">
                                <Icon type="ios-thumbs-up-outline" size="15" :color="'#19be6b'"/>
                                {{item.good}}
                            </a>
                            <a style="color: rgba(0,0,0,.45)" @click="modelInformation = true">
                                <Icon type="ios-chatbubbles-outline" size="15" :color="'#2d8cf0'"/>
                                {{item.comment}}
                            </a>
                        </div>
                    </Col>
                    <Col>
                        <Button type="success" size="small" @click="showModelDetail(index)">详情</Button>
                    </Col>
                </Row>
            </ListItem>
        </List>

        <Divider></Divider>
        <div style="display: flex; justify-content: center;">
            <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                  show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                  show-sizer show-total @on-page-size-change="changePageSize"></Page>
        </div>
    </div>
</template>

<script>
    import ModelInformation from "../component/ModelInformation";

    export default {
        name: "ModelTable",
        components: {ModelInformation},
        data() {
            return {
                modelInformation: false,
                modelFormItem: {
                    name: '计算机视觉',
                    public: 0,
                    status: true,
                    groupId: 0,
                    group: {name: '深度学习'},
                    tagId: 0,
                    tagList: [
                        {id: 1, name: '推荐系统'},
                        {id: 2, name: '分类算法'}
                    ],
                    git: 'https://github.com/alibaba/Sentinel',
                    description: '这是使用神经网络实现实现的性能最优的视觉算法模型'
                },
                searchForm: {
                    name: null,
                    version: null
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
                        updated: '2020-04-30 00:00:00',
                        publisher: 'determination',
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
                        updated: '2020-04-30 00:00:00',
                        publisher: 'determination',
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
                        updated: '2020-04-30 00:00:00',
                        publisher: 'determination',
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

<style scoped>

</style>
