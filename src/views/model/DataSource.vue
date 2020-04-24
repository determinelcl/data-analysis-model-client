<template>
    <CommonDataSource :object-type="objectType"></CommonDataSource>
</template>

<script>
    import CommonDataSource from "../common/CommonDataSource";

    export default {
        name: "DataSource",
        components: {CommonDataSource},
        data() {
            return {
                objectType: {
                    type: 'model',
                    name: '模型'
                }
            }
        }
    }
</script>

<style scoped>

</style>
