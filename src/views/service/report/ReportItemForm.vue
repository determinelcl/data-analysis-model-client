<template>
    <Form :model="formDynamic" v-if="formDynamic" :label-width="100" label-position="left">

        <FormItem
                style="margin-bottom: 15px;"
                :label-width="50"
                label-position="top"
                v-for="(item, index) in formDynamic.items"
                :key="item.step">
            <div style="border: 1px dashed #dcdee2; padding: 10px; border-radius: 10px">
                <Row type="flex" :gutter="32">

                    <Col span="12">
                        <FormItem label="报表项名称" prop="name">
                            <Input v-model="item.title" placeholder="报表项名称"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="数据" prop="visualDataId">
                            <Select v-model="item.visualDataId" placeholder="选择报表项数据">
                                <Option v-for="visualData in formDynamic.visualDataList"
                                        :key="visualData.id" :value="visualData.id">
                                    {{visualData.protocolFormat ? visualData.protocolFormat.name : '无'}}
                                </Option>
                            </Select>
                        </FormItem>
                    </Col>

                </Row>
                <Row type="flex" :gutter="32">
                    <Col span="12">
                        <FormItem label="横坐标" prop="abscissa">
                            <Input v-model="item.abscissa" placeholder="横坐标"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="横坐标跨度" prop="abscissa_span">
                            <Input v-model="item.abscissaSpan" placeholder="横坐标跨度"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" :gutter="32">
                    <Col span="12">
                        <FormItem label="纵坐标" prop="ordinate">
                            <Input v-model="item.ordinate" placeholder="纵坐标"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="纵坐标跨度" prop="ordinate_span">
                            <Input v-model="item.ordinateSpan" placeholder="纵坐标跨度"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" :gutter="32">
                    <Col span="24">
                        <FormItem label="描述" prop="description">
                            <Input v-model="item.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                   placeholder="请输入报表项的说明信息"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" :gutter="32" style="margin-top: 10px">
                    <Col span="24">
                        <Button type="dashed" v-if="index !== 0" @click="handleRemove(item.step)" style="margin-right: 20px">移除
                        </Button>
                    </Col>
                </Row>
            </div>
        </FormItem>
        <FormItem>
            <Row>
                <Col span="12">
                    <Button type="dashed" long @click="handleAdd" icon="md-add">Add item</Button>
                </Col>
            </Row>
        </FormItem>
    </Form>
</template>

<script>
    export default {
        name: "ReportItemForm",
        props: ['formDynamic'],
        methods: {
            handleAdd() {
                this.formDynamic.step++;
                this.formDynamic.items.push({
                    step: this.formDynamic.step,
                    title: '',
                    visualDataId: null,
                    abscissa: 0,
                    ordinate: 0,
                    abscissaSpan: 0,
                    ordinateSpan: 0,
                    description: ''
                });
            },
            handleRemove(index) {
                let start = this.formDynamic.items.findIndex(item => item.step === index);
                this.formDynamic.items.splice(start, 1)
            }
        }
    }
</script>

<style scoped>

</style>
