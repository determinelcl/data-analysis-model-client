<template>
    <div :style="{height: '100px', backgroundColor: '#ffffff', padding: 0}">
        <div :style="{padding: '16px 32px 1px 32px'}">
            <div :style="{fontSize: '22px', height: '30px', color:'#17233D', fontWeight: 500, margin: '0 0 16px 0'}">
                {{name}}
            </div>
            <div>{{description}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ComponentTitle",
        props: {
            name: {type: String},
            description: {type: String}
        }
    }
</script>

<style scoped>

</style>
