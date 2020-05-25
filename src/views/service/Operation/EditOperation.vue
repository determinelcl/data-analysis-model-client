<template>
    <div style="margin: 20px 20px 0 20px; position: relative">
        <Spin fix v-if="spinShow">
            <LoadingIcon></LoadingIcon>
        </Spin>

        <Steps :current="current">
            <Step title="基本信息"></Step>
            <Step title="支付信息"></Step>
            <Step title="完成"></Step>
        </Steps>
        <div style="margin: 30px 20px 0 20px" v-show="current === 0">
            <OperationForm :form-item="formItem" edit-type="add"></OperationForm>
        </div>
        <div style="margin: 30px 20px 0 20px" v-if="current === 1">
            {{order}}
        </div>
        <div style="margin: 30px 20px 0 20px" v-if="current === 2">
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 24px;">
                <Icon type="ios-checkmark-circle" size="80" :color="'#19be6b'"/>
            </div>
            <div style="color: #17233d; font-weight: 500; font-size: 24px; line-height: 32px; margin-bottom: 16px; text-align: center">
                添加成功
            </div>
        </div>

        <div style="display:flex; justify-content: flex-end; margin: 20px 20px 20px auto">
            <Button type="primary" @click="next" v-if="current === 0">下一步</Button>
            <Button type="primary" @click="next" v-if="current === 1">完成</Button>
        </div>
    </div>
</template>

<script>
    import OperationForm from "./OperationForm";
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";
    import LoadingIcon from "../../../components/LoadingIcon";

    export default {
        name: "EditOperation",
        components: {LoadingIcon, OperationForm},
        props: ['formItem'],
        data() {
            return {
                spinShow: false,
                current: 0,
                order: {}
            }
        },
        methods: {
            next() {
                if (this.current === 2) {
                    this.current = 0
                } else if (this.current === 0){
                    this.submit()
                } else this.current += 1
            },
            submit() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id

                this.spinShow = true
                // 查询用户自己的运行时服务
                this.axios.post('/runtime-server/add', item).then(({data}) => {
                    console.log(data.data)
                    // 生成订单
                    return this.axios.put(`/payment-server/add/${item.userId}/${data.data.id}`)
                }).then(({data}) => {
                    console.log(data)
                    this.order = data.data
                    this.current = 1
                    this.spinShow = false
                }).catch(error => {
                    console.log(error)
                    this.spinShow = false
                    errorMessage(error, this)
                });
            }
        },
        created() {
            this.current = 0
        },
    }
</script>

<style scoped>

</style>
