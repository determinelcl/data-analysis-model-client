<template>
    <div id="main-chart"
         :style="{width: `${width}px`, height: `${height}px`, marginTop: 0}">
    </div>
</template>

<script>
    export default {
        name: "Chart",
        props: {
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
        methods: {
            renderChart() {
                // 基于准备好的dom，初始化echarts实例
                let element = document.getElementById('main-chart');
                let myChart = this.$echarts.init(element, 'light')
                // 绘制图表
                myChart.setOption(this.option);
            }
        },
        mounted() {
            this.renderChart();
        }
    }
</script>

<style scoped>

</style>
