<template>
    <div>
        <ComponentTitle name="模型协议管理" description="模型协议管理：添加、删除、修改、查询协议"></ComponentTitle>
        <div :style="this.$store.state.style.contentStyle">
            <Drawer :title="editProtocolText" v-model="editProtocol" width="1183"
                    :mask-closable="false" :styles="editProtocolStyle">
                <EditProtocol></EditProtocol>
            </Drawer>
            <Drawer v-model="protocolInfo" width="1183" :closable="false">
                <ProtocolInformation></ProtocolInformation>
            </Drawer>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p>是否删除当前协议？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="deleteProtocol()">删除</Button>
                </div>
            </Modal>

            <Form ref="formInline" :model="searchForm">
                <Row :gutter="10" type="flex" :style="{padding: 0, height: '38px'}">
                    <Col span="6">
                        <FormItem label="名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '180px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="状态：" prop="version" label-position="left">
                            <Select v-model="searchForm.status" filterable allow-create clearable style="width: 130px">
                                <Option :value="0">启用</Option>
                                <Option :value="1">禁用</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem label="类型：" prop="version" label-position="left">
                            <Select v-model="searchForm.public" filterable allow-create clearable style="width: 100px">
                                <Option :value="0">公开</Option>
                                <Option :value="1">私有</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchProtocol()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchProtocol()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Divider></Divider>
            <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
                <Col span="24">
                    <Button type="dashed" @click="addProtocol()"
                            :style="{width: '100%'}" icon="md-add">新增协议
                    </Button>
                </Col>
            </Row>
            <List>
                <ListItem v-for="(item, index) in data" :key="item.id">
                    <ListItemMeta :title="item.name" :description="item.description"/>
                    <Row type="flex" justify="center" align="middle" :gutter="38"
                         :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                        <Col>
                            <div class="list-description">状态</div>
                            <div :style="{width: '50px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': '#ff9900'}` }">
                                {{item.status === 0 ? '启用': '禁用'}}
                            </div>
                        </Col>
                        <Col>
                            <div class="list-description">类型</div>
                            <div :style="{width: '50px', alignContent: 'center', color: `${item.public === 0 ? '#19be6b': '#ff9900'}` }">
                                {{item.public === 0 ? '公开': '私有'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 138px; align-content: center">更新日期</div>
                            <div style="width: 138px; align-content: center">{{item.updated}}</div>
                        </Col>
                        <Col>
                            <a style="margin: 0 3px; color: #19be6b" @click="showProtocolDetail(index)">详情</a>
                            |
                            <a style="margin: 0 3px; color: #ff9900" @click="updateProtocol(index)">更新</a>
                            |
                            <a style="margin: 0 3px; color:#ed4014;" @click="removeProtocol(index)">删除</a>
                        </Col>
                    </Row>
                </ListItem>
            </List>

            <Divider></Divider>
            <div style="display: flex; justify-content: center;">
                <Page v-model="page" :total="page.total" :current="page.current" @on-change="changePage"
                      show-elevator :page-size-opts="page.sizeOpts" :page-size="page.size"
                      show-sizer show-total @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import ComponentTitle from "../../components/ComponentTitle";
    import EditProtocol from "./protocol/EditProtocol";
    import ProtocolInformation from "./protocol/ProtocolInformation";

    export default {
        name: "Protocol",
        components: {ProtocolInformation, EditProtocol, ComponentTitle},
        data() {
            return {
                editProtocol: false,
                editProtocolText: '',
                protocolInfo: false,
                delConfirm: false,
                protocolFormItem: {
                    name: '计算机视觉',
                    public: 0,
                    status: true,
                    groupId: 0,
                    group: {name: '深度学习'},
                    tagId: 0,
                    tagList: [
                        {id: 1, name: '推荐系统'},
                        {id: 2, name: '分类算法'}
                    ],
                    git: 'https://github.com/alibaba/Sentinel',
                    description: '这是使用神经网络实现实现的性能最优的视觉算法模型'
                },
                editProtocolStyle: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                searchForm: {
                    name: null,
                    status: null,
                    public: null
                },
                page: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50]
                },
                tableColumns: [
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            const row = params.row;
                            const color = row.status === 0 ? 'success' : 'error';
                            const text = row.status === 0 ? '激活' : '禁用';

                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, text);
                        }
                    },
                    {title: '发布者', key: 'publisher'},
                    {title: '更新日期', key: 'updated'}
                ],
                data: [
                    {
                        id: 1,
                        name: '图像识别协议',
                        description: '这是一个图像识别的组件',
                        status: 0,
                        public: 0,
                        updated: '2020-04-30 00:00:00'
                    },
                    {
                        id: 2,
                        name: '支持向量机协议',
                        description: '这是一个分类器',
                        status: 0,
                        public: 0,
                        updated: '2020-04-30 00:00:00',
                    },
                    {
                        id: 3,
                        name: '文字识别协议',
                        description: '这是一个神经网络模型',
                        status: 1,
                        public: 1,
                        updated: '2020-04-30 00:00:00'
                    }
                ]
            }
        },
        methods: {
            searchProtocol() {

            },
            resetSearchProtocol() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
            },
            showProtocolDetail(index) {
                console.log(index);
                this.protocolInfo = true;
            },
            addProtocol() {
                this.editProtocolText = '添加协议';
                this.editProtocol = true;
            },
            updateProtocol(index) {
                console.log(index);
                this.editProtocolText = '更新协议';
                this.editProtocol = true;
            },
            removeProtocol(index) {
                console.log(index);
                this.delConfirm = true;
            },
            deleteProtocol() {

            },
            // 切换页面
            changePage(page) {
                this.page.current = page;
                // this.loadTableData();
            },
            changePageSize(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.page.size = pageSize;
                this.page.current = 1;

                // this.loadTableData()
            },
        }
    }
</script>

<style scoped>

</style>
