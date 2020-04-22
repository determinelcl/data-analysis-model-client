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
                    <Tag type="dot" :color="reportInfo.status === 0 ? '#19be6b': '#ff9900'">
                        {{reportInfo.status === 0 ? '已完成' : '未完成'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    测试模型: {{reportInfo.model}}
                </Col>
                <Col span="12">
                    触发类型:
                    <Tag :color="`${reportInfo.trigger === 0 ? '#19be6b': '#ff9900'}`">
                        {{reportInfo.trigger === 0 ? '自动': '手动'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    数据源: {{reportInfo.dataSource}}
                </Col>
                <Col span="12">
                    测试结果:
                    <Tag :color="reportInfo.resultType === 0 ? 'success' : 'error'">
                        {{reportInfo.resultType === 0 ? '成功': '失败'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="24">
                    测试计划简介: {{reportInfo.description}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">测试结果</p>
        <div class="demo-drawer-profile">
            <Chart :option="option"></Chart>
        </div>
    </div>
</template>

<script>
    import Chart from "../../../components/Chart";

    export default {
        name: "TestReport",
        components: {Chart},
        data() {
            return {
                reportInfo: {
                    name: '图片识别算法测试',
                    trigger: 0,
                    status: 0,
                    resultType: 0,
                    model: '图片识别模型',
                    dataSource: '图片数据源',
                    description: '这是一个图片识别的算法模型测试计划的测试详情信息'
                },
                textTheme: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                },
                option: {
                    tooltip: {},
                    backgroundColor: '#fff',
                    visualMap: {
                        show: false,
                        dimension: 2,
                        min: -1,
                        max: 1,
                        inRange: {
                            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                        }
                    },
                    xAxis3D: {
                        type: 'value'
                    },
                    yAxis3D: {
                        type: 'value'
                    },
                    zAxis3D: {
                        type: 'value'
                    },
                    grid3D: {
                        viewControl: {
                            // projection: 'orthographic'
                        }
                    },
                    series: [{
                        type: 'surface',
                        wireframe: {
                            // show: false
                        },
                        equation: {
                            x: {
                                step: 0.05
                            },
                            y: {
                                step: 0.05
                            },
                            z: function (x, y) {
                                if (Math.abs(x) < 0.1 && Math.abs(y) < 0.1) {
                                    return '-';
                                }
                                return Math.sin(x * Math.PI) * Math.sin(y * Math.PI);
                            }
                        }
                    }]
                }
            }
        }
    }
</script>

<style scoped>

</style>
