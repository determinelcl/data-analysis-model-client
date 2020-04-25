<template>
    <div>
        <ComponentTitle :name="`${objectType.name}测试管理`"
                        :description="`${objectType.name}的测试管理：添加、删除、修改、查询测试计划`">
        </ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">

            <Drawer :title="editTestTaskText" v-model="editTestTask" width="720"
                    :mask-closable="false" :styles="editTestStyle">
                <EditTest :object-type="objectType"></EditTest>
            </Drawer>
            <Drawer title="执行测试计划" v-model="execTestTask" width="720" :mask-closable="false">
                <ExecuteTestTask></ExecuteTestTask>
            </Drawer>
            <Drawer v-model="testReport" width="720" :closable="false">
                <TestReport></TestReport>
            </Drawer>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p>是否删除当前测试计划？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="deleteTest()">删除</Button>
                </div>
            </Modal>

            <Form ref="formInline" :model="searchForm">
                <Row :gutter="10" type="flex" :style="{padding: 0, height: '38px'}">
                    <Col span="6">
                        <FormItem label="名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '180px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="状态：" prop="version" label-position="left">
                            <Select v-model="searchForm.status" filterable allow-create clearable style="width: 130px">
                                <Option :value="0">已完成</Option>
                                <Option :value="1">未开始</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="触发类型：" prop="version" label-position="left">
                            <Select v-model="searchForm.trigger" filterable allow-create clearable style="width: 100px">
                                <Option :value="0">自动</Option>
                                <Option :value="1">手动</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchTest()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchTest()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Divider></Divider>
            <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
                <Col span="24">
                    <Button type="dashed" @click="addTest()"
                            :style="{width: '100%'}" icon="md-add">新增测试计划
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
                            <div :style="{width: '50px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': '#ff9900'}` }">
                                {{item.status === 0 ? '已完成': '未开始'}}
                            </div>
                        </Col>
                        <Col>
                            <div class="list-description">触发类型</div>
                            <div :style="{width: '50px', alignContent: 'center', color: `${item.trigger === 0 ? '#19be6b': '#ff9900'}` }">
                                {{item.trigger === 0 ? '自动': '手动'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 138px; align-content: center">测试计划日期</div>
                            <div style="width: 138px; align-content: center">{{item.startTime}}</div>
                        </Col>
                        <Col>
                            <div style="width: 138px; align-content: center">创建日期</div>
                            <div style="width: 138px; align-content: center">{{item.created}}</div>
                        </Col>
                        <Col>
                            <a style="margin: 0 3px; color: #2d8cf0" @click="execTest(index)">测试</a>
                            |
                            <a style="margin: 0 3px; color: #19be6b" @click="showTestDetail(index)">详情</a>
                            |
                            <a style="margin: 0 3px; color: #ff9900" @click="updateTest(index)">更新</a>
                            |
                            <a style="margin: 0 3px; color:#ed4014;" @click="removeTest(index)">删除</a>
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
    import TestReport from "./test/TestReport";
    import ExecuteTestTask from "./test/ExecuteTestTask";
    import EditTest from "./test/EditTest";
    import ComponentTitle from "../../components/ComponentTitle";

    export default {
        name: "CommonTest",
        components: {TestReport, ExecuteTestTask, EditTest, ComponentTitle},
        props: ['objectType'],
        data() {
            return {
                editTestTask: false,
                editTestTaskText: '',
                execTestTask: false,
                testReport: false,
                delConfirm: false,
                testFormItem: {
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
                editTestStyle: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                searchForm: {
                    name: null,
                    status: null,
                    trigger: null
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
                        name: '图像识别测试',
                        description: '这是一个图像识别的组件',
                        status: 0,
                        trigger: 0,
                        startTime: '2020-04-30 00:00:00',
                        created: '2020-04-30 00:00:00'
                    },
                    {
                        id: 2,
                        name: '支持向量机测试',
                        description: '这是一个分类器',
                        status: 0,
                        trigger: 0,
                        startTime: '2020-04-30 00:00:00',
                        created: '2020-04-30 00:00:00',
                    },
                    {
                        id: 3,
                        name: '文字识别测试',
                        description: '这是一个神经网络模型',
                        status: 1,
                        trigger: 1,
                        startTime: '2020-04-30 00:00:00',
                        created: '2020-04-30 00:00:00'
                    }
                ]
            }
        },
        methods: {
            searchTest() {

            },
            resetSearchTest() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            execTest(index) {
                console.log(index);
                this.execTestTask = true;
            },
            showTestDetail(index) {
                console.log(index);
                this.testReport = true;
            },
            addTest() {
                this.editTestTaskText = '添加测试计划';
                this.editTestTask = true;
            },
            updateTest(index) {
                console.log(index);
                this.editTestTaskText = '更新测试计划';
                this.editTestTask = true;
            },
            removeTest(index) {
                console.log(index);
                this.delConfirm = true;
            },
            deleteTest() {

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
