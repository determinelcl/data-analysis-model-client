<template>
    <Form ref="formItem" :model="formItem" :label-width="100">
        <FormItem label="名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入报表名称"></Input>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="configurationStatus" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="服务" prop="description">
            <Select v-model="formItem.serviceId" placeholder="选择运行时服务" @on-change="changeRuntimeService">
                <Option v-for="runtimeService in runtimeServiceList"
                        :key="runtimeService.id" :value="runtimeService.id">
                    {{runtimeService.name}}
                </Option>
            </Select>
        </FormItem>
        <FormItem label="报表项" prop="model">
            <ReportItemForm :form-dynamic="formItem.formDynamic"></ReportItemForm>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleAdd()" v-if="editType === 'add'">提交</Button>
            <Button type="primary" @click="handleUpdate()" v-if="editType === 'update'">更新</Button>
            <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import ReportItemForm from "./ReportItemForm";
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "EditReport",
        components: {ReportItemForm},
        props: {
            formItem: {},
            editType: {
                type: String,
                default: 'add'
            }
        },
        data() {
            return {
                runtimeServiceList: []
            }
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
            changeRuntimeService(runtimeServiceId) {
                let runtimeService = null
                this.runtimeServiceList.forEach(item => {
                    if (item.id !== runtimeServiceId) return
                    runtimeService = item
                })

                this.formItem.formDynamic.visualDataList = runtimeService.visualDataList
            },
            handleAdd() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id
                item.reportItemList = item.formDynamic.items

                // 查询用户自己的运行时服务
                this.axios.post('/report-server/add', item).then(({data}) => {
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
                item.reportItemList = item.formDynamic.items

                // 查询用户自己的运行时服务
                this.axios.put('/report-server/update', item).then(({data}) => {
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
                    status: 0,
                    serviceId: null,
                    description: '',
                    formDynamic: {
                        step: 0,
                        visualDataList: [],
                        items: [{
                            step: 0,
                            title: '',
                            visualDataId: null,
                            abscissa: 0,
                            ordinate: 0,
                            abscissaSpan: 0,
                            ordinateSpan: 0,
                            description: ''
                        }]
                    }
                }
            },
            loadRuntimeServiceData() {
                let param = {paged: false, userId: this.$store.state.user.id}

                this.axios.post('/runtime-server/list', param).then(({data}) => {
                    this.runtimeServiceList = data.data.data;
                }).catch(error => {
                    console.log(error);
                    errorMessage(error, this);
                });
            }
        },
        mounted() {
            this.loadRuntimeServiceData()
        }
    }
</script>

<style scoped>

</style>
