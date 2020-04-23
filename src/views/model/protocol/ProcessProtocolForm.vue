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
        <Table :columns="protocolColumn" :data="protocolList" :show-header="false"></Table>
    </div>
</template>

<script>

    import OutputProtocolForm from "./OutputProtocolForm";

    export default {
        name: "ProcessProtocolForm",
        data() {
            return {
                delBatchConfirm: false,
                protocolColumn: [
                    {type: 'selection', width: 60, align: 'center'},
                    {
                        type: 'expand',
                        width: 20,
                        render: (h, params) => {
                            return h(OutputProtocolForm, {
                                props: {
                                    formItem: params.row,
                                    operation: 'update'
                                }
                            })
                        }
                    },
                    {
                        title: '输出名称',
                        key: 'name',
                        width: 200,
                        tooltip: true
                    },
                    {
                        title: '输出类型',
                        key: 'outputType',
                        width: 100,
                        render: (h, params) => {
                            let outputType = ['图表', '文本', '图片', '矩阵', '语音', '流数据']
                            return h('div', outputType[params.row.outputType])
                        }
                    },
                    {
                        title: '格式',
                        key: 'format',
                        tooltip: true
                    },
                    {
                        title: '描述',
                        key: 'description',
                        width: 180,
                        tooltip: true
                    }
                ],
                protocolList: [
                    {
                        name: '学习率曲线',
                        outputType: 0,
                        format: {},
                        description: '这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明'
                    },
                    {
                        name: '查准率',
                        outputType: 1,
                        format: {},
                        description: '这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明'
                    },
                    {
                        name: '查全率',
                        outputType: 2,
                        format: {},
                        description: '这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明这是测试说明'
                    }
                ]
            }
        },
        methods: {
            addProtocol() {
                this.protocolList.forEach(protocol => protocol['_expanded'] = false)

                let protocol = {
                    outputType: 0,
                    description: null,
                    format: {},
                }
                this.protocolList.push(protocol);
            },
            removeProtocolBatch() {
                this.delBatchConfirm = true;
            },
            deleteProtocolBatch() {

            },
        }
    }
</script>

<style scoped>

</style>
