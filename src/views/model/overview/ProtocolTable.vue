<template>
    <div>
        <Spin fix v-if="spinShow">
            <LoadingIcon></LoadingIcon>
        </Spin>

        <Drawer v-model="protocolInfo" width="1183" :closable="false">
            <ProtocolInformation :protocol-info="protocolItem"></ProtocolInformation>
        </Drawer>

        <List>
            <ListItem v-for="(item, index) in tableData" :key="item.id">
                <ListItemMeta :title="item.name" :description="item.description"/>
                <Row type="flex" justify="center" align="middle" :gutter="38"
                     :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                    <Col>
                        <div class="list-description">状态</div>
                        <div :style="{width: '50px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': '#ff9900'}` }">
                            {{item.status === 0 ? '启用': '禁用'}}
                        </div>
                    </Col>
                    <Col>
                        <div class="list-description">类型</div>
                        <div :style="{width: '50px', alignContent: 'center', color: `${item.publicType === 0 ? '#19be6b': '#ff9900'}` }">
                            {{item.publicType === 0 ? '公开': '私有'}}
                        </div>
                    </Col>
                    <Col>
                        <div style="width: 138px; align-content: center">更新日期</div>
                        <div style="width: 138px; align-content: center">{{item.updated}}</div>
                    </Col>
                    <Col>
                        <a style="margin: 0 3px; color: #19be6b" @click="showProtocolDetail(index)">详情</a>
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
    import ProtocolInformation from "../protocol/ProtocolInformation";
    import LoadingIcon from "../../../components/LoadingIcon";
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "ProtocolTable",
        components: {LoadingIcon, ProtocolInformation},
        data() {
            return {
                spinShow: false,
                protocolInfo: false,
                protocolItem: {},
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                tableData: []
            }
        },
        methods: {
            showProtocolDetail(index) {
                this.protocolInfo = true

                let item = deepClone(this.tableData[index]);

                let inputFormItem = {}
                let processFormItem = []
                let outputFormItem = {}

                item.protocolFormatList.forEach(format => {
                    if (format.type === 0) inputFormItem = format
                    else if (format.type === 1) processFormItem.push(format)
                    else if (format.type === 2) outputFormItem = format
                })
                item['inputFormItem'] = inputFormItem
                item['processFormItem'] = processFormItem
                item['outputFormItem'] = outputFormItem

                this.protocolItem = item
            },
            // 切换页面
            changePage(page) {
                this.page.current = page;
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
                this.axios.post('/protocol-server/list', condition).then(({data}) => {
                    // 关闭加载提示信息
                    this.spinShow = false;
                    this.tableData = data.data.data;
                    this.page.total = data.data.total;
                }).catch(error => {
                    console.log(error);
                    // 关闭加载提示信息
                    this.spinShow = false;
                    errorMessage(error, this);
                });
            }
        },
        mounted() {
            this.loadTableData()
        }
    }
</script>

<style scoped>

</style>
