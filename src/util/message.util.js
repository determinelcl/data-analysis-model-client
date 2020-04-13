export function errorMessage(error, _this) {
    if (error.response) {
        if (error.response.data.message instanceof Array) {
            error.response.data.message.forEach(msg => _this.$Message.error(msg))
        } else {
            _this.$Message.error(`${error.response.data.message}`)
        }
    } else if (error.request) {
        _this.$Message.error(`请求失败，请检查网络连接是否正常！`)
        console.log(error.request)
    } else {
        _this.$Message.error(`${error.message}`)
    }
}
