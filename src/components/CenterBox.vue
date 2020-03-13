<template>
    <div :style="{
                color: this.color,
                height: this.height,
                width: this.width,
                fontSize: this.fontSize,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }">
        {{ content }}
    </div>
</template>

<script>
    export default {
        name: "CenterBox",
        props: {
            color: String,
            height: String,
            width: String,
            fontSize: String,
            content: String
        }
    }
</script>

<style scoped>

</style>
