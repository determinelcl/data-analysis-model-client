<template>
    <Form :model="formItem" :label-width="80">
        <FormItem label="模型名称">
            <Input v-model="formItem.name" placeholder="请输入模型名称"></Input>
        </FormItem>
        <FormItem label="模型类型">
            <RadioGroup v-model="formItem.type">
                <Radio :label="0">分析</Radio>
                <Radio :label="1">学习</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="公开类型">
            <RadioGroup v-model="formItem.publicType">
                <Radio :label="0">公开</Radio>
                <Radio :label="1">私有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="versionStatus" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="分组">
            <Select v-model="formItem.groupId" filterable allow-create clearable @on-create="createGroup">
                <Option v-for="item in groupList" :key="item.id" :value="item.id" :disabled="item.status !== 0">
                    {{item.name}}
                </Option>
            </Select>
        </FormItem>
        <FormItem label="标签">
            <Select v-model="tagIdList" filterable allow-create multiple @on-create="createTag">
                <Option v-for="item in tagList" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="GIT地址">
            <Input v-model="formItem.git" placeholder="请输入模型名称"></Input>
        </FormItem>
        <FormItem label="模型描述">
            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入" :rows="4"></Input>
        </FormItem>
        <FormItem v-if="operation === 'update'">
            <Button type="primary" @click="handleSubmit('formValidate')">更新</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";
    import {deepClone} from "../../../util/object.util";

    export default {
        name: "ModelForm",
        props: ['formItem', 'operation'],
        data() {
            return {
                groupList: [],
                tagList: [],
                originForm: null,
            }
        },
        computed: {
            versionStatus: {
                get() {
                    return this.formItem.status === 0
                },
                set(status) {
                    this.formItem.status = status ? 0 : 1
                }
            },
            tagIdList: {
                get() {
                    let idList = []
                    if (this.formItem.tagList)
                        this.formItem.tagList.forEach(tag => idList.push(tag.id))
                    return idList
                },
                set(idList) {
                    this.formItem.tagIdList = idList
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
            handleSubmit() {
                this.axios.put(`/model-server/update`, this.formItem).then(({data}) => {
                    console.log(data);
                    this.$emit('addSuccess')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            handleReset() {
                this.formItem = deepClone(this.originForm)
            },
            loadGroupList() {
                this.axios.get(`/classification-server/group/list`).then(({data}) => {
                    console.log(data);
                    this.groupList = data.data
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            loadTagList() {
                this.axios.get(`/classification-server/tag/list`).then(({data}) => {
                    console.log(data);
                    this.tagList = data.data
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            }
        },
        mounted() {
            this.originForm = deepClone(this.formItem);
            console.log(this.originForm)
            this.$on('loadClassificationData', () => {
                this.loadGroupList()
                this.loadTagList()
            })
        }
    }
</script>

<style scoped>

</style>
