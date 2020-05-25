<template>
    <div>
        <ComponentTitle name="订单管理" description="订单管理：删除、导出、查询、支付未支付订单信息"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>

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
                    <Button type="success" @click="payOrder(index)" size="small" :disabled="row.payStatus === 0">
                        {{row.payStatus === 0 ? '已支付' : '支付'}}
                    </Button>
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
    import {errorMessage, renderPopTip} from "../../util/message.util";

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
                    serviceName: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                tableColumns: [
                    {type: 'selection', width: 60, align: 'center', fixed: 'left'},
                    {title: '订单号', key: 'number', width: 180, resizable: true, tooltip: true},
                    {title: '订单金额（：¥）', key: 'money', width: 180, resizable: true},
                    {title: '订单类型', key: 'type', width: 180, resizable: true},
                    {
                        title: '订单方', key: 'account', width: 180, resizable: true,
                        render: (h, params) => {
                            let row = params.row;
                            let content = ''
                            if (row.account) content = row.account.username

                            return renderPopTip(h, content);
                        }
                    },
                    {
                        title: '服务名称', key: 'runtimeService', width: 180, resizable: true,
                        render: (h, params) => {
                            let row = params.row;
                            let content = ''
                            if (row.runtimeService) content = row.runtimeService.name

                            return renderPopTip(h, content);
                        }
                    },
                    {
                        title: '支付状态', key: 'payStatus', width: 180, resizable: true,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.payStatus === 0 ? 'success' : 'warning';
                            const text = row.payStatus === 0 ? '已支付' : '未支付';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {
                        title: '支付方式', key: 'payMethod', width: 180, resizable: true,
                        render: (h, params) => {
                            const row = params.row;
                            if (row.payStatus === 1) return h('div', '未支付')

                            const color = row.payMethod === 0 ? 'primary' : 'success';
                            const text = row.payMethod === 0 ? '支付宝' : '微信';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {title: '支付时间', key: 'payTime', width: 180, resizable: true},
                    {title: '创建日期', key: 'created', width: 180, resizable: true},
                    {title: '操作', slot: 'action', width: 80, align: 'center', fixed: 'right'}
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
            payOrder(index) {
                console.log(index)
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
                condition['payUserId'] = this.$store.state.user.id

                this.spinShow = true;
                this.axios.post('/payment-server/list', condition).then(({data}) => {
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
        mounted() {
            this.loadTableData()
        }
    }
</script>

<style scoped>

</style>
