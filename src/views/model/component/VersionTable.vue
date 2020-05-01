<template>
    <div style="margin: 30px 20px 0 20px">
        <Modal v-model="delConfirm" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否删除当前的版本？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteVersion()">删除</Button>
            </div>
        </Modal>

        <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
            <Col span="5">
                <Button type="primary" @click="addVersion()"
                        :style="{width: '108px'}" icon="md-add">新增版本
                </Button>
            </Col>
        </Row>
        <Table :columns="versionColumn" :data="versionList" :show-header="false">
            <template slot-scope="{ row, index }" slot="action">
                <a style="margin: 0 3px; color: #19be6b" @click="enableVersion(index)">启用</a>
                |
                <a style="margin: 0 3px; color: #ff9900" @click="deprecateVersion(index)">Deprecated</a>
                |
                <a style="margin: 0 3px; color: #ed4014" @click="disableVersion(index)">禁用</a>
                |
                <a style="margin: 0 3px; color:#ed4014;" @click="removeVersion(index)">删除</a>
            </template>
        </Table>
    </div>
</template>

<script>
    import ModelVersion from "./ModelVersion";
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "VersionTable",
        data() {
            return {
                delConfirm: false,
                delConfirmIndex: -1;
                versionColumn: [
                    {type: 'selection', width: 60, align: 'center'},
                    {
                        type: 'expand',
                        width: 20,
                        render: (h, params) => {
                            return h(ModelVersion, {
                                props: {
                                    formItem: params.row,
                                    operation: 'update'
                                }
                            })
                        }
                    },
                    {
                        title: '版本',
                        key: 'name'
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
                        title: '描述',
                        key: 'description',
                        tooltip: true
                    },
                    {title: '操作', slot: 'action', width: 180, align: 'center'}
                ],
                versionList: []
            }
        },
        methods: {
            addVersion() {
                this.versionList.forEach(version => {
                    version['_expanded'] = false;
                    version['_disableExpand'] = true;
                })

                let version = {
                    name: '1.0.0',
                    type: 4,
                    public: 0,
                    status: false,
                    description: '新增版本的默认值',
                    copyright: '',
                    copyrightType: 0,
                    copyrightDesc: '',
                    _disableExpand: false,
                    _expanded: true
                }
                this.versionList.push(version);
            },
            enableVersion(index) {
                let versionId = this.versionList[index].id;

                this.axios.patch(`/model-server/version/enable/${versionId}`).then(({data}) => {
                    console.log(data)
                    this.versionList[index].status = 0;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            deprecateVersion(index) {
                let versionId = this.versionList[index].id;

                this.axios.patch(`/model-server/version/deprecate/${versionId}`).then(({data}) => {
                    console.log(data)
                    this.versionList[index].status = 2;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            disableVersion(index) {
                let versionId = this.versionList[index].id;

                this.axios.patch(`/model-server/version/disable/${versionId}`).then(({data}) => {
                    console.log(data)
                    this.versionList[index].status = 1;
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            removeVersion(index) {
                this.delConfirm = true;
                this.delConfirmIndex = index;
            },
            deleteVersion() {
                let versionId = this.versionList[this.delConfirmIndex].id;

                this.axios.delete(`/model-server/version/delete/${versionId}`).then(({data}) => {
                    console.log(data)
                    this.versionList.slice(this.delConfirmIndex, 1)
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            },
            loadVersionData(modelId) {
                // 加载模型版本列表数据
                this.axios.get(`/model-server/version/list/${modelId}`).then(({data}) => {
                    this.versionList = data.data;
                    this.versionList[0]['_expanded'] = true
                }).catch(error => {
                    console.log(error)
                    errorMessage(error, this);
                });
            }
        },
        mounted() {
            this.$on('loadVersionList', (model) => {
                this.loadVersionData(model.id)
            });
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-table-expanded-cell {
        background: none;
    }
</style>
