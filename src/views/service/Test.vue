<template>
    <div>
        <CommonTest :object-type="objectType"></CommonTest>
    </div>
</template>

<script>
    import CommonTest from "../common/CommonTest";

    export default {
        name: "Test",
        components: {CommonTest},
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
