<template>
    <div style="margin: 20px 20px 0 20px">

        <Steps :current="current">
            <Step title="基本信息"></Step>
            <Step title="支付信息"></Step>
            <Step title="完成"></Step>
        </Steps>
        <div style="margin: 30px 20px 0 20px" v-if="current === 0">
            <OperationForm edit-type="add"></OperationForm>
        </div>
        <div style="margin: 30px 20px 0 20px" v-if="current === 1">
            支付信息
        </div>
        <div style="margin: 30px 20px 0 20px" v-if="current === 2">
            服务启动运行
        </div>

        <div style="display:flex; justify-content: flex-end; margin: 20px 20px 20px auto">

            <Button @click="prev" style="margin-right: 10px" v-if="current > 0">上一步</Button>
            <Button type="primary" @click="next" v-if="current === 0">下一步</Button>
            <Button type="primary" @click="submit" v-if="current === 1">提交</Button>
        </div>
    </div>
</template>

<script>
    import OperationForm from "./OperationForm";
    export default {
        name: "EditOperation",
        components: {OperationForm},
        data() {
            return {
                current: 0,
                copyrightType: 0,
                modelVersion: {
                    name: null,
                    tag: 1,
                    public: 1,
                    status: true,
                    description: null,
                    copyright: null,
                    copyrightType: 0,
                    copyrightDesc: null
                },
                formItem: {
                    name: null,
                    public: 0,
                    status: true,
                    groupId: 0,
                    tagId: 0,
                    git: null,
                    description: null
                }
            }
        },
        methods: {
            prev() {
                if (this.current === 0) {
                    this.current = 2;
                } else {
                    this.current -= 1;
                }
            },
            next() {
                if (this.current === 2) {
                    this.current = 0;
                } else {
                    this.current += 1;
                }
            },
            submit() {

            }
        }

    }
</script>

<style scoped>

</style>
