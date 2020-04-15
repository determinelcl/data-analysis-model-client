<template>
    <div>
        <ComponentTitle name="角色管理" description="角色管理：添加、删除、修改、查询、分配角色权限"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>

            <Form ref="formInline" :model="searchForm">
                <Row type="flex" justify="space-between" :style="{padding: '0 20px'}">
                    <Col span="8">
                        <FormItem label="角色名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="权限名称：" prop="parent" label-position="left">
                            <Input type="text" v-model="searchForm.authority" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchRole()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchRole()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row type="flex" justify="start" :style="{padding: '0 20px', margin: '0 0 20px 0'}">
                <Col span="3">
                    <Button type="primary" @click="addRole()"
                            :style="{width: '108px'}" icon="md-add">新增角色
                    </Button>
                    <Drawer :title="updateRoleText" v-model="editRoleOpenState" width="360"
                            :mask-closable="false" :styles="styles">
                        <EditRole ref="editRole" :form-data="editRoleForm" @addSuccess="addRoleSuccess"
                                  :edit-type="editType" @completeTask="editRoleCompleteTask"></EditRole>
                    </Drawer>
                </Col>
                <Col span="3">
                    <Button @click="removeRoleBatch()" :style="{width: '108px'}">
                        <Icon type="ios-trash-outline" size="17"/>
                        批量删除
                    </Button>
                    <Modal v-model="delBatchConfirm" width="360">
                        <p slot="header" style="color:#f60;text-align:center">
                            <Icon type="ios-information-circle"></Icon>
                            <span>删除确认</span>
                        </p>
                        <div style="text-align:center">
                            <p>是否删除选中的角色？</p>
                        </div>
                        <div slot="footer">
                            <Button type="error" size="large" long
                                    :loading="modalLoading" @click="deleteRoleBatch()">删除
                            </Button>
                        </div>
                    </Modal>
                </Col>
                <Col span="3">
                    <Dropdown @on-click="changRoleStatus">

                        <Button :style="{width: '108px'}">
                            更过操作
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="0">启用角色</DropdownItem>
                            <DropdownItem :name="1">禁用角色</DropdownItem>

                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>
            <Table ref="roleTableRef" :data="tableData" :columns="tableColumns" stripe no-data-text="用户数据为空">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="warning" size="small" style="margin-right: 5px" @click="updateRole(index)">
                        更新
                    </Button>
                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                    <Modal v-model="delConfirm" width="360">
                        <p slot="header" style="color:#f60;text-align:center">
                            <Icon type="ios-information-circle"></Icon>
                            <span>删除确认</span>
                        </p>
                        <div style="text-align:center">
                            <p>是否删除此角色？</p>
                        </div>
                        <div slot="footer">
                            <Button type="error" size="large" long
                                    :loading="modalLoading" @click="deleteRole()">删除
                            </Button>
                        </div>
                    </Modal>
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
    import {errorMessage, renderPopTip} from "../../util/message.util";
    import EditRole from "./role/EditRole";
    import {deepClone} from "../../util/object.util";

    export default {
        name: "Role",
        components: {EditRole, LoadingIcon, ComponentTitle},
        data() {
            return {
                spinShow: false,
                delConfirm: false,
                delBatchConfirm: false,
                deletedRoleIndex: null,
                modalLoading: false,
                editRoleOpenState: false,
                updateRoleText: '',
                tableData: [],
                editType: 'add',
                editRoleForm: {
                    id: null,
                    name: null,
                    enName: null,
                    authorityList: [],
                    status: 0,
                    description: null
                },
                searchForm: {
                    name: null,
                    authority: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                tableColumns: [
                    {type: 'selection', width: 60, align: 'center', fixed: 'left'},
                    {title: '角色名称', key: 'name', width: 180, resizable: true},
                    {
                        title: '角色状态', key: 'status', width: 150, resizable: true,
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
                        title: '权限', key: 'authorityList', width: 180, resizable: true,
                        render: (h, params) => {
                            const row = params.row;
                            if (!row.authorityList) return h('div', '无');

                            // 将权限名称拼接成字符串
                            let authorityList = [];
                            let authority = '';

                            row.authorityList.forEach(item => {
                                if (authorityList.includes(item.id, 0)) return;

                                authorityList.push(item.id);
                                authority += `, ${item.name}`;
                            })

                            return renderPopTip(h, authority);
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
            editRoleCompleteTask() {
                this.editRoleOpenState = false;
                this.loadTableData();
            },
            addRoleSuccess() {
                this.loadTableData();
            },
            searchRole() {
                this.loadTableData();
            },
            resetSearchRole() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            addRole() {
                this.editRoleOpenState = true;
                this.editType = 'add';
                this.updateRoleText = '新增角色';

                this.$refs.editRole.$emit('addRoleClick');
            },
            updateRole(index) {
                this.editRoleOpenState = true;
                this.editType = 'update';
                this.updateRoleText = '更新用户';
                let role = deepClone(this.tableData[index]);
                console.log(role)

                let authorityIdList = []
                let authorityParentIdList = []
                role.authorityList.forEach(authority => {
                    if (authority.parentId === 0) {
                        authorityParentIdList.push(authority.id);
                        return;
                    }

                    authorityIdList.push(authority.id)
                });
                // role['authorityIdList'] = authorityIdList;
                // role['authorityParentIdList'] = authorityParentIdList;

                this.editRoleForm = role;
                // 触发事件
                this.$refs.editRole.$emit('updateRoleClick', authorityParentIdList, authorityIdList);
            },
            // 获取选中的表格中的数据的id
            getTableSelection() {
                let selection = this.$refs.roleTableRef.getSelection();
                let selectIdList = [];
                selection.forEach(item => selectIdList.push(item.id))
                return selectIdList;
            },
            removeRoleBatch() {
                let tableSelectionIdList = this.getTableSelection();
                if (tableSelectionIdList.length === 0) {
                    this.$Message.warning('请选择需要删除的角色');
                    return;
                }

                this.delBatchConfirm = true;
            },
            deleteRoleBatch() {
                let tableSelectionIdList = this.getTableSelection();
                console.log(tableSelectionIdList);
                if (tableSelectionIdList.length === 0) return;

                this.axios.post(`/role-server/del/list`, tableSelectionIdList).then(({data}) => {
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
                this.deletedRoleIndex = index;
                this.delConfirm = true;
            },
            deleteRole() {
                let role = this.tableData[this.deletedRoleIndex];
                console.log(role);
                this.axios.delete(`/role-server/del/${role.id}`).then(({data}) => {
                    console.log(data);
                    this.loadTableData();
                    this.delConfirm = false;
                }).catch(error => {
                    this.delConfirm = false;
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            changRoleStatus(status) {
                let url = '/role-server/enable/list'
                if (parseInt(status) === 1)
                    url = '/role-server/disable/list'

                const tableSelectionIdList = this.getTableSelection();
                console.log(`${url} -> ${tableSelectionIdList}`)

                if (tableSelectionIdList.length === 0) {
                    this.$Message.warning('请选择需要操作的角色');
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
            // 获取角色数据
            loadTableData() {
                let condition = this.searchForm;
                Object.assign(condition, this.page)
                // 显示加载提示信息
                this.spinShow = true;
                // 加载角色列表数据
                this.axios.post('/role-server/page', condition).then(({data}) => {
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
            this.loadTableData();
        }
    }
</script>

<style scoped>

</style>
