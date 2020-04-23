<template>
    <div>
        <ComponentTitle name="博客管理" description="博客管理：添加、删除、修改、查询博客"></ComponentTitle>
        <div :style="this.$store.state.style.contentStyle">
            <Drawer :title="editBlogText" v-model="editBlog" width="1183" draggable
                    :mask-closable="false" :styles="editBlogStyle">
                <EditBlog></EditBlog>
            </Drawer>
            <Drawer v-model="blogInfo" width="1183" :closable="false">
                <BlogInformation></BlogInformation>
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
                        <FormItem label="名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '200px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="状态：" prop="version" label-position="left">
                            <Select v-model="searchForm.status" filterable allow-create clearable style="width: 150px">
                                <Option :value="0">已发布</Option>
                                <Option :value="1">未发布</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label="分组：" prop="version" label-position="left">
                            <Select v-model="searchForm.group" placeholder="请选择" style="width: 115px">
                                <Option :value="0">机器学习</Option>
                                <Option :value="1">深度学习</Option>
                                <Option :value="2">数据分析</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="类型：" prop="version" label-position="left">
                            <Select v-model="searchForm.type" placeholder="请选择" style="width: 100px">
                                <Option :value="0">收藏</Option>
                                <Option :value="1">评论</Option>
                                <Option :value="2">点赞</Option>
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
                <ListItem v-for="(item, index) in data" :key="item.id">
                    <ListItemMeta :title="item.name" :description="item.description"/>
                    {{ item.summary }}

                    <template slot="action">

                        <li style="margin-right: 5px">
                            <Icon type="ios-star-outline" size="15" :color="'#ff9900'"/>
                            {{item.star}}
                        </li>
                        <li style="margin-right: 5px">
                            <Icon type="ios-thumbs-up-outline" size="15" :color="'#19be6b'"/>
                            {{item.good}}
                        </li>
                        <li>
                            <Icon type="ios-chatbubbles-outline" size="15" :color="'#2d8cf0'"/>
                            {{item.comment}}
                        </li>

                        <li :style="{width: '100px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': '#ff9900'}` }">
                            {{item.status === 0 ? '已发布': '未发布'}}
                        </li>

                        <li :style="{width: '150px', alignContent: 'center', color: `${item.trigger === 0 ? '#19be6b': '#ff9900'}` }">
                            <a>{{item.publisher}}</a>
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

    export default {
        name: "Blog",
        components: {BlogInformation, EditBlog, ComponentTitle},
        data() {
            return {
                editBlog: false,
                editBlogText: '',
                blogInfo: false,
                delConfirm: false,
                blogFormItem: {
                    name: '计算机视觉',
                    public: 0,
                    status: true,
                    groupId: 0,
                    group: {name: '深度学习'},
                    tagId: 0,
                    tagList: [
                        {id: 1, name: '推荐系统'},
                        {id: 2, name: '分类算法'}
                    ],
                    git: 'https://github.com/alibaba/Sentinel',
                    description: '这是使用神经网络实现实现的性能最优的视觉算法模型'
                },
                editBlogStyle: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                searchForm: {
                    name: null,
                    status: null,
                    group: null,
                    type: -1
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                tableColumns: [
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? 'success' : 'error';
                            const text = row.status === 0 ? '激活' : '禁用';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {title: '发布者', key: 'publisher'},
                    {title: '更新日期', key: 'updated'}
                ],
                data: [
                    {
                        id: 1,
                        name: '图像识别测试',
                        summary: '这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。',
                        description: '这是一个图像识别的组件',
                        status: 0,
                        trigger: 0,
                        star: 123,
                        good: 456,
                        comment: 789,
                        publisher: 'determination',
                        updated: '2020-04-30 00:00:00',
                        created: '2020-04-30 00:00:00'
                    },
                    {
                        id: 2,
                        name: '支持向量机测试',
                        summary: '这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。',
                        description: '这是一个分类器',
                        status: 0,
                        trigger: 0,
                        star: 123,
                        good: 456,
                        comment: 789,
                        publisher: 'determination',
                        updated: '2020-04-30 00:00:00',
                        created: '2020-04-30 00:00:00',
                    },
                    {
                        id: 3,
                        name: '文字识别测试',
                        summary: '这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容，这是列表的文本内容。',
                        description: '这是一个神经网络模型',
                        status: 1,
                        trigger: 1,
                        star: 123,
                        good: 456,
                        comment: 789,
                        publisher: 'determination',
                        updated: '2020-04-30 00:00:00',
                        created: '2020-04-30 00:00:00'
                    }
                ]
            }
        },
        methods: {
            searchBlog() {

            },
            resetSearchBlog() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            showBlogDetail(index) {
                console.log(index);
                this.blogInfo = true;
            },
            addBlog() {
                this.editBlogText = '添加博文';
                this.editBlog = true;
            },
            updateBlog(index) {
                console.log(index);
                this.editBlogText = '更新博文';
                this.editBlog = true;
            },
            removeBlog(index) {
                console.log(index);
                this.delConfirm = true;
            },
            deleteBlog() {

            },
            // 切换页面
            changePage(page) {
                this.page.current = page;
                // this.loadTableData();
            },
            changePageSize(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.page.size = pageSize;
                this.page.current = 1;

                // this.loadTableData()
            },
        }
    }
</script>

<style scoped>

</style>
