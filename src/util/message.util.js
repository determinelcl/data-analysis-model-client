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

// 渲染成提示框
export function renderPopTip(h, showText) {
    if (showText.indexOf(',', 0) === 0)
        showText = showText.slice(1, showText.length)

    // 如果字符串长度超过10位，则多余的使用提示框进行显示
    let text = showText;
    if (showText && showText.length > 10)
        text = `${text.slice(0, 9)}...`

    return h('Poptip', {
        props: {
            trigger: 'hover',
            placement: 'right',
            width: 300,
            height: 300,
            wordWrap: true,
            transfer: true
        }
    }, [
        h('div', text),
        h('p', {
            slot: 'content'
        }, [
            h('div', {style: {wordWrap: 'break-word'}}, showText)
        ])
    ])
}
