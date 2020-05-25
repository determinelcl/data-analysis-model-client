<template>
    <Form ref="formItem" :model="formItem" :label-width="100">
        <FormItem label="服务名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入运行时服务名称"></Input>
        </FormItem>
        <FormItem label="运行类型">
            <RadioGroup v-model="formItem.type">
                <Radio :label="0">数据分析</Radio>
                <Radio :label="1">学习系统</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="公开类型">
            <RadioGroup v-model="formItem.publicType">
                <Radio :label="0">公开</Radio>
                <Radio :label="1">私有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="服务配置" prop="configId">
            <Select v-model="formItem.configId" placeholder="选择服务配置" @on-change="changeServiceConfig">
                <Option v-for="serviceConfig in serviceConfigList" :key="serviceConfig.id"
                        :value="serviceConfig.id">{{serviceConfig.name}}
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
        <FormItem label="展示结果" prop="protocolFormatIdList">
            <CheckboxGroup v-model="formItem.protocolFormatIdList">
                <Checkbox v-for="protocol in protocolList" :key="protocol.id" :label="protocol.id">
                    {{protocol.name}}
                </Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="内存需求" prop="memory">
            <Input v-model="formItem.memory" :disabled="editType === 'update'"
                   :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入运行服务的内存需求">
            </Input>
        </FormItem>
        <FormItem label="计算需求" prop="calculate">
            <Input v-model="formItem.calculate" :disabled="editType === 'update'"
                   :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入运行服务的计算资源的需求">
            </Input>
        </FormItem>
        <FormItem label="集群部署" prop="clusterFlag">
            <i-switch v-model="clusterFlag" :disabled="editType === 'update'"
                      size="large" :true-color="'#13ce66'" :false-color="'#ff9900'">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </i-switch>
        </FormItem>
        <FormItem label="服务节点数量" prop="serviceNode">
            <Input v-model="formItem.serviceNode" :disabled="editType === 'update'"
                   :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入运行服务的节点数量">
            </Input>
        </FormItem>
        <FormItem label="负载均衡" prop="loadBalanceFlag">
            <i-switch v-model="loadBalanceFlag" :disabled="editType === 'update'"
                      size="large" :true-color="'#13ce66'" :false-color="'#ff9900'">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
            </i-switch>
        </FormItem>
        <FormItem label="描述" prop="description">
            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入运行服务的说明信息"></Input>
        </FormItem>
        <FormItem v-if="editType === 'update'">
            <Button type="primary" @click="handleUpdate()" v-if="editType === 'update'">更新</Button>
            <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";
    import {deepClone} from "../../../util/object.util";

    export default {
        name: "OperationForm",
        props: ['formItem', 'editType'],
        data() {
            return {
                serviceConfigList: [],
                datasourceList: [],
                protocolList: []
            }
        },
        computed: {
            clusterFlag: {
                get() {
                    return this.formItem.clusterFlag === 0
                },
                set(flag) {
                    this.formItem.clusterFlag = flag ? 0 : 1
                }
            },
            loadBalanceFlag: {
                get() {
                    return this.formItem.loadBalanceFlag === 0
                },
                set(flag) {
                    this.formItem.loadBalanceFlag = flag ? 0 : 1
                }
            }
        },
        methods: {
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
            handleUpdate() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id

                // 查询用户自己的运行时服务
                this.axios.put('/runtime-server/update', item).then(({data}) => {
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleReset() {
                this.formItem = {
                    name: null,
                    type: 0,
                    publicType: 1,
                    status: 2,
                    configId: null,
                    datasourceId: null,
                    memory: 256,
                    calculate: 256,
                    clusterFlag: 0,
                    serviceNode: 3,
                    loadBalanceFlag: 0,
                    description: '',
                    countCompleteTask : 0,
                    protocolFormatIdList: []
                }
            }
        },
        mounted() {
            this.loadServiceConfigurationList()
            this.loadDatasourceList()

            this.$on('changeServiceConfig', (configId) => {
                let param = {paged: false, userId: this.$store.state.user.id};

                // 查询用户自己的运行时服务
                this.axios.post('/configuration-server/list', param).then(({data}) => {
                    this.serviceConfigList = data.data.data
                    this.changeServiceConfig(configId)
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            })
        }
    }
</script>

<style scoped>

</style>
