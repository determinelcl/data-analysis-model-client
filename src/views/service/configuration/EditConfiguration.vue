<template>
    <Form ref="formItem" :model="formItem" :label-width="100">
        <FormItem label="服务名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入服务配置名称"></Input>
        </FormItem>
        <FormItem label="公开类型">
            <RadioGroup v-model="formItem.publicType">
                <Radio :label="0">公开</Radio>
                <Radio :label="1">私有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="configurationStatus" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="模型" prop="model">
            <ModelProcessForm :form-dynamic="formItem.formDynamic"></ModelProcessForm>
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
    import ModelProcessForm from "./ModelProcessForm";
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "EditConfiguration",
        components: {ModelProcessForm},
        props: {
            formItem: {},
            editType: {
                type: String,
                default: 'add'
            }
        },
        data() {
            return {}
        },
        computed: {
            configurationStatus: {
                get() {
                    return this.formItem.status === 0
                },
                set(status) {
                    this.formItem.status = status ? 0 : 1
                }
            }
        },
        methods: {
            handleAdd() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id
                item.formDynamic.items.forEach(makeUp => {
                    makeUp.id = null
                    makeUp.protocolTransFlag = makeUp.protocolTransfer ? 0 : 1
                    makeUp.modelVersionId = makeUp.model[makeUp.model.length - 1]
                    makeUp.protocolTransFormat = JSON.stringify(makeUp.format)
                })

                item.makeUpList = item.formDynamic.items

                // 查询用户自己的运行时服务
                this.axios.post('/configuration-server/add', item).then(({data}) => {
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

                item.formDynamic.items.forEach(makeUp => {
                    makeUp.id = null
                    makeUp.protocolTransFlag = makeUp.protocolTransfer ? 0 : 1
                    makeUp.modelVersionId = makeUp.model[makeUp.model.length - 1]

                    if (!makeUp.protocolTransfer || !makeUp.format) return
                    makeUp.protocolTransFormat = JSON.stringify(makeUp.format)
                })

                item.makeUpList = item.formDynamic.items

                // 查询用户自己的运行时服务
                this.axios.put('/configuration-server/update', item).then(({data}) => {
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
                    publicType: 0,
                    status: 0,
                    gender: '',
                    description: '',
                    formDynamic: {
                        step: 0,
                        items: [{
                            step: 0,
                            model: [],
                            protocolTransfer: false,
                            protocolTransFlag: 1,
                            format: {},
                            protocolTransFormat: ''
                        }]
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
