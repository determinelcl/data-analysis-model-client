<template>
    <div>
        <FormItem
                style="margin-bottom: 15px"
                :label-width="50"
                label-position="left"
                v-for="(item, index) in formDynamic.items"
                :key="item.step"
                :label="`模型${index}`"
                :prop="`model_${item.step}`">
            <Row type="flex" >
                <Col span="8">
                    <Cascader v-model="item.model" :data="modelList" :load-data="loadModelVersion"></Cascader>
                </Col>
                <Col span="12" offset="1">
                    <Button v-if="index !== 0" @click="handleRemove(item.step)" style="margin-right: 20px" >移除</Button>
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
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "ModelProcessForm",
        components: {vueJsonEditor},
        props: ['formDynamic'],
        data() {
            return {
                modelList: [],
                versionList: []
            }
        },
        methods: {
            loadModelList() {
                let param = {paged: false, userId: this.$store.state.user.id};

                // 查询用户自己的模型
                this.axios.post('/model-server/list', param).then(({data}) => {
                    this.modelList = this.switchModelData(data.data.data);
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            loadModelVersion(item, callback) {
                item.loading = true;

                // 加载模型的版本信息
                this.axios.get(`/model-server/version/list/${item.value}`).then(({data}) => {
                    item.loading = false;
                    if (!data.data)
                        return;

                    if (data.data.length === 0) return;
                    this.versionList = data.data

                    let children = []
                    let versionTagList = ['lasted', 'GA(最新)', 'GA', 'Beta', 'Snapshot']
                    data.data.forEach(version => {
                        let item = {
                            value: version.id,
                            label: `${version.name}:${versionTagList[version.type]}`
                        }

                        children.push(item)
                    })
                    item.children = children
                    callback(children);
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleAdd () {
                this.formDynamic.step++;
                this.formDynamic.items.push({
                    step: this.formDynamic.step,
                    model: [],
                    protocolTransfer: false,
                    protocolTransFlag: 1,
                    format: {},
                    protocolTransFormat: ''
                });
            },
            // 将从后端获取的数据转换为前端显示的数据的格式
            switchModelData(modelData) {
                let modelList = []
                modelData.forEach(model => {

                    let item = {
                        value: model.id,
                        label: model.name,
                        children: [],
                        loading: false
                    }

                    modelList.push(item)
                })
                return modelList
            },
            change (status) {
                this.$Message.info('开关状态：' + status);
            },
            handleRemove (index) {
                let start = this.formDynamic.items.findIndex(item => item.step === index);
                this.formDynamic.items.splice(start, 1)
            },
            onJsonChange (value) {
                console.log('value:', value)
            }
        },
        mounted() {
            this.loadModelList()
        }
    }
</script>

<style scoped>

</style>
