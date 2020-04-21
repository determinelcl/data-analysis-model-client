<template>
    <Form :model="formItem" :label-width="80">

        <FormItem label="版本号">
            <Input v-model="formItem.name" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="类型">
            <Select v-model="formItem.tag">
                <Option :value="0">Lasted <span style="float:right;color:#ccc">最新版</span></Option>
                <Option :value="1">.GA <span style="float:right;color:#ccc">最新稳定版</span></Option>
                <Option :value="2">GA <span style="float:right;color:#ccc">稳定版</span></Option>
                <Option :value="3">Beta <span style="float:right;color:#ccc">测试版</span></Option>
                <Option :value="4">Snapshot <span style="float:right;color:#ccc">快照版</span></Option>
            </Select>
        </FormItem>
        <FormItem label="类型">
            <RadioGroup v-model="formItem.public">
                <Radio :label="0">公开</Radio>
                <Radio :label="1">私有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="formItem.status" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="模型">
            <Upload multiple type="drag" action="upload/model/">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传模型</p>
                </div>
            </Upload>
        </FormItem>
        <FormItem label="版本描述">
            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入" :rows="4"></Input>
        </FormItem>
        <FormItem label="版权标识">
            <Input v-model="formItem.copyright" placeholder="请输入版权唯一标识：专利号、著作权号、其他"></Input>
        </FormItem>
        <FormItem label="类型">
            <RadioGroup v-model="formItem.copyrightType">
                <Radio :label="0">专利</Radio>
                <Radio :label="1">著作权</Radio>
                <Radio :label="2">其他</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="版权图片">
            <Upload multiple type="drag" action="upload/model/">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传图片</p>
                </div>
            </Upload>
        </FormItem>
        <FormItem label="版权描述" v-if="formItem.copyrightType === 2">
            <Input v-model="formItem.copyrightDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入" :rows="4"></Input>
        </FormItem>
        <FormItem v-if="operation === 'update'">
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    export default {
        name: "ModelVersion",
        props: ['formItem', 'operation'],
        data() {
            return {

            }
        },
        methods: {
            handleSubmit() {

            },
            handleReset() {

            }
        }
    }
</script>

<style scoped>

</style>
