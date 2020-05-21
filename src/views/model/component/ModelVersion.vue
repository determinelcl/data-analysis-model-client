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
        <FormItem label="模型">
            <Upload action="http://localhost:9000/filesystem-server/upload"
                    :format="acceptPy" show-upload-list
                    :headers="tokenParam"
                    :on-success="handleModelSuccess"
                    :on-error="handleModelError">
                <Button icon="ios-cloud-upload-outline">上传数据分析模型文件</Button>
            </Upload>
        </FormItem>
        <FormItem label="I/O协议">
            <Select v-model="protocol">
                <Option v-for="protocol in protocolList" :key="protocol.id" :value="protocol.id">
                    {{protocol.name}} <span style="float:right;color:#ccc">最新版</span>
                </Option>
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
            <Upload multiple type="drag" action="http://localhost:9000/filesystem-server/upload"
                    :format="acceptImage" show-upload-list
                    :headers="tokenParam"
                    :on-success="handleImgSuccess"
                    :on-error="handleImgError">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传版权图片</p>
                </div>
            </Upload>
        </FormItem>
        <FormItem label="版权描述" v-if="formItem.copyrightType === 2">
            <Input v-model="formItem.copyrightDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入" :rows="4"></Input>
        </FormItem>
        <FormItem v-if="operation === 'update'">
            <Button type="primary" @click="updateVersion()" v-if="formItem.id > -1">更新</Button>
            <Button type="primary" @click="addVersion()" v-if="formItem.id === -1">添加</Button>
            <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>

<script>
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";
    import {TOKEN_INFORMATION} from "../../../constant/system";

    export default {
        name: "ModelVersion",
        props: ['formItem', 'operation'],
        data() {
            return {
                modelUrl: '',
                modelSize: 0,
                imageUrl: '',
                imageSize: 0,
                acceptPy: ['py'],
                acceptImage: ['png', 'jpg', 'jpeg'],
                originForm: null,
                token: TOKEN_INFORMATION,
                protocolList: []
            }
        },
        computed: {
            tokenParam: {
                get() {
                    let tokenInformation = localStorage.getItem(TOKEN_INFORMATION)
                    if (tokenInformation && JSON.parse(tokenInformation).access_token)
                        return {'Authorization': `Bearer ${JSON.parse(tokenInformation).access_token}`}
                    return {}
                }
            },
            versionStatus: {
                get() {
                    return this.formItem.status === 0
                },
                set(status) {
                    this.formItem.status = status ? 0 : 1
                }
            },
            protocol: {
                get() {
                    if (this.formItem.protocol)
                        return this.formItem.protocol.id

                    return this.formItem.protocolId
                },
                set(protocolId) {
                    this.formItem.protocolId = protocolId
                }
            }
        },
        methods: {
            updateVersion() {
                let version = deepClone(this.formItem);
                // 上传的模型的url
                version['modelUrl'] = this.modelUrl;
                // 模型文件的大小
                version['modelSize'] = this.modelSize;
                // 模型的版权图片的url
                version['copyrightImg'] = this.imageUrl;
                // 模型版权图片的大小
                version['copyrightImgSize'] = this.imageSize;
                version['userId'] = this.$store.state.user.id;

                if (!version.protocolId)
                    version.protocolId = this.formItem.protocol.id;

                this.axios.put(`/model-server/version/update`, version).then(({data}) => {
                    console.log(data)
                    this.$emit("completeTask")
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            addVersion() {
                let version = deepClone(this.formItem);
                // 上传的模型的url
                version['modelUrl'] = this.modelUrl;
                // 模型文件的大小
                version['modelSize'] = this.modelSize;
                // 模型的版权图片的url
                version['copyrightImg'] = this.imageUrl;
                // 模型版权图片的大小
                version['copyrightImgSize'] = this.imageSize;
                version['userId'] = this.$store.state.user.id;

                this.axios.post(`/model-server/version/add`, version).then(({data}) => {
                    console.log(data)
                    this.$emit("completeTask")
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
            },
            handleModelSuccess(response, file, fileList) {
                this.modelUrl = response.data
                this.modelSize = file.size
                console.log(response)
                console.log(file)
                console.log(fileList)
            },
            handleModelError(error, file, fileList) {
                errorMessage(error, this)
                console.log(file)
                console.log(fileList)
            },
            handleImgSuccess(response, file, fileList) {
                this.imageUrl = response.data
                this.imageSize = file.size
                console.log(response)
                console.log(file)
                console.log(fileList)
            },
            handleImgError(error, file, fileList) {
                errorMessage(error, this)
                console.log(file)
                console.log(fileList)
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
