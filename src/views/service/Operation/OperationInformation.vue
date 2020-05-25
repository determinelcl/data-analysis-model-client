<template>
    <div>
        <p :style="textTheme">运行时服务信息</p>
        <p :style="textTheme">基本信息</p>
        <div class="demo-drawer-profile">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    名称: {{formItem.name}}
                </Col>
                <Col span="12">
                    状态:
                    <Tag type="dot"
                         :color="formItem.status === 0 ? '#2d8cf0' : formItem.status === 1 ? '#19be6b': formItem.status === 2 ? '#ff9900' : '#ed4014'">
                        {{formItem.status === 0 ? '正在运行': formItem.status === 1 ? '运行完成' : formItem.status === 2 ? '未运行' : '出现故障'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12" v-if="formItem.config">
                    服务配置: {{formItem.config.name}}
                </Col>
                <Col span="12" v-if="formItem.datasource">
                    数据源: {{formItem.datasource.name}}
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12" >
                    公开类型:
                    <Tag type="dot" :color="formItem.publicType === 0 ? '#19be6b' : '#2d8cf0'">
                        {{formItem.publicType === 0 ? '公开' : '私有'}}
                    </Tag>
                </Col>
                <Col span="12" v-if="formItem.serviceOrder">
                    付费:
                    <Tag type="dot" :color="formItem.serviceOrder.payStatus === 0 ? '#19be6b' : '#ff9900'">
                        {{formItem.serviceOrder.payStatus === 0 ? '已支付' : '未支付'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    运行类型:
                    <Tag type="dot" :color="formItem.type === 0 ? '#2d8cf0' : '#19be6b'">
                        {{formItem.type === 0 ? '数据分析' : '学习系统'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="24">
                    运行时服务简介: {{formItem.description}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">运行时服务报告</p>
        <div class="demo-drawer-profile">
            {{report}}
        </div>
    </div>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "OperationInformation",
        props: ['formItem'],
        data() {
            return {
                versionTagList: ['lasted', 'GA(最新)', 'GA', 'Beta', 'Snapshot'],
                report: {},
                textTheme: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                }
            }
        },
        mounted() {
            this.$on('loadData', runtimeId => {
                this.axios.get(`/runtime-server/report/${runtimeId}`).then(({data}) => {
                    console.log(data)
                    this.report = data
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            })
        }
    }
</script>

<style scoped>

</style>
