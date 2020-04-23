<template>

    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="博文名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入计划名称"></Input>
        </FormItem>
        <FormItem label="发布状态" prop="gender">
            <RadioGroup v-model="formValidate.gender">
                <Radio :label="0">已发布</Radio>
                <Radio :label="1">未发布</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="分组" prop="city">
            <Select v-model="formValidate.city" placeholder="Select your city" filterable allow-create multiple>
                <Option :value="0">机器学习</Option>
                <Option :value="1">深度学习</Option>
                <Option :value="2">数据分析</Option>
            </Select>
        </FormItem>
        <FormItem label="标签" prop="city">
            <Select v-model="formValidate.city" placeholder="Select your city" filterable allow-create multiple>
                <Option :value="0">机器学习</Option>
                <Option :value="1">深度学习</Option>
                <Option :value="2">监督学习</Option>
            </Select>
        </FormItem>
        <FormItem label="摘要">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入博文的摘要信息"></Input>
        </FormItem>
        <FormItem label="博文正文">
            <mavon-editor v-model="content" ref="md" @imgAdd="imgAdd" @change="change" style="min-height: 300px"/>
        </FormItem>
        <FormItem label="描述" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入博文的说明信息"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>

</template>

<script>
    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'

    export default {
        name: "EditBlog",
        props: [],
        components: {
            mavonEditor,
        },
        data() {
            return {
                content: '',
                html: '',
                configs: {},
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
            },
            // 将图片上传到服务器，返回地址替换到md中
            imgAdd(pos, $file) {
                let formdata = new FormData();
                console.log(pos);
                console.log($file);
                console.log(formdata);
                // this.$upload.post('/上传接口地址', formdata).then(res => {
                //     console.log(res.data);
                //     this.$refs.md.$img2Url(pos, res.data);
                // }).catch(err => {
                //     console.log(err)
                // })
            },
            // 所有操作都会被解析重新渲染
            change(value, render) {
                // render 为 markdown 解析后的结果[html]
                this.html = render;
            },
            // 提交
            submit() {
                console.log(this.content);
                console.log(this.html);
                this.$Message.success('提交成功，已打印至控制台！');
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
