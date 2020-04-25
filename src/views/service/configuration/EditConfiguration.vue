<template>
    <Form ref="formItem" :model="formItem" :rules="ruleValidate" :label-width="100">
        <FormItem label="服务名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入计划名称"></Input>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="formItem.status" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="模型" prop="city">
            <ModelProcessForm></ModelProcessForm>
        </FormItem>
        <FormItem label="描述" prop="desc">
            <Input v-model="formItem.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入测试计划的说明信息"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formItem')">提交</Button>
            <Button @click="handleReset('formItem')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import ModelProcessForm from "./ModelProcessForm";
    export default {
        name: "EditConfiguration",
        components: {ModelProcessForm},
        data() {
            return {
                formItem: {
                    name: '',
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
                    ],
                    date: [
                        {required: true, type: 'date', message: 'Please select the date', trigger: 'change'}
                    ],
                    time: [
                        {required: true, type: 'string', message: 'Please select time', trigger: 'change'}
                    ],
                    desc: [
                        {required: true, message: 'Please enter a personal introduction', trigger: 'blur'},
                        {type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur'}
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
