<template>
    <div :id="chartId"
         :style="{width: `${width}px`, height: `${height}px`, marginTop: 0}">
    </div>
</template>

<script>
    export default {
        name: "Chart",
        props: {
            chartId: {type: String},
            option: {type: Object},
            width: {
                type: Number,
                default: 500
            },
            height: {
                type: Number,
                default: 500
            }
        },
        data() {
            return {
                myChart: null,
            }
        },
        methods: {
            renderChart() {
                // 基于准备好的dom，初始化echarts实例
                let element = document.getElementById(this.chartId);

                this.myChart = this.$echarts.init(element, 'light')
                // 绘制图表
                this.myChart.setOption(this.option);
            }
        },
        mounted() {
            this.renderChart();
            this.$on('setOption', (series) => {
                this.myChart.setOption(series)
            })
        }
    }
</script>

<style scoped>

</style>
