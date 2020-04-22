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
                <Button type="primary" style="height: 90px; width: 100%; display: flex; justify-content: center">
                    <div>发表</div>
                    <div>评论</div>
                </Button>
            </Col>
        </Row>
        <Divider></Divider>
        <Row :gutter="20" style="margin-top: 10px">
            <Col span="3">
                <Icon type="logo-github" size="50" :color="'#dbab82'"/>
                <Button type="primary" size="small" style="margin: 10px auto auto 3px;">关注</Button>
            </Col>
            <Col span="21">
                <div style="margin: 20px auto">
                    <Row :gutter="10" type="flex" style="height: 38px">
                        <Col><b>determination</b></Col>
                        <Col style="color: #19be6b">企业认证</Col>
                    </Row>
                    <Row :gutter="10">
                        <Col>
                            <p style="line-height: 30px">
                                “爱国、敬业、诚信、友善”，是公民基本道德规范，是从个人行为层面对社会主义核心价值观基本理念的凝练。
                                它覆盖社会道德生活的各个领域，是公民必须恪守的基本道德准则，也是评价公民道德行为选择的基本价值标准。
                            </p>
                        </Col>
                    </Row>
                    <Row :gutter="15" type="flex" align="middle"
                         justify="start" style="color: rgba(0,0,0,.45); font-size: 10px">
                        <Col>
                            2020-05-20 05:20:00
                        </Col>
                        <Col>
                            <Icon type="md-thumbs-up" size="16"/>
                            2020
                        </Col>
                        <Col>
                            <Icon type="md-thumbs-down" size="15"/>
                            0
                        </Col>
                        <Col>
                            <a>回复</a>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" style="margin-top: 15px">
                        <Col>
                            <Row :gutter="15">
                                <Col span="2">
                                    <Icon type="logo-github" size="30" :color="'#dbab82'"/>
                                </Col>
                                <Col span="22">
                                    <Row :gutter="10" type="flex" style="height: 25px">
                                        <Col><b>determination</b></Col>
                                        <Col style="color: #19be6b">企业认证</Col>
                                    </Row>
                                    <Row :gutter="10">
                                        <Col>
                                            <p style="line-height: 30px">
                                                “爱国、敬业、诚信、友善”，是公民基本道德规范，是从个人行为层面对社会主义核心价值观基本理念的凝练。
                                                为祖国的繁荣昌盛做出伟大贡献
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row :gutter="15" type="flex" align="middle"
                                         justify="start" style="color: rgba(0,0,0,.45); font-size: 10px">
                                        <Col>
                                            2020-05-20 05:20:00
                                        </Col>
                                        <Col>
                                            <Icon type="md-thumbs-up" size="16"/>
                                            2020
                                        </Col>
                                        <Col>
                                            <Icon type="md-thumbs-down" size="15"/>
                                            0
                                        </Col>
                                        <Col>
                                            <a>回复</a>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                </div>
                <div>
                    <Row :gutter="20">
                        <Col span="3">
                            <Icon type="logo-github" size="50" :color="'#dbab82'"/>
                        </Col>
                        <Col span="18">
                            <Input v-model="comment" type="textarea" style="height: 90px;"
                                   placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"/>
                        </Col>
                        <Col span="3">
                            <Button type="primary"
                                    style="height: 90px; width: 100%; display: flex; justify-content: center">
                                <div>发表</div>
                                <div>评论</div>
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
        <Divider></Divider>
    </div>
</template>

<script>
    export default {
        name: "Comment",
        data() {
            return {
                comment: '',
            }
        }
    }
</script>

<style scoped>

</style>
