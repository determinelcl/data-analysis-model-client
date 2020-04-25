<template>
    <div>
        <h2>新消息通知</h2>
        <List style="padding: 0 16px; margin-top: 16px" :split="false">
            <ListItem>
                <ListItemMeta title="评论/恢复消息" description="其他用户对模型、博文等进行评论/恢复时，接受消息通知" />
                <template slot="action">
                    <li>
                        <i-switch>
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="点赞消息设置" description="其他用户对模型、博文等点赞时，接受消息通知" />
                <template slot="action">
                    <li>
                        <i-switch>
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="关注消息设置" description="其他用户关注我时，接收消息通知" />
                <template slot="action">
                    <li>
                        <i-switch>
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="邮件消息设置" description="重要事件发生时，接收消息通知" />
                <template slot="action">
                    <li>
                        <i-switch>
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="异常消息设置" description="运行的服务出现异常时，接收消息通知" />
                <template slot="action">
                    <li>
                        <i-switch>
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </li>
                </template>
            </ListItem>
        </List>
    </div>
</template>

<script>
    export default {
        name: "MessageNotification"
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-list-item {
        padding: 0;
    }
</style>
