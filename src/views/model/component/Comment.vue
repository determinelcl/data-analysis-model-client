<template>
    <div>
        <!-- 分为主要的两行，第一行用于自身的评论，第二行用于展示评论的信息 -->
        <Row :gutter="20">
            <Col span="3">
                <Icon type="logo-github" size="50" :color="'#dbab82'"/>
            </Col>
            <Col span="18">
                <Input v-model="comment" type="textarea" style="height: 90px;"
                       placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"/>
            </Col>
            <Col span="3">
                <Button type="primary" style="height: 90px; width: 100%; display: flex; justify-content: center"
                        @click="newComment()">
                    <div>发表</div>
                    <div>评论</div>
                </Button>
            </Col>
        </Row>
        <Divider></Divider>
        <Row :gutter="20" style="margin-top: 10px" v-for="item in commentList" :key="item.id">
            <Col span="3">
                <Icon type="logo-github" size="50" :color="'#dbab82'"/>
                <div style="display:flex; justify-content: flex-start; margin: 10px auto auto 3px;">
                    <Button :disabled="$store.state.user.followList.indexOf(item.user.id) > -1"
                            type="primary" size="small" @click="followUser(item.user.id)">
                        {{$store.state.user.followList.indexOf(item.user.id) > -1 ? '已关注' : '关注'}}
                    </Button>
                </div>
            </Col>
            <Col span="21">
                <div style="margin: 20px auto">
                    <Row :gutter="10" type="flex" style="height: 38px">
                        <Col><b>{{item.user.username}}</b></Col>
                        <Col style="color: #19be6b">企业认证</Col>
                    </Row>
                    <Row :gutter="10">
                        <Col>
                            <p style="line-height: 30px">
                                {{item.content}}
                            </p>
                        </Col>
                    </Row>
                    <Row :gutter="15" type="flex" align="middle"
                         justify="start" style="color: rgba(0,0,0,.45); font-size: 10px">
                        <Col>
                            {{item.created}}
                        </Col>
                        <Col>
                            <Icon type="md-thumbs-up" size="16"/>
                            {{item.likeNum}}
                        </Col>
                        <Col>
                            <Icon type="md-thumbs-down" size="15"/>
                            {{item.unLikeNum}}
                        </Col>
                        <Col>
                            <a @click="commentReplyOperation(item.id, 0)">回复</a>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" style="margin-top: 15px" v-for="reply in item.replyList"
                         :key="reply.id">
                        <Col>
                            <Row :gutter="15">
                                <Col span="2">
                                    <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                                </Col>
                                <Col span="22">
                                    <Row :gutter="10" type="flex" style="height: 25px">
                                        <Col><b>{{reply.user.username}}</b></Col>
                                        <Col style="color: #19be6b">企业认证</Col>
                                        <Col v-if="reply.targetId !== item.id">
                                            <span style="margin-right: 20px">回复</span>
                                            <span><b>{{reply.target.user.username}}</b></span>
                                        </Col>
                                    </Row>
                                    <Row :gutter="10">
                                        <Col>
                                            <p style="line-height: 30px">
                                                {{reply.content}}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row :gutter="15" type="flex" align="middle"
                                         justify="start" style="color: rgba(0,0,0,.45); font-size: 10px">
                                        <Col>
                                            {{reply.created}}
                                        </Col>
                                        <Col>
                                            <Icon type="md-thumbs-up" size="16"/>
                                            {{reply.likeNum}}
                                        </Col>
                                        <Col>
                                            <Icon type="md-thumbs-down" size="15"/>
                                            {{reply.unLikeNum}}
                                        </Col>
                                        <Col>
                                            <a @click="commentReplyOperation(reply.id, 1)">回复</a>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                </div>
                <div v-if="commentReplyFlag">
                    <Row :gutter="20">
                        <Col span="3">
                            <Icon type="logo-github" size="50" :color="'#dbab82'"/>
                        </Col>
                        <Col span="18">
                            <Input v-model="commentReply" type="textarea" style="height: 90px;"
                                   placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"/>
                        </Col>
                        <Col span="3">
                            <Button type="primary"
                                    style="height: 90px; width: 100%; display: flex; justify-content: center"
                                    @click="newCommentReply">
                                <div>发表</div>
                                <div>评论</div>
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
        <Divider></Divider>
        <div style="display: flex; justify-content: center;">
            <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                  show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                  show-sizer show-total @on-page-size-change="changePageSize"></Page>
        </div>
    </div>
</template>

<script>
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "Comment",
        data() {
            return {
                comment: '',
                commentReply: '',
                commentReplyFlag: false,
                topicType: 0,
                replyId: -1,
                replyType: -1,
                model: null,
                blog: null,
                commentList: [],
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50],
                    paged: true
                },
            }
        },
        methods: {
            // 关注用户的操作
            followUser(userId) {
                let item = {
                    userId: this.$store.state.user.id,
                    followId: userId
                }
                // 显示加载提示信息
                this.axios.post(`/user-server/follow`, item).then(({data}) => {
                    console.log(data)
                    this.loadTableData()
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            newComment() {
                let item = {
                    content: this.comment,
                    topicId: this.topicType === 0 ? this.model.id : this.blog.id,
                    topicType: this.topicType,
                    userId: this.$store.state.user.id
                }

                // 显示加载提示信息
                this.axios.post(`/information-server/comment/add`, item).then(({data}) => {
                    console.log(data)
                    this.loadTableData()
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            commentReplyOperation(replyId, replyType) {
                this.commentReplyFlag = true
                this.replyId = replyId;
                this.replyType = replyType;
            },
            newCommentReply() {
                let item = {
                    content: this.comment,
                    // 评论ID或者回复的ID
                    targetId: this.replyId,
                    // 0：回复评论，1：回复别人的回复
                    replyType: this.replyType,
                    userId: this.$store.state.user.id
                }

                // 显示加载提示信息
                this.axios.post(`/information-server/comment/reply`, item).then(({data}) => {
                    console.log(data)
                    this.commentReplyFlag = false
                    this.loadTableData()
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
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
                let condition = {
                    topicId: this.topicType === 0 ? this.model.id : this.blog.id,
                    topicType: this.topicType
                };

                Object.assign(condition, this.page)
                // 显示加载提示信息
                this.axios.post(`/information-server/comment/list`, condition).then(({data}) => {
                    this.commentList = data.data.data;
                    this.page.total = data.data.total;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            }
        },
        mounted() {
            this.$on('loadCommentInfo', (target, type) => {
                if (type === 0)
                    this.model = target;
                else if (type === 1)
                    this.blog = target;

                this.topicType = type
                this.loadTableData()
            });
        }
    }
</script>

<style scoped>

</style>
