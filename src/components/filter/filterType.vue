<template>
    <div class="filter-type">
        <div class="title">
			<text class="title-text">{{title}}</text>
		</div>
		<div class="list">
            <div class="button" v-for="item in info" v-if="!item.isCate" @click="jump(item.id)">
			    <text class="button-text">{{item.name}}</text>
			</div>
            <div class="button" v-for="item in info" v-if="item.isCate" @click="showSidebar(item.id)">
			    <text class="button-text">{{item.name}}</text>
                <image src="https://s.kcimg.cn/wap/images/detail/productApp/filter-more.png" class="more"></image>
                <!-- <text style='font-family:iconfont4;font-size:20;color:#B8C0D0'>&#xe695;</text> -->
			</div>
		</div>
    </div>
</template>

<script type="text/babel">
    const storage = weex.requireModule('storage')
    export default {
        props: ['title', 'info', 'type'],
        data () {
            return {}
        },
        methods: {
            jump (id) {
                let data = {
                    id: id,
                    type: this.type
                }
                storage.setItem('filterResultId', JSON.stringify(data), e => {
                    if (e.result === 'success') {
                        this.goWeexUrl('filterResult.weex.js')
                    }
                })
            },
            showSidebar (id) {
                this.$emit('showSidebar', id)
            }
        },
    }
</script>

<style scoped>
.title {
    height: 62px;
    background-color: #f5f5f5;
}
.title-text {
    line-height: 62px;
    padding-left: 30px;
    color: #586C94;
    font-size: 28px;
}
.list {
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
    width: 162px;
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
</style>
