<template>

    <Form ref="formItem" :model="formItem" :label-width="100">
        <FormItem label="博文名称" prop="name">
            <Input v-model="formItem.title" placeholder="请输入博文名称"></Input>
        </FormItem>
        <FormItem label="发布状态" prop="type">
            <RadioGroup v-model="formItem.type">
                <Radio :label="0">发布</Radio>
                <Radio :label="1">保存</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="分组" prop="groupId">
            <Select v-model="formItem.groupId" placeholder="请选择分组"
                    filterable allow-create clearable @on-create="createGroup">
                <Option v-for="item in groupList" :key="item.id" :value="item.id" :disabled="item.status !== 0">
                    {{item.name}}
                </Option>
            </Select>
        </FormItem>
        <FormItem label="标签" prop="tagIdList">
            <Select v-model="formItem.tagIdList" placeholder="请选择标签"
                    filterable allow-create multiple @on-create="createTag">
                <Option v-for="item in tagList" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="摘要">
            <Input v-model="formItem.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入博文的摘要信息"></Input>
        </FormItem>
        <FormItem label="博文正文">
            <mavon-editor v-model="formItem.content" ref="markDownRef" @imgAdd="imgAdd" @save="handleEditorSave"
                          @change="change" style="min-height: 300px"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleAdd()" v-if="editType === 'add'">提交</Button>
            <Button type="primary" @click="handleUpdate()" v-if="editType === 'update'">更新</Button>
            <Button @click="handleReset()" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>

</template>

<script>
    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import {errorMessage} from "../../../util/message.util";
    import {deepClone} from "../../../util/object.util";

    export default {
        name: "EditBlog",
        components: {
            mavonEditor,
        },
        props: {
            editType: {
                type: String,
                default: 'add'
            },
            formItem: {}
        },
        data() {
            return {
                groupList: [],
                tagList: [],
                content: '',
                html: '',
                configs: {}
            }
        },
        methods: {
            createGroup(value) {
                let item = {
                    name: value,
                    status: 0,
                    userId: this.$store.state.user.id
                }
                this.axios.post(`/classification-server/group/add`, item).then(({data}) => {
                    console.log(data);
                    this.loadGroupList();
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            createTag(value) {
                let item = {
                    name: value,
                    keyword: value,
                    userId: this.$store.state.user.id
                }
                this.axios.post(`/classification-server/tag/add`, item).then(({data}) => {
                    console.log(data);
                    this.loadTagList();
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                })
            },
            handleAdd() {
                console.log(this.content)
                console.log(this.html)

                let item = deepClone(this.formItem)
                item['html'] = this.html
                item['userId'] = this.$store.state.user.id

                // 查询用户自己的运行时服务
                this.axios.post('/blog-server/add', item).then(({data}) => {
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleUpdate() {
                console.log(this.content);
                console.log(this.html);

                let item = deepClone(this.formItem)
                item['html'] = this.html
                item['userId'] = this.$store.state.user.id

                this.axios.put('/blog-server/update', item).then(({data}) => {
                    console.log(data)
                    this.$emit('completeTask')
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                });
            },
            handleReset() {
                this.formItem = {
                    title: '',
                    type: 1,
                    groupId: null,
                    tagIdList: [],
                    summary: [],
                    content: ''
                }
            },
            handleEditorSave() {
                console.log(this.content)
                localStorage.setItem('blog', this.content)
            },
            // 将图片上传到服务器，返回地址替换到md中
            imgAdd(pos, $file) {
                let formdata = new FormData()
                formdata.append("file", $file)

                console.log(pos)
                console.log($file)
                console.log(formdata)
                this.axios.post('/filesystem-server/upload', formdata, {
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(res => {
                    //"{"filename":"M00/00/00/wKhkAl7JREeABK7aAAJAaz3RDcI381.jpg","group":"group1"}"
                    let file = JSON.parse(res.data.data);
                    console.log(file);
                    let url = `${this.$store.state.fileRoot}/${file.group}/${file.filename}`
                    this.$refs.markDownRef.$img2Url(pos, url);
                }).catch(err => {
                    console.log(err)
                    errorMessage(err, this)
                })
            },
            // 所有操作都会被解析重新渲染
            change(value, render) {
                // render 为 markdown 解析后的结果[html]
                this.html = render
                console.log(value)
            },
            loadGroupList() {
                this.axios.get(`/classification-server/group/list`).then(({data}) => {
                    console.log(data)
                    this.groupList = data.data
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                })
            },
            loadTagList() {
                this.axios.get(`/classification-server/tag/list`).then(({data}) => {
                    console.log(data)
                    this.tagList = data.data
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                })
            }
        },
        mounted() {
            this.loadGroupList()
            this.loadTagList()
        }
    }
</script>

<style scoped>

</style>
