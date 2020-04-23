<template>
    <div>
        <Row type="flex" justify="space-between">
            <Col span="11">
                <FormItem label="输入类型" prop="inputType" label-position="left" label-width="69">
                    <Select v-model="formItem.inputType" filterable>
                        <Option :value="0">Sql</Option>
                        <Option :value="1">文本</Option>
                        <Option :value="2">图片</Option>
                        <Option :value="3">矩阵</Option>
                        <Option :value="4">语音</Option>
                        <Option :value="5">流数据</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="11">
                <FormItem label="输入协议说明" prop="imgSuffix" label-position="left">
                    <Input v-model="formItem.description" placeholder="输入数据的格式说明，可以是特征值的说明">
                    </Input>
                </FormItem>
            </Col>
        </Row>
        <Row type="flex" justify="space-between">
            <Col span="11"  v-if="[1, 2, 4].indexOf(formItem.inputType, 0) > -1">
                <FormItem label="数据文件后缀" prop="imgSuffix" label-position="left">
                    <Input v-model="formItem.suffix" placeholder="请输入后缀名称，多个后缀使用逗号(英文中的逗号)进行分割">
                    </Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="24"  v-if="[2, 4, 5].indexOf(formItem.inputType, 0) === -1">
                <FormItem label="输入数据格式" prop="imgSuffix" label-position="left">
                    <vue-json-editor v-model="formItem.format" mode="code"
                                     :expandedOnStart="true" @json-change="onJsonChange">
                    </vue-json-editor>
                </FormItem>
            </Col>
        </Row>
    </div>

</template>

<script>
    import vueJsonEditor from 'vue-json-editor'
    export default {
        name: "InputProtocolForm",
        components: {vueJsonEditor},
        data() {
            return {
                formItem: {
                    inputType: 0,
                    suffix: null,
                    description: null,
                    format: {}
                }
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
