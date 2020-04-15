<template>
    <div>
        <Form ref="addRoleFormRef" :model="formData" :rules="addRoleRule">
            <Row :gutter="32">
                <Col span="24">
                    <FormItem label="角色名称" label-position="top" prop="name">
                        <Input v-model="formData.name" placeholder="请输入角色"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="英文名称" label-position="top" prop="enName">
                        <Input v-model="formData.enName" placeholder="请输入角色"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="角色状态" label-position="top" prop="status">
                        <Select v-model="formData.status" placeholder="选择角色状态">
                            <Option :value="0">启用</Option>
                            <Option :value="1">禁用</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="角色描述信息" label-position="top" prop="description">
                <Input type="textarea" v-model="formData.description" :rows="4" placeholder="请输入描述信息"/>
            </FormItem>
        </Form>
        <p :style="{fontSize: '16px',color: 'rgba(0,0,0,0.85)',lineHeight: '24px',display: 'block'}">权限信息</p>
        <Divider/>
        <Row type="flex" justify="center">
            <Col span="22">
                <Tree ref="authorityTree" :data="authorityList" :load-data="loadAuthorityList"
                      show-checkbox @on-check-change="checkRole"></Tree>
            </Col>
        </Row>
        <Divider/>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="$emit('completeTask')">取消</Button>
            <Button type="primary" @click="createRole()">提交</Button>
        </div>
    </div>
</template>

<script>
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "EditRole",
        props: ['formData', 'editType'],
        data() {
            return {
                addRoleRule: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    enName: [
                        {required: true, message: '请输入角色的英文名称', trigger: 'blur'}
                    ]
                },
                authorityList: [],
                originAuthorityList: []
            }
        },
        methods: {
            checkRole(checkedList, current) {
                console.log(checkedList);
                if (current.hasMore === 0) return;

                current.expand = true;
                this.loadAuthorityList(current, data => {
                    current.children = data;
                })
            },
            createRole() {
                this.$refs.addRoleFormRef.validate((valid) => {
                    if (valid) {
                        console.log("创建角色的操作")
                        console.log(this.formData)

                        if (this.editType === 'add') this.addRole();
                        else this.updateRole()
                    } else {
                        this.$Message.error('请输入角色信息');
                    }
                })
            },
            getSubmitFormData() {
                let formData = deepClone(this.formData);

                let checkedAndIndeterminateNodes = this.$refs.authorityTree.getCheckedAndIndeterminateNodes();
                console.log(checkedAndIndeterminateNodes);

                let authorityIdList = [];
                checkedAndIndeterminateNodes.forEach(authority => authorityIdList.push(authority.value))
                formData['authorityIdList'] = authorityIdList;
                console.log(formData);
                return formData;
            },
            updateRole() {
                let formData = this.getSubmitFormData();
                console.log(formData)

                this.$Loading.start();
                this.axios.put(`/role-server/update`, formData).then(({data}) => {
                    this.$Loading.finish();
                    this.$Message.success(`${data.message}`)

                    this.$emit('completeTask')
                    this.$emit('addSuccess')
                }).catch(error => {
                    this.$Loading.error();
                    errorMessage(error, this);
                })
            },
            addRole() {
                let formData = this.getSubmitFormData();
                console.log(formData)

                this.$Loading.start();
                this.axios.post(`/role-server/add`, formData).then(({data}) => {
                    this.$Loading.finish();
                    this.$Message.success(`${data.message}`)
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    this.$Loading.error();
                    errorMessage(error, this);
                })
            },
            loadAuthorityList(item, callback) {
                item.loading = true;
                // 加载省权限的数据
                this.axios.get(`/authority-server/${item.value}/children`).then(({data}) => {
                    if (!data.data)
                        return;

                    item.loading = false;
                    if (data.data.length === 0) return;

                    callback(this.switchAuthorityData(data.data));
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            // 将从后端获取的数据转换为前端显示的数据的格式
            switchAuthorityData(authorityData) {
                let authorityList = [];
                authorityData.forEach(authority => {

                    let item = {
                        value: authority.id,
                        title: authority.name,
                        expand: false,
                        selected: false,
                        children: [],
                        hasMore: authority.hasMore
                    };

                    if (authority.status === 1)
                        item['disabled'] = true

                    if (authority.hasMore === 1)
                        item['loading'] = false;

                    authorityList.push(item);
                })
                return authorityList;
            },
        },
        created() {
            // 加载角色列表数据
            this.axios.get('/authority-server/root').then(({data}) => {

                this.authorityList = this.switchAuthorityData(data.data);
                this.originAuthorityList = deepClone(this.authorityList);
            }).catch(error => {
                console.log(error)
                errorMessage(error, this);
            });
        },
        mounted() {
            this.$on('addRoleClick', () => {
                this.authorityList = deepClone(this.originAuthorityList);
            });

            this.$on('updateRoleClick', (parentIdList, childIdList) => {
                this.authorityList = deepClone(this.originAuthorityList);

                this.authorityList.forEach(authority => {
                    // 如果当前节点为父节点，则设置expand为true展开权限节点
                    if (parentIdList && parentIdList.includes(authority.value, 0)) {
                        if (authority.expand) {
                            if (!authority.children) return;
                            authority.children.forEach(temp => {
                                // 如果子节点选中，则设置checked为true
                                if (childIdList && childIdList.includes(temp.value, 0))
                                    temp['checked'] = true
                            });
                            return;
                        }

                        this.loadAuthorityList(authority, data => {
                            authority['expand'] = true
                            data.forEach(temp => {
                                // 如果子节点选中，则设置checked为true
                                if (childIdList && childIdList.includes(temp.value, 0))
                                    temp['checked'] = true
                            });
                            authority.children = data;
                        })
                    }


                })
            })
        }
    }
</script>

<style scoped>

</style>
