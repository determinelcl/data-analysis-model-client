<template>
    <div style="margin-bottom: 50px">
        <Row type="flex" :gutter="20" style="padding: 0 24px">
            <Col span="8">
                <Card :bordered="false" :dis-hover="true">
                    <div>
                        <Row type="flex" justify="center" align="center">
                            <Col>
                                <img src="@/assets/mine.jpg" style="height: 72px; width: 72px; border-radius: 50px">
                            </Col>
                        </Row>
                        <div style="display:flex; justify-content: center; align-items: center; margin: 8px">
                            <b style="font-size: 20px">determination</b>
                        </div>
                        <div style="margin-bottom: 16px">
                            不要把别人嘴上的困难当做自己向前探索路上的绊脚石. 挑战自己，永无止境
                        </div>
                        <div style="margin-bottom: 16px">
                            <Icon type="ios-create-outline" size="15" style="margin-right: 5px"/> 企业认证
                            <Icon type="ios-bookmark" size="15" color="#ff9900" />
                        </div>
                        <div style="margin-bottom: 16px">
                            <Icon type="ios-glasses-outline" size="15" style="margin-right: 5px"/> 研发经理
                        </div>
                        <div style="margin-bottom: 16px">
                            <Icon type="ios-transgender" size="15" style="margin-right: 5px"/> 男
                        </div>
                        <div style="margin-bottom: 16px">
                            <Icon type="ios-school-outline" size="15" style="margin-right: 5px"/> 本科
                            <Icon type="ios-bookmark" size="15" color="#ff9900" />
                        </div>
                        <div style="margin-bottom: 16px">
                            <Icon type="ios-bookmarks-outline" size="15" style="margin-right: 5px"/> 计算机与科学技术
                        </div>
                        <div style="margin-bottom: 16px">
                            <Icon type="ios-ice-cream-outline" size="15" style="margin-right: 5px"/> 1996-02-16
                        </div>
                        <div style="margin-bottom: 16px;">
                            <Icon type="ios-call-outline" size="15" style="margin-right: 5px"/>
                            <span style="color: #5cadff">15151961231</span>
                        </div>
                        <div style="margin-bottom: 16px; font-size: 15px;">
                            <Icon type="ios-mail-outline" size="15" style="margin-right: 5px"/>
                            <span style="color: #5cadff">
                                timecyc@outlook.com
                            </span>
                        </div>
                        <div style="margin-bottom: 16px;">
                            <Icon type="ios-pin-outline" size="15" style="margin-right: 5px"/>
                            <span style="color: #2d8cf0">
                                江苏省常州市
                            </span>
                        </div>

                    </div>
                </Card>
            </Col>
            <Col span="16" class="personal-center">
                <Card :bordered="false" :dis-hover="true">
                    <Tabs :animated="false" type="line">
                        <TabPane label="收藏">
                            <Collection></Collection>
                        </TabPane>
                        <TabPane label="关注">
                            <Follow></Follow>
                        </TabPane>
                        <TabPane label="粉丝">
                            <Fans></Fans>
                        </TabPane>
                    </Tabs>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import Collection from "./center/Collection";
    import Follow from "./center/Follow";
    import Fans from "./center/Fans";
    export default {
        name: "PersonalCenter",
        components: {Fans, Follow, Collection}
    }
</script>

<style lang="less" scoped>
    /deep/ .personal-center .ivu-tabs-bar {
        padding: 6px 0 !important;
    }

    /deep/ .personal-center .ivu-card-body {
        padding: 0 !important;
    }
</style>
