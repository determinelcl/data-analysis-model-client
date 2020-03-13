<template>
    <div id="logo">
        <div id="logo-img"><img src="../assets/login_logo.png" alt="数据分析模型"></div>
        <div id="logo-content">数据分析模型</div>
    </div>
</template>

<script>
    export default {
        name: "Logo"
    }
</script>

<style scoped>

    div#logo {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
    }

    div#logo-img, div#logo img {
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
