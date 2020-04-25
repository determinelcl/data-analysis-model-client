<template>
    <div>
        <h2>安全设置</h2>
        <List style="padding: 0 16px; margin-top: 16px" :split="false">
            <ListItem>
                <ListItemMeta title="账号密码" description="绑定手机和邮箱，并设置密码，帐号更安全" />
                <template slot="action">
                    <li>
                        <a href="">修改</a>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="绑定手机" description="已绑定手机号：15151961231" />
                <template slot="action">
                    <li>
                        <a href="">修改</a>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="绑定邮箱" description="已绑定邮箱：timecyc@outlook.com" />
                <template slot="action">
                    <li>
                        <a href="">修改</a>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="密保问题" description="未设置密保问题，密保问题可有效保护账户安全" />
                <template slot="action">
                    <li>
                        <a href="">设置</a>
                    </li>
                </template>
            </ListItem>
            <Divider/>
            <ListItem>
                <ListItemMeta title="个性域名" description="已绑定域名：iview.design" />
                <template slot="action">
                    <li>
                        <a href="">修改</a>
                    </li>
                </template>
            </ListItem>
        </List>
    </div>
</template>

<script>
    export default {
        name: "SecuritySetting"
    }
</script>

<style lang="less" scoped>
    /deep/ .ivu-list-item {
        padding: 0;
    }
</style>
