<template>
    <Form ref="formItemRef" :model="formItem" :label-width="100">
        <FormItem label="计划名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入计划名称"></Input>
        </FormItem>
        <FormItem label="触发类型" prop="triggerType">
            <RadioGroup v-model="formItem.triggerType">
                <Radio :label="0">自动</Radio>
                <Radio :label="1">手动</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="开始时间" prop="date" v-if="formItem.triggerType === 0">
            <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择计划的开始时间" style="width: 100%" v-model="formItem.triggerTime">
            </DatePicker>
        </FormItem>
        <FormItem label="模型" prop="mdoelId" v-if="objectType === 'model'">
            <Cascader v-model="formItem.model" :data="modelList" :load-data="loadModelVersion"
                      @on-change="changeModelVersion"></Cascader>
        </FormItem>

        <FormItem label="服务" prop="serviceId" v-if="objectType === 'service'">
            <Select v-model="formItem.targetId" placeholder="选择服务配置">
                <Option v-for="serviceConfig in serviceConfigList" :key="serviceConfig.id"
                        :value="serviceConfig.id" @on-change="changeServiceConfig">{{serviceConfig.name}}
                </Option>
            </Select>
        </FormItem>
        <FormItem label="数据源" prop="datasourceId">
            <Select v-model="formItem.datasourceId" placeholder="选择数据源">
                <Option v-for="datasource in datasourceList" :key="datasource.id" :value="datasource.id">
                    {{datasource.name}}
                </Option>
            </Select>
        </FormItem>
        <!-- 展示结果是根据模型对应的协议自动解析的出来的选项 -->
        <FormItem label="展示结果" prop="protocolIdList">
            <CheckboxGroup v-model="formItem.protocolFormatIdList">
                <Checkbox v-for="protocol in protocolList" :key="protocol.id" :label="protocol.id">
                    {{protocol.name}}
                </Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="生成测试报告" prop="reportFlag">
            <i-switch v-model="reportFlag" size="large" true-color="#13ce66" false-color="#ff9900">
                <span slot="open">是</span>
                <span slot="close">否</span>
            </i-switch>
        </FormItem>
        <FormItem label="描述" prop="description">
            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入测试计划的说明信息"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleAdd()" v-if="editType === 'add'">提交</Button>
            <Button type="primary" @click="handleUpdate()" v-if="editType === 'update'">更新</Button>
            <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";
    import {deepClone} from "../../../util/object.util";
    import {formatDateTime} from "../../../util/datetime.util";

    export default {
        name: "EditTest",
        props: {
            objectType: {
                type: String,
                default: 'model'
            },
            editType: {
                type: String,
                default: 'add'
            },
            formItem: {}
        },
        data() {
            return {
                modelList: [],
                versionList: [],
                serviceConfigList: [],
                datasourceList: [],
                protocolList: []
            }
        },
        computed: {
            reportFlag: {
                get() {
                    return this.formItem.reportFlag === 0
                },
                set(flag) {
                    this.formItem.reportFlag = flag ? 0 : 1
                }
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
            loadServiceConfigurationList() {
                let param = {paged: false, userId: this.$store.state.user.id};

                // 查询用户自己的运行时服务
                this.axios.post('/configuration-server/list', param).then(({data}) => {
                    this.serviceConfigList = data.data.data;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            loadDatasourceList() {
                let param = {paged: false, userId: this.$store.state.user.id};

                this.axios.post('/datasource-server/list', param).then(({data}) => {
                    this.datasourceList = data.data.data;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            changeModelVersion(value, selectedData) {
                console.log(selectedData)

                let version = null
                this.versionList.forEach(item => {
                    if (!value.includes(item.id)) return
                    version = item
                })

                if (version == null) return

                this.protocolList = version.protocol.protocolFormatList.filter(item => item.type !== 0)
            },
            changeServiceConfig(configId) {
                let config = null
                this.serviceConfigList.forEach(item => {
                    if (item.id !== configId) return
                    config = item
                })

                // 获取最后一步的模型编排的模型
                let max = -1
                let makeUp = null
                config.makeUpList.forEach(item => {
                    if (max > item.step) return

                    max = item.step
                    makeUp = item
                })

                if (makeUp == null) return
                this.protocolList = makeUp.version.protocol.protocolFormatList.filter(item => item.type !== 0)
            },
            handleAdd() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id
                if (item.triggerType === 0)
                    item.triggerTime = formatDateTime(item.triggerTime)
                else item.triggerTime = null

                if (this.objectType === 'model') {
                    item.targetId = item.model[item.model.length - 1]
                    item['targetType'] = 0
                    item['type'] = 0
                } else {
                    item['targetType'] = 1
                    item['type'] = 1
                }

                // 查询用户自己的运行时服务
                this.axios.post('/test-server/add', item).then(({data}) => {
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleUpdate() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id

                if (item.triggerType === 0)
                    item.triggerTime = formatDateTime(item.triggerTime)
                else item.triggerTime = null

                if (this.objectType === 'model') {
                    item.targetId = item.model[item.model.length - 1]
                    item['targetType'] = 0
                    item['type'] = 0
                } else {
                    item['targetType'] = 1
                    item['type'] = 1
                }

                // 查询用户自己的运行时服务
                this.axios.put('/test-server/update', item).then(({data}) => {
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleReset() {
                this.formItem = {
                    name: '',
                    triggerType: 0,
                    triggerTime: null,
                    targetId: null,
                    model: [],
                    datasourceId: null,
                    protocolFormatIdList: [],
                    reportFlag: 0,
                    description: ''
                }
            }
        },
        mounted() {
            this.loadDatasourceList()
            if (this.objectType === 'model') this.loadModelList()
            else if (this.objectType === 'service') this.loadServiceConfigurationList()
        }
    }
</script>

<style scoped>

</style>
