<template>
    <div>
        <Spin fix v-if="spinShow">
            <LoadingIcon></LoadingIcon>
        </Spin>
        <Drawer v-model="modelInformation" width="720" :closable="false" draggable>
            <ModelInformation ref="modelInfoRef"></ModelInformation>
        </Drawer>

        <List>
            <ListItem v-for="(item, index) in tableData" :key="item.id">
                <ListItemMeta :title="item.name" :description="item.description"/>
                <Row type="flex" justify="center" align="middle" :gutter="38"
                     :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                    <Col>
                        <div class="list-description">状态</div>
                        <div :style="{width: '30px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': '#ed4014'}` }">
                            {{item.status === 0 ? '启用': '禁用'}}
                        </div>
                    </Col>
                    <Col>
                        <div style="width: 100px; align-content: center">发布者</div>
                        <div style="width: 100px; align-content: center">
                            <a>{{item.username}}</a>
                        </div>
                    </Col>
                    <Col>
                        <div style="width: 138px; align-content: center">更新日期</div>
                        <div style="width: 138px; align-content: center">{{item.updated}}</div>
                    </Col>
                    <Col>
                        <div>动态</div>
                        <div style="display: flex;">
                            <li style="margin-right: 5px">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-star-outline" size="15" :color="'#ff9900'"/>
                                    {{item.starSize}}
                                </a>
                            </li>
                            <li style="margin-right: 5px">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-thumbs-up-outline" size="15" :color="'#19be6b'"/>
                                    {{item.thumbsUpSize}}
                                </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">
                                    <Icon type="ios-chatbubbles-outline" size="15" :color="'#2d8cf0'"/>
                                    {{item.commentSize}}
                                </a>
                            </li>
                        </div>
                    </Col>
                    <Col>
                        <a style="margin: 0 3px; color: #2d8cf0" @click="modelApply(index)">申请授权</a>
                        |
                        <a style="margin: 0 3px; color: #19be6b" @click="showModelDetail(index)">详情</a>
                    </Col>
                </Row>
            </ListItem>
        </List>

        <Divider></Divider>
        <div style="display: flex; justify-content: center;">
            <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                  show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                  show-sizer show-total @on-page-size-change="changePageSize"></Page>
        </div>
    </div>
</template>

<script>
    import ModelInformation from "../component/ModelInformation";
    import LoadingIcon from "../../../components/LoadingIcon";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "ModelTable",
        components: {LoadingIcon, ModelInformation},
        data() {
            return {
                spinShow: false,
                modelInformation: false,
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50],
                    paged: true
                },
                tableData: []
            }
        },
        methods: {
            showModelDetail(index) {
                console.log(index);
                this.modelInformation = true;
                let model = this.tableData[index];
                this.$refs.modelInfoRef.$emit('loadModelInfo', model)
            },
            // 模型的授权申请
            modelApply(index) {
                console.log(index)
            },
            // 切换页面
            changePage(pageCurrent) {
                this.page.current = pageCurrent;
                this.loadTableData();
            },
            changePageSize(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.page.size = pageSize;
                this.page.current = 1;

                this.loadTableData()
            },
            loadTableData() {
                let condition = {name: this.$route.query.name};
                Object.assign(condition, this.page)
                // 显示加载提示信息
                this.spinShow = true;
                // 加载模型列表数据
                this.axios.post('/model-server/list', condition).then(({data}) => {
                    this.tableData = data.data.data;
                    this.page.total = data.data.total;
                    this.spinShow = false;
                }).catch(error => {
                    console.log(error)
                    this.spinShow = false;
                    errorMessage(error, this);
                });
            }
        },
        created() {
            this.loadTableData();
        }
    }
</script>

<style scoped>

</style>
