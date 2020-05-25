<template>
    <div>
        <ComponentTitle name="报表管理" description="报表管理：添加、删除、修改、查询报表信息"></ComponentTitle>

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
                    <p>是否删除此报表模版？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long
                            :loading="modalLoading" @click="deleteReport()">删除
                    </Button>
                </div>
            </Modal>
            <Drawer :title="updateReportText" v-model="editReportOpenState" width="1080"
                    :mask-closable="false" :styles="styles">
                <EditReport ref="editReportRef" :form-item="editReportForm" :edit-type="editType"
                            @completeTask="editReportCompleteTask"></EditReport>
            </Drawer>

            <Form ref="formInline" :model="searchForm">
                <Row type="flex" justify="space-between" :style="{padding: '0 20px'}">
                    <Col span="8">
                        <FormItem label="报表名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="服务名称：" prop="parent" label-position="left">
                            <Input type="text" v-model="searchForm.serviceName" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchReport()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchReport()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row type="flex" justify="start" :style="{padding: '0 20px', margin: '0 0 20px 0'}">
                <Col span="3">
                    <Button type="primary" @click="addReport()"
                            :style="{width: '108px'}" icon="md-add">新增报表
                    </Button>
                </Col>
            </Row>
            <Table ref="reportTableRef" :data="tableData" :columns="tableColumns" stripe no-data-text="报表数据为空">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" @click="exportReport(index)"
                            :style="{width: '80px', marginRight: '5px'}">
                        导出报表
                    </Button>
                    <Button type="warning" size="small" style="margin-right: 5px" @click="updateReport(index)">
                        更新
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
    import ComponentTitle from "../../components/ComponentTitle";
    import {errorMessage, renderPopTip} from "../../util/message.util";
    import {deepClone} from "../../util/object.util";
    import LoadingIcon from "../../components/LoadingIcon";
    import EditReport from "./report/EditReport";

    export default {
        name: "Report",
        components: {EditReport, LoadingIcon, ComponentTitle},
        data() {
            return {
                spinShow: false,
                delConfirm: false,
                deletedReportIndex: null,
                modalLoading: false,
                editReportOpenState: false,
                updateReportText: '',
                editType: 'add',
                editReportForm: {},
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
                    {title: '报表名称', key: 'name', width: 180, resizable: true, tooltip: true},
                    {
                        title: '服务名称', key: 'runtimeService', width: 180, resizable: true,
                        render: (h, params) => {
                            let row = params.row;
                            if (!row.runtimeService) return h('div', '未选择服务')

                            return renderPopTip(h, row.runtimeService.name);
                        }
                    },
                    {
                        title: '模版状态', key: 'status', width: 150, resizable: true,
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? 'success' : 'error';
                            const text = row.status === 0 ? '启用' : '禁用';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {title: '创建日期', key: 'created', width: 180, resizable: true},
                    {title: '更新日期', key: 'updated', width: 180, resizable: true},
                    {title: '操作', slot: 'action', width: 218, align: 'center', fixed: 'right'}
                ],
                tableData: [],
                styles: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
            }
        },
        methods: {
            editReportCompleteTask() {
                this.editReportOpenState = false;
                this.loadTableData();
            },
            searchReport() {
                this.page.current = 1;
                this.loadTableData();
            },
            resetSearchReport() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            addReport() {
                this.editReportOpenState = true;
                this.editType = 'add';
                this.updateReportText = '新增报表';

                this.editReportForm = {
                    name: '',
                    status: 0,
                    serviceId: null,
                    description: '',
                    formDynamic: {
                        step: 0,
                        visualDataList: [],
                        items: [{
                            step: 0,
                            title: '',
                            visualDataId: null,
                            abscissa: 0,
                            ordinate: 0,
                            abscissaSpan: 0,
                            ordinateSpan: 0,
                            description: ''
                        }]
                    }
                }
            },
            exportReport(index) {
                console.log(index)
            },
            updateReport(index) {
                this.editReportOpenState = true;
                this.editType = 'update';
                this.updateReportText = '更新报表';
                let report = deepClone(this.tableData[index]);
                console.log(report)
                report.formDynamic = {
                    step: 0,
                    visualDataList: report.runtimeService.visualDataList,
                    items: report.reportItemList
                }
                if (report.runtimeService)
                    report.serviceId = report.runtimeService.id

                this.editReportForm = report;
            },
            // 获取选中的表格中的数据的id
            getTableSelection() {
                let selection = this.$refs.reportTableRef.getSelection();
                let selectIdList = [];
                selection.forEach(item => selectIdList.push(item.id))
                return selectIdList;
            },
            remove(index) {
                console.log(index);
                this.deletedReportIndex = index;
                this.delConfirm = true;
            },
            deleteReport() {
                let report = this.tableData[this.deletedReportIndex];
                let userId = this.$store.state.user.id
                console.log(report);
                this.axios.delete(`/report-server/delete/${userId}/${report.id}`).then(({data}) => {
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
            // 获取报表数据
            loadTableData() {
                let condition = this.searchForm;
                Object.assign(condition, this.page)
                condition['userId'] = this.$store.state.user.id
                // 显示加载提示信息
                this.spinShow = true;
                // 加载报表列表数据
                this.axios.post('/report-server/list', condition).then(({data}) => {
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
