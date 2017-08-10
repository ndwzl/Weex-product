<template>
	<div class="add-series" ref="addSeries">
		<list style="flex: 1;background-color: #f5f5f5;">
			<cell>
				<!-- 公共头 -->
				<title :titleName="titleName"></title>
				<!-- 导航 -->
				<div class="nav">
					<!-- 热门 -->
					<div class="hot" @click="setSelected(0)" >
						<text :class="['nav-text',selected === 0 ? 'current' : '']">热门</text>
					</div>
					<!-- 品牌 -->
					<div class="brand" @click="setSelected(1)">
						<text class="" :class="['nav-text',selected === 1 ? 'current' : '']">品牌</text>
					</div>
					<!-- 对比记录 -->
					<div class="contrast-record" @click="setSelected(2)">
						<text :class="['nav-text',selected === 2 ? 'current' : '']">对比记录</text>
					</div>
				</div>
			</cell>
			<cell class="wrapper" ref="slider">
					<!-- 热门列表 -->
					<div class="hot-module">
						<div class="hot-list" v-if="selected == 0 && listInfo.hot">
							<div v-for="ele in listInfo.hot" class="hot-recommend-model" @click="selectModel(ele)">
								<text class="choose" v-if="ProductId == ele.F_ProductId">(已选)</text>
								<text :class="['hot-model-text',ProductId == ele.F_ProductId ? 'active' : '']">{{ele.F_ProductName}}</text>
							</div>
						</div>
						<div v-else class="empty">
							<text :style="{fontFamily:'detail',color:'#a1c6f5',fontSize:'100px'}">无</text>
							<text class="empty-text">很遗憾~ 没有相关内容~</text>
						</div>
					</div>
					<!-- 品牌推荐列表 -->
					<div class="brand-page" >
						<div v-if="selected == 1">
							<!-- 热门推荐 -->
							<recommend-list :recommendList="recommendList" @SidebarShow="SidebarShow"></recommend-list>
							<!--品牌列表-->
							<div v-for="(ele,index) in brandList" :ref="indexNav[index]">
								<div class="header">
									<text class="header-text">{{indexNav[index]}}</text>
								</div>
								<div class="brand-model">
									<div v-for="(item,number) in ele"  class="brand-list" @click="SidebarShow(item)">
										<image class="car-icon" :src="item.img"></image>
										<text class="car-text">{{item.name}}</text>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 对比记录 -->
					<div class="contrast-page">
						<div v-if="selected == 2">
							<div v-for="(ele,index) in compareHistory" class="contrast-list" @click="selectModel(ele)">
								<div class="contrast-recommend-model">
									<div class="contrast-letters">
										<text class="choose" v-if="ele.F_ProductId == ProductId">(已选)</text>
										<text :class="['contrast-text',ProductId == ele.F_ProductId ? 'active' : '']">{{ele.F_ProductName}}</text>
									</div>
									<div class="contrast-ico" @click="clearHistory(index)">
										<text class="contrast-icon" :style="{fontFamily:'detail',fontSize:'40px',color:'#ccc'}">叉</text>
									</div>
								</div>
							</div>
							<!--没有对比历史记录-->
							<div v-if="!compareHistory.length" class="empty">
								<text :style="{fontFamily:'detail',color:'#a1c6f5',fontSize:'100px'}">无</text>
								<text class="empty-text">没有对比记录~</text>
							</div>
							<!-- 清除记录 -->
							<div  v-if="compareHistory.length" class="clear-all" @click="clearHistory('all')">
								<text class="clear-all-text">清除所有记录</text>
							</div>
						</div>
					</div>
				</cell>
		</list>

		<!-- 索引导航 -->
		<div class="brand-nav" v-if="selected == 1 && indexNavShow">
			<div class="index-nav" v-for="ele in indexNav" @click="anchor(ele)">
				<text class="index-nav-text">{{ele}}</text>
			</div>
		</div>
		<!--sidebar-->
		<div :class="['sidebar',showSidebar?'sidebar-visible':'']">
			<!--遮罩层-->
			<div v-if="shadeShow" class="shade" @click="sidebarHide"></div>

			<!--内容-->
			<list class="sidebar-content" style="flex: 1" ref="side">
				<cell class="sidebar-header" v-if="showSidebar">
					<div class="back" @click="sidebarHide">
						<image src="https://s.kcimg.cn/wap/images/app_icon/back.png" style="width:40px;height:40px"></image>
						<!--<text class="back-text" :style="{fontFamily:'detail'}">&#x56de;</text>-->
					</div>
					<text class="sidebar-header-text">选择车系</text>
				</cell>
				<cell class="sidebar-module">
					<div class="sidebar-list" v-for="(item,index) in sidebarList" @click="goSelectProduct(item)">
						<text class="sidebar-list-name">{{item.seriesName}}</text>
					</div>
				</cell>
			</list>
		</div>

		<!--选择车型-->
		<div class="add-product" ref="addProduct">
			<list style="flex: 1;background-color: #f5f5f5;">
				<cell class="product-title">
					<div class="product-back" @click="hideAddProduct">
						<text :style="{fontFamily:'detail',fontSize:'32px',color:'#333'}">回</text>
					</div>
					<div class="product-wrapper">
						<text class="title-name">请选择车型</text>
					</div>
				</cell>
				<cell>
					<div class="content">
						<div class="header">
							<text class="header-text">{{seriesName}}</text>
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
	</div>
