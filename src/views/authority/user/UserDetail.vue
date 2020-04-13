<template>
    <div>
        <p :style="textTheme">用户详情</p>
        <p :style="textTheme">个人信息</p>
        <div class="demo-drawer-profile">
            <Row :style="{height: '38px'}">
                <Col span="12">
                    账号: {{userInfo.username}}
                </Col>
                <Col span="12">
                    邮箱: {{userInfo.email}}
                </Col>
            </Row>
            <Row :style="{height: '38px'}">
                <Col span="12">
                    性别: {{gender}}
                </Col>
                <Col span="12">
                    手机: {{userInfo.phone}}
                </Col>
            </Row>
            <Row :style="{height: '38px'}">
                <Col span="12">
                    生日:{{userInfo.birthday}}
                </Col>
                <Col span="12">
                    地区: {{area}}
                </Col>
            </Row>
            <Row :style="{height: '38px'}">
                <Col span="12">
                    状态:
                    <Tag type="dot"
                         :color="userInfo.status === 0 ? 'success' : userInfo.status === 1 ? 'warning' : 'error'">
                        {{status}}
                    </Tag>
                </Col>
                <Col span="12">
                    认证:
                    <Tag type="dot"
                         :color="userInfo.authenticationType !== 0 ? 'primary' : 'error'">
                        {{authenticationType}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}">
                <Col span="24">
                    个人简介: {{userInfo.description}}

                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">权限信息</p>
        <div class="demo-drawer-profile">
            <Row>
                <Col span="23" :style="{height: '30px'}">
                    角色:
                </Col>
                <Col span="3"></Col>
                <Col span="22">
                    <Tag v-for="role in roleList" size="large" color="orange">{{role.name}}</Tag>
                </Col>
            </Row>
            <Row :style="{height: '30px'}"></Row>
            <Row>
                <Col span="23" :style="{height: '30px'}">
                    权限:
                </Col>
                <Col span="3"></Col>
                <Col span="22">
                    <Tag v-for="item in authorityList" size="large" color="green">{{item}}</Tag>
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">活跃度统计</p>
        <div class="demo-drawer-profile">
            <Row>
                <Col span="12">
                    Email: admin@aresn.com
                </Col>
                <Col span="12">
                    Phone Number: +86 18888888888
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    GitHub: <a href="https://github.com/view-design/ViewUI" target="_blank">https://github.com/view-design/ViewUI</a>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserDetail",
        props: {
            userInfo: {
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
            }
        },
        data() {
            return {
                textTheme: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                }
            }
        },
        computed: {
            gender: {
                get() {
                    if (!this.userInfo) return '';
                    return this.userInfo.gender === 0 ? '男' : this.userInfo.gender === 1 ? '女' : '未知'
                }
            },
            area: {
                get() {
                    if (!this.userInfo || !this.userInfo.area) return '';

                    let area = '';
                    let setAreaName = item => {
                        area = `${item.name}${area}`
                        if (item.parentArea)
                            setAreaName(item.parentArea);
                    };
                    setAreaName(this.userInfo.area);

                    return area;
                }
            },
            status: {
                get() {
                    if (!this.userInfo) return '';

                    return this.userInfo.status === 0 ? '已激活' : this.userInfo.status === 1 ? '未激活' : '已禁用';
                }
            },
            authenticationType: {
                get() {
                    if (!this.userInfo) return '';

                    let label = ['未认证', '个人认证', '学生认证', '教师/教授认证', '团队认证', '高校认证', '企业认证']
                    return label[this.userInfo.authenticationType];
                }
            },
            authorityList: {
                get() {
                    let tempList = [];
                    if (!this.userInfo || !this.userInfo.roleList) return tempList;

                    this.userInfo.roleList.forEach(role => {
                        if (!role.authorityList) return;
                        role.authorityList.forEach(item => {
                            if (tempList.includes(item.name, 0)) return;
                            tempList.push(item.name);
                        })
                    });

                    return tempList;
                }
            },
            roleList: {
                get() {
                    if (!this.userInfo || !this.userInfo.roleList) return [];
                    return this.userInfo.roleList;
                }
            }
        }
    }
</script>

<style scoped>

</style>
