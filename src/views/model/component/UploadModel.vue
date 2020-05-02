<template>
    <div style="margin: 20px 20px 0 20px">

        <Steps :current="current">
            <Step title="基本信息"></Step>
            <Step title="模型版本"></Step>
            <Step title="上传结果"></Step>
        </Steps>
        <div style="margin: 30px 20px 0 20px" v-if="current === 0">
            <ModelForm ref="modelFormRef" :form-item="formItem" operation="add"></ModelForm>
        </div>
        <div style="margin: 30px 20px 0 20px" v-if="current === 1">
            <ModelVersion :form-item="modelVersion" operation="add"></ModelVersion>
        </div>
        <div style="margin: 30px 20px 0 20px" v-if="current === 200 || current === 500">
            <div v-if="current === 200">{{successMsg}}</div>
            <div v-if="current === 500">{{errorMsg}}</div>
        </div>

        <div style="display:flex; justify-content: flex-end; margin: 20px 20px 20px auto">

            <Button @click="prev" style="margin-right: 10px" v-if="current > 0">上一步</Button>
            <Button type="primary" @click="next" v-if="current === 0">下一步</Button>
            <Button type="primary" @click="submit" v-if="current === 1">提交</Button>
        </div>
    </div>
</template>

<script>
    import ModelVersion from "./ModelVersion";
    import ModelForm from "./ModelForm";
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "UploadModel",
        components: {ModelForm, ModelVersion},
        data() {
            return {
                current: 0,
                copyrightType: 0,
                successMsg: '添加成功',
                errorMsg: '添加失败',
                // 模型的初始版本信息
                modelVersion: {
                    name: null,
                    tag: 1,
                    publicType: 1,
                    status: 0,
                    description: null,
                    copyright: null,
                    copyrightType: 0,
                    copyrightDesc: null
                },
                // 模型组件的基础表单
                formItem: {
                    name: null,
                    publicType: 0,
                    status: 0,
                    groupId: 0,
                    tagIdList: 0,
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
                let model = deepClone(this.formItem)
                let modelVersion = deepClone(this.modelVersion)
                modelVersion.status = modelVersion.status ? 0 : 1
                model.status = model.status ? 0 : 1
                model.userId = this.$store.state.user.id

                model['versionList'] = [modelVersion]
                this.axios.post(`/model-server/add`, model).then(({data}) => {
                    console.log(data);
                    this.$emit('completeTask')
                    this.current = 200
                }).catch(error => {
                    console.log(error)
                    this.current = 500
                    this.errorMsg = errorMessage(error, this)
                })
            }
        },
        created() {
            this.current = 0
        },
        mounted() {
            this.$on('loadData', () => {
                this.$refs.modelFormRef.$emit('loadClassificationData')
            })
        }
    }
</script>

<style scoped>

</style>
