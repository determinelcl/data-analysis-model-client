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
                        <FormItem prop="username">
                            <Input type="text" v-model="form.username" placeholder="请输入用户名" size="large">
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
    import qs from 'qs';
    import {ADD_ACCOUNT, UPDATE_MENU_LIST} from "../store/mutations.type";
    import {mapMutations} from "vuex";

    export default {
        name: 'Login',
        components: {Internationalization, CenterBox, Logo},
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                    auto: false
                },
                loginRule: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        // {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            ...mapMutations([
                ADD_ACCOUNT, UPDATE_MENU_LIST
            ])
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let formData = this.form;
                        formData['grant_type'] = 'password';
                        formData['client_id'] = 'client';
                        formData['client_secret'] = 'secret';

                        this.axios.post("/oauth2-server/oauth/token", qs.stringify(this.form), {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).then(({data}) => {
                            this.$store.commit(ADD_ACCOUNT, JSON.stringify(data));
                            this.$Message.success('登录成功');
                            // 登录成功获取菜单数据
                            return this.axios.get(`/authority-server/list/user/${formData.username}`);
                        }).then(({data}) => {
                            // 更新菜单状态
                            this.$store.commit(UPDATE_MENU_LIST, data);
                            this.$router.push({name: 'home'});
                        }).catch(error => {
                            console.log("登录错误信息：" + error);
                            this.$Message.error("用户名或者密码错误");
                        });
                    } else {
                        this.$Message.error('用户名和密码不能为空！');
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
