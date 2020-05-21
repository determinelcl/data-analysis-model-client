<template>
    <Form :model="formItem" :label-width="80">
        <FormItem label="名称">
            <Input v-model="formItem.name" placeholder="请输入数据源名称"></Input>
        </FormItem>
        <FormItem label="类型">
            <Select v-model="formItem.type">
                <OptionGroup label="数据库">
                    <Option :value="0">Mysql</Option>
                    <Option :value="1">MongoDB</Option>
                    <Option :value="2">Apache Hive</Option>
                    <Option :value="3">Redis</Option>
                    <Option :value="4">MariaDB</Option>
                    <Option :value="5">PostgreSQL</Option>
                    <Option :value="6">Oracle</Option>
                    <Option :value="7">Microsoft SQL Server</Option>
                    <Option :value="8">IBM Db2</Option>
                    <Option :value="9">HSQLDB</Option>
                    <Option :value="10">H2</Option>
                    <Option :value="11">Apache Derby</Option>
                </OptionGroup>
                <OptionGroup label="文件">
                    <Option :value="12">excel</Option>
                    <Option :value="13">csv</Option>
                    <Option :value="14">log</Option>
                    <Option :value="15">txt</Option>
                    <Option :value="16">image</Option>
                </OptionGroup>
            </Select>
        </FormItem>
        <FormItem label="公开类型">
            <RadioGroup v-model="formItem.publicType">
                <Radio :label="0">公开</Radio>
                <Radio :label="1">私有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="datasourceStatus" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="存储">
            <RadioGroup v-model="storeType">
                <Radio :label="0" :disabled="formItem.type >= 12">本地</Radio>
                <Radio :label="1">平台</Radio>

            </RadioGroup>
        </FormItem>
        <SqlForm :form-item="formItem" v-if="formItem.type >= 0 && formItem.type <= 11"></SqlForm>
        <FileForm v-if="formItem.type >= 12"
                  :accept="['xls', 'csv', 'log', 'txt', 'png', 'jpg', 'jpeg', 'gif']" :file="formItem">
        </FileForm>
        <FormItem label="描述">
            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入数据源描述信息" :rows="4"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit" v-if="type === 'add'">提交</Button>
            <Button type="primary" @click="handleUpdate" v-if="type === 'update'">更新</Button>
            <Button style="margin-left: 8px" @click="handleCancel">取消</Button>
        </FormItem>
    </Form>
</template>

<script>
    import SqlForm from "./SqlForm";
    import FileForm from "./FileForm";
    import {errorMessage} from "../../../util/message.util";
    import {deepClone} from "../../../util/object.util";

    export default {
        name: "AddDataSource",
        components: {FileForm, SqlForm},
        props: ['type', 'formItem'],
        computed: {
            storeType: {
                get() {
                    return this.formItem.type >= 0 && this.formItem.type <= 11 ? 0 : 1
                },
                set(storeType) {
                    this.formItem.storeType = storeType;
                }
            },
            datasourceStatus: {
                get() {
                    return this.formItem.status === 0
                },
                set(status) {
                    this.formItem.status = status ? 0 : 1
                }
            }
        },
        methods: {
            handleSubmit() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id

                this.axios.post(`/datasource-server/add`, item).then(({data}) => {
                    console.log(data);
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            handleUpdate() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id

                this.axios.put(`/datasource-server/update`, item).then(({data}) => {
                    console.log(data);
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            handleCancel() {
                this.$emit('cancelTask');
            }
        }
    }
</script>

<style scoped>

</style>
