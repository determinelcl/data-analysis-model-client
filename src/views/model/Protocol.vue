<template>
    <div>
        <ComponentTitle name="模型协议管理" description="模型协议管理：添加、删除、修改、查询协议"></ComponentTitle>
        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>
            <Drawer :title="editProtocolText" v-model="editProtocol" width="1183"
                    :mask-closable="false" :styles="editProtocolStyle">
                <EditProtocol :edit-type="editType" :form-item="formItem"
                              @completeTask="editProtocolCompleteTask"></EditProtocol>
            </Drawer>
            <Drawer v-model="protocolInfo" width="1183" :closable="false">
                <ProtocolInformation :protocol-info="protocolItem"></ProtocolInformation>
            </Drawer>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p>是否删除当前协议？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="deleteProtocol()">删除</Button>
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
                                <Option :value="0">启用</Option>
                                <Option :value="1">禁用</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="类型：" prop="version" label-position="left">
                            <Select v-model="searchForm.publicType" filterable allow-create clearable
                                    style="width: 100px">
                                <Option :value="0">公开</Option>
                                <Option :value="1">私有</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchProtocol()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchProtocol()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Divider></Divider>
            <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
                <Col span="24">
                    <Button type="dashed" @click="addProtocol()"
                            :style="{width: '100%'}" icon="md-add">新增协议
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
                            <div :style="{width: '50px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': '#ff9900'}` }">
                                {{item.status === 0 ? '启用': '禁用'}}
                            </div>
                        </Col>
                        <Col>
                            <div class="list-description">类型</div>
                            <div :style="{width: '50px', alignContent: 'center', color: `${item.publicType === 0 ? '#19be6b': '#ff9900'}` }">
                                {{item.publicType === 0 ? '公开': '私有'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 138px; align-content: center">更新日期</div>
                            <div style="width: 138px; align-content: center">{{item.updated}}</div>
                        </Col>
                        <Col>
                            <a style="margin: 0 3px; color: #19be6b" @click="showProtocolDetail(index)">详情</a>
                            |
                            <a style="margin: 0 3px; color: #ff9900" @click="updateProtocol(index)">更新</a>
                            |
                            <a style="margin: 0 3px; color:#ed4014;" @click="removeProtocol(index)">删除</a>
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
    import EditProtocol from "./protocol/EditProtocol";
    import ProtocolInformation from "./protocol/ProtocolInformation";
    import {deepClone} from "../../util/object.util";
    import {errorMessage} from "../../util/message.util";
    import LoadingIcon from "../../components/LoadingIcon";

    export default {
        name: "Protocol",
        components: {LoadingIcon, ProtocolInformation, EditProtocol, ComponentTitle},
        data() {
            return {
                spinShow: false,
                editProtocol: false,
                editType: 'add',
                editProtocolText: '',
                protocolInfo: false,
                protocolItem: {},
                delConfirm: false,
                delConfirmIndex: -1,
                formItem: {},
                editProtocolStyle: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                searchForm: {
                    name: null,
                    status: null,
                    publicType: null
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
            editProtocolCompleteTask() {
                this.editProtocol = false
                this.searchProtocol()
            },
            searchProtocol() {
                this.page.current = 1
                this.loadTableData()
            },
            resetSearchProtocol() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            showProtocolDetail(index) {
                this.protocolInfo = true

                let item = deepClone(this.tableData[index]);

                let inputFormItem = {}
                let processFormItem = []
                let outputFormItem = {}

                item.protocolFormatList.forEach(format => {
                    if (format.type === 0) inputFormItem = format
                    else if (format.type === 1) processFormItem.push(format)
                    else if (format.type === 2) outputFormItem = format
                })
                item['inputFormItem'] = inputFormItem
                item['processFormItem'] = processFormItem
                item['outputFormItem'] = outputFormItem

                this.protocolItem = item
            },
            addProtocol() {
                this.formItem = {
                    name: null,
                    publicType: 0,
                    status: 0,
                    groupId: null,
                    tagIdList: [],
                    description: '',
                    inputFormItem: {
                        name: '',
                        ioType: null,
                        ioDesc: '',
                        fileSuffix: '',
                        format: '',
                    },
                    processFormItem: [],
                    outputFormItem: {
                        name: '',
                        ioType: null,
                        ioDesc: '',
                        fileSuffix: '',
                        format: '',
                    }
                }

                this.editProtocolText = '添加协议'
                this.editType = 'add'
                this.editProtocol = true
            },
            updateProtocol(index) {
                let item = deepClone(this.tableData[index]);
                item.groupId = item.group.id
                let tagIdList = []
                if (item.tagList)
                    item.tagList.forEach(tag => tagIdList.push(tag.id))

                item.tagIdList = tagIdList
                let inputFormItem = {}
                let processFormItem = []
                let outputFormItem = {}

                item.protocolFormatList.forEach(format => {
                    if (format.type === 0) inputFormItem = format
                    else if (format.type === 1) processFormItem.push(format)
                    else if (format.type === 2) outputFormItem = format

                    // 将所有的协议设置为修改的项
                    format['newObj'] = 1
                    if (!format.format) return
                    let item = eval('(' + format.format + ')');
                    if (item instanceof String)
                        format.format = eval('(' + item + ')')
                    else format.format = item
                })
                item['inputFormItem'] = inputFormItem
                item['processFormItem'] = processFormItem
                item['outputFormItem'] = outputFormItem

                this.formItem = item

                this.editProtocolText = '更新协议'
                this.editType = 'update'
                this.editProtocol = true
            },
            removeProtocol(index) {
                console.log(index)
                this.delConfirm = true
                this.delConfirmIndex = index
            },
            deleteProtocol() {
                let protocol = deepClone(this.tableData[this.delConfirmIndex]);

                let userId = this.$store.state.user.id
                this.axios.delete(`/protocol-server/delete/${userId}/${protocol.id}`).then(({data}) => {
                    console.log(data)

                    this.delConfirm = false
                    this.loadTableData()
                }).catch(error => {
                    console.log(error)

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
            loadTableData() {
                let condition = deepClone(this.searchForm)
                Object.assign(condition, this.page)
                condition['userId'] = this.$store.state.user.id

                // 显示加载提示信息
                this.spinShow = true;
                this.axios.post('/protocol-server/list', condition).then(({data}) => {
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
