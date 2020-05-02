<template>
    <div>
        <ComponentTitle name="模型管理" description="模型管理：添加、删除、修改、查询模型基本信息，以及版本管理、评论、点赞、关注和收藏"></ComponentTitle>

        <div :style="this.$store.state.style.contentStyle">
            <Spin fix v-if="spinShow">
                <LoadingIcon></LoadingIcon>
            </Spin>
            <Drawer title="上传模型" v-model="uploadModel" width="720"
                    :mask-closable="false" :styles="uploadModelStyle">
                <UploadModel ref="uploadModelRef" @completeTask="editModelCompleteTask" @addSuccess="addModelSuccess"></UploadModel>
            </Drawer>
            <Drawer title="版本管理" v-model="versionManagement" width="720" :mask-closable="false">
                <VersionTable ref="versionListRef"></VersionTable>
            </Drawer>
            <Drawer title="更新模型信息" v-model="modelForm" width="720" :mask-closable="false">
                <ModelForm ref="modelFormRef" :form-item="modelFormItem" operation="update" @addSuccess="addModelSuccess"></ModelForm>
            </Drawer>
            <Drawer v-model="modelInformation" width="720" :closable="false" draggable>
                <ModelInformation ref="modelInfoRef"></ModelInformation>

            </Drawer>
            <Modal v-model="delConfirm" width="360">
                <p slot="header" style="color:#f60;text-align:center">
                    <Icon type="ios-information-circle"></Icon>
                    <span>删除确认</span>
                </p>
                <div style="text-align:center">
                    <p> 删除当前模型<b style='color: #f60;'>将会删除当前模型的所有版本</b>，是否删除当前模型？</p>
                </div>
                <div slot="footer">
                    <Button type="error" size="large" long @click="deleteModel()">删除</Button>
                </div>
            </Modal>

            <Form ref="formInline" :model="searchForm">
                <Row type="flex" justify="space-between" :style="{padding: 0, height: '38px'}" :gutter="15">
                    <Col span="8">
                        <FormItem label="模型名称：" prop="name" label-position="left">
                            <Input type="text" v-model="searchForm.name" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="发布者：" prop="version" label-position="left">
                            <Input type="text" v-model="searchForm.username" placeholder="请输入"
                                   :style="{width: '252px'}"/>
                        </FormItem>
                    </Col>
                    <Col span="8" :style="{display: 'flex', justifyContent:'flex-end', paddingRight: '20px'}">
                        <FormItem>
                            <Button type="primary" @click="searchModel()">查询</Button>
                        </FormItem>
                        <span :style="{width: '10px'}"></span>
                        <FormItem>
                            <Button @click="resetSearchModel()">重置</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Divider></Divider>
            <Row type="flex" justify="start" :style="{padding: 0, margin: '0 0 20px 0'}">
                <Col span="24">
                    <Button type="dashed" @click="uploadModelAction()"
                            :style="{width: '100%'}" icon="md-add">上传模型
                    </Button>
                </Col>
            </Row>
            <List>
                <ListItem v-for="(item, index) in tableData" :key="item.id">
                    <ListItemMeta :title="item.name" :description="item.description"/>
                    <Row type="flex" justify="center" align="middle" :gutter="38"
                         :style="{color: 'rgba(0,0,0,.45)', height: '100%'}">
                        <Col>
                            <div class="list-description">状态</div>
                            <div :style="{width: '30px', alignContent: 'center', color: `${item.status === 0 ? '#19be6b': '#ed4014'}` }">
                                {{item.status === 0 ? '启用': '禁用'}}
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 90px; align-content: center">发布者</div>
                            <div style="width: 90px; align-content: center">
                                <a>{{item.username}}</a>
                            </div>
                        </Col>
                        <Col>
                            <div style="width: 138px; align-content: center">更新日期</div>
                            <div style="width: 138px; align-content: center">{{item.updated}}</div>
                        </Col>
                        <Col>
                            <div>动态</div>
                            <div style="display: flex;">
                                <li style="margin-right: 5px">
                                    <Icon type="ios-star-outline" size="15" :color="'#ff9900'"/>
                                    {{item.starSize}}
                                </li>
                                <li style="margin-right: 5px">
                                    <Icon type="ios-thumbs-up-outline" size="15" :color="'#19be6b'"/>
                                    {{item.thumbsUpSize}}
                                </li>
                                <li>
                                    <Icon type="ios-chatbubbles-outline" size="15" :color="'#2d8cf0'"/>
                                    {{item.commentSize}}
                                </li>
                            </div>
                        </Col>
                        <Col>
                            <a style="margin: 0 3px; color: #2d8cf0" @click="showModelVersion(index)">版本</a>
                            |
                            <a style="margin: 0 3px; color: #19be6b" @click="showModelDetail(index)">详情</a>
                            |
                            <a style="margin: 0 3px; color: #ff9900" @click="updateModel(index)">更新</a>
                            |
                            <a style="margin: 0 3px; color:#ed4014;" @click="removeModel(index)">删除</a>
                        </Col>
                    </Row>
                </ListItem>
            </List>

            <Divider></Divider>
            <div style="display: flex; justify-content: center;">
                <Page v-model="pageModel" :total="pageModel.total" :current="pageModel.current" @on-change="changePage"
                      show-elevator :page-size-opts="pageModel.sizeOpts" :page-size="pageModel.size"
                      show-sizer show-total @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
    </div>
