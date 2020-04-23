<template>
    <div>
        <Row>
            <Col span="24">
                <FormItem label="输出名称" prop="imgSuffix" label-position="left" label-width="69">
                    <Input v-model="formItem.name" placeholder="请输入输出数据的名称"/>
                </FormItem>
            </Col>
        </Row>
        <Row type="flex" justify="space-between">
            <Col span="11">
                <FormItem label="输出类型" prop="inputType" label-position="left" label-width="69">
                    <Select v-model="formItem.outputType" filterable transfer>
                        <Option :value="0">图表</Option>
                        <Option :value="1">文本</Option>
                        <Option :value="2">图片</Option>
                        <Option :value="3">矩阵</Option>
                        <Option :value="4">语音</Option>
                        <Option :value="5">流数据</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="11">
                <FormItem label="协议说明" prop="imgSuffix" label-position="left" label-width="69">
                    <Input v-model="formItem.description" placeholder="输入数据的格式说明，可以是特征值的说明"/>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24"  v-if="formItem.outputType === 0">
                <FormItem label="图表数据格式" prop="imgSuffix" label-position="left">
                    <vue-json-editor v-model="formItem.format" mode="code"
                                     :expandedOnStart="true" @json-change="onJsonChange">
                    </vue-json-editor>
                </FormItem>
            </Col>
        </Row>
    </div>
</template>

<script>
    import vueJsonEditor from "vue-json-editor";

    export default {
        name: "OutputProtocolForm",
        components: {vueJsonEditor},
        props: ['formItem'],
        data() {
            return {
            }
        },
        methods: {
            onJsonChange (value) {
                console.log('value:', value)
            }
        }
    }
</script>

<style scoped>

</style>
