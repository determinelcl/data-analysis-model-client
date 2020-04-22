<template>
    <div>
        <ComponentTitle name="数据源管理" description="数据源管理：添加、删除、修改、查询"></ComponentTitle>
        <Modal :title="dataSourceModalText" v-model="addDataSourceModal" scrollable :mask-closable="false" width="600px"
               :footer-hide="true">
            <AddDataSource></AddDataSource>
        </Modal>
        <Modal v-model="delConfirm" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否删除当前数据源？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteDataSource()">删除</Button>
            </div>
        </Modal>

        <div :style="this.$store.state.style.contentStyle">
            <Row type="flex" justify="space-between" align="middle">
                <Col span="12">
                    <Input v-model="searchName" search size="large"
                           enter-button="搜索" placeholder="数据源名称、类型、方式"/>
                </Col>
                <Col span="3">
                    <Button size="large" icon="md-add" @click="addDataSource()">新增数据源</Button>
                </Col>
            </Row>
        </div>
        <div :style="{margin: '0 24px 16px 24px', padding: '0 0 16px 0', overflow: 'auto', position: 'relative'}">
            <Row :gutter="20">
                <Col style="margin-bottom: 16px" span="6" v-for="(dataSource, index) in dataSourceList"
                     :key="dataSource.id" :value="index">
                    <Card style="width:269px;">
                        <Row type="flex" align="middle">
                            <Col>
                                <div style="display:flex; align-items: center">
                                    <svg t="1587518237583" class="icon"
                                         style="height: 38px; width: 38px; border-radius: 50px"
                                         viewBox="0 0 1024 1024" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" p-id="1594" width="200" height="200">
                                        <path d="M880.697 737.555c-47.588-1.195-84.475 3.572-115.409 16.653-8.925 3.573-23.203 3.573-24.393 14.876 4.762 4.762 5.357 12.492 9.523 19.037 7.136 11.898 19.628 27.962 30.935 36.29 12.492 9.513 24.988 19.033 38.069 27.362 23.206 14.281 49.383 22.604 71.988 36.885 13.087 8.325 26.173 19.036 39.259 27.962 6.546 4.756 10.707 12.491 19.037 15.465v-1.785c-4.166-5.357-5.357-13.091-9.52-19.037-5.945-5.952-11.897-11.308-17.842-17.253-17.253-23.199-38.67-43.425-61.874-60.086-19.036-13.087-60.679-30.934-68.409-52.944 0 0-0.601-0.595-1.19-1.19 13.087-1.189 28.551-5.946 41.049-9.519 20.223-5.353 38.67-4.162 59.491-9.52 9.513-2.379 19.033-5.351 28.551-8.33v-5.351c-10.707-10.707-18.438-24.983-29.745-35.097-30.334-26.178-63.652-51.761-98.155-73.171-18.444-11.902-42.243-19.637-61.869-29.745-7.139-3.573-19.043-5.357-23.199-11.308-10.713-13.087-16.657-30.334-24.393-45.806-17.249-32.722-33.913-69.007-48.783-103.511-10.707-23.203-17.249-46.404-30.334-67.821-61.28-101.133-127.904-162.403-230.228-222.494-22.017-12.492-48.19-17.847-76.15-24.388-14.87-0.595-29.741-1.785-44.614-2.38-9.52-4.165-19.037-15.47-27.367-20.821-33.908-21.417-121.355-67.822-146.343-6.546-16.064 38.67 23.794 76.738 37.479 96.375 10.114 13.682 23.199 29.147 30.34 44.615 4.162 10.108 5.353 20.821 9.52 31.529 9.513 26.173 18.437 55.323 30.934 79.717 6.541 12.492 13.682 25.579 22.011 36.88 4.757 6.546 13.084 9.519 14.87 20.226-8.329 11.898-8.925 29.745-13.685 44.62-21.412 67.221-13.081 150.507 17.253 199.884 9.519 14.87 32.129 47.595 62.464 35.097 26.772-10.707 20.822-44.615 28.556-74.362 1.785-7.139 0.595-11.897 4.162-16.653v1.189c8.334 16.654 16.658 32.718 24.393 49.377 18.444 29.147 50.567 59.487 77.334 79.717 14.282 10.703 25.583 29.147 43.43 35.692v-1.789h-1.189c-3.573-5.353-8.925-7.731-13.682-11.898-10.711-10.707-22.61-23.794-30.939-35.69-24.983-33.314-46.995-70.198-66.627-108.273-9.519-18.444-17.847-38.67-25.579-57.107-3.572-7.139-3.572-17.847-9.523-21.417-8.925 13.087-22.004 24.388-28.551 40.453-11.301 25.579-12.492 57.106-16.659 89.826-2.384 0.599-1.19 0-2.384 1.189-19.033-4.756-25.579-24.388-32.718-41.049-17.844-42.236-20.822-110.058-5.353-158.835 4.166-12.491 22.016-51.757 14.876-63.652-3.572-11.301-15.47-17.847-22.011-26.772-7.735-11.302-16.064-25.579-21.417-38.075-14.282-33.31-21.421-70.194-36.885-103.511-7.139-15.465-19.632-31.53-29.745-45.805-11.301-16.060-23.794-27.367-32.718-46.405-2.973-6.541-7.139-17.249-2.379-24.388 1.189-4.757 3.568-6.541 8.33-7.735 7.73-6.546 29.744 1.785 37.475 5.353 22.011 8.925 40.453 17.253 58.896 29.745 8.325 5.951 17.249 17.253 27.957 20.226h12.496c19.037 4.166 40.453 1.194 58.297 6.546 31.529 10.114 60.086 24.985 85.669 41.049 77.929 49.377 142.177 119.575 185.606 203.456 7.135 13.682 10.108 26.178 16.658 40.453 12.487 29.152 27.957 58.896 40.448 87.447 12.492 27.962 24.389 56.517 42.237 79.722 8.925 12.487 44.615 19.033 60.679 25.579 11.898 5.353 30.34 10.114 41.049 16.654 20.227 12.492 40.453 26.773 59.491 40.453 9.519 7.139 39.265 22.015 41.049 33.913v0 0zM880.697 737.555z"
                                              p-id="1595" fill="#2575EC">
                                        </path>
                                    </svg>
                                    <b style="margin-left: 20px">{{dataSource.name}}</b>
                                </div>
                            </Col>
                        </Row>
                        <div style="margin: 15px 0">
                            <div>类型：{{dataSource.type}}</div>
                            <div>
                                状态：
                                <span :style="{color: `${dataSource.status === 0 ? '#19be6b': '#ed4014'}`}">
                                    {{dataSource.status === 0 ? '启用': '禁用'}}
                                </span>
                            </div>
                            <div>
                                存储方式：
                                <span :style="{color: `${dataSource.store === 0 ? '#2d8cf0': '#19be6b'}`}">
                                    {{dataSource.store === 0 ? '本地': '平台'}}
                                </span>
                            </div>
                            <div>创建时间：{{dataSource.updated}}</div>
                        </div>
                        <Divider style="margin: 0 0 8px 0"/>
                        <div style="display: flex; justify-content: space-around; height:30px;">

                            <div style="height: 100%; display: flex; justify-content: center; align-items: center">
                                <a>
                                    <span :style="{color: `${dataSource.status === 0 ? '#ed4014': '#19be6b'}`}">
                                        {{dataSource.status === 0 ? '禁用': '启用'}}
                                    </span>
                                </a>
                            </div>
                            <Divider type="vertical" style="height: 100%"/>
                            <div style="height: 100%; display: flex; justify-content: center; align-items: center">
                                <a>
                                    <span :style="{color: `${dataSource.store === 0 ? '#19be6b': '#2d8cf0'}`}">
                                        {{dataSource.store === 0 ? '平台': '本地'}}
                                    </span>
                                </a>
                            </div>
                            <Divider type="vertical" style="height: 100%"/>
                            <div style="height: 100%; display: flex; justify-content: center; align-items: center">
                                <a style="color: #ff9900;" @click="updateDataSource(index)">更新</a>
                            </div>
                            <Divider type="vertical" style="height: 100%"/>
                            <div style="height: 100%; display: flex; justify-content: center; align-items: center">
                                <a style="color: #ed4014;" @click="removeDataSource(index)">删除</a>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
    import ComponentTitle from "../../components/ComponentTitle";
    import AddDataSource from "./datasource/AddDataSource";

    export default {
        name: "DataSource",
        components: {AddDataSource, ComponentTitle},
        data() {
            return {
                searchName: '',
                addDataSourceModal: false,
                dataSourceModalText: '',
                delConfirm: false,
                dataSourceList: [
                    {
                        id: 1,
                        name: '数据源名称',
                        type: 'mysql',
                        status: 1,
                        store: 0,
                        updated: '2020-05-20 00:00:00',
                    },
                    {
                        id: 2,
                        name: '数据源名称',
                        type: 'mysql',
                        status: 0,
                        store: 0,
                        updated: '2020-05-20 00:00:00',
                    },
                    {
                        id: 3,
                        name: '数据源名称',
                        type: 'mysql',
                        status: 0,
                        store: 1,
                        updated: '2020-05-20 00:00:00',
                    },
                    {
                        id: 4,
                        name: '数据源名称',
                        type: 'mysql',
                        status: 0,
                        store: 0,
                        updated: '2020-05-20 00:00:00',
                    },
                    {
                        id: 5,
                        name: '数据源名称',
                        type: 'mysql',
                        status: 0,
                        store: 0,
                        updated: '2020-05-20 00:00:00',
                    },
                    {
                        id: 6,
                        name: '数据源名称',
                        type: 'mysql',
                        status: 0,
                        store: '本地',
                        updated: '2020-05-20 00:00:00',
                    },
                    {
                        id: 7,
                        name: '数据源名称',
                        type: 'mysql',
                        status: 0,
                        store: 1,
                        updated: '2020-05-20 00:00:00',
                    },
                    {
                        id: 8,
                        name: '数据源名称',
                        type: 'mysql',
                        status: 0,
                        store: 0,
                        updated: '2020-05-20 00:00:00',
                    }
                ]
            }
        },
        methods: {
            addDataSource() {
                this.addDataSourceModal = true;
                this.dataSourceModalText = '新增数据源';
            },
            updateDataSource(index) {
                console.log(index);
                this.addDataSourceModal = true;
                this.dataSourceModalText = '更新数据源';
            },
            removeDataSource(index) {
                console.log(index);
                this.delConfirm = true;
            },
            deleteDataSource() {

            }
        }
    }
</script>

<style lang="less" scoped>

    /deep/ .ivu-card-body {
        padding-bottom: 8px !important;
    }
</style>
