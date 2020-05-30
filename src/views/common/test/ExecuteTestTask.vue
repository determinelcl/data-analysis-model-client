<template>
    <div>
        <h3 v-if="formItem">{{formItem.name}}</h3>
        <Row type="flex" :gutter="30" style="margin-top: 10px">
            <Col>
                状态：测试进行中
            </Col>
            <Col>
                触发时间：2020-05-15 09:30:00
            </Col>
            <Col>
                触发方式：自动
            </Col>
            <Col>
                已运行时长： 00:01:31
            </Col>
        </Row>
        <br/>
        <Button type="primary" @click="startTest()" >开始测试</Button>
        <div style="margin: 16px 0; height: auto">
            <Progress :percent="90" :stroke-color="['#108ee9', '#87d068']" status="active"/>
            <Scroll height="500" class="test-task-output">
                <div style="padding: 3px 15px; height: 100%; width: 100%">
                    <div style="height: 30px; display: flex; align-items: center">
                        2020-05-16 09:30:00 测试计划开始
                    </div>
                    <div style="height: 30px; display: flex; align-items: center">
                        2020-05-16 09:30:20 数据预处理完成
                    </div>
                    <div style="align-items: center">
                        <div style="height: 30px; display: flex; align-items: center">2020-05-16 09:30:22 待分析矩阵</div>
                        <div>
                            <div>[2020-05-15  24.4(17:30) 94.0(00:50)  (NE)(27%)  16.1(12:20) 1013.9(23:50) 23.6(20:15) 0.0(23:55)]</div>
                            <div>[2020-05-15  12.2(06:20) 39.0(17:20)   (E)(27%)   0.0(00:05) 1008.7(03:40) 21.9(05:25) 0.0(24h)]</div>
                            <div>[2020-05-14  16.6(15:30) 96.0(12:25)   (E)(43%)  14.5(19:35) 1009.7(23:55) 23.8(00:10) 9.8(19:40)]</div>
                            <div>[2020-05-14  11.9(08:50) 81.0(17:30)  (NE)(25%)   0.0(00:00) 1004.8(07:15) 22.6(13:15)18.5(24h)]</div>
                            <div>[2020-05-13  21.1(15:50) 94.0(09:05)   (E)(24%)  14.5(18:05) 1010.1(00:05) 24.6(01:10) 0.1(19:35)]</div>
                            <div>[2020-05-13  11.9(04:35) 50.0(14:45)   (S)(14%)   0.0(02:45) 1004.0(17:45) 23.5(17:50) 1.5(24h)]</div>
                            <div>[2020-05-12  19.2(17:35) 95.0(11:50)  (SW)(25%)  12.9(18:50) 1012.0(00:00) 25.5(00:25) 5.9(09:15)]</div>
                            <div>[2020-05-12  12.8(09:45) 58.0(17:00)   (W)(11%)   0.0(00:40) 1007.8(19:10) 24.3(22:00)17.3(24h)]</div>
                            <div>[2020-05-11  21.9(17:30) 93.0(06:45)   (W)(38%)  20.9(13:45) 1012.8(00:25) 25.6(23:50) 2.0(10:20)]</div>
                            <div>[2020-05-11  14.2(02:55) 54.0(15:35)  (SW)(25%)   0.0(03:20) 1010.1(09:50) 24.8(09:25) 1.5(24h)]</div>
                            <div>[2020-05-10  21.4(15:45) 93.0(01:45)   (W)(72%)  16.1(20:25) 1012.8(23:55) 26.3(12:05) 0.0(23:55)]</div>
                            <div>[2020-05-10  13.4(07:15) 57.0(15:20)  (SW)(16%)   0.0(00:20) 1010.0(17:25) 25.4(21:00) 0.3(24h)]</div>
                            <div>[2020-05-09  21.8(14:25) 93.0(23:55)  (SW)(44%)  14.5(18:30) 1015.4(01:15) 27.1(01:00) 0.7(19:20)]</div>
                            <div>[2020-05-09  14.2(05:40) 48.0(14:15)   (W)(23%)   0.0(02:20) 1010.8(19:50) 25.3(18:40) 3.8(24h)]</div>
                        </div>
                    </div>
                    <div style="align-items: center">
                        <div style="height: 30px; display: flex; align-items: center">
                            2020-05-15 09:31:01 距离海较近的城市与相对距离海较远的城市的最高气温比对
                        </div>
                        <div>
                            <Chart ref="weatherChartRef" chart-id="weather" :option="weatherOption" :width="650" :height="350">
                            </Chart>
                        </div>
                    </div>
                </div>
            </Scroll>
            <div class="test-task-res">
                <Chart ref="cpuChartRef" chart-id="cpu" :option="option" :width="350" :height="300">
                </Chart>

                <Chart ref="memoryChartRef" chart-id="memory" :option="memoryOption" :width="350" :height="300">
                </Chart>
            </div>
        </div>

    </div>
