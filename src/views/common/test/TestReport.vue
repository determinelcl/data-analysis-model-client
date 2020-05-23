<template>
    <div>
        <p :style="textTheme">测试计划信息</p>
        <p :style="textTheme">基本信息</p>
        <div class="demo-drawer-profile">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    名称: {{reportInfo.name}}
                </Col>
                <Col span="12">
                    状态:
                    <Tag type="dot"
                         :color="reportInfo.status === 0 ? '#19be6b': reportInfo.status === 1 ? '#ff9900' : reportInfo.status === 2 ? '#2d8cf0' : '#ed4014'">
                        {{reportInfo.status === 0 ? '成功': reportInfo.status === 1 ? '未开始' : reportInfo.status === 2 ? '#进行中' : '#失败'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    测试模型: {{reportInfo.version.model.name}}/
                    {{reportInfo.version.name}}:{{versionTagList[reportInfo.version.type]}}
                </Col>
                <Col span="12">
                    触发类型:
                    <Tag :color="`${reportInfo.triggerType === 0 ? '#19be6b': '#ff9900'}`">
                        {{reportInfo.triggerType === 0 ? '自动': '手动'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    数据源: {{reportInfo.datasource.name}}
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="24">
                    测试计划简介: {{reportInfo.description}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">测试报告</p>
        <div class="demo-drawer-profile">
            {{report}}
        </div>
    </div>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "TestReport",
        props: ['reportInfo'],
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
            this.$on('loadData', testPlanId => {
                this.axios.get(`/test-server/report/plan/${testPlanId}`).then(({data}) => {
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
