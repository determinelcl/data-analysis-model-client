<template>
    <div>
        <Spin fix v-if="spinShow">
            <LoadingIcon></LoadingIcon>
        </Spin>

        <Drawer v-model="blogInfo" width="1183" :closable="false">
            <BlogInformation ref="blogInfoRef" :blog-info="blogItem"></BlogInformation>
        </Drawer>

        <List item-layout="vertical">
            <ListItem v-for="(item, index) in tableData" :key="item.id">
                <ListItemMeta :title="item.title" :description="item.description"/>
                {{ item.summary }}

                <template slot="action">

                    <li style="margin-right: 5px">
                        <a href="javascript:void(0)">
                            <Icon type="ios-star-outline" size="15" :color="'#ff9900'"/>
                            {{item.starSize}}
                        </a>
                    </li>
                    <li style="margin-right: 5px">
                        <a href="javascript:void(0)">
                            <Icon type="ios-thumbs-up-outline" size="15" :color="'#19be6b'"/>
                            {{item.thumbsUpSize}}
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0)">
                            <Icon type="ios-chatbubbles-outline" size="15" :color="'#2d8cf0'"/>
                            {{item.commentSize}}
                        </a>
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
    import LoadingIcon from "../../../components/LoadingIcon";
    import {deepClone} from "../../../util/object.util";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "BlogTable",
        components: {LoadingIcon, BlogInformation},
        data() {
            return {
                spinShow: false,
                blogInfo: false,
                blogItem: {},
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
            showBlogDetail(index) {
                this.blogItem = deepClone(this.tableData[index]);

                this.blogInfo = true
                this.$refs.blogInfoRef.$emit('loadBlogInfo', this.blogItem)
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
                let condition = {title: this.$route.query.name};
                Object.assign(condition, this.page)

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
            }
        },
        mounted() {
            this.loadTableData()
        }
    }
</script>

<style scoped>

</style>
