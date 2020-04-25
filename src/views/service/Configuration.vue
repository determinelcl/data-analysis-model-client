<template>
    <div>
        <ComponentTitle name="服务配置管理" description="服务配置管理：添加、删除、修改、查询服务基本信息"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">

            <Drawer :title="editServiceText" v-model="editService" width="720"
                    :mask-closable="false" :styles="editServiceStyle">
                <EditConfiguration></EditConfiguration>
            </Drawer>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p>是否删除当前服务配置？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="deleteService()">删除</Button>
                </div>
            </Modal>

            <Form ref="formInline" :model="searchForm">
                <Row type="flex" justify="space-between" :style="{padding: 0, height: '38px'}">
                    <Col span="8">
                        <FormItem label="服务名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" style="margin-right: 20px" @click="searchService()">查询</Button>
                            <Button @click="resetSearchService()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Divider></Divider>
            <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
                <Col span="24">
                    <Button type="dashed" @click="addService()"
                            :style="{width: '100%'}" icon="md-add">新增服务配置
                    </Button>
                </Col>
            </Row>
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
                            <div style="width: 80px;">测试状态</div>
                            <div :style="{width: '80px', alignContent: 'center', color: `${item.test === 0 ? '#19be6b': '#ed4014'}` }">
                                {{item.test === 0 ? '已通过': '未测试'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 138px; align-content: center">更新日期</div>
                            <div style="width: 138px; align-content: center">{{item.updated}}</div>
                        </Col>
                        <Col>
                            <a style="margin: 0 3px; color: #ff9900" @click="updateService(index)">更新</a>
                            |
                            <a style="margin: 0 3px; color:#ed4014;" @click="removeService(index)">删除</a>
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
    </div>
</template>

<script>
    import ComponentTitle from "../../components/ComponentTitle";
    import EditConfiguration from "./configuration/EditConfiguration";

    export default {
        name: "Configuration",
        components: {EditConfiguration, ComponentTitle},
        data() {
            return {
                editService: false,
                editServiceText: '',
                delConfirm: false,
                serviceFormItem: {
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
                    description: '这是使用神经网络实现实现的性能最优的视觉算法服务'
                },
                editServiceStyle: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                searchForm: {
                    name: null
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
                        status: 0,
                        test: 0,
                        updated: '2020-04-30 00:00:00'
                    },
                    {
                        id: 2,
                        name: '支持向量机',
                        description: '这是一个分类器',
                        status: 0,
                        test: 0,
                        updated: '2020-04-30 00:00:00'
                    },
                    {
                        id: 3,
                        name: '文字识别',
                        description: '这是一个神经网络服务',
                        status: 1,
                        test: 1,
                        updated: '2020-04-30 00:00:00'
                    }
                ]
            }
        },
        methods: {
            searchService() {

            },
            resetSearchService() {

            },
            addService() {
                this.editServiceText = '新增服务';
                this.editService = true;
            },
            updateService(index) {
                console.log(index);
                this.editServiceText = '更新服务';
                this.editService = true;
            },
            removeService(index) {
                console.log(index);
                this.delConfirm = true;
            },
            deleteService() {

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
    /deep/ .ivu-table-header th {
        background: none;
    }

    .list-description {
        width: 50px;
        align-content: center;
        color: rgba(0, 0, 0, .45);
    }
</style>
