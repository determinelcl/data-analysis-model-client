<template>
    <Form ref="formItem" :model="formItem" :label-width="100">
        <FormItem label="协议名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入协议名称"></Input>
        </FormItem>
        <FormItem label="类型" prop="gender">
            <RadioGroup v-model="formItem.publicType">
                <Radio :label="0">公开</Radio>
                <Radio :label="1">私有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="status" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="分组" prop="groupId">
            <Select v-model="formItem.groupId" placeholder="请选择分组"
                    filterable allow-create clearable @on-create="createGroup">
                <Option v-for="item in groupList" :key="item.id" :value="item.id" :disabled="item.status !== 0">
                    {{item.name}}
                </Option>
            </Select>
        </FormItem>
        <FormItem label="标签" prop="tagIdList">
            <Select v-model="formItem.tagIdList" placeholder="请选择标签"
                    filterable allow-create multiple @on-create="createTag">
                <Option v-for="item in tagList" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="输入协议">
            <InputProtocolForm :form-item="formItem.inputFormItem"></InputProtocolForm>
        </FormItem>
        <FormItem label="过程协议">
            <ProcessProtocolForm :form-item="formItem.processFormItem" :del-item="delProcessProtocolItem">
            </ProcessProtocolForm>
        </FormItem>
        <FormItem label="输出协议">
            <OutputProtocolForm :form-item="formItem.outputFormItem"></OutputProtocolForm>
        </FormItem>
        <FormItem label="描述" prop="desc">
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
    import InputProtocolForm from "./InputProtocolForm";
    import ProcessProtocolForm from "./ProcessProtocolForm";
    import OutputProtocolForm from "./OutputProtocolForm";
    import {errorMessage} from "../../../util/message.util";
    import {deepClone} from "../../../util/object.util";

    export default {
        name: "EditProtocol",
        components: {OutputProtocolForm, ProcessProtocolForm, InputProtocolForm},
        props: ['editType', 'formItem'],
        data() {
            return {
                delProcessProtocolItem: [],
                groupList: [],
                tagList: []
            }
        },
        computed: {
            status: {
                get() {
                    return this.formItem.status === 0
                },
                set(flag) {
                    this.formItem.status = flag ? 0 : 1
                }
            }
        },
        methods: {
            createGroup(value) {
                let item = {
                    name: value,
                    status: 0,
                    userId: this.$store.state.user.id
                }
                this.axios.post(`/classification-server/group/add`, item).then(({data}) => {
                    console.log(data);
                    this.loadGroupList();
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            createTag(value) {
                let item = {
                    name: value,
                    keyword: value,
                    userId: this.$store.state.user.id
                }
                this.axios.post(`/classification-server/tag/add`, item).then(({data}) => {
                    console.log(data);
                    this.loadTagList();
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            handleAdd() {
                let item = deepClone(this.formItem)
                item['userId'] = this.$store.state.user.id
                item.inputFormItem.type = 0
                if (item.processFormItem)
                    item.processFormItem.forEach(process => process.type = 1)
                else item.processFormItem = []

                item.outputFormItem.type = 2

                item['protocolFormatList'] = [item.inputFormItem, ...item.processFormItem, item.outputFormItem]

                item.protocolFormatList.forEach(format => {
                    if (!format.format) return
                    format.format = JSON.stringify(JSON.stringify(format.format))
                })

                // 查询用户自己的运行时服务
                this.axios.post('/protocol-server/add', item).then(({data}) => {
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleUpdate() {
                let item = deepClone(this.formItem)
                item['userId'] = this.$store.state.user.id

                this.delProcessProtocolItem.forEach(protocol => protocol['newObj'] = -1)
                item['protocolFormatList'] = [item.inputFormItem,
                    ...item.processFormItem, item.outputFormItem, ...this.delProcessProtocolItem]

                item.protocolFormatList.forEach(format => {
                    if (!format.format) return
                    format.format = JSON.stringify(format.format)
                })

                // 查询用户自己的运行时服务
                this.axios.put('/protocol-server/update', item).then(({data}) => {
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
                    publicType: 0,
                    status: 0,
                    groupId: null,
                    tagIdList: [],
                    description: '',
                    inputFormItem: {
                        name: '',
                        ioType: null,
                        ioDesc: '',
                        fileSuffix: '',
                        format: '',
                    },
                    processFormItem: [],
                    outputFormItem: {
                        name: '',
                        ioType: null,
                        ioDesc: '',
                        fileSuffix: '',
                        format: '',
                    }
                }
            },
            loadGroupList() {
                this.axios.get(`/classification-server/group/list`).then(({data}) => {
                    console.log(data)
                    this.groupList = data.data
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                })
            },
            loadTagList() {
                this.axios.get(`/classification-server/tag/list`).then(({data}) => {
                    console.log(data)
                    this.tagList = data.data
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                })
            }
        },
        mounted() {
            this.loadGroupList()
            this.loadTagList()
        }
    }
</script>

<style scoped>

</style>
