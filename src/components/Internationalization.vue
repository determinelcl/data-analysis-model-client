<template>
    <Dropdown>
        <Icon type="md-globe" size="18"/>
        <DropdownMenu slot="list" :style="{width: '25px'}">
            <DropdownItem>简体中文</DropdownItem>
            <DropdownItem>English</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</template>

<script>
    export default {
        name: "Internationalization"
    }
</script>

<style scoped>

</style>
