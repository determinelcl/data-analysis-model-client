<template>
    <div>
        <FormItem
                style="margin-bottom: 15px"
                label-width="20px"
                label-position="left"
                v-for="(item, index) in formDynamic.items"
                :key="item.id"
                :label="`模型${index}`"
                :prop="`model_${item.id}`"
                :rules="{required: true, message: 'Item ' + item.index +' can not be empty', trigger: 'blur'}">
            <Row type="flex" >
                <Col span="8">
                    <Select v-model="item.model" placeholder="Select your city">
                        <Option :value="0">图片识别</Option>
                        <Option :value="1">支持向量机</Option>
                        <Option :value="2">商品推荐</Option>
                    </Select>
                </Col>
                <Col span="12" offset="1">
                    <Button v-if="index !== 0" @click="handleRemove(item.id)" style="margin-right: 20px" >移除</Button>
                    <span>协议转换：</span>
                    <i-switch v-model="item.protocolTransfer" @on-change="change" >
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </Col>
                <Col span="24"  v-if="item.protocolTransfer">
                    <FormItem label="协议转换" prop="imgSuffix" label-position="left">
                        <vue-json-editor v-model="item.format" mode="code"
                                         :expandedOnStart="true" @json-change="onJsonChange">
                        </vue-json-editor>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem>
            <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
                </Col>
            </Row>
        </FormItem>
    </div>
</template>

<script>
    import vueJsonEditor from "vue-json-editor";

    export default {
        name: "ModelProcessForm",
        components: {vueJsonEditor},
        data() {
            return {
                formDynamic: {
                    id: 12,
                    items: [
                        {
                            id: 12,
                            value: '',
                            model: 0,
                            protocolTransfer: false,
                            format: {}
                        }
                    ]
                },
            }
        },
        methods: {

            handleAdd () {
                this.formDynamic.id++;
                this.formDynamic.items.push({
                    id: this.formDynamic.id,
                    value: '',
                    model: -1,
                    protocolTransfer: false,
                    format: {}
                });
            },
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            handleRemove (index) {
                let start = this.formDynamic.items.findIndex(item => item.id === index);
                this.formDynamic.items.splice(start, 1)
            },
            onJsonChange (value) {
                console.log('value:', value)
            }
        }
    }
</script>

<style scoped>

</style>