</template>

<script type="text/babel">
	import title from '../components/title.vue'
	import recommendList from '../components/brandList/recommendBrand.vue'
	import addProduct from '../components/config/addProduct.vue'

	let animation  = weex.requireModule('animation')
	let storage = weex.requireModule('storage')
	let dom = weex.requireModule('dom')
	export default {
		props:['addSeriesShow'],
		data (){
			return {
				// 标题
                titleName:'车型筛选',
				//车系信息 子类id && 车系id && 品牌id
				seriesInfo:{},
				//车型id
				ProductId:'',
				//以选择的选项
                selected:0,
				//所有的列表信息
				listInfo:{

				},
				//推荐品牌列表
				recommendList:[],
				//品牌列表
				brandList: [],
				//品牌导航
				indexNav:[],
				//品牌导航是否显示
				indexNavShow:true,
				//sidebar数据
				sidebarList:[],
				//sidebar内容标题
				notHistoryTitle:true,
				//sidebar显示与隐藏
				showSidebar: false,
				//sidebar遮罩层显示和隐藏
				shadeShow: false,
				//对比历史记录
				compareHistory:[],
				//对比信息数据
				compareData:{},
				//车型列表
				productList:[],
				//选择车系的名字
				seriesName:'',
			}
		},
		created(){
//			let cast = weex.requireModule('BroadcastChannel');
//			this.alert(JSON.stringify(cast))

			//获取车系信息
			storage.getItem('seriesInfo',ele => {
				if(ele.result == 'success'){
					this.seriesInfo = JSON.parse(ele.data);

					//获取对比信息
					storage.getItem('compareData',compareData => {
						if(compareData.result == 'success'){
							let data = JSON.parse(compareData.data);
							//对比信息数据
							this.compareData = data;

							//请求地址
							let ajaxUrl;
							//如果有车型id
							if(data[this.seriesInfo.F_SubCategoryId].length){
								//车型id   默认是第一个
								this.ProductId = data[this.seriesInfo.F_SubCategoryId][0];

								//如果缓存数据的length == 2  如果有新添加的车型 查看哪个是新添加的
 								if(data[this.seriesInfo.F_SubCategoryId].length == 2){
									this.ProductId = data[this.seriesInfo.F_SubCategoryId];
									//获取缓存  查看有没有新添加的车型
									storage.getItem('compareNumber',compareNumber => {
										if(compareNumber.result == 'success'){
											if(compareNumber.data == 0){
												this.ProductId = data[this.seriesInfo.F_SubCategoryId][1];
											}
										}
									})
								}

								ajaxUrl = this.ajaxUrl() + '/index.php?r=weex/series/filtrate&subId=' + this.seriesInfo.F_SubCategoryId + '&productId=' + data[this.seriesInfo.F_SubCategoryId][0] + '&seriesId=' + this.seriesInfo.F_SeriesId + '&brandId=' + this.seriesInfo.F_BrandId
							}else{
								ajaxUrl = this.ajaxUrl() + '/index.php?r=weex/series/filtrate&subId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&brandId=' + this.seriesInfo.F_BrandId
							}

							//获取车系id
							this.getData(ajaxUrl,res => {
								if(res.ok){
									this.listInfo = res.data;
									//品牌推荐列表
									this.recommendList = res.data.recommend;
									console.log(this.recommendList,'this.recommendList')

									//品牌列表
									this.brandList = res.data.brands;
									//nav导航
									this.indexNav = res.data.brandsKey;

									//如果没有热门车型列表，默认进去品牌选项
									if(!this.listInfo.hot){
										this.selected = 1;
										console.log(this.selected)
									}
									console.log(this.listInfo)
								}
							})
						}
					});

				}
			});

			//获取对比历史记录
			storage.getItem('compare_history',ele => {
				if(ele.result == 'success'){
					this.compareHistory = JSON.parse(ele.data)
					console.log(this.compareHistory)
				}
			})

		},
		methods:{
			setSelected(index){
				this.animation = true;
				if(this.selected !== index){
					this.selected = index;
				}
			},
			//删除对比记录
			clearHistory(index){
				//清除所有
				if(index == 'all'){
					this.compareHistory = [];
				}else{
					this.compareHistory.splice(index,1)
				}

				storage.setItem('compare_history',JSON.stringify(this.compareHistory))
			},
			//显示侧边栏 请求sidebar数据
			SidebarShow(item){
				//隐藏品牌索引导航
				this.indexNavShow = false;
				this.getData(this.ajaxUrl() + '/index.php?r=ajax%2Fproduct%2Fajaxprodlist&bid=' + item.id + '&subid=' + this.seriesInfo.F_SubCategoryId, ele => {
					if(ele.ok){
						//sidebar数据
						this.sidebarList = ele.data;

						//展示sidebar
						this.showSidebar = true;
						this.shadeShow = true;
						this.$nextTick(() => {
							var side = this.$refs.side;
							animation.transition(side, {
								styles: {
									transform: 'translate(0,0)'
								},
								duration: 300, //ms
								timingFunction: 'linear',
								delay: 0 //ms
							})
						})
					}
				})
			},
			//隐藏侧边栏
			sidebarHide(){
				//显示品牌索引导航
				this.indexNavShow = true;
				//隐藏遮罩层
				this.shadeShow = false;
				//隐藏侧边栏动画
				var side = this.$refs.side;
				animation.transition(side, {
					styles: {
						transform: 'translate(750px,0)'
					},
					duration: 300, //ms
					timingFunction: 'linear',
					delay: 0 //ms
				}, () => {
					//隐藏sidebar
					this.showSidebar = false;
					//隐藏更多车系
					this.seriesMoreShow = false;
				})
			},
			//选择品牌 显示选择车型列表
			goSelectProduct(item){
				//存储选择的车系
//				storage.setItem('addSeriesInfo',JSON.stringify(item),ele => {
//					if(ele.result == 'success'){
//						this.goWeexUrl('addProduct.weex.js')
//					}
//				})
				//显示选择车型列表
				console.log(item)

				let addProduct = this.$refs.addProduct;
				animation.transition(addProduct, {
					styles: {
						transform: 'translate(0, 0)'
					},
					duration: 300, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				})

				//选择车系的名字
				this.seriesName = item.seriesName;

				//请求车型列表
				this.getData(this.ajaxUrl() + '/index.php?r=weex/product/choose-product&sId=' + item.seriesId + '&subId=' + item.subCateId , ele => {
					if(ele.ok){
						this.productList = ele.data.proList;
						console.log(this.productList)
					}
				})
			},
			//隐藏选择车型列表弹窗
			hideAddProduct(){
				let addProduct = this.$refs.addProduct;
				animation.transition(addProduct, {
					styles: {
						transform: 'translate(750px, 0)'
					},
					duration: 300, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				})
			},
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


			},
			//锚点效果
			anchor(index){
				console.log(this.$refs[index][0])
				dom.scrollToElement(this.$refs[index][0], {offset: 0})
				this.classifyPop = false;
			}
		},
		watch:{
			selected(){
				let slider = this.$refs.slider;
				animation.transition(slider, {
					styles: {
						transform: 'translate(' + this.selected * -750  + 'px, 0)'
					},
					duration: 300, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				})
			},
			addSeriesShow(){
				let addSeries = this.$refs.addSeries;
				let left = 0;
				if(!this.addSeriesShow){
					left = 750;
				}
				addSeries.transition(addSeries, {
					styles: {
						transform: 'translate(' + left  + 'px, 0)'
					},
					duration: 300, //ms
					timingFunction: 'ease',
					delay: 0 //ms
				})
			}
		},
		components:{
			title,
			recommendList,
			addProduct
		}
	}
