<template>
    <div>
        <Row type="flex" :gutter="1">
            <Col span="15">
                <FormItem label="主机">
                    <Input v-model="formItem.input" placeholder="Enter something..."></Input>
                </FormItem>
            </Col>
            <Col span="9">
                <FormItem label="端口">
                    <Input v-model="formItem.input" placeholder="Enter something..."></Input>
                </FormItem>
            </Col>
        </Row>
        <FormItem label="用户名">
            <Input v-model="formItem.input" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="密码">
            <Input v-model="formItem.input" placeholder="Enter something..."></Input>
        </FormItem>
        <Row type="flex" :gutter="10">
            <Col span="19">
                <FormItem label="数据库">
                    <Input v-model="formItem.input" placeholder="Enter something..."></Input>
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
