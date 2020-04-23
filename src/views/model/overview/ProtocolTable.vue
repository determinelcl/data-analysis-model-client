<template>
    <div>
        <Drawer v-model="protocolInfo" width="1183" :closable="false">
            <ProtocolInformation></ProtocolInformation>
        </Drawer>

        <Form ref="formInline" :model="searchForm" label-width="60">
            <Row :gutter="32" type="flex" :style="{padding: 0, height: '38px'}">
                <Col span="8">
                    <FormItem label="名称：" prop="name" label-position="left">
                        <Input type="text" v-model="searchForm.name" placeholder="请输入"/>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="状态：" prop="version" label-position="left">
                        <Select v-model="searchForm.status" filterable clearable >
                            <Option :value="0">启用</Option>
                            <Option :value="1">禁用</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                    <FormItem>
                        <Button type="primary" @click="searchProtocol()" style="margin-right: 20px">查询</Button>
                        <Button @click="resetSearchProtocol()">重置</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Divider></Divider>
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
                        <div style="width: 100px; align-content: center">发布者</div>
                        <div style="width: 100px; align-content: center">
                            <a>{{item.publisher}}</a>
                        </div>
                    </Col>
                    <Col>
                        <div style="width: 138px; align-content: center">更新日期</div>
                        <div style="width: 138px; align-content: center">{{item.updated}}</div>
                    </Col>
                    <Col>
                        <Button type="success" size="small" @click="showProtocolDetail(index)">详情</Button>
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
</template>

<script>
    import ProtocolInformation from "../protocol/ProtocolInformation";

    export default {
        name: "ProtocolTable",
        components: {ProtocolInformation},
        data() {
            return {
                protocolInfo: false,
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
                        updated: '2020-04-30 00:00:00',
                        publisher: 'determination'
                    },
                    {
                        id: 2,
                        name: '支持向量机协议',
                        description: '这是一个分类器',
                        status: 0,
                        public: 0,
                        updated: '2020-04-30 00:00:00',
                        publisher: 'determination'
                    },
                    {
                        id: 3,
                        name: '文字识别协议',
                        description: '这是一个神经网络模型',
                        status: 1,
                        public: 1,
                        updated: '2020-04-30 00:00:00',
                        publisher: 'determination'
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
