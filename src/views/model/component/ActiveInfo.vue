<template>
    <div>
        <Tabs :animated="false" @on-click="switchTab">
            <TabPane label="评论" name="comment" icon="ios-chatbubbles" style="padding: 0 20px">
                <Comment ref="commentRef"></Comment>
            </TabPane>
            <TabPane label="点赞" name="thumpsUp" icon="md-thumbs-up">
                <Row type="flex" align="middle" justify="space-around" v-for="item in thumpsUpList" :key="item.id">
                    <Col style="display:flex; justify-content: center">
                        <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                        <div style="margin: 3px auto 3px 10px"><b>{{item.user.username}}</b></div>
                        <div style="margin: 3px auto 3px 15px; color: #19be6b">{{authenticationDesc[item.user.authentication.type]}}</div>
                    </Col>
                    <Col>
                        {{item.created}}
                    </Col>
                    <Col>
                        <Button type="success" size="small" @click="followUser(item.user.id)"
                                v-if="$store.state.user.followList.indexOf(item.user.id) === -1">
                            <Icon type="md-add"/>
                            关注
                        </Button>

                        <Button type="warning" size="small" @click="removeFollowUser(item.user.id)"
                                v-if="$store.state.user.followList.indexOf(item.user.id) > -1">
                            <Icon type="md-remove"/>
                            取消关注
                        </Button>
                    </Col>
                </Row>
                <Divider></Divider>
                <div style="display: flex; justify-content: center;">
                    <Page v-model="pageThumpsUp" :total="pageThumpsUp.total" :current="pageThumpsUp.current" @on-change="changePageThumpsUp"
                          show-elevator :page-size-opts="pageThumpsUp.sizeOpts" :page-size="pageThumpsUp.size"
                          show-sizer show-total @on-page-size-change="changePageSizeThumpsUp"></Page>
                </div>
            </TabPane>

            <TabPane label="收藏" name="star" icon="ios-star">
                <Row type="flex" align="middle" justify="space-around" v-for="item in starList" :key="item.id">
                    <Col style="display:flex; justify-content: center">
                        <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                        <div style="margin: 3px auto 3px 10px"><b>{{item.user.username}}</b></div>
                        <div style="margin: 3px auto 3px 15px; color: #19be6b">{{authenticationDesc[item.user.authentication.type]}}</div>
                    </Col>
                    <Col>
                        {{item.created}}
                    </Col>
                    <Col>
                        <Button type="success" size="small" @click="followUser(item.user.id)"
                                v-if="$store.state.user.followList.indexOf(item.user.id) === -1">
                            <Icon type="md-add"/>
                            关注
                        </Button>

                        <Button type="warning" size="small" @click="removeFollowUser(item.user.id)"
                                v-if="$store.state.user.followList.indexOf(item.user.id) > -1">
                            <Icon type="md-remove"/>
                            取消关注
                        </Button>
                    </Col>
                </Row>
                <Divider></Divider>
                <div style="display: flex; justify-content: center;">
                    <Page v-model="pageStar" :total="pageStar.total" :current="pageStar.current" @on-change="changePageStar"
                          show-elevator :page-size-opts="pageStar.sizeOpts" :page-size="pageStar.size"
                          show-sizer show-total @on-page-size-change="changePageSizeStar"></Page>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import Comment from "./Comment";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "ActiveInfo",
        components: {Comment},
        data() {
            return {
                comment: '',
                target: null,
                targetType: -1,
                thumpsUpList: [],
                starList: [],
                authenticationDesc: ["未认证", "个人认证", "学生认证", "教师/教授认证", "团队认证", "高校认证", "企业认证"],

                pageStar: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50],
                    paged: true
                },
                pageThumpsUp: {
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

                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            removeFollowUser(userId) {
                let item = {
                    userId: this.$store.state.user.id,
                    followId: userId
                }
                // 显示加载提示信息
                this.axios.post(`/user-server/follow/remove`, item).then(({data}) => {
                    console.log(data)
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            switchTab(tabName) {
                // 评论
                if (tabName === 'comment')
                    this.$refs.commentRef.$emit("loadCommentInfo", this.target, this.targetType)
                else if (tabName === 'thumpsUp')  // 点赞
                    this.loadThumpsUpData()
                else if (tabName === 'star')  // 收藏
                    this.loadStarData()
            },
            // 切换页面
            changePageStar(page) {
                this.pageStar.current = page
                this.loadStarData()
            },
            changePageSizeStar(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.pageStar.size = pageSize
                this.pageStar.current = 1

                this.loadStarData()
            },
            // 切换页面
            changePageThumpsUp(page) {
                this.pageThumpsUp.current = page
                this.loadThumpsUpData()
            },
            changePageSizeThumpsUp(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.pageThumpsUp.size = pageSize
                this.pageThumpsUp.current = 1

                this.loadThumpsUpData()
            },
            loadThumpsUpData() {
                let condition = {
                    targetId: this.target.id,
                    targetType: this.targetType
                };

                // 显示加载提示信息
                this.axios.post(`/information-server/thumps_up/list`, condition).then(({data}) => {
                    console.log(data)
                    this.thumpsUpList = data.data.data
                    this.pageThumpsUp.total = data.data.total;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            loadStarData() {
                let condition = {
                    targetId: this.target.id,
                    targetType: this.targetType
                };

                // 显示加载提示信息
                this.axios.post(`/information-server/star/list`, condition).then(({data}) => {
                    console.log(data)
                    this.starList = data.data.data
                    this.pageStar.total = data.data.total;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            }
        }
        ,
        mounted() {
            this.$on('loadActiveInfo', (target, targetType) => {
                this.target = target;
                this.targetType = targetType;
                this.$refs.commentRef.$emit("loadCommentInfo", target, targetType)
            });
        }
    }
</script>

<style lang="less" scoped>

    /deep/ .ivu-input {
        height: 100%;
    }
</style>
