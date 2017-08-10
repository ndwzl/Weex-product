<template>
	<div class="foot-price">
		<div class="action-module" v-if="footerInfo.list.length">
			<div class="configure" v-for="ele in footerInfo.list" @click="goWeexUrl(ele.url)">
				<text class="configure-text">{{ele.name}}</text>
			</div>
			<!-- 对比 -->
			<div class="contrast" v-if="footerInfo.compare" @click="compare(footerInfo.ProductId)">
				<!--<text class="contrast-icon" :style="{fontFamily:'detail',color:'#586c94'}" v-if="!compareState[footerInfo.ProductId]">加</text>-->
				<image v-if="!compareState[footerInfo.ProductId]" src="https://s.kcimg.cn/wap/images/detail/productApp/add.png" style="width:20px;height:20px;margin-right:5px"></image>
				<text class="contrast-text">{{compareState[footerInfo.ProductId] ? compareState[footerInfo.ProductId] : '对比'}}</text>
			</div>
		</div>
		<div :class="['floor-price',footerInfo.compare || footerInfo.list.length > 2 ? '' : 'long-floor-price']" @click="goFooterPrice" v-if="footerInfo.footerPrice">
			<text class="price-text">询底价</text>
			<text class="number">{{footerInfo.askTotal > 100 ? '已有' + footerInfo.askTotal + '人询价' : '已有100人+询底价'}}</text>
		</div>
	</div>
</template>

<script type="text/babel">
	let storage = weex.requireModule('storage');
	 export default {
		props:['footerInfo','compareState','el'],
		 methods:{
			 goFooterPrice(){
//				 this.GA(0,this.footerInfo.ProductId)
				 this.eventGa(weex.config.deviceId,'点击询底价按钮',this.el,'底部浮层区块')
				 storage.setItem('priceProductId',this.footerInfo.ProductId,ele => {
					 if(ele.result == 'success'){
						 this.goWeexUrl('footerPrice.weex.js')
					 }
				 })
			 },
			 compare(productId){
				this.$emit('compare',productId)
			 }
		 }
	}
</script>

<style scoped>
	.foot-price{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100px;
		flex-direction: row;
	}
	.action-module{
		height: 100px;
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		border-top: solid;
		border-top-color: #ddd;
		border-top-width: 2px;
		background-color: #fff;
	}
	.floor-price{
		width: 268px;
		height: 100px;
		flex-direction: column;
		justify-content: center;
		background-color: #f60;
		align-items: center;
	}
	.long-floor-price{
		flex: 1;
	}
	.price-text{
		font-size: 32px;
		color: #fff;
	}
	.number{
		font-size: 24px;
		color: rgba(255,255,255,0.7);
	}
	.configure{
		flex: 1;
		height: 100px;
		justify-content: center;
		align-items: center;
	}
	.configure:active{
		background-color: rgba(0,0,0,.3);
	}
	.configure-text{
		font-size: 32px;
		color: #586c94;
	}
	.picture{
		flex: 1;
		height: 100px;
		justify-content: center;
		align-items: center;
	}
	.picture-text{
		font-size: 32px;
		color: #586c94;
	}
	.contrast{
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.contrast-text{
		text-align: center;
		font-size: 32px;
		color: #586c94;
	}
	.contrast-icon{
		margin-right: 6px;
	}
	.forum{
		flex: 1;
		height: 100px;
		justify-content: center;
		align-items: center;
	}
	.forum-text{
		font-size: 32px;
		color: #586c94;
	}
</style>