</template>

<script>
    import Chart from "../../../components/Chart";
    import {errorMessage} from "../../../util/message.util";
    import {deepClone} from "../../../util/object.util";

    export default {
        name: "ExecuteTestTask",
        components: {Chart},
        props: ['formItem'],
        data() {
            return {
                dataCPU: [],
                dataMemory: [],
                now: +new Date(1997, 9, 3),
                oneDay: 24 * 3600 * 1000,
                value: Math.random() * 1000,
                weatherOption : {
                    title: {
                        text: '城市的最高气温比对'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['08:00', '11:00', '14:00', '17:00', '20:00', '23:00', '02:00', '05:00', '08:00']
                    },
                    yAxis: [
                        { // 纵轴标尺固定
                            type : 'value',
                            scale : true,
                            max : 38,
                            min : 18,
                            splitNumber : 5,
                            boundaryGap : [ 0.2, 0.2 ]
                        }
                    ],
                    series: [
                        {
                            type: 'line',
                            data: [21, 26, 27.5, 27, 25, 22, 22, 18, 20]
                        },
                        {
                            type: 'line',
                            data: [19, 28, 29.5, 28.5, 25.5, 23, 20.9, 19, 21]
                        },
                        {
                            type: 'line',
                            data: [23, 29, 26.5, 26, 25.2, 21.5, 19.5, 18, 19]
                        },
                        {
                            type: 'line',
                            data: [20.5, 25.5, 28.5, 31.5, 29, 25, 21.5, 18.5, 21.5]
                        },
                        {
                            type: 'line',
                            data: [23.5, 26, 29, 32, 30, 26, 23, 19, 22]
                        },
                        {
                            type: 'line',
                            data: [20, 25, 28, 30, 27.5, 24, 20, 18, 20]
                        }
                    ]
                },
                option: {
                    title: {
                        text: 'CPU负载'
                    },
                    xAxis: {
                        type: 'time',
                        show: false,
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        show: false,
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        areaStyle: {},
                        showSymbol: false,
                        hoverAnimation: false,
                        data: this.dataCPU
                    }]
                },
                memoryOption: {
                    title: {
                        text: '内存负载'
                    },
                    xAxis: {
                        type: 'time',
                        show: true,
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: 'value',
                        show: false,
                        boundaryGap: [0, '100%'],
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            show: false,
                            interval: 'auto',
                            formatter: '{value}%'
                        }
                    },
                    series: [{
                        name: '模拟数据',
                        type: 'line',
                        areaStyle: {},
                        showSymbol: false,
                        hoverAnimation: false,
                        data: this.dataMemory,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{b}\n{c}%'
                                }
                            }
                        }
                    }]
                }
            }
        },
        methods: {
            startTest() {
                let testPlan = deepClone(this.formItem)
                // 显示加载提示信息
                let userId = this.$store.state.user.id
                this.axios.patch(`/test-server/start/${userId}/${testPlan.id}`).then(({data}) => {
                    console.log(data)

                    this.loadTableData()
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            randomData() {
                this.now = new Date(+this.now + this.oneDay);
                this.value = this.value + Math.random() * 21 - 10;
                let _this = this
                return {
                    name: _this.now.toString(),
                    value: [
                        [_this.now.getFullYear(), _this.now.getMonth() + 1, _this.now.getDate()].join('/'),
                        Math.round(_this.value)
                    ]
                };
            }

        },
        mounted() {
            for (let i = 0; i < 1000; i++) {
                this.dataCPU.push(this.randomData());
                this.dataMemory.push(this.randomData());
            }
            //
            let _this = this;
            // setInterval(() => {
            //
            //     for (let i = 0; i < 5; i++) {
            //         _this.dataCPU.shift();
            //         _this.dataMemory.shift();
            //
            //         _this.dataCPU.push(_this.randomData());
            //         _this.dataMemory.push(_this.randomData());
            //     }
            //
            _this.$refs.cpuChartRef.$emit('setOption', {
                series: [{
                    data: _this.dataCPU
                }]
            });
            _this.$refs.memoryChartRef.$emit('setOption', {
                series: [{
                    data: _this.dataMemory
                }]
            });
            // }, 1000);
        }
    }
</script>

<style scoped>
    .test-task-output {
        height: 506px;
        border: 1px #cdcece solid;
        margin: 20px auto;
        box-shadow: inset 2px 2px 2px #e8eaec;
    }

    .test-task-res {
        height: 300px;
        border: 1px #e8eaec solid;
        padding: 3px 0 3px 15px;
        display: flex;
        justify-content: space-between;
    }
</style>
