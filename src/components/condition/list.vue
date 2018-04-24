<template>
    <div class="condition-list">
		<!-- 标题 -->
        <div class="title">
			<text class="title-index">{{index}}</text>
			<text class="title-text">{{title}}</text>
		</div>
		<div class="list">
			<!-- 选项 -->
            <div :style="{width: buttonWidth}" :class="['button', item.selected ? 'button-selected' : '']" v-for="(item, idx) in info" @click="select(item, idx)">
                <image :src="item.imgUrl" class="icon" v-if="item.imgUrl"></image>
			    <text :class="['button-text', item.selected ? 'button-text-selected' : '']">{{item.name}}</text>
                <!-- <text style='font-family:iconfont4;font-size:20;color:#B8C0D0'>&#xe695;</text> -->
			</div>
		</div>
    </div>
</template>

<script type="text/babel">
    const storage = weex.requireModule('storage')
    export default {
        props: ['title', 'index', 'info', 'type'],
        data () {
            return {}
        },
        computed: {
            buttonWidth: function () {
                return this.type === 'drive' ? '122px' : '216px'
            }
        },
        methods: {
            select (data, index) {
                const type = this.type
                // type, data, index
                this.$emit('select', {type, data, index})
            }
        },
    }
</script>

<style scoped>
.condition-list {
	background-color: #fff;
}
.title {
    height: 60px;
	padding-left: 20px;
    background-color: #f5f5f5;
    flex-direction: row;
    align-items: center;
}
.title-index {
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
	border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    border-bottom-left-radius: 50%;
    width: 26px;
    height: 26px;
    font-size: 24px;
    text-align: center;
    line-height: 26px;
    color: #1571e5;
}
.title-text {
    padding-left: 20px;
    color: #1571e5;
    font-size: 24px;
}
.list {
    background-color: #fff;
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 30px;
    padding-left: 20px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}
.button {
    width: 216px;
    height: 88px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-top-color: rgb(238, 238, 238);
    border-top-style: solid;
    border-top-width: 2px;
    border-right-color: rgb(238, 238, 238);
    border-right-style: solid;
    border-right-width: 2px;
    border-bottom-color: rgb(238, 238, 238);
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-left-color: rgb(238, 238, 238);
    border-left-style: solid;
    border-left-width: 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 20px;
}
.button-selected {
    border-top-color: rgb(21, 113, 229);
    border-right-color: rgb(21, 113, 229);
    border-bottom-color: rgb(21, 113, 229);
    border-left-color: rgb(21, 113, 229);
}
.button-text {
    text-align: center;
    font-size: 32px;
    color: #333;
    lines: 1;
    text-overflow: ellipsis;
}
.button-text-selected {
    color: #1571e5;
}
.icon {
    width: 64px;
    height: 34px;
    margin-right: 10px;
}
</style>
