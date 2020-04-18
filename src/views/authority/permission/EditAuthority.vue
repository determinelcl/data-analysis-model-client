<template>
    <div>
        <Form ref="addAuthorityFormRef" :model="formData" :rules="addAuthorityRule">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="权限名称" label-position="top" prop="name">
                        <Input v-model="formData.name" placeholder="请输入权限名称"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="英文名称" label-position="top" prop="name">
                        <Input v-model="formData.enName" placeholder="请输入权限的英文名称"/>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="权限图标" label-position="top" prop="iconId">
                        <Select v-model="formData.iconId" placeholder="请选择权限图标" clearable>
                            <Option v-for="item in iconList" :key="item.id" :value="item.id">
                                <Icon :type="item.type" size="large"></Icon>
                                {{item.name}}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="权限状态" label-position="top" prop="status">
                        <Select v-model="formData.status" placeholder="选择权限状态">
                            <Option :value="0">启用</Option>
                            <Option :value="1">禁用</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="组件类型" label-position="top" prop="parentId">
                        <Select v-model="formData.showType" placeholder="选择权限状态" @on-change="changShowType">
                            <Option :value="0">菜单</Option>
                            <Option :value="1">其他</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12" v-if="formData.showType === 0">
                    <FormItem label="权限组件" label-position="top" prop="componentId">
                        <Select v-model="formData.componentId" placeholder="选择权限组件" clearable>
                            <OptionGroup label="静态组件" v-if="staticComponentList.length > 0">
                                <Option v-for="item in staticComponentList" :key="item.id" :value="item.id">
                                    {{item.name}}
                                    <span style="float:right;color:#ccc">静态组件</span>
                                </Option>
                            </OptionGroup>
                            <OptionGroup label="动态组件" v-if="dynamicComponentList.length > 0">
                                <Option v-for="item in dynamicComponentList" :key="item.id" :value="item.id">
                                    {{item.name}}
                                    <span style="float:right;color:#ccc">动态组件</span>
                                </Option>
                            </OptionGroup>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12" v-if="formData.showType === 1">
                    <FormItem label="权限URL" label-position="top" prop="url">
                        <Input v-model="formData.url" placeholder="请输入权限的URL"/>
                    </FormItem>
                </Col>
            </Row>

            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="所属权限" label-position="top" prop="parentId">
                        <Select v-model="formData.parentId" placeholder="选择所属权限" clearable>
                            <Option v-for="item in parentAuthorityList" :key="item.id"
                                    :value="item.id" :disabled="item.id === formData.id">
                                {{item.name}}
                                <span style="float:right;color:#ccc">
                                    {{item.parentId !== 0 ? item.parentAuthority.name : ''}}
                                </span>
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="权限描述信息" label-position="top" prop="description">
                <Input type="textarea" v-model="formData.description" :rows="4" placeholder="请输入描述信息"/>
            </FormItem>
        </Form>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="$emit('completeTask')">取消</Button>
            <Button type="primary" @click="createAuthority()">提交</Button>
        </div>
    </div>
</template>

<script>
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "EditAuthority",
        props: ['formData', 'editType'],
        data() {
            return {
                componentList: [],
                iconList: [],
                authorityList: [],
                addAuthorityRule: {
                    name: [
                        {required: true, message: '请输入权限名称', trigger: 'blur'}
                    ],
                    enName: [
                        {required: true, message: '请输入权限的英文名称', trigger: 'blur'}
                    ]
                },
                originFormData: null,
                originAuthorityList: null,
            }
        },
        computed: {
            staticComponentList: {
                get() {
                    if (this.componentList)
                        return this.componentList.filter(component => component.type === 0)
                    else
                        return []
                }
            },
            dynamicComponentList: {
                get() {
                    if (this.componentList)
                        return this.componentList.filter(component => component.type === 1)
                    else
                        return []
                }
            },
            parentAuthorityList: {
                get() {
                    if (this.formData.showType !== 1) return this.authorityList;

                    this.authorityList.forEach(authority => {
                        this.authorityList.forEach(temp => {
                            if (temp.id !== authority.parentId) return;
                            authority['parentAuthority'] = temp;
                        })
                    });
                    return this.authorityList;
                }
            }
        },
        methods: {
            createAuthority() {
                this.$refs.addAuthorityFormRef.validate((valid) => {
                    if (valid) {
                        console.log("创建权限的操作")
                        console.log(this.formData)

                        if (this.editType === 'add') this.addAuthority();
                        else this.updateAuthority()
                    } else {
                        this.$Message.error('请输入权限信息');
                    }
                })
            },
            updateAuthority() {
                let formData = deepClone(this.formData);
                console.log(formData)

                this.$Loading.start();
                this.axios.put(`/authority-server/update`, formData).then(({data}) => {
                    this.$Loading.finish();
                    this.$Message.success(`${data.message}`)

                    this.$emit('completeTask')
                    this.$emit('addSuccess')
                }).catch(error => {
                    this.$Loading.error();
                    errorMessage(error, this);
                })
            },
            addAuthority() {
                let formData = deepClone(this.formData);
                console.log(formData)

                this.$Loading.start();
                this.axios.post(`/authority-server/add`, formData).then(({data}) => {
                    this.$Loading.finish();
                    this.$Message.success(`${data.message}`)
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    this.$Loading.error();
                    errorMessage(error, this);
                })
            },
            changShowType(showType) {
                if (showType === 0)
                    this.loadAuthorityList({parentId: 0, paged: false})
                else if (showType === 1)
                    this.loadAuthorityList({paged: false})
            },
            loadAuthorityList(condition) {
                this.axios.post('/authority-server/search', condition).then(({data}) => {
                    this.authorityList = data.data.data
                    this.originAuthorityList = this.authorityList;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            }
        },
        created() {

            // componentList: 组件列表信息
            this.axios.get('/authority-server/component/list').then(({data}) => {
                this.componentList = data.data
            }).catch(error => {
                console.log(error)
                errorMessage(error, this);
            });

            // iconList: 图标列表信息
            this.axios.get('/authority-server/icon/list').then(({data}) => {
                this.iconList = data.data
            }).catch(error => {
                console.log(error)
                errorMessage(error, this);
            });

            // authorityList: 权限列表信息
            this.changShowType(this.formData.showType);

            this.originFormData = this.formData;
        },
        mounted() {
            this.$on('addAuthorityClick', () => {
                this.changShowType(0);
            });

            this.$on('updateAuthorityClick', (parentAuthorityType) => {
                this.changShowType(parentAuthorityType);
            });
        }
    }
</script>

<style scoped>

</style>
