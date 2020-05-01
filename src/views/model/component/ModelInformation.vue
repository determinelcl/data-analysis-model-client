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
                    <Tag color="green">
                        {{modelInfo.group.name}}
                    </Tag>
                </Col>
                <Col span="12">
                    状态:
                    <Tag type="dot" :color="modelInfo.status ? 'success' : 'error'">
                        {{modelInfo.status ? '启用' : '禁用'}}
                    </Tag>
                </Col>
            </Row>
            <Row :style="{height: '38px'}" type="flex" align="middle">
                <Col span="12">
                    标签:
                    <Tag v-for="tag in modelInfo.tagList" :key="tag.id" color="orange">
                        {{tag.name}}
                    </Tag>
                </Col>
                <Col span="12">
                    类型:
                    <Tag type="dot" :color="modelInfo.public === 0 ? 'success' : 'primary'">
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
            <Table :columns="versionColumn" :data="versionList"></Table>
        </div>
        <Divider/>
        <p :style="textTheme">测试报告</p>
        <div class="demo-drawer-profile">

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
    import ActiveInfo from "./ActiveInfo";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "ModelInformation",
        components: {ActiveInfo},
        data() {
            return {
                modelInfo: null,
                versionColumn: [
                    {
                        title: '版本',
                        key: 'name'
                    },
                    {
                        title: '标识',
                        key: 'type',
                        render: (h, params) => {
                            let row = params.row;
                            let versionTag = ['最新新版本', '最新稳定版本', '稳定版本', '测试版本', '快照版本']

                            return h('div', versionTag[row.type]);
                        }
                    },
                    {
                        title: '类型',
                        key: 'publicType',
                        render: (h, params) => {
                            let row = params.row;

                            return h('div', row.publicType === 0 ? '公开' : '私有');
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            let row = params.row;

                            return h('div', {
                                style: {
                                    width: '30px',
                                    alignContent: 'center',
                                    color: `${row.status ? '#19be6b' : '#ed4014'}`
                                }
                            }, row.status ? '启用' : '禁用');
                        }
                    },
                    {
                        title: '模型大小',
                        key: 'modelSize',
                        width: 50,
                        tooltip: true,
                    },
                    {
                        title: '协议',
                        key: 'protocol',
                        width: 50,
                        tooltip: true,
                        render: (h, params) => {
                            let row = params.row;
                            return h('div', row.protocol.name);
                        }
                    },
                    {
                        title: '版权标识',
                        key: 'copyright',
                        width: 150,
                        tooltip: true
                    },
                    {
                        title: '版权类型',
                        key: 'copyrightType',
                        render: (h, params) => {
                            let row = params.row;
                            let copyrightTypeList = ['专利', '软件著作权', '其他']

                            return h('div', copyrightTypeList[row.copyrightType]);
                        }
                    },
                    {
                        title: '版权图片',
                        key: 'copyrightImg',
                        render: (h, params) => {
                            let row = params.row;
                            // todo: 访问版权的图片

                            return h('div', row.copyrightImg);
                        }
                    },
                    {
                        title: '版权说明',
                        key: 'copyrightDesc',
                        tooltip: true,
                        render: (h, params) => {
                            let row = params.row;
                            // todo: 访问版权的图片

                            return h('div', row.copyrightDesc);
                        }
                    },
                    {
                        title: '描述',
                        key: 'description',
                        tooltip: true
                    },
                ],
                versionList: [],
                textTheme: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                }
            }
        },
        methods: {
            loadModelInformation(modelId) {
                // 加载模型详情信息
                this.axios.get(`/model-server/detail/${modelId}`).then(({data}) => {
                    this.modelInfo = data.data;
                    this.versionList = data.data.versionList;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            }
        },
        mounted() {
            this.$on('loadModelInfo', (model) => {
                this.loadModelInformation(model.id)
                this.$refs.activeInfoRef.$emit("loadActiveInfo", model, 0);
            });
        }
    }
</script>

<style scoped>

</style>
