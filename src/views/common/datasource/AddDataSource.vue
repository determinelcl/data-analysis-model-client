<template>
    <Form :model="formItem" :label-width="80">
        <FormItem label="名称">
            <Input v-model="formItem.input" placeholder="Enter something..."></Input>
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
        <FormItem label="状态">
            <i-switch v-model="formItem.status" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="存储">
            <RadioGroup v-model="formItem.radio">
                <Radio :label="0">本地</Radio>
                <Radio :label="1">平台</Radio>
            </RadioGroup>
        </FormItem>
        <SqlForm :form-item="formItem" v-if="formItem.type >= 0 && formItem.type <= 11"></SqlForm>
        <FileForm v-if="formItem.type >= 12" :accept="['xls', 'csv', 'log', 'txt', 'png', 'jpg', 'jpeg']">
        </FileForm>

        <FormItem>
            <Button type="primary">提交</Button>
            <Button style="margin-left: 8px">取消</Button>
        </FormItem>
    </Form>
</template>

<script>
    import SqlForm from "./SqlForm";
    import FileForm from "./FileForm";
    export default {
        name: "AddDataSource",
        components: {FileForm, SqlForm},
        data() {
            return {
                formItem: {
                    input: '',
                    type: 0,
                    radio: 'male',
                    checkbox: [],
                    switch: true,
                    date: '',
                    time: '',
                    slider: [20, 50],
                    textarea: ''
                }
            }
        }
    }
</script>

<style scoped>

</style>
