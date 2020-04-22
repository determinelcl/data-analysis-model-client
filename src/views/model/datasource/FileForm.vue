<template>
    <div>
        <FormItem label="数据文件">
            <Upload multiple type="drag" action="upload/model/" :format="accept">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传模型</p>
                </div>
            </Upload>
        </FormItem>
    </div>
</template>

<script>
    export default {
        name: "FileForm",
        props: ['accept']
    }
</script>

<style scoped>

</style>
