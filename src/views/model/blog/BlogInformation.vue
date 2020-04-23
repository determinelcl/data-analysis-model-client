<template>
    <div>
        <p :style="textTheme">博客信息</p>
        <p :style="textTheme">基本信息</p>
        <div class="demo-drawer-profile">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    名称: {{blogInfo.name}}
                </Col>
                <Col span="12">
                    分组:
                    <Tag color="green">
                        {{blogInfo.group.name}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    状态:
                    <Tag type="dot" :color="blogInfo.status === 0 ? 'success' : 'warning'">
                        {{blogInfo.status === 0 ? '已发布' : '未发布'}}
                    </Tag>
                </Col>
                <Col span="12">
                    标签:
                    <Tag v-for="tag in blogInfo.tagList" :key="tag.id" color="orange">
                        {{tag.name}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="24">
                    摘要: {{blogInfo.summary}}
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="24">
                    简介: {{blogInfo.description}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">正文</p>
        <div class="demo-drawer-profile">
        </div>
        <Divider/>
        <p :style="textTheme">评论信息</p>
        <div class="demo-drawer-profile">
            <ActiveInfo></ActiveInfo>
        </div>
        <div style="height: 100px"></div>

    </div>
</template>

<script>
    import ActiveInfo from "../component/ActiveInfo";

    export default {
        name: "BlogInformation",
        components: {ActiveInfo},
        data() {
            return {
                blogInfo: {
                    name: '计算机视觉',
                    status: 0,
                    groupId: 0,
                    group: {name: '深度学习'},
                    tagId: 0,
                    tagList: [
                        {id: 1, name: '推荐系统'},
                        {id: 2, name: '分类算法'}
                    ],
                    summary: '这是使用神经网络实现实现的性能最优的视觉算法模型',
                    description: '这是使用神经网络实现实现的性能最优的视觉算法模型'
                },
                textTheme: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                }
            }
        }
    }
</script>

<style scoped>

</style>
