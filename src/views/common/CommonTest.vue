<template>
    <div>
        <ComponentTitle :name="`${objectType.name}测试管理`"
                        :description="`${objectType.name}的测试管理：添加、删除、修改、查询测试计划`">
        </ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow"><LoadingIcon></LoadingIcon></Spin>
            <Drawer :title="editTestTaskText" v-model="editTestTask" width="720"
                    :mask-closable="false" :styles="editTestStyle">
                <EditTest :object-type="objectType.type" :edit-type="editType" :form-item="formItem"
                          @completeTask="editTestPlanCompleteTask"></EditTest>
            </Drawer>
            <Drawer title="执行测试计划" v-model="execTestTask" width="720" :mask-closable="false">
                <ExecuteTestTask></ExecuteTestTask>
            </Drawer>
            <Drawer v-model="testReport" width="720" :closable="false">
                <TestReport ref="testReportRef" :report-info="reportInfo"></TestReport>
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
                                <Option :value="2">进行中</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="触发类型：" prop="version" label-position="left">
                            <Select v-model="searchForm.triggerType" filterable allow-create clearable style="width: 100px">
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
                <ListItem v-for="(item, index) in tableData" :key="item.id">
                    <ListItemMeta :title="item.name" :description="item.description"/>
                    <Row type="flex" justify="center" align="middle" :gutter="38"
                         :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                        <Col>
                            <div class="list-description">状态</div>
                            <div :style="{width: '50px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': item.status === 1 ? '#ff9900' : item.status === 2 ? '#2d8cf0' : '#ed4014'}` }">
                                {{item.status === 0 ? '成功': item.status === 1 ? '未开始' : item.status === 2 ? '#进行中' : '#失败'}}
                            </div>
                        </Col>
                        <Col>
                            <div class="list-description">触发类型</div>
                            <div :style="{width: '50px', alignContent: 'center', color: `${item.triggerType === 0 ? '#19be6b': '#ff9900'}` }">
                                {{item.triggerType === 0 ? '自动': '手动'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 138px; align-content: center">测试计划日期</div>
                            <div style="width: 138px; align-content: center" v-if="item.triggerType === 0">{{item.triggerTime}}</div>
                            <div style="width: 138px; align-content: center" v-if="item.triggerType === 1">手动触发测试计划</div>
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
    import {errorMessage} from "../../util/message.util";
    import {deepClone} from "../../util/object.util";
    import LoadingIcon from "../../components/LoadingIcon";

    export default {
        name: "CommonTest",
        components: {LoadingIcon, TestReport, ExecuteTestTask, EditTest, ComponentTitle},
        props: ['objectType'],
        data() {
            return {
                spinShow: false,
                editTestTask: false,
                editTestTaskText: '',
                editType: 'add',
                execTestTask: false,
                testReport: false,
                delConfirm: false,
                delConfirmIndex: -1,
                formItem: {},
                reportInfo: {},
                editTestStyle: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                searchForm: {
                    name: null,
                    status: null,
                    triggerType: null
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
                tableData: []
            }
        },
        methods: {
            editTestPlanCompleteTask() {
                this.editTestTask = false
                this.searchTest()
            },
            searchTest() {
                this.page.current = 1;
                this.loadTableData()
            },
            resetSearchTest() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            execTest(index) {
                console.log(index);
                this.execTestTask = true;
            },
            showTestDetail(index) {
                let testPlan = deepClone(this.tableData[index]);
                console.log(testPlan)
                this.reportInfo = testPlan
                this.$refs['testReportRef'].$emit('loadData', testPlan.id)
                this.testReport = true;
            },
            addTest() {
                this.formItem = {
                    name: '',
                    triggerType: 0,
                    triggerTime: null,
                    targetId: null,
                    model: [],
                    datasourceId: null,
                    protocolFormatIdList: [],
                    reportFlag: 0,
                    description: ''
                }

                this.editTestTaskText = '添加测试计划';
                this.editType = 'add';
                this.editTestTask = true;
            },
            updateTest(index) {
                let testPlan = deepClone(this.tableData[index]);
                console.log(testPlan)

                // 变换对象的参数
                testPlan['model'] = [testPlan.version.modelId, testPlan.version.id]
                let protocolFormatIdList = []
                testPlan.visualDataList.forEach(visualData => protocolFormatIdList.push(visualData.protocolFormatId))
                testPlan['protocolFormatIdList'] = protocolFormatIdList

                this.formItem = testPlan

                this.editTestTaskText = '更新测试计划';
                this.editType = 'update';
                this.editTestTask = true;
            },
            removeTest(index) {
                this.delConfirmIndex = index
                this.delConfirm = true
            },
            deleteTest() {
                let testPlan = deepClone(this.tableData[this.delConfirmIndex]);

                // 显示加载提示信息
                let userId = this.$store.state.user.id
                this.axios.delete(`/test-server/delete/${userId}/${testPlan.id}`).then(({data}) => {
                    console.log(data)
                    // 关闭加载提示信息
                    this.delConfirm = false
                    this.loadTableData()
                }).catch(error => {
                    console.log(error)
                    // 关闭加载提示信息
                    this.delConfirm = false
                    errorMessage(error, this)
                });
            },
            // 切换页面
            changePage(page) {
                this.page.current = page;
                this.loadTableData();
            },
            changePageSize(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.page.size = pageSize;
                this.page.current = 1;

                this.loadTableData()
            },
            // 获取测试计划数据
            loadTableData() {
                let condition = deepClone(this.searchForm)
                Object.assign(condition, this.page)
                condition['userId'] = this.$store.state.user.id

                // type === 0表示查询数据分析模型列表
                if (this.objectType.type === 'model')
                    condition['type'] = 0
                else condition['type'] = 1

                // 显示加载提示信息
                this.spinShow = true;
                this.axios.post('/test-server/list', condition).then(({data}) => {
                    // 关闭加载提示信息
                    this.spinShow = false;
                    this.tableData = data.data.data;
                    this.page.total = data.data.total;
                }).catch(error => {
                    console.log(error);
                    // 关闭加载提示信息
                    this.spinShow = false;
                    errorMessage(error, this);
                });
            }
        },
        mounted() {
            this.loadTableData()
        }
    }
</script>

<style scoped>

</style>
