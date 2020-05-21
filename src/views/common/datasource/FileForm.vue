<template>
    <div>
        <FormItem label="数据文件">
            <Upload multiple type="drag" action="http://localhost:9000/filesystem-server/upload"
                    :format="accept" show-upload-list
                    :headers="tokenParam"
                    :on-success="handleSuccess"
                    :on-error="handleError">
                <div style="padding: 20px 0">
                    <Icon type="ios-cloud-upload" size="30" style="color: #3399ff"></Icon>
                    <p>点击或拖拽上传数据源文件</p>
                </div>
            </Upload>
        </FormItem>
    </div>
</template>

<script>
    import {TOKEN_INFORMATION} from '../../../constant/system';
    import {errorMessage} from "../../../util/message.util";

    export default {
        name: "FileForm",
        props: ['accept', 'file'],
        data() {
            return {
                token: TOKEN_INFORMATION
            }
        },
        computed: {
            tokenParam: {
                get() {
                    let tokenInformation = localStorage.getItem(TOKEN_INFORMATION)
                    if (tokenInformation && JSON.parse(tokenInformation).access_token)
                        return {'Authorization': `Bearer ${JSON.parse(tokenInformation).access_token}`}
                    return {}
                }
            }
        },
        methods: {
            handleSuccess(response, file, fileList) {
                this.file.url = response.data
                console.log(response)
                console.log(file)
                console.log(fileList)
            },
            handleError(error, file, fileList) {
                errorMessage(error, this)
                console.log(file)
                console.log(fileList)
            }
        }
    }
</script>

<style scoped>

</style>
