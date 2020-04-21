<template>
    <div>
        <p :style="textTheme">模型信息</p>
        <p :style="textTheme">基本信息</p>
        <div class="demo-drawer-profile">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    名称: {{modelInfo.name}}
                </Col>
                <Col span="12">
                    Git地址: {{modelInfo.git}}
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    分组:
                    <Tag color="green" size="small">
                        {{modelInfo.group.name}}
                    </Tag>
                </Col>
                <Col span="12">
                    状态:
                    <Tag type="dot" size="small" :color="modelInfo.status ? 'success' : 'error'">
                        {{modelInfo.status ? '启用' : '禁用'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    标签:
                    <Tag v-for="tag in modelInfo.tagList" :key="tag.id" size="small" color="orange">
                        {{tag.name}}
                    </Tag>
                </Col>
                <Col span="12">
                    类型:
                    <Tag type="dot" size="small" :color="modelInfo.public === 0 ? 'success' : 'primary'">
                        {{modelInfo.public === 0 ? '公开' : '私有'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="24">
                    模型简介: {{modelInfo.description}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">版本信息</p>
        <div class="demo-drawer-profile">
        </div>
        <Divider/>
        <p :style="textTheme">测试报告</p>
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
    import ActiveInfo from "./ActiveInfo";
    export default {
        name: "ModelInformation",
        components: {ActiveInfo},
        props: ['modelInfo'],
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
        }
    }
</script>

<style scoped>

</style>
