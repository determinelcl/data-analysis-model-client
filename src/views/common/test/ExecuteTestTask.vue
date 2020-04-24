<template>
    <div>
        <Button type="primary" @click="startTest()" size="large">开始测试</Button>
        <div style="margin: 16px 0">
            阶段1：训练数据
            <Progress :percent="50" :stroke-width="20" status="active" text-inside/>
            输出结果：
            <div>
                <Chart :option="option" :width="300" :height="300"></Chart>
            </div>
        </div>

    </div>
</template>

<script>
    import Chart from "../../../components/Chart";

    export default {
        name: "ExecuteTestTask",
        components: {Chart},
        data() {
            return {
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
        },
        methods: {
            startTest() {

            }
        }
    }
</script>

<style scoped>

</style>
