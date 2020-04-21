<template>
    <div style="margin: 20px 20px 0 20px">

        <Steps :current="current">
            <Step title="基本信息"></Step>
            <Step title="模型版本"></Step>
            <Step title="版权信息"></Step>
        </Steps>
        <div style="margin: 30px 20px 0 20px" v-if="current === 0">
            <ModelForm :form-item="formItem" operation="add"></ModelForm>
        </div>
        <div style="margin: 30px 20px 0 20px" v-if="current === 1">
            <ModelVersion :form-item="modelVersion" operation="add"></ModelVersion>
        </div>
        <div style="margin: 30px 20px 0 20px" v-if="current === 2">
            <Form :model="formItem" :label-width="80">

            </Form>
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
    export default {
        name: "UploadModel",
        components: {ModelForm, ModelVersion},
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
