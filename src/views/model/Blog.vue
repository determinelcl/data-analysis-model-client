<template>
    <div>
        <ComponentTitle name="博客管理" description="博客管理：添加、删除、修改、查询博客"></ComponentTitle>
        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>

            <Drawer :title="editBlogText" v-model="editBlog" width="1183" draggable
                    :mask-closable="false" :styles="editBlogStyle">
                <EditBlog :edit-type="editType" :form-item="formItem" @completeTask="editBlogCompleteTask"></EditBlog>
            </Drawer>
            <Drawer v-model="blogInfo" width="1183" :closable="false">
                <BlogInformation ref="blogInfoRef" :blog-info="blogItem"></BlogInformation>
            </Drawer>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p>是否删除当前博文？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="deleteBlog()">删除</Button>
                </div>
            </Modal>

            <Form ref="formInline" :model="searchForm">
                <Row :gutter="10" type="flex" :style="{padding: 0, height: '38px'}">
                    <Col span="6">
                        <FormItem label="名称：" prop="title" label-position="left">
                            <Input type="text" v-model="searchForm.title" placeholder="请输入"
                                   :style="{width: '200px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="状态：" prop="version" label-position="left">
                            <Select v-model="searchForm.type" filterable allow-create clearable style="width: 150px">
                                <Option :value="0">已发布</Option>
                                <Option :value="1">未发布</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label="分组：" prop="version" label-position="left">
                            <Select v-model="searchForm.groupId" placeholder="请选择分组" clearable style="width: 115px">
                                <Option v-for="group in groupList" :key="group.id" :disabled="group.status !== 0"
                                        :value="group.id">{{group.name}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>

                    <Col span="4" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchBlog()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchBlog()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Divider></Divider>
            <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
                <Col span="24">
                    <Button type="dashed" @click="addBlog()"
                            :style="{width: '100%'}" icon="md-add">新增博文
                    </Button>
                </Col>
            </Row>
            <List item-layout="vertical">
                <ListItem v-for="(item, index) in tableData" :key="item.id">
                    <ListItemMeta :title="item.title" :description="item.description"/>
                    {{ item.summary }}

                    <template slot="action">

                        <li style="margin-right: 5px">
                            <Icon type="ios-star-outline" size="15" :color="'#ff9900'"/>
                            {{item.starSize}}
                        </li>
                        <li style="margin-right: 5px">
                            <Icon type="ios-thumbs-up-outline" size="15" :color="'#19be6b'"/>
                            {{item.thumbsUpSize}}
                        </li>
                        <li>
                            <Icon type="ios-chatbubbles-outline" size="15" :color="'#2d8cf0'"/>
                            {{item.commentSize}}
                        </li>

                        <li :style="{width: '100px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': item.status === 1 ? '#ff9900': '#ed4014'}` }">
                            {{item.status === 0 ? '审核通过': item.status === 1 ? '未审核' : '审核不通过'}}
                        </li>

                        <li :style="{width: '150px', alignContent: 'center', color: `${item.trigger === 0 ? '#19be6b': '#ff9900'}` }">
                            <a>{{$store.state.user.username}}</a>
                        </li>

                        <li style="width: 150px; align-content: center">

                            分组：{{item.group.name}}
                        </li>
                        <li style="width: 238px; align-content: center">
                            更新日期：{{item.updated}}
                        </li>
                        <li>
                            <a style="margin: 0 3px; color: #19be6b" @click="showBlogDetail(index)">详情</a>
                        </li>

                        <li>
                            <a style="margin: 0 3px; color: #ff9900" @click="updateBlog(index)">更新</a>
                        </li>

                        <li>
                            <a style="margin: 0 3px; color:#ed4014;" @click="removeBlog(index)">删除</a>
                        </li>

                    </template>
                </ListItem>
            </List>

            <Divider></Divider>
            <div style="display: flex; justify-content: center;">
                <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                      show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                      show-sizer show-total @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import ComponentTitle from "../../components/ComponentTitle";
    import EditBlog from "./blog/EditBlog";
    import BlogInformation from "./blog/BlogInformation";
    import {deepClone} from "../../util/object.util";
    import {errorMessage} from "../../util/message.util";
    import LoadingIcon from "../../components/LoadingIcon";

    export default {
        name: "Blog",
        components: {LoadingIcon, BlogInformation, EditBlog, ComponentTitle},
        data() {
            return {
                spinShow: false,
                editBlog: false,
                editBlogText: '',
                editType: 'add',
                blogInfo: false,
                blogItem: {},
                delConfirm: false,
                delConfirmIndex: -1,
                groupList: [],
                formItem: {},
                editBlogStyle: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                searchForm: {
                    title: null,
                    groupId: null,
                    type: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                tableData: []
            }
        },
        methods: {
            editBlogCompleteTask() {
                this.editBlog = false
                this.searchBlog()
            },
            searchBlog() {
                this.page.current = 1
                this.loadTableData()
            },
            resetSearchBlog() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            showBlogDetail(index) {
                this.blogItem = deepClone(this.tableData[index]);

                this.$refs.blogInfoRef.$emit('loadBlogInfo', this.blogItem)
                this.blogInfo = true
            },
            addBlog() {
                this.formItem = {
                    title: '',
                    type: 1,
                    groupId: null,
                    tagIdList: [],
                    summary: [],
                    content: ''
                }

                this.editBlogText = '添加博文'
                this.editType = 'add'
                this.editBlog = true
            },
            updateBlog(index) {
                let item = deepClone(this.tableData[index]);
                item.groupId = item.group.id
                let tagIdList = []
                if (item.tagList)
                    item.tagList.forEach(tag => tagIdList.push(tag.id))

                item.tagIdList = tagIdList
                this.formItem = item

                this.editBlogText = '更新博文'
                this.editType = 'update'
                this.editBlog = true
            },
            removeBlog(index) {
                console.log(index)
                this.delConfirm = true
                this.delConfirmIndex = index
            },
            deleteBlog() {
                let blog = deepClone(this.tableData[this.delConfirmIndex]);

                let userId = this.$store.state.user.id
                this.axios.delete(`/blog-server/delete/${userId}/${blog.id}`).then(({data}) => {
                    console.log(data)

                    this.delConfirm = false
                    this.loadTableData()
                }).catch(error => {
                    console.log(error)

                    this.delConfirm = false
                    errorMessage(error, this)
                });
            },
            // 切换页面
            changePage(page) {
                this.page.current = page;
                this.loadTableData();
            },
            changePageSize(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.page.size = pageSize;
                this.page.current = 1;

                this.loadTableData()
            },
            loadTableData() {
                let condition = deepClone(this.searchForm)
                Object.assign(condition, this.pageModel)
                condition['userId'] = this.$store.state.user.id

                // 显示加载提示信息
                this.spinShow = true;
                // 加载模型列表数据
                this.axios.post('/blog-server/list', condition).then(({data}) => {
                    this.tableData = data.data.data
                    this.page.total = data.data.total
                    this.spinShow = false
                }).catch(error => {
                    console.log(error)
                    this.spinShow = false
                    errorMessage(error, this)
                });
            },
            loadGroupList() {
                this.axios.get(`/classification-server/group/list`).then(({data}) => {
                    console.log(data);
                    this.groupList = data.data
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this)
                })
            }
        },
        mounted() {
            this.loadTableData()
            this.loadGroupList()
        }
    }
</script>

<style scoped>

</style>
