<template>
	<div class="add-product">
		<list style="flex: 1;background-color: #f5f5f5;">
			<cell>
				<!-- 公共头 -->
				<title titleName="请选择车型"></title>
				<div class="content">
					<div class="header">
						<text class="header-text" v-if="addSeriesInfo.seriesName">{{addSeriesInfo.seriesName}}</text>
					</div>
					<div class="model">
						<div v-for="ele in productList" class="model-list" @click="selectModel(ele)">
							<text v-if="ProductId == ele.F_ProductId">已选</text>
							<text class="model-name">{{ele.F_ProductName}}</text>
						</div>
					</div>
				</div>
			</cell>

		</list>
	</div>
</template>

<script type="text/babel">
	import title from '../components/title.vue'

	let animation  = weex.requireModule('animation')
	let storage = weex.requireModule('storage')
	let dom = weex.requireModule('dom')
	export default {
		data (){
			return {
				//车系信息
				seriesInfo:{},
//				已经选择的车型id
				ProductId:'',
				//缓存的车系数据
				addSeriesInfo:{},
				//车型列表
				productList:[],
				//对比信息
				compareData:{},
			}
		},
		created(){
			storage.getItem('addSeriesInfo',addSeriesInfo => {
				if(addSeriesInfo.result == 'success'){
					console.log(JSON.parse(addSeriesInfo.data))
					this.addSeriesInfo = JSON.parse(addSeriesInfo.data)

					//请求车型列表
					this.getData(this.ajaxUrl() + '/index.php?r=weex/product/choose-product&sId=' + this.addSeriesInfo.seriesId + '&subId=' +  + this.addSeriesInfo.subCateId , ele => {
						if(ele.ok){
							this.productList = ele.data.proList;
							console.log(this.productList)
						}
					})
				}
			})

			//获取车系信息
			storage.getItem('seriesInfo',seriesInfo => {
				if(seriesInfo.result == 'success'){
					//车系信息
					this.seriesInfo = JSON.parse(seriesInfo.data);

					//获取对比信息
					storage.getItem('compareData',compareData => {
						if (compareData.result == 'success') {
							let data = JSON.parse(compareData.data);
							//对比信息数据
							this.compareData = data;

							//获取另一个的车型id
							if(data[this.seriesInfo.F_SubCategoryId].length){
								//车型id
								this.ProductId = data[this.seriesInfo.F_SubCategoryId][0];
							}
							console.log(this.ProductId)
						}
					})
				}
			})




		},
		methods: {
			//添加车型页
//			selectProduct(item){
//				//获取车系数据
//				storage.getItem('seriesInfo',seriesInfo => {
//					if(seriesInfo.result == 'success'){
//						//车系信息
//						this.seriesInfo = JSON.parse(seriesInfo.data);
//
//						//读取对比信息
//						storage.getItem('compareData',compareData => {
//							if(compareData.result == 'success'){
//								let data = JSON.parse(compareData.data);
//								if(data[this.seriesInfo.F_SubCategoryId] && data[this.seriesInfo.F_SubCategoryId].length){
//									//读取添加的是第一个位置还是第二个位置
//									storage.getItem('compareNumber',ele => {
//										if(ele.result == 'success'){
//											//第一个位置
//											if(ele.data == 0){
//												data[this.seriesInfo.F_SubCategoryId].unshift(item.F_ProductId)
//											}else{
//												data[this.seriesInfo.F_SubCategoryId].push(item.F_ProductId)
//											}
//
//											//再次存储对比信息
//											storage.setItem('compareData',JSON.stringify(data),ele => {
//												if(ele.result == 'success'){
//
//												}
//											})
//										}
//									})
//								}else{
//									data[this.seriesInfo.F_SubCategoryId].push(item.F_ProductId)
//									//再次存储对比信息
//									storage.setItem('compareData',JSON.stringify(data),ele => {
//										if(ele.result == 'success'){
//
//										}
//									})
//								}
//							}
//						})
//					}
//				})
//			},
			//选择车型
			selectModel(ele){
				//如果是已经选中的，则直接return
				if(this.ProductId == ele.F_ProductId){return }

				//重新获取缓存
				storage.getItem('compareData',compareData => {
					if (compareData.result == 'success') {
						let data = JSON.parse(compareData.data);
						//重新赋值对比信息数据
						this.compareData = data;
						//获取缓存，查看存储的是第一个还是第二个

						storage.getItem('compareNumber',res => {
							if(res.result == 'success'){
								//查看是否有对比
								if(this.compareData[this.seriesInfo.F_SubCategoryId].length){
									console.log(this.compareData[this.seriesInfo.F_SubCategoryId])

									//如果数据已经是两个了，那么把刚才添加进去的给删除掉
									if(this.compareData[this.seriesInfo.F_SubCategoryId].length == 2){
										this.compareData[this.seriesInfo.F_SubCategoryId].splice(res.data,1)
									}

									//再添加新点击的对比
									if(res.data == 0){
										this.compareData[this.seriesInfo.F_SubCategoryId].unshift(ele.F_ProductId)
									}else{
										this.compareData[this.seriesInfo.F_SubCategoryId].push(ele.F_ProductId)
									}
								}else{
									this.compareData[this.seriesInfo.F_SubCategoryId].push(ele.F_ProductId)
								}

//						//存储新添加的车型id
								storage.setItem('compareData',JSON.stringify(this.compareData),success => {
									if(success.result == 'success'){
										this.goWeexUrl('contrast.weex.js')
									}
								})

								//重新存储
//						storage.setItem('compareData',JSON.stringify(this.compareData),success => {
//							if(success.result == 'success'){
//
//								if(direction == 'left'){
//									this.compareData[this.seriesInfo.F_SubCategoryId].shift();
//								}else if(direction == 'right'){
//									this.compareData[this.seriesInfo.F_SubCategoryId].pop();
//								}
//
//								this.goWeexUrl('contrast.weex.js')
//
////								let Hulk = weex.requireModule('BroadcastChannel')
////								if(Hulk.postMessage){
////									this.alert(1)
////								}else{
////									this.alert(2)
////								}
////								this.alert(JSON.stringify(Hulk))
////								Hulk.postMessage("Hulk Smash !!!")
////								this.goBack();
//							}
//						})
							}
						})
					}
				})
			}
		},
		watch:{

		},
		components:{
			title
		}
	} 
</script>

<style scoped>
	.header {
		height: 60px;
		padding-left:30px;
		justify-content: center;
		background-color: #f5f5f5;
	}
	.header-text{
		font-size: 28px;
		color: #666;
	}
	.model{
		flex:1;
		background-color: #fff;
	}
	.model-list{
		padding-top:30px;
		padding-left:40px;
		padding-bottom:30px;
		padding-right:40px;
		border-bottom-width:1px;
		border-bottom-style: solid;
		border-bottom-color: #eee;
	}
	.model-name{
		color:#333;
		font-size: 28px;
	}
</style>