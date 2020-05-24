<template>
    <div>
        <ComponentTitle name="模型的授权管理" description="模型的授权管理：添加、删除、修改、查询、审核模型的授权信息">
        </ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p>是否删除此授权申请？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long
                            :loading="modalLoading" @click="deleteAuthorization()">删除
                    </Button>
                </div>
            </Modal>
            <Drawer :title="updateAuthorizationText" v-model="editAuthorizationOpenState" width="720"
                    :mask-closable="false" :styles="styles">
                <EditAuthorization :form-item="editAuthorizationItem" :edit-type="editType"
                                   @completeTask="editAuthorizationCompleteTask"></EditAuthorization>
            </Drawer>

            <Form ref="formInline" :model="searchForm">
                <Row type="flex" justify="space-between" :style="{padding: '0 20px'}">
                    <Col span="8">
                        <FormItem label="名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchAuthorization()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchAuthorization()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row type="flex" justify="start" :style="{padding: '0 20px', margin: '0 0 20px 0'}">
                <Col>
                    <Button type="primary" @click="addAuthorization()"
                            :style="{width: '138px'}" icon="md-add">新增授权申请
                    </Button>
                </Col>
            </Row>
            <Table ref="authorizationTableRef" :data="tableData" :columns="tableColumns" stripe no-data-text="授权申请数据为空">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="warning" size="small" style="margin-right: 5px" @click="updateAuthorization(index)">
                        更新
                    </Button>
                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                </template>
            </Table>

            <div style="margin: 10px; overflow: hidden">
            </div>
            <div style="display: flex; justify-content: center;">
                <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                      show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                      show-sizer show-total @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import LoadingIcon from "../../components/LoadingIcon";
    import ComponentTitle from "../../components/ComponentTitle";
    import {errorMessage, renderPopTip} from "../../util/message.util";
    import {deepClone} from "../../util/object.util";
    import EditAuthorization from "./authorization/EditAuthorization";

    export default {
        name: "Authorization",
        components: {EditAuthorization, LoadingIcon, ComponentTitle},
        data() {
            return {
                spinShow: false,
                delConfirm: false,
                delBatchConfirm: false,
                deletedAuthorizationIndex: null,
                modalLoading: false,
                editAuthorizationOpenState: false,
                updateAuthorizationText: '',
                tableData: [],
                editType: 'add',
                editAuthorizationItem: {},
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
                    {title: '授权申请名称', key: 'name', width: 180, resizable: true, tooltip: true, fixed: 'left'},
                    {
                        title: '申请的模型', key: 'modelVersion', width: 180, resizable: true, tooltip: true,
                        render: (h, params) => {
                            const row = params.row;
                            let versionTagList = ['lasted', 'GA(最新)', 'GA', 'Beta', 'Snapshot']
                            let modelVersionName = `${row.modelVersion.name}:${versionTagList[row.modelVersion.type]}`
                            let text = `${row.modelVersion.model.name}/${modelVersionName}`

                            return h('div', text);
                        }
                    },
                    {title: '申请描述', key: 'applyDesc', width: 180, resizable: true, tooltip: true},
                    {
                        title: '状态', key: 'authStatus', width: 150, resizable: true,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.authStatus === 0 ? 'success' : row.authStatus === 1 ? 'warning' : 'error';
                            const text = row.authStatus === 0 ? '已授权' : row.authStatus === 1 ? '待授权' : '未授权';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {title: '达成的协议', key: 'protocol', width: 180, resizable: true, tooltip: true},
                    {
                        title: '协议的图片', key: 'protocolImg', width: 180, resizable: true, tooltip: true,
                        render: (h, params) => {
                            const row = params.row;

                            let url = ''
                            if (row.protocolImg) {
                                let file = JSON.parse(row.protocolImg);
                                console.log(file);
                                url = `${this.$store.state.fileRoot}/${file.group}/${file.filename}`
                            }

                            return h('img', {
                                props: {
                                    src: url
                                },
                                styles: {
                                    height: '30px',
                                    width: '30px'
                                },
                                on: {
                                    // 用于点击放大
                                    click: () => {
                                        console.log(url)
                                    }
                                }
                            });
                        }
                    },
                    {title: '授权时限', key: 'expireDate', width: 180, resizable: true, tooltip: true},
                    {title: '授权开始时间', key: 'authStartTime', width: 180, resizable: true, tooltip: true},
                    {title: '创建日期', key: 'created', width: 180, resizable: true},
                    {title: '更新日期', key: 'updated', width: 180, resizable: true},
                    {
                        title: '描述信息', key: 'description', width: 180, resizable: true, tooltip: true,
                        render: (h, params) => {
                            let row = params.row;
                            return renderPopTip(h, row.description);
                        }
                    },
                    {title: '操作', slot: 'action', width: 150, align: 'center', fixed: 'right'}
                ],
                styles: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
            }
        },
        methods: {
            editAuthorizationCompleteTask() {
                this.editAuthorizationOpenState = false;
                this.loadTableData()
            },
            searchAuthorization() {
                this.page.current = 1;
                this.loadTableData();
            },
            resetSearchAuthorization() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            addAuthorization() {
                this.editAuthorizationOpenState = true;
                this.editType = 'add';
                this.updateAuthorizationText = '新增授权申请';

                this.editAuthorizationItem = {
                    name: '',
                    modelVersionId: null,
                    expireDate: null,
                    protocol: null,
                    protocolImg: '',
                    applyDesc: '',
                    description: ''
                }
            },
            updateAuthorization(index) {
                this.editAuthorizationOpenState = true;
                this.editType = 'update';
                this.updateAuthorizationText = '更新授权申请';
                let authorization = deepClone(this.tableData[index]);

                authorization.versionUrl = [authorization.modelVersion.modelId, authorization.modelVersion.id]
                this.editAuthorizationItem = authorization;
            },
            // 获取选中的表格中的数据的id
            getTableSelection() {
                let selection = this.$refs.authorizationTableRef.getSelection();
                let selectIdList = [];
                selection.forEach(item => selectIdList.push(item.id))
                return selectIdList;
            },
            remove(index) {
                console.log(index);
                this.deletedAuthorizationIndex = index;
                this.delConfirm = true;
            },
            deleteAuthorization() {
                let authorization = this.tableData[this.deletedAuthorizationIndex];

                console.log(authorization);
                let userId = this.$store.state.user.id;
                this.axios.delete(`/model-server/apply/delete/${userId}/${authorization.id}`).then(({data}) => {
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
            // 获取授权申请数据
            loadTableData() {
                let condition = this.searchForm;
                Object.assign(condition, this.page)
                condition['userId'] = this.$store.state.user.id
                condition['applyUserId'] = this.$store.state.user.id

                // 显示加载提示信息
                this.spinShow = true;
                // 加载授权申请列表数据
                this.axios.post('/model-server/apply/list', condition).then(({data}) => {
                    this.tableData = data.data.data;
                    this.page.total = data.data.total;
                    this.spinShow = false;
                }).catch(error => {
                    console.log(error)
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
