<template>
    <div>
        <Layout :style="{minHeight: '100vh'}">
            <Content>
                <div id="header">
                    <Internationalization></Internationalization>
                </div>

                <div id="loginForm">
                    <Logo></Logo>
                    <CenterBox :height="'30px'" :color="'#ABABAB'"
                               :content="'数据分析组件为大数据分析系统提供优质解决方案'"></CenterBox>
                    <CenterBox :height="'25px'"></CenterBox>
                    <Form ref="formInline" :model="form" :rules="loginRule" :label-width="0">
                        <FormItem prop="user">
                            <Input type="text" v-model="form.user" placeholder="请输入用户名" size="large">
                                <Icon type="ios-person-outline" slot="prefix" size="large"/>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码" size="large">
                                <Icon type="ios-lock-outline" slot="prefix" size="large"/>
                            </Input>
                        </FormItem>
                        <FormItem prop="automaticLogin">
                            <Row type="flex" justify="space-between" class="code-row-bg">
                                <Checkbox v-model="form.auto" size="large">自动登录</Checkbox>
                                <router-link to="/">忘记密码</router-link>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formInline')" size="large" long>
                                登录
                            </Button>
                        </FormItem>
                        <FormItem>
                            <Row type="flex" justify="space-between" class="code-row-bg">
                                <Col span="16" id="thirdPartyLogin">
                                    <Col span="9">
                                        其他登录方式
                                    </Col>
                                    <Col span="3">
                                        <router-link to="/">
                                            <img src="../assets/icon_wechat.svg" alt="微信">
                                        </router-link>
                                    </Col>
                                    <Col span="3">
                                        <router-link to="/">
                                            <img src="../assets/icon_qq.svg" alt="QQ">
                                        </router-link>
                                    </Col>
                                    <Col span="3">
                                        <router-link to="/">
                                            <img src="../assets/icon_weibo.svg" alt="微博">
                                        </router-link>
                                    </Col>
                                </Col>

                                <router-link to="/register">注册账户</router-link>
                            </Row>
                        </FormItem>
                    </Form>
                </div>

                <div id="footer">

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
        name: 'Login',
        components: {Internationalization, CenterBox, Logo},
        data() {
            return {
                form: {
                    user: '',
                    password: '',
                    auto: false
                },
                loginRule: {
                    user: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        // {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                        this.$router.push({name: 'home'});
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        }
    }
</script>

<style scoped>
    div#header {
        padding: 10px 50px;
        height: 32px;
        display: flex;
        flex-direction: row-reverse;
    }

    div#loginForm {
        width: 384px;
        height: 100%;
        margin-left: 50%;
        margin-top: 50px;
        transform: translate(-50%);
    }

    #thirdPartyLogin img {
        width: 24px;
        height: 24px;
        margin-top: 10%;
    }

</style>
