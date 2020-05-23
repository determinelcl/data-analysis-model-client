<template>
    <div>
        <p :style="textTheme">博客信息</p>
        <p :style="textTheme">基本信息</p>
        <div class="demo-drawer-profile">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    名称: {{blogInfo.title}}
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

                    类型: {{blogInfo.type === 0 ? '已发布' : '已保存'}}
                </Col>
                <Col span="12">
                    状态:
                    <Tag type="dot" :color="blogInfo.status === 0 ? '#19be6b': blogInfo.status === 1 ? '#ff9900': '#ed4014'">
                        {{blogInfo.status === 0 ? '审核通过': blogInfo.status === 1 ? '未审核' : '审核不通过'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="22">
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
        </div>
        <Divider/>
        <p :style="textTheme">正文</p>
        <div class="demo-drawer-profile" v-html="blogInfo.html">
        </div>
        <Divider/>
        <p :style="textTheme">评论信息</p>
        <div class="demo-drawer-profile">
            <ActiveInfo ref="activeInfoRef"></ActiveInfo>
        </div>
        <div style="height: 100px"></div>

    </div>
</template>

<script>
    import ActiveInfo from "../component/ActiveInfo";

    export default {
        name: "BlogInformation",
        components: {ActiveInfo},
        props: ['blogInfo'],
        data() {
            return {
                textTheme: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                }
            }
        },
        mounted() {
            let _this = this

            this.$on('loadBlogInfo', (blog) => {
                _this.$refs.activeInfoRef.$emit("loadActiveInfo", blog, 1);
            });
        }
    }
</script>

<style scoped>

</style>
