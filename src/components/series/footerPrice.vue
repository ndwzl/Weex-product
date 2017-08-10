<template>
	<div class="foot-price">
		<div class="foot-nav">
			<text>配置</text>
			<text>图片</text>
			<text>论坛</text>
		</div>
		<div class="price">
			<text>询底价</text>
		</div>
	</div>
</template>

<script type="text/babel">
	
</script>

<style scoped>
	.foot-price{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
	}
	.foot-nav{
		flex: 1;
        flex-direction: row;
        align-items: center;
	}
	.price{
		flex: 1;
        flex-direction: row;
        align-items: center;
	}
</style>