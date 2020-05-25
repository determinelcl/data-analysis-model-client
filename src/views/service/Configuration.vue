<template>
    <div>
        <ComponentTitle name="服务配置管理" description="服务配置管理：添加、删除、修改、查询服务基本信息"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">

            <Drawer :title="editServiceText" v-model="editService" width="720"
                    :mask-closable="false" :styles="editServiceStyle">
                <EditConfiguration :form-item="configurationFormItem" :edit-type="editType"
                                   @completeTask="editConfigurationCompleteTask"></EditConfiguration>
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
                <ListItem v-for="(item, index) in tableData" :key="item.id">
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
                            <div style="width: 80px;">公开类型</div>
                            <div :style="{width: '80px', alignContent: 'center', color: `${item.publicType === 0 ? '#19be6b': '#ff9900'}` }">
                                {{item.publicType === 0 ? '公开': '私有'}}
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
    import {deepClone} from "../../util/object.util";
    import {errorMessage} from "../../util/message.util";

    export default {
        name: "Configuration",
        components: {EditConfiguration, ComponentTitle},
        data() {
            return {
                editService: false,
                editType: 'add',
                editServiceText: '',
                delConfirm: false,
                delConfirmIndex: -1,
                configurationFormItem: {},
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
                tableData: []
            }
        },
        methods: {
            editConfigurationCompleteTask() {
                this.editService = false;
                this.loadTableData()
            },
            searchService() {
                this.page.current = 1;
                this.loadTableData();
            },
            resetSearchService() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            addService() {
                this.editServiceText = '新增服务';
                this.editType = 'add';
                this.editService = true;

                this.configurationFormItem = {
                    name: '',
                    publicType: 0,
                    status: 0,
                    gender: '',
                    description: '',
                    formDynamic: {
                        step: 0,
                        items: [{
                            step: 0,
                            model: [],
                            protocolTransfer: false,
                            protocolTransFlag: 1,
                            format: {},
                            protocolTransFormat: ''
                        }]
                    }
                }
            },
            updateService(index) {
                this.editServiceText = '更新服务'
                this.editType = 'update'
                this.editService = true

                let item = deepClone(this.tableData[index]);
                item.makeUpList = item.makeUpList.sort((a, b) => a.step - b.step);

                let step = 0
                item.makeUpList.forEach(makeUp => {
                    makeUp.step = step++
                    makeUp.model = [makeUp.version.modelId, makeUp.version.id]
                    makeUp.protocolTransfer = (makeUp.protocolTransFlag === 0)

                    if (!makeUp.protocolTransFormat) return
                    let item = eval('(' + makeUp.protocolTransFormat + ')');
                    if (item instanceof String)
                        makeUp.format = eval('(' + item + ')')
                    else makeUp.format = item
                })

                item.formDynamic = {
                    step: 0,
                    items: item.makeUpList
                }
                this.configurationFormItem = item;
            },
            removeService(index) {
                this.delConfirm = true
                this.delConfirmIndex = index
            },
            deleteService() {
                let configuration = this.tableData[this.delConfirmIndex];

                console.log(configuration);
                let userId = this.$store.state.user.id;
                this.axios.delete(`/configuration-server/delete/${userId}/${configuration.id}`).then(({data}) => {
                    console.log(data);
                    this.loadTableData();
                    this.delConfirm = false;
                }).catch(error => {
                    this.delConfirm = false;
                    console.log(error)
                    errorMessage(error, this);
                })
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
                this.axios.post('/configuration-server/list', condition).then(({data}) => {
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
