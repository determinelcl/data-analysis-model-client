<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="计划名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入计划名称"></Input>
        </FormItem>
        <FormItem label="触发类型" prop="gender">
            <RadioGroup v-model="formValidate.gender">
                <Radio :label="0">自动</Radio>
                <Radio :label="1">手动</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="开始时间" prop="date">
            <DatePicker type="datetime" placeholder="选择时间日期" style="width: 100%" v-model="formValidate.date">
            </DatePicker>
        </FormItem>
        <FormItem label="模型" prop="city">
            <Select v-model="formValidate.city" placeholder="Select your city">
                <Option :value="0">图片识别</Option>
                <Option :value="1">支持向量机</Option>
                <Option :value="2">商品推荐</Option>
            </Select>
        </FormItem>
        <FormItem label="数据源" prop="city">
            <Select v-model="formValidate.city" placeholder="Select your city">
                <Option :value="0">数字图片</Option>
                <Option :value="1">人脸认证视屏</Option>
                <Option :value="2">主机监控日志</Option>
            </Select>
        </FormItem>
        <!-- 展示结果是根据模型对应的协议自动解析的出来的选项 -->
        <FormItem label="展示结果" prop="interest">
            <CheckboxGroup v-model="formValidate.interest">
                <Checkbox :label="0">分析结果</Checkbox>
                <Checkbox :label="1">查准率</Checkbox>
                <Checkbox :label="2">查全率</Checkbox>
                <Checkbox :label="3">Cost Function</Checkbox>
                <Checkbox :label="4">Learning Rate</Checkbox>
                <Checkbox :label="5">正则方程</Checkbox>
                <Checkbox :label="6">BFGS</Checkbox>
                <Checkbox :label="7">L-BGFS</Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="生成测试报告">
            <i-switch v-model="formValidate.report" size="large" true-color="#13ce66" false-color="#ff9900">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
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
    export default {
        name: "EditTest",
        data() {
            return {
                formValidate: {
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
