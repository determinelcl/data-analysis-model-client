<template>
    <div>
        <ComponentTitle name="权限管理" description="权限管理：添加、删除、修改、查询"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow"><LoadingIcon></LoadingIcon></Spin>
        </div>
    </div>
</template>

<script>
    import ComponentTitle from "../../components/ComponentTitle";
    import LoadingIcon from "../../components/LoadingIcon";
    export default {
        name: "Authority",
        components: {LoadingIcon, ComponentTitle},
        data() {
            return {
                spinShow: false
            }
        }
    }
</script>

<style scoped>

</style>
