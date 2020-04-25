<template>
    <div style="margin-bottom: 50px">
        <Row type="flex" :gutter="20" style="padding: 0 24px">
            <Col span="6">
                <Card title="个人设置" icon="ios-options" :padding="0" :bordered="false" :dis-hover="true">
                    <CellGroup ref="settingRef" style="padding: 10px 0" @on-click="switchCell">
                        <Cell :name="0" title="基本设置" label="个人账户信息设置" :selected="selectedSetting === 0"/>
                        <Cell :name="1" title="安全设置" label="密码、邮箱等设置" :selected="selectedSetting === 1"/>
                        <Cell :name="2" title="账号绑定" label="绑定第三方社交账户" :selected="selectedSetting === 2"/>
                        <Cell :name="3" title="新消息通知" label="不同类型消息的通知设置" :selected="selectedSetting === 3"/>
                    </CellGroup>
                </Card>
            </Col>
            <Col span="18">
                <Card :bordered="false" :dis-hover="true">
                    <router-view></router-view>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "Settings",
        data() {
            return {
                currentRouter: '',
                selectedSetting: 0,
                itemList: [
                    {name: 'basic', url: 'personal/setting/BasicSetting'},
                    {name: 'security', url: 'personal/setting/SecuritySetting'},
                    {name: 'binding', url: 'personal/setting/AccountBinding'},
                    {name: 'notification', url: 'personal/setting/MessageNotification'}
                ]
            }
        },
        methods: {
            switchCell(name) {
                this.selectedSetting = name
                this.$router.push({path: `${this.currentRouter}/${this.itemList[name].name}`});
            }
        },
        mounted() {
            // issue：显示找到当前路由，如果是直接添加路由的话，vue-router不会进行覆盖，而是会重复添加路由
            let {routes} = this.$router.options;
            let home = routes.find(r => r.path === '/home');
            let routeData = home.children.find(r => `/home/${r.path}` === this.$route.path);

            // 动态生成所有子路有
            let routerChildren = [];
            this.itemList.forEach(item => {
                // 判断路由组件是否存在，如果存在直接跳过
                let flag = false;
                routerChildren.forEach(temp => {
                    if (temp.path === item.url)
                        flag = true;
                });
                if (flag) return;

                // 添加新的路由
                let temp = {
                    path: item.name,
                    name: item.name,
                    // issue：webpack不支持import中是变量，所以这个样子写才可以
                    component: () => import(`@/views/${item.url}.vue`),
                    meta: {requireAuth: true}
                };
                routerChildren.push(temp);
            });
            routeData.children = routerChildren;

            this.$router.$addRoutes([home]);
            this.currentRouter = this.$route.path;
            this.$router.push({path: `${this.currentRouter}/${this.itemList[0].name}`});
        }
    }
</script>

<style scoped>

</style>
