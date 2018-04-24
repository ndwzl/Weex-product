<template>
	<div class="button-wrapper">
		<div class="next" @click="$emit('next')" v-if="!step">
			<text class="next-text">下一步</text>
		</div>
		<div class="prev" @click="$emit('changeStep')">
			<text class="prev-text">上一步</text>
		</div>
		<div class="complete" @click="$emit('complete')">
			<text class="complete-text">完成</text>
		</div>
	</div>
</template>

<script type="text/babel">
export default {
	props: ['step'],
	data() {
		return {}
	},
	methods: {
	},
}
</script>

<style scoped>
.button-wrapper {
	margin-top: 60px;
	align-items: center;
	flex-direction: row;
	padding-left: 20px;
	padding-right: 20px;
}

.next {
	width: 690px;
	height: 88px;
	background-color: #1571e5;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
	margin-left: 10px;
	margin-right: 60px;
}

.next-text {
	line-height: 88px;
	color: #fff;
	text-align: center;
	font-size: 32px;
}

.prev,
.complete {
	/* width: 335px; */
	flex: 1;
	height: 84px;
	margin-right: 10px;
	margin-left: 10px;
	border-top-color: rgb(21, 113, 229);
	border-top-style: solid;
	border-top-width: 2px;
	border-right-color: rgb(21, 113, 229);
	border-right-style: solid;
	border-right-width: 2px;
	border-bottom-color: rgb(21, 113, 229);
	border-bottom-style: solid;
	border-bottom-width: 2px;
	border-left-color: rgb(21, 113, 229);
	border-left-style: solid;
	border-left-width: 2px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
	background-color: #f5f5f5;
}

.complete {
	background-color: #1571e5;
}

.prev-text,
.complete-text {
	line-height: 84px;
	text-align: center;
	font-size: 32px;
	color: #1571e5;
}

.complete-text {
	color: #fff;
}
</style>
