<template>
    <div>
        <p :style="textTheme">博客信息</p>
        <p :style="textTheme">基本信息</p>
        <div class="demo-drawer-profile" v-if="protocolInfo">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    名称: {{protocolInfo.name}}
                </Col>
                <Col span="12">
                    分组:
                    <Tag color="green">
                        {{protocolInfo.group.name}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    类型: {{protocolInfo.publicType === 0 ? '公开' : '私有'}}
                </Col>
                <Col span="12">
                    状态:
                    <Tag type="dot"
                         :color="protocolInfo.status === 0 ? '#19be6b': protocolInfo.status === 1 ? '#ed4014': '#ff9900'">
                        {{protocolInfo.status === 0 ? '启用': protocolInfo.status === 1 ? '禁用' : '不建议使用'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="22">
                    标签:
                    <Tag v-for="tag in protocolInfo.tagList" :key="tag.id" color="orange">
                        {{tag.name}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="24">
                    协议说明信息: {{protocolInfo.description}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">输入协议</p>
        <div class="demo-drawer-profile">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    协议名称: {{typeFormat[protocolInfo.inputFormItem.name]}}
                </Col>
                <Col span="12">
                    输入类型: {{typeFormat[protocolInfo.inputFormItem.ioType]}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">
                <Col span="22">
                    协议格式描述: {{protocolInfo.inputFormItem.ioDesc}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">
                <Col span="22" v-if="typeList.includes(protocolInfo.inputFormItem.ioType)">
                    文件后缀: {{protocolInfo.inputFormItem.fileSuffix}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">
                <Col span="22" v-if="!typeList.includes(protocolInfo.inputFormItem.ioType)">
                    输入格式: {{protocolInfo.inputFormItem.format}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">过程协议</p>
        <div class="demo-drawer-profile" v-for="item in protocolInfo.processFormItem" :key="item.id">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    协议名称: {{item.name}}
                </Col>
                <Col span="12">
                    输出类型: {{typeFormat[item.ioType]}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">
                <Col span="22">
                    协议格式描述: {{item.ioDesc}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">
                <Col span="22" v-if="typeList.includes(item.ioType)">
                    文件后缀: {{item.fileSuffix}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">
                <Col span="22" v-if="!typeList.includes(item.ioType)">
                    输出格式: {{item.format}}
                </Col>
            </Row>
        </div>
        <Divider/>
        <p :style="textTheme">输出协议</p>
        <div class="demo-drawer-profile" v-if="protocolInfo.outputFormItem || protocolInfo.outputFormItem.name">
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    协议名称: {{protocolInfo.outputFormItem.name}}
                </Col>
                <Col span="12">
                    输出类型: {{typeFormat[protocolInfo.outputFormItem.ioType]}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">
                <Col span="22">
                    协议格式描述: {{protocolInfo.outputFormItem.ioDesc}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">

                <Col span="22" v-if="typeList.includes(protocolInfo.outputFormItem.ioType)">
                    文件后缀: {{protocolInfo.outputFormItem.fileSuffix}}
                </Col>
            </Row>
            <Row :style="{minHeight: '38px'}" type="flex" align="middle">
                <Col span="22" v-if="!typeList.includes(protocolInfo.outputFormItem.ioType)">
                    输出格式: {{protocolInfo.outputFormItem.format}}
                </Col>
            </Row>
        </div>
        <div style="height: 100px"></div>

    </div>
</template>

<script>
    export default {
        name: "ProtocolInformation",
        props: ['protocolInfo'],
        data() {
            return {
                typeFormat: ['SQL', '图表', '文本', '图片', '矩阵', '语音', '流数据'],
                typeList: [3, 5, 6],
                textTheme: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                }
            }
        },
    }
</script>

<style scoped>

</style>