</template>

<script>
    import ComponentTitle from "../../components/ComponentTitle";
    import UploadModel from "./component/UploadModel";
    import VersionTable from "./component/VersionTable";
    import ModelForm from "./component/ModelForm";
    import ModelInformation from "./component/ModelInformation";
    import {deepClone} from "../../util/object.util";
    import {errorMessage} from "../../util/message.util";
    import LoadingIcon from "../../components/LoadingIcon";

    export default {
        name: "Management",
        components: {LoadingIcon, ModelInformation, ModelForm, VersionTable, UploadModel, ComponentTitle},
        data() {
            return {
                spinShow: false,
                uploadModel: false,
                versionManagement: false,
                modelForm: false,
                modelInformation: false,
                delConfirm: false,
                delConfirmIndex: -1,
                modelFormItem: {
                    name: '计算机视觉',
                    publicType: 0,
                    status: 0,
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
                uploadModelStyle: {
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: '53px',
                    position: 'static'
                },
                searchForm: {
                    name: null,
                    username: null
                },
                pageModel: {
                    total: 100,
                    current: 1,
                    size: 10,
                    sizeOpts: [10, 20, 30, 40, 50],
                    paged: true
                },
                tableData: []
            }
        },
        methods: {
            editModelCompleteTask() {
                this.updateModel = false;
            },
            addModelSuccess() {
                this.uploadModel = false;
                this.modelForm = false;
                this.loadTableData()
            },
            searchModel() {
                this.loadTableData()
            },
            resetSearchModel() {
                Object.keys(this.searchForm).forEach(prop => this.searchForm[prop] = null)
                this.searchForm.modelType = 0
            },
            uploadModelAction() {
                this.uploadModel = true
                this.$refs.uploadModelRef.$emit('loadData');
            },
            showModelVersion(index) {
                this.versionManagement = true;
                // 在进入版本管理之前首先加载版本列表
                this.$refs.versionListRef.$emit("loadVersionList", this.tableData[index]);
            },
            showModelDetail(index) {
                console.log(index);
                this.modelInformation = true;
                let model = this.tableData[index];
                this.$refs.modelInfoRef.$emit('loadModelInfo', model)
            },
            updateModel(index) {
                console.log(index);
                this.modelForm = true;
                this.modelFormItem = this.tableData[index]
                console.log(this.modelFormItem)
                this.$refs.modelFormRef.$emit('loadClassificationData')
            },
            removeModel(index) {
                console.log(index);
                this.delConfirm = true;
                this.delConfirmIndex = index;
            },
            deleteModel() {
                let modelId = this.tableData[this.delConfirmIndex].id;

                this.axios.delete(`/model-server/delete/${modelId}`).then(({data}) => {
                    console.log(data)
                    this.delConfirm = false;
                    this.loadTableData()
                }).catch(error => {
                    console.log(error)
                    this.delConfirm = false;
                    errorMessage(error, this);
                });
            },
            // 切换页面
            changePage(pageCurrent) {
                this.pageModel.current = pageCurrent;
                this.loadTableData();
            },
            changePageSize(pageSize) {
                // 如果每页显示的数据发生改变，则还是从第一页开始查询
                this.pageModel.size = pageSize;
                this.pageModel.current = 1;

                this.loadTableData()
            },
            loadTableData() {
                let condition = deepClone(this.searchForm);
                Object.assign(condition, this.pageModel)
                // 显示加载提示信息
                this.spinShow = true;
                // 加载模型列表数据
                this.axios.post('/model-server/list', condition).then(({data}) => {
                    this.tableData = data.data.data;
                    this.pageModel.total = data.data.total;
                    this.spinShow = false;
                }).catch(error => {
                    console.log(error)
                    this.spinShow = false;
                    errorMessage(error, this);
                });
            }
        },
        created() {
            this.loadTableData();
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-list-item-extra {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;

    }

    /deep/ .ivu-table-header th {
        background: none;
    }

    .list-description {
        width: 50px;
        align-content: center;
        color: rgba(0, 0, 0, .45);
    }

    /deep/ .version-selection .ivu-select-selection {
        border: none;
        box-shadow: none;
    }
</style>
