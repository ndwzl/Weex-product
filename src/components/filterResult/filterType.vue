<template>
    <div class="filter-result">
        <div :class="['button', item.selected ? 'selected' : '']" v-for="(item, index) in list" @click="showSidebar(item, index)">
		    <text :class="['button-text', item.selected ? 'selected-button-text' : '']">{{item.name}}</text>
            <image src="https://s.kcimg.cn/wap/images/detail/productApp/filter-selected.png" v-if="item.selected" class="more"></image>
            <!-- <text style='font-family:iconfont4;font-size:20;color:#1571e5'>&#xe695;</text> -->
            <image src="https://s.kcimg.cn/wap/images/detail/productApp/filter-more.png" v-else class="more"></image>
            <!-- <text style='font-family:iconfont4;font-size:20;color:#B8C0D0'>&#xe695;</text> -->
		</div>
    </div>
</template>

<script type="text/babel">
    export default {
        props: ['list'],
        data () {
            return {}
        },
        methods: {
            showSidebar (item, index) {
                this.$emit('showSidebar', item.fId, index)
            }
        },
    }
</script>

<style scoped>
.filter-result {
    background-color: #fff;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}
.button {
    position:relative;
    width: 223px;
    height: 64px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
    border-top-color: rgb(238, 238, 238);
    border-top-style: solid;
    border-top-width: 1px;
    border-right-color: rgb(238, 238, 238);
    border-right-style: solid;
    border-right-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-left-color: rgb(238, 238, 238);
    border-left-style: solid;
    border-left-width: 1px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
}
.button-text {
    line-height: 64px;
    text-align: center;
    font-size: 24px;
    color: #333;
    lines: 1;
    text-overflow: ellipsis;
}
.more {
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 20px;
    height: 20px;
}
.selected {
    border-top-color: rgb(21, 113, 229);
    border-top-style: solid;
    border-top-width: 1px;
    border-right-color: rgb(21, 113, 229);
    border-right-style: solid;
    border-right-width: 1px;
    border-bottom-color: rgb(21, 113, 229);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-left-color: rgb(21, 113, 229);
    border-left-style: solid;
    border-left-width: 1px;
}
.selected-button-text {
    color: #1571e5;
}
</style>
