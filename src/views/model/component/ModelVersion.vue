<template>
    <Form :model="formItem" :label-width="80">

        <FormItem label="版本号">
            <Input v-model="formItem.name" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="标识">
            <Select v-model="formItem.type">
                <Option :value="0">Lasted <span style="float:right;color:#ccc">最新版</span></Option>
                <Option :value="1">.GA <span style="float:right;color:#ccc">最新稳定版</span></Option>
                <Option :value="2">GA <span style="float:right;color:#ccc">稳定版</span></Option>
                <Option :value="3">Beta <span style="float:right;color:#ccc">测试版</span></Option>
                <Option :value="4">Snapshot <span style="float:right;color:#ccc">快照版</span></Option>
            </Select>
        </FormItem>
        <FormItem label="类型">
            <RadioGroup v-model="formItem.public">
                <Radio :label="0">公开</Radio>
                <Radio :label="1">私有</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="状态">
            <i-switch v-model="formItem.status" size="large" true-color="#13ce66" false-color="#ff4949">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </i-switch>
        </FormItem>
        <FormItem label="模型">
            <Upload multiple type="drag" action="upload/model/">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传模型</p>
                </div>
            </Upload>
        </FormItem>
        <FormItem label="I/O协议">
            <Select v-model="formItem.protocolId">
                <Option :value="0">Lasted <span style="float:right;color:#ccc">最新版</span></Option>
                <Option :value="1">.GA <span style="float:right;color:#ccc">最新稳定版</span></Option>
                <Option :value="2">GA <span style="float:right;color:#ccc">稳定版</span></Option>
                <Option :value="3">Beta <span style="float:right;color:#ccc">测试版</span></Option>
                <Option :value="4">Snapshot <span style="float:right;color:#ccc">快照版</span></Option>
            </Select>
        </FormItem>
        <FormItem label="版本描述">
            <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入" :rows="4"></Input>
        </FormItem>
        <FormItem label="版权标识">
            <Input v-model="formItem.copyright" placeholder="请输入版权唯一标识：专利号、著作权号、其他"></Input>
        </FormItem>
        <FormItem label="类型">
            <RadioGroup v-model="formItem.copyrightType">
                <Radio :label="0">专利</Radio>
                <Radio :label="1">著作权</Radio>
                <Radio :label="2">其他</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="版权图片">
            <Upload multiple type="drag" action="upload/model/">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传图片</p>
                </div>
            </Upload>
        </FormItem>
        <FormItem label="版权描述" v-if="formItem.copyrightType === 2">
            <Input v-model="formItem.copyrightDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入" :rows="4"></Input>
        </FormItem>
        <FormItem v-if="operation === 'update'">
            <Button type="primary" @click="handleSubmit('formValidate')">更新</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "ModelVersion",
        props: ['formItem', 'operation'],
        data() {
            return {
                originForm: null,
                protocolList: []
            }
        },
        methods: {
            handleSubmit() {
                let version = deepClone(this.formItem);
                // 上传的模型的url
                version['modelUrl'] = '';
                // 模型文件的大小
                version['modelSize'] = '';
                // 模型的版权图片的url
                version['copyrightImg'] = '';
                // 模型版权图片的大小
                version['copyrightImgSize'] = '';

                this.axios.post(`/model-server/version/add`, this.formItem).then(({data}) => {
                    this.versionList = data.data;
                    this.versionList[0]['_expanded'] = true
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            handleReset() {
                this.formItem = deepClone(this.originForm)
            },
            loadProtocolList() {
                // 加载模型版本列表数据
                this.axios.post(`/protocol-server/list`, {}).then(({data}) => {
                    this.protocolList = data.data.data;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            }
        },
        created() {
            this.originForm = deepClone(this.formItem)
            this.loadProtocolList()
        }
    }
</script>

<style scoped>

</style>
