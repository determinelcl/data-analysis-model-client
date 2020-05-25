<template>
    <div>
        <ComponentTitle name="服务运行管理" description="服务运行管理：添加、删除、修改、查询服务运行信息"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>

            <Drawer title="添加运行服务" v-model="addRunTask" width="720" :mask-closable="false" :styles="editRunStyle">
                <EditOperation :form-item="addFormItem" @completeTask="editRuntimeServiceCompleteTask"></EditOperation>
            </Drawer>
            <Drawer title="编辑运行服务" v-model="updateRunTask" width="720" :mask-closable="false" :styles="editRunStyle">
                <OperationForm ref="updateRuntimeRef" :form-item="updateFormItem" edit-type="update"
                               @completeTask="editRuntimeServiceCompleteTask"></OperationForm>
            </Drawer>
            <Drawer title="服务任务执行" v-model="executeTask" width="720" :mask-closable="false">
                <ExecuteOperationTask></ExecuteOperationTask>
            </Drawer>
            <Drawer title="服务运行详情" v-model="runInformation" width="720">
                <OperationInformation ref="runtimeInfoRef" :form-item="runtimeInfo"></OperationInformation>
            </Drawer>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p>是否删除当前运行服务？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="deleteRun()">删除</Button>
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
                            <Button type="primary" style="margin-right: 20px" @click="searchRun()">查询</Button>
                            <Button @click="resetSearchRun()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Divider></Divider>
            <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
                <Col span="24">
                    <Button type="dashed" @click="addRun()"
                            :style="{width: '100%'}" icon="md-add">新增运行服务
                    </Button>
                </Col>
            </Row>
            <List>
                <ListItem v-for="(item, index) in tableData" :key="item.id">
                    <ListItemMeta :title="item.name" :description="item.description"/>
                    <Row type="flex" justify="center" align="middle" :gutter="38"
                         :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                        <Col>
                            <div style="width: 80px; align-content: center">付费</div>
                            <div :style="{width: '80px', alignContent: 'center', color: `${item.serviceOrder.payStatus === 0 ? '#19be6b' : '#ff9900'}`}">
                                {{item.serviceOrder.payStatus === 0 ? '已支付' : '未支付'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 80px; align-content: center">运行类型</div>
                            <div :style="{width: '80px', alignContent: 'center', color: `${item.type === 0 ? '#2d8cf0' : '#19be6b'}`}">
                                {{item.type === 0 ? '数据分析' : '学习系统'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 80px; align-content: center">公开类型</div>
                            <div :style="{width: '80px', alignContent: 'center', color: `${item.publicType === 0 ? '#19be6b' : '#2d8cf0'}`}">
                                {{item.publicType === 0 ? '公开' : '私有'}}
                            </div>
                        </Col>
                        <Col>
                            <div class="list-description">运行状态</div>
                            <div :style="{width: '80px', alignContent: 'center', color: `${item.status === 0 ? '#2d8cf0' : item.status === 1 ? '#19be6b': item.status === 2 ? '#ff9900' : '#ed4014'}` }">
                                {{item.status === 0 ? '正在运行': item.status === 1 ? '运行完成' : item.status === 2 ? '未运行' : '出现故障'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 138px; align-content: center">开始运行时间</div>
                            <div style="width: 138px; align-content: center">{{item.startTime ? item.startTime : '未开始'}}
                            </div>
                        </Col>
                        <Col>
                            <a style="margin: 0 3px; color: #2d8cf0" @click="switchRun(index)">运行</a>
                            |
                            <a style="margin: 0 3px; color: #19be6b" @click="showRunDetail(index)">详情</a>
                            |
                            <a style="margin: 0 3px; color: #ff9900" @click="updateRun(index)">更新</a>
                            |
                            <a style="margin: 0 3px; color:#ed4014;" @click="removeRun(index)">删除</a>
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
    import EditOperation from "./Operation/EditOperation";
    import OperationForm from "./Operation/OperationForm";
    import ExecuteOperationTask from "./Operation/ExecuteOperationTask";
    import {deepClone} from "../../util/object.util";
    import {errorMessage} from "../../util/message.util";
    import LoadingIcon from "../../components/LoadingIcon";
    import OperationInformation from "./Operation/OperationInformation";

    export default {
        name: "Operation",
        components: {
            OperationInformation,
            LoadingIcon, ExecuteOperationTask, OperationForm, EditOperation, ComponentTitle},
        data() {
            return {
                spinShow: false,
                addRunTask: false,
                updateRunTask: false,
                executeTask: false,
                runInformation: false,
                delConfirm: false,
                delConfirmIndex: -1,
                addFormItem: {},
                updateFormItem: {},
                runtimeInfo: {},
                editRunStyle: {
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
                tableData: []
            }
        },
        methods: {
            editRuntimeServiceCompleteTask() {
                this.addRunTask = false
                this.updateRunTask = false
                this.loadTableData()
            },
            searchRun() {
                this.page.current = 1;
                this.loadTableData()
            },
            resetSearchRun() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            switchRun(index) {
                console.log(index)
                this.executeTask = true;
            },
            showRunDetail(index) {
                this.runInformation = true;
                this.runtimeInfo = deepClone(this.tableData[index])
                this.$refs['runtimeInfoRef'].$emit('loadData', this.runtimeInfo.id)
            },
            addRun() {
                this.addRunTask = true;

                this.addFormItem = {
                    name: null,
                    type: 0,
                    publicType: 1,
                    status: 2,
                    configId: null,
                    datasourceId: null,
                    memory: 256,
                    calculate: 256,
                    clusterFlag: 0,
                    serviceNode: 3,
                    loadBalanceFlag: 0,
                    description: '',
                    countCompleteTask: 0,
                    protocolFormatIdList: []
                }
            },
            updateRun(index) {
                this.updateRunTask = true;

                let runtimeService = deepClone(this.tableData[index]);
                console.log(runtimeService)
                this.$refs['updateRuntimeRef'].$emit("changeServiceConfig", runtimeService.config.id)

                let protocolFormatIdList = []
                runtimeService.visualDataList.forEach(
                    visualData => protocolFormatIdList.push(visualData.protocolFormatId))

                runtimeService['protocolFormatIdList'] = protocolFormatIdList
                if (runtimeService.config)
                    runtimeService.configId = runtimeService.config.id
                if (runtimeService.datasource)
                    runtimeService.datasourceId = runtimeService.datasource.id

                this.updateFormItem = runtimeService
            },
            removeRun(index) {
                this.delConfirm = true
                this.delConfirmIndex = index
            },
            deleteRun() {
                let runtimeService = deepClone(this.tableData[this.delConfirmIndex]);

                // 显示加载提示信息
                let userId = this.$store.state.user.id
                this.axios.delete(`/runtime-server/delete/${userId}/${runtimeService.id}`).then(({data}) => {
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

                // 显示加载提示信息
                this.spinShow = true;
                this.axios.post('/runtime-server/list', condition).then(({data}) => {
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
