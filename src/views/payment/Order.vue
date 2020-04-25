<template>
    <div>
        <ComponentTitle name="订单管理" description="订单管理：删除、导出、查询、支付未支付订单信息"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p>是否删除此订单？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long
                            :loading="modalLoading" @click="deleteOrder()">删除
                    </Button>
                </div>
            </Modal>

            <Form ref="formInline" :model="searchForm">
                <Row type="flex" justify="space-between" :style="{padding: '0 20px'}">
                    <Col span="8">
                        <FormItem label="订单名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="服务名称：" prop="parent" label-position="left">
                            <Input type="text" v-model="searchForm.service" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchOrder()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchOrder()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Table ref="orderTableRef" :data="tableData" :columns="tableColumns" stripe no-data-text="订单数据为空">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" @click="exportOrder(index)" :style="{width: '108px'}">
                        导出
                    </Button>
                    <Button type="success" @click="payOrder(index)" :style="{width: '108px'}">
                        支付
                    </Button>
                    <Button type="error" size="small" @click="remove(index)">删除</Button>
                </template>
            </Table>

            <div style="margin: 10px; overflow: hidden">
            </div>
            <div style="display: flex; justify-content: center;">
                <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                      show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                      show-sizer show-total @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import LoadingIcon from "../../components/LoadingIcon";
    import ComponentTitle from "../../components/ComponentTitle";
    import {errorMessage} from "../../util/message.util";

    export default {
        name: "Order",
        components: {LoadingIcon, ComponentTitle},
        data() {
            return {
                spinShow: false,
                delConfirm: false,
                deletedOrderIndex: null,
                modalLoading: false,
                tableData: [],
                searchForm: {
                    name: null,
                    service: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                tableColumns: [
                    {type: 'selection', width: 60, align: 'center', fixed: 'left'},
                    {title: '订单号', key: 'name', width: 180, resizable: true},
                    {title: '订单金额', key: 'name', width: 180, resizable: true},
                    {title: '订单类型', key: 'name', width: 180, resizable: true},
                    {title: '订单方', key: 'name', width: 180, resizable: true},
                    {title: '商品名称', key: 'name', width: 180, resizable: true},
                    {title: '创建日期', key: 'created', width: 180, resizable: true},
                    {title: '商品描述', key: 'description', width: 180, resizable: true, tooltip: true},
                    {title: '操作', slot: 'action', width: 150, align: 'center', fixed: 'right'}
                ],
                styles: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
            }
        },
        methods: {
            searchOrder() {
                this.page.current = 1;
                this.loadTableData();
            },
            resetSearchOrder() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            exportOrder(index) {
                console.log(index)
            },
            // 获取选中的表格中的数据的id
            getTableSelection() {
                let selection = this.$refs.orderTableRef.getSelection();
                let selectIdList = [];
                selection.forEach(item => selectIdList.push(item.id))
                return selectIdList;
            },
            payOrder(index){
                console.log(index)
            },
            remove(index) {
                console.log(index);
                this.deletedOrderIndex = index;
                this.delConfirm = true;
            },
            deleteOrder() {
                let order = this.tableData[this.deletedOrderIndex];
                console.log(order);
                this.axios.delete(`/order-server/del/${order.id}`).then(({data}) => {
                    console.log(data);
                    this.loadTableData();
                    this.delConfirm = false;
                }).catch(error => {
                    this.delConfirm = false;
                    console.log(error)
                    errorMessage(error, this);
                })
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
            // 获取订单数据
            loadTableData() {
                let condition = this.searchForm;
                Object.assign(condition, this.page)
                // 显示加载提示信息
                // this.spinShow = true;
                // 加载订单列表数据
                this.axios.post('', condition).then(({data}) => {
                    this.tableData = data.data.data;
                    this.page.total = data.data.total;
                    // this.spinShow = false;
                }).catch(error => {
                    console.log(error)
                    // this.spinShow = false;
                    errorMessage(error, this);
                });
            }
        }
    }
</script>

<style scoped>

</style>
