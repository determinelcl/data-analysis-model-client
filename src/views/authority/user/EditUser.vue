<template>
    <div>
        <Form ref="addUserFormRef" :model="formData" :rules="addUserRule">
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="用户名" label-position="top" prop="username">
                        <Input v-model="formData.username" placeholder="请输入用户名"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="出生日期" label-position="top" prop="birthday">
                        <DatePicker :style="{width: '100%'}" format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime" placeholder="请选择出生日期" v-model="formData.birthday">
                        </DatePicker>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="性别" label-position="top" prop="gender">
                        <RadioGroup v-model="formData.gender" :style="{width: '100%'}">
                            <Radio :label="0" border>男</Radio>
                            <Radio :label="1" border>女</Radio>
                            <Radio :label="2" border>未知</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="地址" label-position="top" prop="area">
                        <Cascader v-model="formData.area" :data="areaList" :load-data="loadAreaChildren"></Cascader>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="邮箱" label-position="top" prop="email">
                        <Input type="email" v-model="formData.email" placeholder="请输入邮箱"/>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="手机号码" label-position="top" prop="phone">
                        <Input type="tel" v-model="formData.phone" placeholder="请输入手机号码"/>
                    </FormItem>
                </Col>
            </Row>
            <Row :gutter="32">
                <Col span="12">
                    <FormItem label="角色分配" label-position="top" prop="roleList">
                        <Select v-model="formData.roleList" multiple filterable placeholder="分配用户角色">
                            <Option v-for="item in roleList" :value="item.id" :key="item.id">
                                {{ item.name }}
                            </Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="用户状态" label-position="top" prop="status">
                        <Select v-model="formData.status" placeholder="选择用户状态">
                            <Option :value="0">已激活</Option>
                            <Option :value="1">未激活</Option>
                            <Option :value="2">已禁用</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="用户描述信息" label-position="top" prop="description">
                <Input type="textarea" v-model="formData.description" :rows="4" placeholder="请输入描述信息"/>
            </FormItem>
        </Form>
        <div class="demo-drawer-footer">
            <Button style="margin-right: 8px" @click="$emit('completeTask')">取消</Button>
            <Button type="primary" @click="createUser()">提交</Button>
        </div>
    </div>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";
    import {deepClone} from "../../../util/object.util";
    import {formatDateTime} from "../../../util/datetime.util";

    export default {
        name: "EditUser",
        props: ['formData', 'editType', 'clickBtn'],
        data() {
            return {
                areaList: [],
                addUserRule: {
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {pattern: /^1[3456789]\d{9}$/, message: "手机号码格式不正确", trigger: "blur"}

                    ],
                    roleList: [
                        {required: true, message: '请选择一个角色', type: 'array', trigger: 'change'}
                    ],
                    area: [
                        {required: true, message: '请选择所在地址', type: 'array', trigger: 'change'}
                    ],
                },
                roleList: []

            }
        },
        methods: {
            loadAreaChildren(item, callback) {
                item.loading = true;
                // 加载省市地区的数据
                this.axios.get(`/user-server/area/${item.value}/children`).then(({data}) => {
                    if (!data.data)
                        return;

                    if (data.data.length !== 0)
                        item.children = this.switchAreaData(data.data);
                    item.loading = false;
                    callback();
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            // 将从后端获取的数据转换为前端显示的数据的格式
            switchAreaData(areaData) {
                let areaList = [];
                areaData.forEach(area => {

                    let item = {
                        value: area.id,
                        label: area.name,
                        children: []
                    };

                    if (area.hasCity === 1)
                        item['loading'] = false;

                    areaList.push(item);
                })
                return areaList;
            },
            createUser() {
                this.$refs.addUserFormRef.validate((valid) => {
                    if (valid) {
                        console.log("创建用户的操作")
                        console.log(this.formData)

                        if (this.editType === 'add') this.addUser();
                        else this.updateUser()
                    } else {
                        this.$Message.error('请输入用户信息');
                    }
                })
            },
            getSubmitFormData() {
                let formData = deepClone(this.formData);
                formData['addressId'] = formData.area.pop();
                formData.birthday = formatDateTime(formData.birthday);
                formData['roleIdList'] = formData.roleList;
                formData.area = null;
                formData.roleList = null;
                return formData;
            },
            updateUser() {
                let formData = this.getSubmitFormData();
                console.log(formData)

                this.$Loading.start();
                this.axios.put(`/user-server/update`, formData).then(({data}) => {
                    this.$Loading.finish();
                    this.$Message.success(`${data.message}`)
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    this.$Loading.error();
                    errorMessage(error, this);
                })
            },
            addUser() {
                let formData = this.getSubmitFormData();
                console.log(formData)

                this.$Loading.start();
                this.axios.post(`/user-server/add`, formData).then(({data}) => {
                    this.$Loading.finish();
                    this.$Message.success(`${data.message}`)
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    this.$Loading.error();
                    errorMessage(error, this);
                })
            }
        },
        created() {
            // 加载省市地区的数据
            this.axios.get('/user-server/area/province').then(({data}) => {
                if (!data.data) return;
                this.areaList = this.switchAreaData(data.data);
            }).catch(error => {
                console.log(error)
                errorMessage(error, this);
            });

            // 加载角色列表数据
            this.axios.get('/role-server/list').then(({data}) => {
                this.roleList = data.data;
            }).catch(error => {
                console.log(error)
                errorMessage(error, this);
            });
        }
    }
</script>

<style scoped>

</style>
