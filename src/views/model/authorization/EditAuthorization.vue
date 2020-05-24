<template>
    <div>
        <Form ref="formItemRef" :model="formItem" :label-width="118">
            <FormItem label="计划名称" prop="name">
                <Input v-model="formItem.name" placeholder="请输入计划名称"></Input>
            </FormItem>
            <FormItem label="模型" prop="modelVersionId">
                <Cascader v-model="formItem.versionUrl" :data="modelList" :load-data="loadModelVersion"></Cascader>
            </FormItem>

            <FormItem label="授权时间" prop="expireDate">
                <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择授权的使用时间" style="width: 100%" v-model="formItem.expireDate">
                </DatePicker>
            </FormItem>
            <FormItem label="协议信息" prop="protocol">
                <Input v-model="formItem.protocol" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                       placeholder="请输入授权的达成的协议信息"></Input>
            </FormItem>
            <FormItem label="协议文件的图片">
                <Upload action="http://localhost:9000/filesystem-server/upload"
                        :format="acceptImage" show-upload-list
                        :headers="tokenParam"
                        :on-success="handleImgSuccess"
                        :on-error="handleImgError">
                    <Button icon="ios-cloud-upload-outline">上传协议文件图片</Button>
                </Upload>
            </FormItem>
            <FormItem label="申请用途" prop="applyDesc">
                <Input v-model="formItem.applyDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                       placeholder="请输入授权申请的用途的说明信息"></Input>
            </FormItem>
            <FormItem label="描述" prop="description">
                <Input v-model="formItem.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                       placeholder="请输入授权申请的说明信息"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleAdd()" v-if="editType === 'add'">提交</Button>
                <Button type="primary" @click="handleUpdate()" v-if="editType === 'update'">更新</Button>
                <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";
    import {TOKEN_INFORMATION} from "../../../constant/system";
    import {deepClone} from "../../../util/object.util";

    export default {
        name: "EditAuthorization",
        props: ['formItem', 'editType'],
        data() {
            return {
                acceptImage: ['png', 'jpg', 'jpeg'],
                modelList: [],
                versionList: []
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
            }
        },
        methods: {
            loadModelList() {
                let param = {paged: false};

                // 查询用户自己的模型
                let userId = this.$store.state.user.id;
                this.axios.post('/model-server/list', param).then(({data}) => {
                    this.modelList = this.switchModelData(data.data.data.filter(model => model.userId !== userId));
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            loadModelVersion(item, callback) {
                item.loading = true;

                // 加载模型的版本信息
                this.axios.get(`/model-server/version/list/${item.value}`).then(({data}) => {
                    item.loading = false;
                    if (!data.data)
                        return;

                    if (data.data.length === 0) return;
                    this.versionList = data.data

                    let children = []
                    let versionTagList = ['lasted', 'GA(最新)', 'GA', 'Beta', 'Snapshot']
                    data.data.forEach(version => {
                        let item = {
                            value: version.id,
                            label: `${version.name}:${versionTagList[version.type]}`
                        }

                        children.push(item)
                    })
                    item.children = children
                    callback(children);
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            // 将从后端获取的数据转换为前端显示的数据的格式
            switchModelData(modelData) {
                let modelList = []
                modelData.forEach(model => {

                    let item = {
                        value: model.id,
                        label: model.name,
                        children: [],
                        loading: false
                    }

                    modelList.push(item)
                })
                return modelList
            },
            handleImgSuccess(response, file, fileList) {
                this.formItem.protocolImg = response.data
                console.log(response)
                console.log(file)
                console.log(fileList)
            },
            handleImgError(error, file, fileList) {
                errorMessage(error, this)
                console.log(file)
                console.log(fileList)
            },
            handleAdd() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id
                item['applyUserId'] = this.$store.state.user.id
                item.modelVersionId = item.versionUrl[item.versionUrl.length - 1]

                // 查询用户自己的运行时服务
                this.axios.post('/model-server/apply/add', item).then(({data}) => {
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleUpdate() {
                let item = deepClone(this.formItem);
                item['userId'] = this.$store.state.user.id
                item['applyUserId'] = this.$store.state.user.id
                item.modelVersionId = item.versionUrl[item.versionUrl.length - 1]

                // 查询用户自己的运行时服务
                this.axios.put('/model-server/apply/update', item).then(({data}) => {
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleReset() {
                this.formItem = {
                    name: '',
                    versionUrl: [],
                    modelVersionId: null,
                    expireDate: null,
                    protocol: null,
                    protocolImg: '',
                    applyDesc: '',
                    description: ''
                }
            }
        },
        mounted() {
            this.loadModelList();
        }
    }
</script>

<style scoped>

</style>
