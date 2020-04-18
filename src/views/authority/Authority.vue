<template>
    <div>
        <ComponentTitle name="权限管理" description="权限管理：添加、删除、修改、查询"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>
            <Modal v-model="delBatchConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p v-html="delBatchConfirmText"></p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long
                            :loading="modalLoading" @click="deleteAuthorityBatch()">删除
                    </Button>
                </div>
            </Modal>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p v-html="delConfirmText"></p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long
                            :loading="modalLoading" @click="deleteAuthority()">删除
                    </Button>
                </div>
            </Modal>
            <Drawer :title="updateAuthorityText" v-model="editAuthorityOpenState" width="720"
                    :mask-closable="false" :styles="styles">
                <EditAuthority ref="editAuthority" :form-data="editAuthorityForm"
                               @addSuccess="addAuthoritySuccess" :edit-type="editType"
                               @completeTask="editAuthorityCompleteTask"></EditAuthority>
            </Drawer>

            <Form ref="formInline" :model="searchForm">
                <Row type="flex" justify="space-between" :style="{padding: '0 20px'}">
                    <Col span="8">
                        <FormItem label="权限名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="组件名称：" prop="parent" label-position="left">
                            <Input type="text" v-model="searchForm.componentName" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchAuthority()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchAuthority()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row type="flex" justify="start" :style="{padding: '0 20px', margin: '0 0 20px 0'}">
                <Col span="3">
                    <Button type="primary" @click="addAuthority()"
                            :style="{width: '108px'}" icon="md-add">新增权限
                    </Button>
                </Col>
                <Col span="3">
                    <Button @click="removeAuthorityBatch()" :style="{width: '108px'}">
                        <Icon type="ios-trash-outline" size="17"/>
                        批量删除
                    </Button>
                </Col>
                <Col span="3">
                    <Dropdown @on-click="changAuthorityStatus">

                        <Button :style="{width: '108px'}">
                            更过操作
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="0">启用权限</DropdownItem>
                            <DropdownItem :name="1">禁用权限</DropdownItem>

                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>
            <Table ref="authorityTableRef" :data="tableData" :columns="tableColumns" stripe no-data-text="权限信息为空">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="warning" size="small" style="margin-right: 5px" @click="updateAuthority(index)">
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
    import ComponentTitle from "../../components/ComponentTitle";
    import LoadingIcon from "../../components/LoadingIcon";
    import EditAuthority from "./permission/EditAuthority";
    import {errorMessage, renderPopTip} from "../../util/message.util";
    import {deepClone} from "../../util/object.util";

    export default {
        name: "Authority",
        components: {EditAuthority, LoadingIcon, ComponentTitle},
        data() {
            return {
                spinShow: false,
                delConfirm: false,
                delConfirmText: '',
                delBatchConfirm: false,
                delBatchConfirmText: '',
                deletedAuthorityIndex: null,
                modalLoading: false,
                editAuthorityOpenState: false,
                updateAuthorityText: '',
                tableData: [],
                originParentAuthorityList: [],
                editType: 'add',
                editAuthorityForm: {
                    id: null,
                    name: null,
                    enName: null,
                    iconId: null,
                    url: null,
                    componentId: null,
                    parentId: null,
                    status: 0,
                    showType: 0,
                    description: null
                },
                searchForm: {
                    name: null,
                    componentName: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50],
                    paged: true
                },
                tableColumns: [
                    {type: 'selection', width: 60, align: 'center', fixed: 'left'},
                    {title: '权限名称', key: 'name', width: 150, resizable: true},
                    {title: '英文名称', key: 'enName', width: 180, resizable: true},
                    {
                        title: '所属权限', key: 'parent', width: 130, resizable: true,
                        render: (h, params) => {
                            let row = params.row;
                            if (!row.parentId) return h('div', '');

                            let parentName = '';
                            this.originParentAuthorityList.forEach(authority => {
                                if (authority.id === row.parentId)
                                    parentName = authority.name;
                            })

                            return renderPopTip(h, parentName);
                        }
                    },
                    {
                        title: '权限类型', key: 'showType', width: 118, resizable: true,
                        filters: [
                            {label: '菜单', value: 0},
                            {label: '其他', value: 1}
                        ],
                        filterMethod(value, row) {
                            return row.showType === value;
                        },
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.showType === 0 ? 'green' : 'orange';
                            const text = row.showType === 0 ? '菜单' : '其他';

                            return h('Tag', {
                                props: {
                                    size: 'large',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '权限状态', key: 'status', width: 118, resizable: true,
                        filters: [
                            {label: '启用', value: 0},
                            {label: '禁用', value: 1}
                        ],
                        filterMethod(value, row) {
                            return row.status === value;
                        },
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? 'success' : 'error';
                            const text = row.status === 0 ? '启用' : '禁用';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '权限图标', key: 'icon', width: 100, resizable: true, align: 'center',
                        render: (h, params) => {
                            let row = params.row;

                            if (!row.icon) return h('div', '');

                            return h('Icon', {
                                props: {
                                    size: 22,
                                    type: row.icon.type
                                }
                            }, row.icon);
                        }
                    },
                    {
                        title: '访问地址', key: 'url', width: 130, resizable: true,
                        render: (h, params) => {
                            let row = params.row;
                            if (row.showType !== 0) return h('div', row.url);

                            let address = row.url;
                            if (row.component)
                                address = `${this.$store.state.rootRouter}/${row.component.url}`;
                            return renderPopTip(h, address);
                        }
                    },
                    {
                        title: '组件名称', key: 'component', width: 150, resizable: true,
                        render: (h, params) => {
                            let row = params.row;
                            if (!row.component) return h('div', '');

                            return renderPopTip(h, row.component.name);
                        }
                    },
                    {title: '创建日期', key: 'created', width: 180, resizable: true},
                    {title: '更新日期', key: 'updated', width: 180, resizable: true},
                    {
                        title: '描述信息', key: 'description', width: 180, resizable: true,
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
            editAuthorityCompleteTask() {
                this.editAuthorityOpenState = false;
                this.loadTableData();
            },
            addAuthoritySuccess() {
                this.loadTableData();
            },
            searchAuthority() {
                this.page.current = 1;
                this.loadTableData();
            },
            resetSearchAuthority() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            addAuthority() {
                this.editAuthorityOpenState = true;
                this.editType = 'add';
                this.updateAuthorityText = '新增权限';

                this.$refs.editAuthority.$emit('addAuthorityClick');
            },
            updateAuthority(index) {
                this.editAuthorityOpenState = true;
                this.editType = 'update';
                this.updateAuthorityText = '更新权限';
                let authority = deepClone(this.tableData[index]);
                console.log(authority)
                if (authority.icon)
                    authority.iconId = authority.icon.id;
                if (authority.component)
                    authority.componentId = authority.component.id;

                this.editAuthorityForm = authority;
                // 触发事件
                this.$refs.editAuthority.$emit('updateAuthorityClick',
                    authority.showType == null ? authority.showType : 0);
            },
            // 获取选中的表格中的数据的id
            getTableSelection() {
                let selection = this.$refs.authorityTableRef.getSelection();
                let selectIdList = [];
                selection.forEach(item => selectIdList.push(item.id))
                return selectIdList;
            },
            removeAuthorityBatch() {
                let tableSelectionIdList = this.getTableSelection();
                if (tableSelectionIdList.length === 0) {
                    this.$Message.warning('请选择需要删除的权限');
                    return;
                }

                this.delBatchConfirmText =
                    '批量删除权限将删除<b style="color: #f60;">当前选中的权限</b>以及' +
                    '<b style="color: #f60;">所有属于当前权限的权限</b>，是否删除选中的权限？'
                this.delBatchConfirm = true;
            },
            deleteAuthorityBatch() {
                let tableSelectionIdList = this.getTableSelection();
                console.log(tableSelectionIdList);
                if (tableSelectionIdList.length === 0) return;

                this.axios.post(`/authority-server/del/list`, tableSelectionIdList).then(({data}) => {
                    this.delBatchConfirm = false;
                    console.log(data);
                    this.loadTableData();
                }).catch(error => {
                    this.delBatchConfirm = false;
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            remove(index) {
                console.log(index);
                this.deletedAuthorityIndex = index;
                this.delConfirm = true;

                this.delConfirmText = '删除权限将删除<b style="color: #f60;">当前权限</b>以及' +
                    '<b style="color: #f60;">所有属于当前权限的权限</b>，是否删除此权限？'
            },
            deleteAuthority() {
                let authority = this.tableData[this.deletedAuthorityIndex];
                console.log(authority);
                this.axios.delete(`/authority-server/del/${authority.id}`).then(({data}) => {
                    console.log(data);
                    this.loadTableData();
                    this.delConfirm = false;
                }).catch(error => {
                    this.delConfirm = false;
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            changAuthorityStatus(status) {
                let url = '/authority-server/enable/list'
                if (parseInt(status) === 1)
                    url = '/authority-server/disable/list'

                const tableSelectionIdList = this.getTableSelection();
                console.log(`${url} -> ${tableSelectionIdList}`)

                if (tableSelectionIdList.length === 0) {
                    this.$Message.warning('请选择需要操作的权限');
                    return;
                }

                this.axios.patch(url, tableSelectionIdList).then(({data}) => {
                    console.log(data)
                    this.loadTableData()
                }).catch(error => {
                    console.log(error);
                    errorMessage(error, this);
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
            // 获取权限数据
            loadTableData() {
                let condition = deepClone(this.searchForm);
                Object.assign(condition, this.page)
                // 显示加载提示信息
                this.spinShow = true;
                // 加载权限列表数据
                this.axios.post('/authority-server/search', condition).then(({data}) => {
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
        created() {
            this.axios.post('/authority-server/search', {parentId: 0, paged: false}).then(({data}) => {
                this.originParentAuthorityList = data.data.data;
            }).catch(error => {
                errorMessage(error, this);
            });
            this.loadTableData();
        }
    }
</script>

<style scoped>

</style>
