<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="协议名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入协议名称"></Input>
        </FormItem>
        <FormItem label="类型" prop="gender">
            <RadioGroup v-model="formValidate.gender">
                <Radio :label="0">公开</Radio>
                <Radio :label="1">私有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="formValidate.status" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="分组">
            <Select v-model="formValidate.groupId" filterable allow-create clearable>
                <Option :value="0">线性回归</Option>
                <Option :value="1">神经网络</Option>
                <Option :value="2">支持向量机</Option>
                <Option :value="3">图片识别</Option>
                <Option :value="4">深度学习</Option>
            </Select>
        </FormItem>
        <FormItem label="标签">
            <Select v-model="formValidate.tagId" filterable allow-create multiple>
                <Option :value="0">线性回归</Option>
                <Option :value="1">神经网络</Option>
                <Option :value="2">支持向量机</Option>
                <Option :value="3">图片识别</Option>
                <Option :value="4">深度学习</Option>
            </Select>
        </FormItem>
        <FormItem label="输入协议">
            <InputProtocolForm></InputProtocolForm>
        </FormItem>
        <FormItem label="过程协议">
            <ProcessProtocolForm></ProcessProtocolForm>
        </FormItem>
        <FormItem label="输出协议">
            <OutputProtocolForm :form-item="outputFormItem"></OutputProtocolForm>
        </FormItem>
        <FormItem label="描述" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入测试计划的说明信息"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import InputProtocolForm from "./InputProtocolForm";
    import ProcessProtocolForm from "./ProcessProtocolForm";
    import OutputProtocolForm from "./OutputProtocolForm";
    export default {
        name: "EditProtocol",
        components: {OutputProtocolForm, ProcessProtocolForm, InputProtocolForm},
        data() {
            return {
                outputFormItem: {
                    name: null,
                    outputType: 0,
                    description: null,
                    format: {},
                },
                formValidate: {
                    name: '',
                    status: true,
                    groupId: 0,
                    tagId: 0,
                    mail: '',
                    city: '',
                    gender: '',
                    interest: [],
                    date: '',
                    report: true,
                    time: '',
                    desc: ''
                },
                ruleValidate: {
                    name: [
                        {required: true, message: 'The name cannot be empty', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