</script>

<style scoped>
	.add-series{
		position: fixed;
		left:0;
		right:0;
		top:0;
		bottom:0;
		transform: translate(750px, 0);
	}
	.content{
		width:750px;
		overflow: hidden;
		background-color: #f5f5f5;
	}
	.wrapper{
		width:2250px;
		flex-direction: row;
	}
	.empty{
		padding-top: 50px;
		padding-bottom: 50px;
		justify-content: center;
		align-items: center;
		background-color: #fff;
	}
	.empty-text{
		color: #999;
		font-size: 32px;
		padding-top: 20px;
	}
	.nav{
		display: flex;
		flex-direction: row;
		height: 80px;
		background-color: #fff;
		border-bottom: solid;
		border-bottom-color: #eee;
		border-bottom-width: 2px;
	}
	.hot{
		flex: 1;
		height: 80px;
		align-items: center;
		justify-content: center;
	}
	.nav-text{
		font-size: 28px;
		color: #999;
		border-bottom-width:0;
	}
	.brand{
		flex: 1;
		height: 80px;
		align-items: center;
		justify-content: center;
	}
	.contrast-record{
		flex: 1;
		height: 80px;
		align-items: center;
		justify-content: center;
	}
	.selected{
		font-size: 32px;
		color: #586c94;
	}
	.nav{
		display: flex;
		flex-direction: row;
		height: 80px;
		background-color: #fff;
		border-bottom: solid;
		border-bottom-color: #eee;
		border-bottom-width: 2px;
	}
	.hot{
		flex: 1;
		height: 80px;
		align-items: center;
		justify-content: center;
	}
	.hot-text{
		font-size: 28px;
		color: #999;
	}
	.brand{
		flex: 1;
		height: 80px;
		align-items: center;
		justify-content: center;
	}
	.brand-text{
		font-size: 28px;
		color: #999;
	}
	.contrast-record{
		flex: 1;
		height: 80px;
		align-items: center;
		justify-content: center;
	}
	.contrast-text{
		font-size: 28px;
		color: #999;
	}
	.hot-module{
		width:750px;
		background-color: #fff;
		margin-top: 20px;
	}
	.hot-recommend-model{
		flex: 1;
		flex-direction: row;
		padding-top: 30px;
		padding-bottom: 30px;
		padding-left: 40px;
		padding-right: 40px;
		border-bottom: solid;
		border-bottom-width: 2px;
		border-bottom-color: #eee;
	}
	.choose{
		width: 80px;
		color: #1571e5;
		font-size: 28px;
	}
	.hot-model-text{
		flex: 1;
		line-height: 44px;
		font-size: 28px;
		color: #333;
		word-wrap:break-word;
	}
	.active{
		color: #999;
	}
	.brand-page{
		width:750px;
		background-color: #fff;
	}
	.header{
		height: 60px;
		justify-content: center;
		padding-left: 30px;
		padding-right: 30px;
		background-color: #f5f5f5;
	}
	.header-text{
		font-size: 28px;
		color: #666;
	}
	.brand-model{
		background-color: #fff;
		flex-direction: row;
		display: flex;
		flex-wrap: wrap;
	}
	.brand-list{
		width:250px;
		padding-top: 30px;
		padding-bottom: 22px;
		justify-content: center;
		align-items: center;
	}
	.car-icon{
		width: 150px;
		height: 100px;
	}
	.car-text{
		font-size: 24px;
		color: #333;
	}
	.brand-nav{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		align-items: center;
		justify-content: center;
	}
	.index-nav{
		padding-left: 20px;
		padding-right: 20px;
		height: 44px;
		align-items: center;
		justify-content: center;
	}
	.index-nav-text{
		color: #666;
		font-size: 28px;
	}
	.nav-text{
		line-height: 44px;
		font-size: 28px;
		color: #999;
		padding-left: 10px;
		padding-right: 10px;
		text-align: center;
	}
	.current{
		font-size: 32px;
		color: #586c94;
		padding-top: 13px;
		padding-bottom: 14px;
		border-bottom: solid;
		border-bottom-width: 4px;
		border-bottom-color: #586c94;
	}
	.contrast-page{
		width:750px;
		margin-top: 20px;

	}
	.contrast-list{
		background-color: #fff;
	}
	.contrast-recommend-model{
		flex-direction: row;
		padding-top: 30px;
		padding-bottom: 30px;
		align-items: center;
		padding-left: 40px;
		border-bottom: solid;
		border-bottom-width: 2px;
		border-bottom-color: #eee;
	}
	.contrast-text{
		flex: 1;
		line-height: 44px;
		font-size: 28px;
		color: #333;
	}
	.contrast-letters{
		flex: 1;
		flex-direction: row;
	}
	.contrast-ico{
		width: 100px;
		align-items: center;
	}
	.clear-all{
		height: 80px;
		background-color: #fff;
		align-items: center;
		justify-content: center;
		margin-top: 24px;
	}
	.clear-all-text{
		font-size: 28px;
		color: #333;
	}
	.choose{
		width: 80px;
		color: #1571e5;
		font-size: 28px;
	}
	/*sidebar*/

	.sidebar {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 750px;
		padding-left: 140px;
		align-items: flex-end;
	}

	.sidebar-visible {
		left: 0;
	}

	.shade {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .6);
		/*transform: translate(750px, 0);*/
	}

	/*.shade-visible {*/
	/*transform: translate(0, 0);*/
	/*}*/

	.sidebar-content {
		flex: 1;
		width:600px;
		background-color: #fff;
		transform: translate(750px, 0);
	}

	.sidebar-header {
		position: relative;
		padding-left: 88px;
		padding-right: 88px;
		height: 90px;
		align-items: center;
		justify-content: center;
		border-bottom-width:1px;
		border-bottom-style: solid;
		border-bottom-color:#eee;
		background-color: #fff;
	}

	.sidebar-header-text {
		color: #333;
		font-size: 36px;
	}

	.back {
		position: absolute;
		left: 0;
		top: 0;
		width: 88px;
		height: 90px;
		align-items: center;
		justify-content: center;
	}
	.sidebar-list{
		height:88px;
		padding-left:30px;
		justify-content: center;
		border-bottom-width:1px;
		border-bottom-style: solid;
		border-bottom-color:#eee;
	}
	.sidebar-list-name{
		font-size:28px;
		color:#333;
	}

	/*选择车型列表*/
	.add-product{
		position:fixed;
		top:0;
		left:0;
		bottom:0;
		right:0;
		transform: translate(750px, 0);
	}
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
	/*选择车型列表title*/
	.product-title{
		position:relative;
		width:750px;
		height: 90px;
		justify-content: center;
		align-items: center;
		padding-left:120px;
		padding-right:120px;
		border-bottom-width:1px;
		border-bottom-style:solid;
		border-bottom-color:#eee;
		background-color: #fff;
	}
	.product-wrapper{
		flex: 1;
		height:90px;
		justify-content: center;
		align-items:center;
	}
	.title-name{
		padding-left:20px;
		padding-right:20px;
		color:#333;
		font-size:36px;
	}
	.product-back{
		position:absolute;
		left:0;
		top:0;
		width:54px;
		height:90px;
		justify-content: center;
		align-items: center;
	}
</style>