<template>
    <div>
        <ComponentTitle name="用户管理" description="用户管理：添加、删除、修改、查询、禁用用户"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">

            <Spin fix v-if="spinShow"><LoadingIcon></LoadingIcon></Spin>

            <Form ref="formInline" :model="searchForm" :rules="searchRule">
                <Row type="flex" justify="space-between" :style="{padding: '0 20px'}">
                    <Col span="8">
                        <FormItem label="用户名称：" prop="username" label-position="left">
                            <Input type="text" v-model="searchForm.username" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="用户邮箱：" prop="email" label-position="left">
                            <Input type="email" v-model="searchForm.email" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="手机号码：" prop="phone" label-position="left">
                            <Input type="tel" v-model="searchForm.phone" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="认证信息：" prop="authenticationId" label-position="left">
                            <Input type="text" v-model="searchForm.authentication" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="创建日期：" prop="created" label-position="left">
                            <Input type="date" v-model="searchForm.created" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="更新日期：" prop="updated" label-position="left">
                            <Input type="date" v-model="searchForm.updated" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="24" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchUser()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchUser()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row type="flex" justify="start" :style="{padding: '0 20px', margin: '0 0 20px 0'}">
                <Col span="3">
                    <Button type="primary" @click="addUser()"
                            :style="{width: '108px'}" icon="md-add">新增用户
                    </Button>
                    <Drawer :title="updateUserText" v-model="editUserOpenState" width="720"
                            :mask-closable="false" :styles="styles">
                        <EditUser :form-data="editUserForm"
                                  :edit-type="editType" @completeTask="editUserCompleteTask"></EditUser>
                    </Drawer>
                </Col>
                <Col span="3">
                    <Button @click="removeUserBatch()" :style="{width: '108px'}">
                        <Icon type="ios-trash-outline" size="17"/>
                        批量删除
                    </Button>
                    <Modal v-model="delBatchConfirm" width="360">
                        <p slot="header" style="color:#f60;text-align:center">
                            <Icon type="ios-information-circle"></Icon>
                            <span>删除确认</span>
                        </p>
                        <div style="text-align:center">
                            <p>是否删除选中的用户？</p>
                        </div>
                        <div slot="footer">
                            <Button type="error" size="large" long
                                    :loading="modalLoading" @click="deleteUserBatch()">删除
                            </Button>
                        </div>
                    </Modal>
                </Col>
                <Col span="3">
                    <Dropdown @on-click="changUserStatus">

                        <Button :style="{width: '108px'}">
                            更过操作
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem name="0">启用用户</DropdownItem>
                            <DropdownItem name="2">禁用用户</DropdownItem>

                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>
            <Table ref="userTableRef" :data="tableData" :columns="tableColumns" stripe no-data-text="用户数据为空">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="showUserDetail(index)">详情
                    </Button>
                    <Drawer :closable="false" v-model="userDetail" width="640"
                            :styles="{overflow: 'auto', position: 'static'}">
                        <UserDetail :user-info="userInfo"></UserDetail>
                    </Drawer>
                    <Button type="warning" size="small" style="margin-right: 5px" @click="updateUser(index)">更新</Button>
                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                    <Modal v-model="delConfirm" width="360">
                        <p slot="header" style="color:#f60;text-align:center">
                            <Icon type="ios-information-circle"></Icon>
                            <span>删除确认</span>
                        </p>
                        <div style="text-align:center">
                            <p>是否删除此用户？</p>
                        </div>
                        <div slot="footer">
                            <Button type="error" size="large" long
                                    :loading="modalLoading" @click="deleteUser()">删除
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
    import EditUser from "./user/EditUser";
    import UserDetail from "./user/UserDetail";
    import {errorMessage} from "../../util/message.util";
    import {deepClone} from "../../util/object.util";
    import ComponentTitle from "../../components/ComponentTitle";
    import LoadingIcon from "../../components/LoadingIcon";

    export default {
        name: "User",
        components: {LoadingIcon, ComponentTitle, UserDetail, EditUser},
        data() {
            return {
                spinShow: false,
                editUserOpenState: false,
                userDetail: false,
                delBatchConfirm: false,
                batchModalLoading: false,
                modalLoading: false,
                delConfirm: false,
                deletedUserIndex: null,
                updateUserText: '',
                editType: 'add',
                editUserForm: {
                    id: null,
                    username: null,
                    password: null,
                    gender: null,
                    birthday: null,
                    email: null,
                    phone: null,
                    roleList: [],
                    status: null,
                    area: [],
                    description: null
                },
                userInfo: {},
                styles: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                tableData: [],
                searchForm: {
                    username: null,
                    email: null,
                    phone: null,
                    authentication: null,
                    created: null,
                    updated: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                searchRule: {},
                tableColumns: [
                    {type: 'selection', width: 60, align: 'center', fixed: 'left'},
                    {title: '用户名', key: 'username', width: 180, resizable: true},
                    {
                        title: '性别', key: 'gender', width: 100, resizable: true,
                        render: (h, params) => {
                            const row = params.row;
                            const gender = row.gender === 0 ? '男' : row.gender === 1 ? '女' : '未知';

                            return h('div', gender);
                        }
                    },
                    {title: '出生日期', key: 'birthday', width: 180, resizable: true},
                    {title: '邮箱', key: 'email', width: 180, resizable: true},
                    {title: '手机号码', key: 'phone', width: 150, resizable: true},
                    {
                        title: '认证类型', key: 'authenticationType', width: 150, resizable: true,
                        filters: [
                            {label: '未认证', value: 0},
                            {label: '个人认证', value: 1},
                            {label: '学生认证', value: 2},
                            {label: '教师/教授认证', value: 3},
                            {label: '团队认证', value: 4},
                            {label: '高校认证', value: 5},
                            {label: '企业认证', value: 6}
                        ],
                        filterMethod(value, row) {
                            return row.authenticationType === value;
                        },
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.authenticationType !== 0 ? 'primary' : 'error';
                            let label = ['未认证', '个人认证', '学生认证', '教师/教授认证', '团队认证', '高校认证', '企业认证']

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, label[row.authenticationType]);
                        }
                    },
                    {
                        title: '用户状态', key: 'status', width: 150, resizable: true,
                        filters: [
                            {label: '已激活', value: 0},
                            {label: '未激活', value: 1},
                            {label: '已禁用', value: 2}
                        ],
                        filterMethod(value, row) {
                            return row.status === value;
                        },
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? 'success' : row.status === 1 ? 'warning' : 'error';
                            const text = row.status === 0 ? '已激活' : row.status === 1 ? '未激活' : '已禁用';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '角色', key: 'roleList', width: 180, resizable: true,
                        render: (h, params) => {
                            const row = params.row;
                            if (!row.roleList) return h('div', '无');

                            let roleName = '';
                            row.roleList.forEach(role => {
                                roleName += ', ' + role.name
                            });

                            return this.renderPopTip(h, roleName);
                        }
                    },
                    {
                        title: '权限', key: 'roleList', width: 180, resizable: true,
                        render: (h, params) => {
                            const row = params.row;
                            if (!row.roleList) return h('div', '无');

                            // 将权限名称拼接成字符串
                            let authorityList = [];
                            let authority = '';
                            row.roleList.forEach(role => {
                                if (!role.authorityList) return;

                                role.authorityList.forEach(item => {
                                    if (authorityList.includes(item.id, 0)) return;

                                    authorityList.push(item.id);
                                    authority += `, ${item.name}`;
                                })
                            });


                            return this.renderPopTip(h, authority);
                        }
                    },
                    {
                        title: '地址', key: 'area', width: 180, resizable: true,
                        render: (h, params) => {
                            const row = params.row;

                            // 如果地址为空，则不进行渲染
                            if (!row.area) return h('div', '');

                            let areaName = '';
                            let setAreaName = area => {
                                areaName = area.name + areaName;
                                if (area.parentArea)
                                    setAreaName(area.parentArea);
                            };

                            setAreaName(row.area);

                            return this.renderPopTip(h, areaName);
                        }
                    },
                    {title: '创建日期', key: 'created', width: 180, resizable: true},
                    {title: '更新日期', key: 'updated', width: 180, resizable: true},
                    {
                        title: '描述信息', key: 'description', width: 180, resizable: true,
                        render: (h, params) => {
                            let row = params.row;
                            return this.renderPopTip(h, row.description);
                        }
                    },
                    {title: '操作', slot: 'action', width: 180, align: 'center', fixed: 'right'}
                ]
            }
        },
        methods: {
            editUserCompleteTask() {
                this.editUserOpenState = false;
            },
            // 渲染成提示框
            renderPopTip(h, showText) {
                // 如果字符串长度超过10位，则多余的使用提示框进行显示
                let text = showText;
                if (showText && showText.length > 10)
                    text = `${text.slice(0, 9)}...`

                return h('Poptip', {
                    props: {
                        trigger: 'hover',
                        placement: 'right'
                    }
                }, [
                    h('div', text),
                    h('p', {
                        slot: 'content'
                    }, [
                        h('div', {style: {wordWrap: 'break-word'}}, showText)
                    ])
                ])
            },
            // 添加用户信息
            addUser() {
                this.editUserOpenState = true;
                this.editType = 'add';
                this.updateUserText = '新增用户';
            },
            // 更新用户的信息
            updateUser(index) {
                this.editUserOpenState = true;
                this.editType = 'update';
                this.updateUserText = '更新用户';
                let user = deepClone(this.tableData[index]);
                console.log(user);

                // 转换角色数据
                let roleIdList = [];
                if (user.roleList)
                    user.roleList.forEach(role => {
                        roleIdList.push(role.id)
                    })

                // 获取默认的城市地区的值
                let area = [];
                let setAreaName = item => {
                    area.push(item.id)
                    if (item.parentArea)
                        setAreaName(item.parentArea);
                };
                if (user.area)
                    setAreaName(user.area);

                user.area = area.reverse();
                user.roleList = roleIdList;

                this.editUserForm = user;
            },
            // 进行查询用户
            searchUser() {
                this.loadTableData()
            },
            // 重置查询条件
            resetSearchUser() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            // 显示用户的详情
            showUserDetail(index) {
                this.userDetail = true;
                this.userInfo = deepClone(this.tableData[index]);
            },
            // 删除表格中的用户
            remove(index) {
                this.deletedUserIndex = index;
                this.delConfirm = true;
            },
            removeUserBatch() {
                let tableSelectionIdList = this.getTableSelection();
                if (tableSelectionIdList.length === 0) {
                    this.$Message.warning('请选择需要删除的用户');
                    return;
                }

                this.delBatchConfirm = true;
            },
            deleteUser() {
                let user = this.tableData[this.deletedUserIndex];
                console.log(user);
                this.axios.delete(`/user-server/del/${user.id}`).then(({data}) => {
                    console.log(data);
                    this.loadTableData();
                    this.delConfirm = false;
                }).catch(error => {
                    this.delConfirm = false;
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            deleteUserBatch() {
                let tableSelectionIdList = this.getTableSelection();
                console.log(tableSelectionIdList);
                if (tableSelectionIdList.length === 0) return;

                this.axios.post(`/user-server/del/list`, tableSelectionIdList).then(({data}) => {
                    this.delBatchConfirm = false;
                    console.log(data);
                    this.loadTableData();
                }).catch(error => {
                    this.delBatchConfirm = false;
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
            // 更多操作的启动和禁用用户的操作
            changUserStatus(status) {
                let url = '/user-server/enable/list'
                if (parseInt(status) === 2)
                    url = '/user-server/disable/list'

                const tableSelectionIdList = this.getTableSelection();
                console.log(`${url} -> ${tableSelectionIdList}`)

                if (tableSelectionIdList.length === 0) {
                    this.$Message.warning('请选择需要操作的用户');
                    return;
                }

                this.axios.post(url, tableSelectionIdList).then(({data}) => {
                    console.log(data)
                    this.loadTableData()
                }).catch(error => {
                    console.log(error);
                    errorMessage(error, this);
                });
            },
            // 获取选中的表格中的数据的id
            getTableSelection() {
                let selection = this.$refs.userTableRef.getSelection();
                let selectIdList = [];
                selection.forEach(item => selectIdList.push(item.id))
                return selectIdList;
            },
            // 获取用户数据
            loadTableData() {
                let condition = this.searchForm;
                Object.assign(condition, this.page)
                // 显示加载提示信息
                this.spinShow = true;
                this.axios.post('/user-server/list', condition).then(({data}) => {
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
        created() {
            this.loadTableData();
        }
    }
</script>

<style lang="less" scoped>

    /deep/ .ivu-modal-mask, /deep/ .ivu-drawer-mask {
        clear: page;
        background-color: rgba(55, 55, 55, .2);
    }
</style>
