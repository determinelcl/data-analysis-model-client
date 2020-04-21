<template>
    <div>
        <Tabs :animated="false">
            <TabPane label="评论" icon="ios-chatbubbles" style="padding: 0 20px">
                <Comment></Comment>
            </TabPane>
            <TabPane label="点赞" icon="md-thumbs-up">
                <Row type="flex" align="middle" justify="space-around">
                    <Col style="display:flex; justify-content: center">
                        <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                        <div style="margin: 3px auto 3px 10px"><b>determination</b></div>
                        <div style="margin: 3px auto 3px 15px; color: #19be6b">企业认证</div>
                    </Col>
                    <Col>
                        2020-05-20 05:20:00
                    </Col>
                    <Col>
                        <Button type="success" size="small">
                            <Icon type="md-add" />关注
                        </Button>
                    </Col>
                </Row>
            </TabPane>

            <TabPane label="收藏" icon="ios-star">
                <Row type="flex" align="middle" justify="space-around">
                    <Col style="display:flex; justify-content: center">
                        <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                        <div style="margin: 3px auto 3px 10px"><b>determination</b></div>
                        <div style="margin: 3px auto 3px 15px; color: #19be6b">企业认证</div>
                    </Col>
                    <Col>
                        2020-05-20 05:20:00
                    </Col>
                    <Col>
                        <Button type="success" size="small">
                            <Icon type="md-add" />关注
                        </Button>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import Comment from "./Comment";
    export default {
        name: "ActiveInfo",
        components: {Comment},
        data() {
            return {
                comment: '',
            }
        }
    }
</script>

<style lang="less" scoped>

    /deep/ .ivu-input {
        height: 100%;
    }
</style>
