<template>
    <Form ref="formItem" :model="formItem" :label-width="100">
        <FormItem label="服务名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入计划名称"></Input>
        </FormItem>
        <FormItem label="运行类型">
            <RadioGroup v-model="formItem.public">
                <Radio :label="0">数据分析</Radio>
                <Radio :label="1">学习系统</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="服务" prop="city">
            <Select v-model="formItem.city" placeholder="Select your city">
                <Option :value="0">图片识别服务</Option>
                <Option :value="1">支持向量机服务</Option>
                <Option :value="2">商品推荐服务</Option>
            </Select>
        </FormItem>
        <FormItem label="数据源" prop="city">
            <Select v-model="formItem.city" placeholder="Select your city">
                <Option :value="0">数字图片</Option>
                <Option :value="1">人脸认证视屏</Option>
                <Option :value="2">主机监控日志</Option>
            </Select>
        </FormItem>
        <!-- 展示结果是根据模型对应的协议自动解析的出来的选项 -->
        <FormItem label="展示结果" prop="interest">
            <CheckboxGroup v-model="formItem.interest">
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
        <FormItem label="内存需求" prop="desc">
            <Input v-model="formItem.desc" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入运行服务的内存需求">
            </Input>
        </FormItem>
        <FormItem label="计算需求" prop="desc">
            <Input v-model="formItem.desc" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入运行服务的计算资源的需求">
            </Input>
        </FormItem>
        <FormItem label="集群部署" prop="desc">
            <i-switch v-model="formItem.status" size="large" :true-color="'#13ce66'" :false-color="'#ff9900'">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </i-switch>
        </FormItem>
        <FormItem label="服务节点数量" prop="desc">
            <Input v-model="formItem.desc" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入运行服务的节点数量">
            </Input>
        </FormItem>
        <FormItem label="负载均衡" prop="desc">
            <i-switch v-model="formItem.status" size="large" :true-color="'#13ce66'" :false-color="'#ff9900'">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </i-switch>
        </FormItem>
        <FormItem label="描述" prop="desc">
            <Input v-model="formItem.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入运行服务的说明信息"></Input>
        </FormItem>
        <FormItem v-if="editType === 'update'">
            <Button type="primary" @click="handleSubmit('formItem')">提交</Button>
            <Button @click="handleReset('formItem')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    export default {
        name: "OperationForm",
        props: ['editType'],
        data() {
            return {
                formItem: {
                    name: '',
                    mail: '',
                    city: '',
                    gender: '',
                    interest: [],
                    status: true,
                    date: '',
                    report: true,
                    time: '',
                    desc: ''
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
