<template>
    <div>
        <Modal v-model="delBatchConfirm" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否删除选中的过程协议？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteProtocolBatch()">删除</Button>
            </div>
        </Modal>
        <Modal title="编辑协议信息" v-model="editProcessProtocolModal" scrollable :mask-closable="false" width="650px"
               :footer-hide="true">
            <OutputProtocolForm :form-item="outputFormItem" operation="checked"
                                @completeTask="editProcessProtocolCompleteTask"></OutputProtocolForm>
        </Modal>

        <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
            <Col span="5">
                <Button type="primary" @click="addProtocol()"
                        :style="{width: '138px'}" icon="md-add">新增过程协议
                </Button>
            </Col>
            <Col span="5">
                <Button @click="removeProtocolBatch()" :style="{width: '108px'}">
                    <Icon type="ios-trash-outline" size="17"/>
                    批量删除
                </Button>
            </Col>
        </Row>
        <Table ref="protocolProcessRef" :columns="protocolColumn" :data="formItem" :show-header="false">
            <template slot-scope="{ row, index }" slot="action">
                <a style="margin: 0 3px; color:#ff9900;" @click="updateProcessProtocol(index)">编辑</a>
            </template>
        </Table>
    </div>
</template>

<script>

    import OutputProtocolForm from "./OutputProtocolForm";

    export default {
        name: "ProcessProtocolForm",
        components: {OutputProtocolForm},
        props: ['formItem', "delItem"],
        data() {
            return {
                delBatchConfirm: false,
                editProcessProtocolModal: false,
                outputFormItem: {},
                protocolColumn: [
                    {type: 'selection', width: 60, align: 'center'},
                    {
                        title: '输出名称',
                        key: 'name',
                        width: 200,
                        tooltip: true
                    },
                    {
                        title: '输出类型',
                        key: 'ioType',
                        width: 100,
                        render: (h, params) => {
                            let outputType = ['图表', '文本', '图片', '矩阵', '语音', '流数据']
                            return h('div', outputType[params.row.ioType])
                        }
                    },
                    {
                        title: '格式',
                        key: 'format',
                        tooltip: true
                    },
                    {
                        title: '描述',
                        key: 'ioDesc',
                        width: 180,
                        tooltip: true
                    },
                    {title: '操作', slot: 'action', width: 100, align: 'center'}
                ]
            }
        },
        methods: {
            editProcessProtocolCompleteTask(protocol) {
                this.editProcessProtocolModal = false
                this.formItem.push(protocol)
            },
            addProtocol() {
                this.editProcessProtocolModal = true

                this.outputFormItem = {
                    name: '',
                    ioType: null,
                    ioDesc: '',
                    fileSuffix: '',
                    format: '',
                    newObj: 0
                }
            },
            updateProcessProtocol(index) {
                this.editProcessProtocolModal = true
                let item = this.formItem[index];
                item.newObj = 1
                this.outputFormItem = item
            },
            removeProtocolBatch() {
                this.delBatchConfirm = true;
            },
            deleteProtocolBatch() {
                let tableSelectionIdList = this.getTableSelection();
                console.log(tableSelectionIdList);
                if (tableSelectionIdList.length === 0) return;

                // 从当前数组中移除
                this.formItem = this.formItem.filter(item => !tableSelectionIdList.includes(item.name))

                let filter = this.formItem.filter(item => tableSelectionIdList.includes(item.name));
                if (filter) this.delItem.push(...filter)

                this.delBatchConfirm = false
            },
            // 获取选中的表格中的数据的id
            getTableSelection() {
                let selection = this.$refs.protocolProcessRef.getSelection();
                let selectIdList = [];
                selection.forEach(item => selectIdList.push(item.name))
                return selectIdList;
            },
        }
    }
</script>

<style scoped>

</style>
