<template>
    <div>
        <Row type="flex" :gutter="1">
            <Col span="15">
                <FormItem label="主机">
                    <Input v-model="formItem.host" placeholder="请输入主机IP地址"></Input>
                </FormItem>
            </Col>
            <Col span="9">
                <FormItem label="端口">
                    <Input v-model="formItem.port" placeholder="请输入端口号"></Input>
                </FormItem>
            </Col>
        </Row>
        <FormItem label="用户名">
            <Input v-model="formItem.username" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem label="密码">
            <Input v-model="formItem.password" type="password" placeholder="请输入密码"></Input>
        </FormItem>
        <Row type="flex" :gutter="10">
            <Col span="19">
                <FormItem label="数据库">
                    <Input v-model="formItem.dbName" placeholder="请输入数据库名"></Input>
                </FormItem>
            </Col>
            <Col span="5">
                <Button type="primary" long>连接测试</Button>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "SqlForm",
        props: ['formItem']
    }
</script>

<style scoped>

</style>
