<template>
    <div>
        <CommonDataSource :object-type="objectType"></CommonDataSource>
    </div>
</template>

<script>
    import CommonDataSource from "../common/CommonDataSource";
    export default {
        name: "DataSource",
        components: {CommonDataSource},
        data() {
            return {
                objectType: {
                    type: 'service',
                    name: '服务'
                }
            }
        }
    }
</script>

<style scoped>

</style>
