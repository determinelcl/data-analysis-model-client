<template>
    <div>
        <h2>基本设置</h2>
        <Row :gutter="32">
            <Col span="16">
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
                    <FormItem label="用户描述信息" label-position="top" prop="description">
                        <Input type="textarea" v-model="formData.description" :rows="4" placeholder="请输入描述信息"/>
                    </FormItem>
                </Form>
                <div class="demo-drawer-footer">
                    <Button type="primary" style="margin-right: 20px" @click="updateUser()">更新</Button>
                    <Button @click="resetUser()">重置</Button>
                </div>
            </Col>
            <Col span="8">
                <div>
                    <div style="padding: 6px 0; color: #515a6e">头像</div>
                    <div>
                        <img src="@/assets/mine.jpg" style="width: 90px; height: 90px; border-radius: 5px">
                    </div>
                    <div style="margin-top: 10px">
                        <Button icon="md-camera">点击修改</Button>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "BasicSetting",
        data() {
            return {
                areaList: [],
                formData: {
                    id: null,
                    username: null,
                    gender: null,
                    birthday: null,
                    email: null,
                    phone: null,
                    area: [],
                    description: null
                },
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

                    ]
                }
            }
        },
        methods: {
            loadAreaChildren(item, callback) {
                item.loading = true;
                // 加载省市地区的数据
                this.axios.get(`/user-server/area/${item.value}/children`).then(({data}) => {
                    if (!data.data)
                        return;

                    item.loading = false;
                    if (data.data.length === 0) return;

                    // item.children = this.switchAreaData(data.data);
                    callback(this.switchAreaData(data.data));
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
            updateUser() {

            },
            resetUser() {

            }
        }
    }
</script>

<style scoped>

</style>
