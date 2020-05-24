<template>
    <div>
        <Form ref="formCustom" :model="formItem" :label-width="80">

            <Row>
                <Col span="24">
                    <FormItem label="输出名称" prop="name" label-position="top" :label-width="69">
                        <Input v-model="formItem.name" placeholder="请输入输出数据的名称"/>
                    </FormItem>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col span="11">
                    <FormItem label="输出类型" prop="ioType" label-position="top" :label-width="69">
                        <Select v-model="formItem.ioType" filterable transfer>
                            <Option :value="1">图表</Option>
                            <Option :value="2">文本</Option>
                            <Option :value="3">图片</Option>
                            <Option :value="4">矩阵</Option>
                            <Option :value="5">语音</Option>
                            <Option :value="6">流数据</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="11">
                    <FormItem label="协议说明" prop="ioDesc" label-position="top" :label-width="69">
                        <Input v-model="formItem.ioDesc" placeholder="输入数据的格式说明，可以是特征值的说明"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24" v-if="formItem.ioType === 1">
                    <FormItem label="图表数据格式" prop="format" label-position="top" :label-width="100">
                        <vue-json-editor v-model="formItem.format" mode="code"
                                         :expandedOnStart="true" @json-change="onJsonChange">
                        </vue-json-editor>
                    </FormItem>
                </Col>
            </Row>
            <FormItem>
                <Button type="primary" @click="handleCheck" v-if="operation === 'checked'">确定</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import vueJsonEditor from "vue-json-editor";

    export default {
        name: "OutputProtocolForm",
        components: {vueJsonEditor},
        props: {
            formItem: {},
            operation: {
                type: String,
                default: ''
            }
        },
        data() {
            return {}
        },
        methods: {
            onJsonChange(value) {
                console.log('value:', value)
            },
            handleCheck() {
                this.$emit('completeTask', this.formItem)
            }
        }
    }
</script>

<style scoped>

</style>
