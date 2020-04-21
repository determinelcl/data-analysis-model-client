<template>
    <div style="margin: 30px 20px 0 20px">
        <Modal v-model="delBatchConfirm" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否删除选中的版本？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteVersionBatch()">删除</Button>
            </div>
        </Modal>

        <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
            <Col span="5">
                <Button type="primary" @click="addVersion()"
                        :style="{width: '108px'}" icon="md-add">新增版本
                </Button>
            </Col>
            <Col span="5">
                <Button @click="removeVersionBatch()" :style="{width: '108px'}">
                    <Icon type="ios-trash-outline" size="17"/>
                    批量删除
                </Button>
            </Col>
            <Col span="5">
                <Dropdown @on-click="changVersionStatus">

                    <Button :style="{width: '108px'}">
                        更过操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="0">启用版本</DropdownItem>
                        <DropdownItem name="2">禁用版本</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
        </Row>
        <Table :columns="versionColumn" :data="versionList" :show-header="false"></Table>
    </div>
</template>

<script>
    import ModelVersion from "./ModelVersion";

    export default {
        name: "VersionTable",
        data() {
            return {
                delBatchConfirm: false,
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
                    }
                ],
                versionList: [
                    {
                        name: '1.0.0',
                        tag: 1,
                        public: 1,
                        status: true,
                        description: '当前版本为最新稳定版',
                        copyright: '86394305313880343813748392',
                        copyrightType: 0,
                        copyrightDesc: '测试的版权标识',
                        _expanded: true
                    },
                    {
                        name: '1.2.0',
                        tag: 3,
                        public: 1,
                        status: true,
                        description: '当前版本为测试版',
                        copyright: '86394305313880343813748392',
                        copyrightType: 0,
                        copyrightDesc: '测试的版权标识'
                    },
                    {
                        name: '1.2.1',
                        tag: 4,
                        public: 1,
                        status: false,
                        description: '当前版本为Snapshot版本',
                        copyright: '86394305313880343813748392',
                        copyrightType: 0,
                        copyrightDesc: '测试的版权标识',
                        _disableExpand: true
                    }
                ]
            }
        },
        methods: {
            addVersion() {
                this.versionList.forEach(version => {
                    version['_expanded'] = false;
                    version['_disableExpand'] = true;
                })

                let version = {
                    name: '0.0.0',
                    tag: 4,
                    public: 1,
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
            changVersionStatus() {

            },
            removeVersionBatch() {
                this.delBatchConfirm = true;
            },
            deleteVersionBatch() {

            },
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-table-expanded-cell {
        background: none;
    }
</style>
