<template>
    <div>
        <Drawer v-model="blogInfo" width="1183" :closable="false">
            <BlogInformation></BlogInformation>
        </Drawer>

        <Form ref="formInline" :model="searchForm" label-position="left" label-width="60">
            <Row :gutter="32" type="flex" justify="center" align="middle" :style="{padding: 0, height: '38px'}">
                <Col span="8">
                    <FormItem label="名称：" prop="name">
                        <Input type="text" v-model="searchForm.name" placeholder="请输入"/>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="类型：" prop="version" >
                        <Select v-model="searchForm.type" placeholder="请选择">
                            <Option :value="0">收藏</Option>
                            <Option :value="1">评论</Option>
                            <Option :value="2">点赞</Option>
                        </Select>
                    </FormItem>
                </Col>

                <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                    <FormItem>
                        <Button type="primary" @click="searchBlog()" style="margin-right: 20px">查询</Button>
                        <Button @click="resetSearchBlog()">重置</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Divider></Divider>
        <List item-layout="vertical">
            <ListItem v-for="(item, index) in data" :key="item.id">
                <ListItemMeta :title="item.name" :description="item.description"/>
                {{ item.summary }}

                <template slot="action">

                    <li style="margin-right: 5px" @click="blogInfo = true">
                        <Icon type="ios-star-outline" size="15" :color="'#ff9900'"/>
                        {{item.star}}
                    </li>
                    <li style="margin-right: 5px" @click="blogInfo = true">
                        <Icon type="ios-thumbs-up-outline" size="15" :color="'#19be6b'"/>
                        {{item.good}}
                    </li>
                    <li @click="blogInfo = true">
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
                        <Button type="success" size="small" @click="showBlogDetail(index)">详情</Button>
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
</template>

<script>
    import BlogInformation from "../blog/BlogInformation";

    export default {
        name: "BlogTable",
        components: {BlogInformation},
        data() {
            return {
                blogInfo: false,
                searchForm: {
                    name: null,
                    type: -1
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
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
