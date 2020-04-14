<template>
    <div>
        <Icon type="ios-loading" size=38 class="spin-icon-load"></Icon>
        <div>Loading</div>
    </div>
</template>

<script>
    export default {
        name: "LoadingIcon",
        props: {
            iconType: {
                type: String,
                default: 'ios-loading'
            },
            iconSize: {
                type: Number,
                default: 38
            },
            loadingText: {
                type: String,
                default: 'Loading'
            }
        }
    }
</script>

<style lang="less" scoped>
    .spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
