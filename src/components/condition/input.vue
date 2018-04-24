<template>
    <div class="condition-input">
        <!-- 标题 -->
        <div class="title">
			<text class="title-index">{{index}}</text>
			<text class="title-text">{{title}}</text>
			<text class="allow-write-text">（可修改）</text>
		</div>
        <!-- 内容 -->
        <div class="content">
            <text class="content-text">{{info}}</text>
            <input class="input" :value="value" type="number" maxlength="4" @change="change"/>
            <text class="content-text">{{unit}}</text>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props: ['index', 'title', 'info', 'value', 'unit', 'type', 'hasPoint'],
        data () {
            return {}
        },
        methods: {
            change (e) {
                let input = e.value
                // 去除非法字符
                input = input.replace(/[^\d^\.]/g, '')
                if (input) input = parseFloat(input.match(/\.*(.+)/)[1])
                // 禁止输入小数点
                if (input && !this.hasPoint) input = parseInt(input)
                this.$emit('input', {type: this.type, data: input})
            }
        },
    }
</script>

<style scoped>
.condition-input {
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
.allow-write-text {
    color: #999;
    margin-left: 4px;
    font-size: 24px;
}
.content {
    height: 88px;
    flex-direction: row;
    align-items: center;
    padding-right: 20px;
    padding-left: 20px;
}
.content-text {
    color: #333;
    font-size: 32px;
}
.input {
    flex: 1;
    height: 48px;
    font-size: 32px;
    padding-right: 12px;
    text-align: right;
}
</style>
