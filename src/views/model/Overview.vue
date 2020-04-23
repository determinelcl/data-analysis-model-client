<template>
    <div>
        <div :style="{height: '176px', backgroundColor: '#ffffff', padding: 0}">
            <div :style="{padding: '16px 32px 1px 32px'}">
                <div :style="{fontSize: '22px', height: '30px', color:'#17233D', fontWeight: 500, margin: '0 0 16px 0'}">
                    模型概览
                </div>

                <Row type="flex" justify="center" align="middle" style="height: 72px">
                    <Col span="12">
                        <Input v-model="searchName" search size="large"
                               enter-button="搜索" placeholder="模型、博客、协议的检索信息"/>
                    </Col>
                </Row>
                <div class="">
                    <Tabs :animated="false" @on-click="selectedTab">
                        <TabPane label="模型"></TabPane>
                        <TabPane label="博客"></TabPane>
                        <TabPane label="协议"></TabPane>
                    </Tabs>
                </div>
            </div>
        </div>

        <div :style="this.$store.state.style.contentStyle">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Overview",
        data() {
            return {
                currentRouter: '',
                searchName: '',
                itemList: [
                    {name: 'model', url: 'model/overview/ModelTable'},
                    {name: 'blog', url: 'model/overview/BlogTable'},
                    {name: 'protocol', url: 'model/overview/ProtocolTable'},
                ]
            }
        },
        methods: {
            selectedTab(tabName) {
                console.log(tabName);
                this.$router.push({path: `${this.currentRouter}/${this.itemList[tabName].name}`});
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
        }
    }
</script>

<style scoped>

</style>
