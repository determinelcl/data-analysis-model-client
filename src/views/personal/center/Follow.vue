<template>
    <div>
        <Form ref="formInline" :model="searchForm" label-width="60">
            <Row type="flex" justify="center" align="middle" style="margin-top: 10px" :gutter="20">
                <Col span="8">
                    <FormItem label="名称：" prop="name" label-position="left">
                        <Input type="text" v-model="searchForm.name" placeholder="请输入"/>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="分组：" prop="version" label-position="left" >
                        <Select v-model="searchForm.groupId" filterable clearable>
                            <Option :value="0">线性回归</Option>
                            <Option :value="1">神经网络</Option>
                            <Option :value="2">支持向量机</Option>
                            <Option :value="3">图片识别</Option>
                            <Option :value="4">深度学习</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8" style="display:flex; justify-content: end">
                    <FormItem>
                        <Button type="primary" style="margin-right: 20px" @click="searchModel()">查询</Button>
                        <Button @click="resetSearchModel()">重置</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Divider/>
        <div>
            <Row type="flex" align="middle" justify="space-around">
                <Col style="display:flex; justify-content: center">
                    <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                    <div style="margin: 3px auto 3px 10px"><b>determination</b></div>
                    <div style="margin: 3px auto 3px 15px; color: #19be6b">企业认证</div>
                </Col>
                <Col>
                    机器学习
                </Col>
                <Col>
                    <Button type="warning" size="small">
                        <Icon type="md-close" />取消
                    </Button>
                </Col>
            </Row>
            <Divider></Divider>
            <Row type="flex" align="middle" justify="space-around">
                <Col style="display:flex; justify-content: center">
                    <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                    <div style="margin: 3px auto 3px 10px"><b>determination</b></div>
                    <div style="margin: 3px auto 3px 15px; color: #19be6b">企业认证</div>
                </Col>
                <Col>
                    机器学习
                </Col>
                <Col>
                    <Button type="warning" size="small">
                        <Icon type="md-close" />取消
                    </Button>
                </Col>
            </Row>
            <Divider></Divider>
            <Row type="flex" align="middle" justify="space-around">
                <Col style="display:flex; justify-content: center">
                    <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                    <div style="margin: 3px auto 3px 10px"><b>determination</b></div>
                    <div style="margin: 3px auto 3px 15px; color: #19be6b">企业认证</div>
                </Col>
                <Col>
                    机器学习
                </Col>
                <Col>
                    <Button type="warning" size="small">
                        <Icon type="md-close" />取消
                    </Button>
                </Col>
            </Row>
            <Divider></Divider>
            <Row type="flex" align="middle" justify="space-around">
                <Col style="display:flex; justify-content: center">
                    <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                    <div style="margin: 3px auto 3px 10px"><b>determination</b></div>
                    <div style="margin: 3px auto 3px 15px; color: #19be6b">企业认证</div>
                </Col>
                <Col>
                    机器学习
                </Col>
                <Col>
                    <Button type="warning" size="small">
                        <Icon type="md-close" />取消
                    </Button>
                </Col>
            </Row>
            <Divider></Divider>
            <Row type="flex" align="middle" justify="space-around">
                <Col style="display:flex; justify-content: center">
                    <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                    <div style="margin: 3px auto 3px 10px"><b>determination</b></div>
                    <div style="margin: 3px auto 3px 15px; color: #19be6b">企业认证</div>
                </Col>
                <Col>
                    机器学习
                </Col>
                <Col>
                    <Button type="warning" size="small">
                        <Icon type="md-close" />取消
                    </Button>
                </Col>
            </Row>
            <Divider></Divider>
            <Row type="flex" align="middle" justify="space-around">
                <Col style="display:flex; justify-content: center">
                    <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                    <div style="margin: 3px auto 3px 10px"><b>determination</b></div>
                    <div style="margin: 3px auto 3px 15px; color: #19be6b">企业认证</div>
                </Col>
                <Col>
                    机器学习
                </Col>
                <Col>
                    <Button type="warning" size="small">
                        <Icon type="md-close" />取消
                    </Button>
                </Col>
            </Row>

        </div>
        <Divider></Divider>
        <div style="display: flex; justify-content: center; margin-bottom: 20px">
            <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                  show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                  show-sizer show-total @on-page-size-change="changePageSize"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Follow",
        data() {
            return {
                modelInformation: false,
                searchForm: {
                    name: null,
                    groupId: null,
                    collectionType: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                }
            }
        },
        methods: {
            searchModel() {

            },
            resetSearchModel() {

            },
            showModelDetail(index) {
                console.log(index);
                this.modelInformation = true;
            },
            // 切换页面
            changePage(page) {
                this.page.current = page;
                // this.loadTableData();
            },
            changePageSize(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.page.size = pageSize;
                this.page.current = 1;

                // this.loadTableData()
            },
        }
    }
</script>

<style scoped>

</style>
