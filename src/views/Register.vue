<template>
    <div>
        <Layout :style="{minHeight: '100vh'}">
            <Content>
                <div id="register-header">
                    <Internationalization></Internationalization>
                </div>

                <div id="registerForm">
                    <Logo></Logo>
                    <CenterBox :height="'30px'" :color="'#ABABAB'"
                               :content="'数据分析组件为大数据分析系统提供优质解决方案'"></CenterBox>
                    <CenterBox :height="'25px'"></CenterBox>
                    <Form ref="form" :model="form" :rules="registerRule" :label-width="0">
                        <FormItem prop="email">
                            <Input type="email" v-model="form.email" placeholder="请输入邮箱" size="large">
                                <Icon type="ios-mail-outline" slot="prefix" size="large"/>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="至少6位密码，区分大小写" size="large">
                                <Icon type="ios-lock-outline" slot="prefix" size="large"/>
                            </Input>
                        </FormItem>
                        <FormItem prop="confirmPassword">
                            <Input type="password" v-model="form.confirmPassword" placeholder="确认密码" size="large">
                                <Icon type="ios-lock-outline" slot="prefix" size="large"/>
                            </Input>
                        </FormItem>
                        <FormItem prop="phone">
                            <Input type="tel" v-model="form.phone" placeholder="请输入手机号码" size="large">
                                <Icon type="ios-phone-portrait" slot="prefix" size="large"/>
                            </Input>
                        </FormItem>
                        <FormItem prop="phoneCode">
                            <Row type="flex" justify="space-between" class="code-row-bg">
                                <Col span="15">
                                    <Input type="tel" v-model="form.phoneCode" placeholder="请输入验证码" size="large">
                                        <Icon type="ios-keypad-outline" slot="prefix" size="large"/>
                                    </Input>
                                </Col>
                                <Col span="8">
                                    <Button size="large" long>获取验证码</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formInline')" size="large" long>
                                注册
                            </Button>
                        </FormItem>
                        <Row type="flex" justify="center" class="code-row-bg">
                            <router-link to="/">使用已有账户登录</router-link>
                        </Row>
                    </Form>
                </div>

                <div id="register-footer">

                </div>
            </Content>
        </Layout>
    </div>
</template>

<script>
    import CenterBox from "../components/CenterBox";
    import Logo from "../components/Logo";
    import Internationalization from "../components/Internationalization";

    export default {
        name: 'Register',
        components: {Internationalization, CenterBox, Logo},

        data() {
            // 验证密码
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else if (value.length < 6) {
                    callback(new Error('密码长度至少6位！'));
                } else {
                    if (this.form.confirmPassword !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('confirmPassword');
                    }
                    callback();
                }
            };

            // 验证确认密码
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('确认密码不能为空'));
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入的密码不匹配！'));
                } else {
                    callback();
                }
            };

            // 验证手机号码
            const validatePhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入手机号码！'));
                } else if (!/^1[34578]\d{9}$/.test(value)) {
                    callback('输入的手机号码格式不正确！');
                } else {
                    callback();
                }
            };

            return {
                form: {
                    email: '',
                    password: '',
                    confirmPassword: '',
                    auto: false,
                    phone: '',
                    phoneCode: ''
                },
                registerRule: {
                    email: [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '输入的邮箱格式不正确！', trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    confirmPassword: [
                        {validator: validatePassCheck, trigger: 'blur'}
                    ],
                    phone: [
                        {validator: validatePhone, trigger: 'blur'}
                    ],
                    phoneCode: [
                        {required: true, message: '请输入验证码！', trigger: 'blur'},
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        }
    }
</script>

<style scoped>
    div#register-header {
        padding: 10px 50px;
        height: 32px;
        display: flex;
        flex-direction: row-reverse;
    }

    div#registerForm {
        width: 384px;
        height: 100%;
        margin-left: 50%;
        margin-top: 50px;
        transform: translate(-50%);
    }

</style>
