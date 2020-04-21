<template>
    <Form :model="formItem" :label-width="80">
        <FormItem label="模型名称">
            <Input v-model="formItem.name" placeholder="请输入模型名称"></Input>
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
        <FormItem label="分组">
            <Select v-model="formItem.groupId" filterable allow-create clearable>
                <Option :value="0">线性回归</Option>
                <Option :value="1">神经网络</Option>
                <Option :value="2">支持向量机</Option>
                <Option :value="3">图片识别</Option>
                <Option :value="4">深度学习</Option>
            </Select>
        </FormItem>
        <FormItem label="标签">
            <Select v-model="formItem.tagId" filterable allow-create multiple>
                <Option :value="0">线性回归</Option>
                <Option :value="1">神经网络</Option>
                <Option :value="2">支持向量机</Option>
                <Option :value="3">图片识别</Option>
                <Option :value="4">深度学习</Option>
            </Select>
        </FormItem>
        <FormItem label="GIT地址">
            <Input v-model="formItem.git" placeholder="请输入模型名称"></Input>
        </FormItem>
        <FormItem label="模型描述">
            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
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
        name: "ModelForm",
        props: ['formItem', 'operation'],
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
