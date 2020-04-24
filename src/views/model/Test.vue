<template>
    <CommonTest :object-type="objectType"></CommonTest>
</template>

<script>
    import CommonTest from "../common/CommonTest";

    export default {
        name: "Test",
        components: {CommonTest},
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
