<template>
    <div>
        <h2>账号绑定</h2>
        <List style="padding: 0 16px; margin-top: 16px" :split="false">
            <ListItem>
                <ListItemMeta title="QQ" description="当前未绑定QQ账号">
                    <template slot="avatar">
                        <div style="height: 50px; width: 50px; display: flex; justify-content: center; align-items: center">
                            <svg class="icon" >
                                <use xlink:href="#icon-QQ"></use>
                            </svg>
                        </div>
                    </template>
                </ListItemMeta>
                <template slot="action">
                    <li>
                        <a href="">绑定</a>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="微信" description="当前未绑定微信账号">
                    <template slot="avatar">
                        <div style="height: 50px; width: 50px; display: flex; justify-content: center; align-items: center">
                            <svg class="icon" >
                                <use xlink:href="#icon-weixin"></use>
                            </svg>
                        </div>
                    </template>
                </ListItemMeta>
                <template slot="action">
                    <li>
                        <a href="">绑定</a>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="微博" description="当前未绑定微博账号">
                    <template slot="avatar">
                        <div style="height: 50px; width: 50px; display: flex; justify-content: center; align-items: center">
                            <svg class="icon" >
                                <use xlink:href="#icon-weibo"></use>
                            </svg>
                        </div>
                    </template>
                </ListItemMeta>
                <template slot="action">
                    <li>
                        <a href="">绑定</a>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="钉钉" description="当前未绑定钉钉账号">
                    <template slot="avatar">
                        <div style="height: 50px; width: 50px; display: flex; justify-content: center; align-items: center">
                            <svg class="icon" >
                                <use xlink:href="#icon-dingding"></use>
                            </svg>
                        </div>
                    </template>
                </ListItemMeta>
                <template slot="action">
                    <li>
                        <a href="">绑定</a>
                    </li>
                </template>
            </ListItem>
        </List>
    </div>
</template>

<script>
    export default {
        name: "AccountBinding"
    }
</script>

<style lang="less" scoped>
    .icon {
        width: 30px;
        height: 30px;
    }

    /deep/ .ivu-list-item {
        padding: 0;
    }
</style>
