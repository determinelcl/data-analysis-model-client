<template>
    <div id="logo" :style="{height: height}">
        <img :style="{height: logoSize, width: logoSize}" src="../assets/login_logo.png" alt="数据分析模型">
        <transition name="slide-fade" mode="out-in">
            <div id="logo-content" v-show="isShow"
                 :style="{fontSize: fontSize, color: fontColor, paddingLeft: logoSpace}">
                数据分析模型
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "Logo",
        props: {
            fontSize: String,
            fontColor: String,
            height: String,
            logoSize: String,
            logoSpace: String,
            isShow: {
                type: Boolean,
                default: true
            }
        }
    }
</script>

<style scoped>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .6s ease;
    }

    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    /* .slide-fade-leave-active for below version 2.1.8 */
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }

    div#logo {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    div#logo img {
        width: 80px;
        height: 80px;
    }

    div#logo-content {
        padding-left: 8px;
        font-size: 33px;
        color: #2a353e;
        display: flex;
        align-items: center;
    }

</style>
