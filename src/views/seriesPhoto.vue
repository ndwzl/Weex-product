<template>
    <div class="series-photo">
        <div v-if="iosTop" class="ios-top"></div>
        <!--标题-->
        <title @shareToggle="shareShow" :titleName="titleName" :shareData="shareData" :el="el" v-if="notImg"></title>
        <list style="flex: 1;" @loadmore="fetch" loadmoreoffset="100" v-if="!notImg" ref="list">
            <!--标题-->
            <header>
				<title @shareToggle="shareShow" :titleName="titleName" :shareData="shareData" :el="el"></title>
            </header>
            <cell>
                <!--车型名字和换车型-->
                <div class="model-name" v-if="!notImg">
                    <!--<div @click="fetch">-->
                        <!--<tetx>加载</tetx>-->
                        <!--<tetx>加载</tetx>-->
                        <!--<tetx>加载</tetx>-->
                    <!--</div>-->
                    <text class="model-name-text">{{proName}}</text>
                    <div class="switch-model-button" @click="switchModelShow">
                        <text class="switch-model-text">换车型</text>
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/go-blue.png" style="width:14px;height:24px;margin-left:10px"></image>
                        <!--<text :style="{fontFamily:'detail',fontSize:'24px',color:'#586C94'}">&#x53bb;</text>-->
                    </div>
                </div>
                <!--内容-->
                <photo-album :photoData="photoData" v-if="photoData.options.length" :ProductId="this.ProductId" @detailed="detailed"></photo-album>
                <!--loading状态-->
                <load v-if="loadingShow"></load>
            </cell>
        </list>
        <div v-else class="not-img">
            <div class="not-wrapper">
                <image src="https://s.kcimg.cn/wap/images/detail/productApp/not-img.png" style="width:268px;height:194px;"></image>
                <text class="not-img-text">当前车系暂无图片</text>
            </div>
        </div>

        <!--换车型弹层-->
        <switch-model v-if="switchModelData.paramName || switchModelData.paramName === 'none' || emptyList" all="all" :emptyList="emptyList" :switchModelPop="switchModelPop" :switchModelData="switchModelData" @goSwitchModel="goSwitchModel" @switchModelShow="switchModelShow" :imgSwitchModel="imgSwitchModel" @allProduct="allProduct"></switch-model>
        <!--底层询底价浮层-->
        <footerInfo :footerInfo="footerInfo" :el="el"></footerInfo>
		<!-- weex分享 -->
        <weexShare :shareParams="shareData" :showShare="showShare" @shareCallBack="shareCallBack"></weexShare>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import photoAlbum from '../components/photoAlbum.vue'
    import switchModel from '../components/switchModel.vue'
    import load from '../components/load.vue'
    import footerInfo from '../components/footerInfo.vue'

    let dom = weex.requireModule('dom');
    let stream = weex.requireModule('stream');
    let storage = weex.requireModule('storage');
    let modal = weex.requireModule('modal')
    let globalEvent = weex.requireModule('globalEvent');
    let scrollToElement = weex.requireModule('scrollToElement');
    export default {
        components: {
            title, 
            photoAlbum, 
            switchModel,
            load,
            footerInfo
        },
        data(){
            return {
                //标题名称
                titleName: '',
                //车型名称
                proName: '',
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo: {},
                //车型id
                ProductId:0,
                //备份车型id
                backProductId:'',
                //图片列表数据
                photoData: {
                    options: [],
                    content: {},
                    typeId: 0,
                    page:2,
                },
                //换车型弹层是否显示
                switchModelPop: false,
                //换车型列表为空
                emptyList : false,
                //换车型弹层数据
                switchModelData:{
                    //换车型列表数据
                    priceList:[],
                    //换车型标题数据
                    attrList:[],
                    //换车型当前的显示
                    paramName:'',
                },
                //图片页面换车型
                imgSwitchModel:true,
                //loading状态显示与隐藏
                loadingShow:false,
                //底层询底价信息
                footerInfo:{
                    //询底价数量
                    askTotal:'',
                    //车系询底价热门车型id
                    ProductId:'',
                    //是否显示加入对比
                    compare:false,
                    //是否显示询底价
                    footerPrice:true,
                    list:[
//                        {
//                            name:'综述',
//                            url:'series.weex.js',
//                        },
//                        {
//                            name:'配置',
//                            url:'config.weex.js',
//                        }
                    ]
                },
                //图片是否为空
                notImg:false,
                iosTop:false,
                //统计
                el:'产品库-子类车系图片列表页',
				loadimg:true,
				showShare: false,
				// 分享数据
				shareData: {}
            }
        },
        created(){
            //前端监控
            this.weexLogger('子类车系图片列表页')


            this.showLoading()

            //发送PV
            storage.getItem('p4',p4 => {
                if(p4.result == 'success'){
                    this.p4 = p4.data;
                    storage.getItem('p5',p5 => {
                        if(p5.result == 'success'){
                            this.p5 = p5.data;
                            this.collect({
                                'p3':p4.data,
                                'p4':2,
                                'p5':p5.data
                            })
                        }
                    })
                }
            })

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });

            if(weex.config.env && weex.config.env.platform == 'iOS'){
                this.iosTop = true;
            }
            //获取询底价信息
            storage.getItem('seriesFooterInfo',ele => {
                if(ele.result == 'success'){
                    this.footerInfo.askTotal = JSON.parse(ele.data).askTotal
                    this.footerInfo.ProductId = JSON.parse(ele.data).ProductId
                }
            })

            //如果有车型id，删除车型id
            storage.getItem('ProductId',ele => {
                if(ele.result == 'success'){
                    this.backProductId = ele.data;
                    storage.removeItem('ProductId')
                }
            })

            //车型图片id
            storage.getItem('imgProductId',ele => {
                if(ele.result == 'success'){
                    storage.removeItem('imgProductId')
                }
            })

            //获取车系id信息
            storage.getItem('seriesInfo', seriesInfo => {
                if (seriesInfo.result == 'success') {
                    this.seriesInfo = JSON.parse(seriesInfo.data);

                    //查看有没有车型id ？ 如果有车型id 请求车型图片数据 ： 请求所有数据

//                    storage.getItem('ProductId', ProductId => {
//                        if(ProductId.result == 'success'){
//                            this.ProductId = ProductId.data;
//                            //请求详细车型数据
//                            this.detailed(this.photoData.typeId)
//                        }else{

                            //请求图片页信息
                            this.getData(this.ajaxUrl() + '/index.php?r=api/getweekpicturelist&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&special=1', ele => {
								if (ele.ok && ele.data.info == 'ok') {
									//分享数据
									let shareData = ele.data.share
									this.shareData = {
										title: shareData.h1,
										desc: shareData.title,
										link: shareData.url,
										imgUrl: shareData.img,
									}
                                    //标题
                                    this.titleName = ele.data.title;
                                    //车型名称
                                    this.proName = '全部车型';
                                    //图片内容选项
                                    this.photoData.options = ele.data.data.tab;
                                    //存储图片页面的tab标题
                                    storage.setItem('PhotoTabName',JSON.stringify(this.photoData.options))
                                    //图片内容
                                    this.photoData.content = ele.data.data.list;

                                    //发送GA
                                    this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-子类车系图片列表页',ele.data.title)

                                }else{
                                    //标题
                                    this.titleName = ele.data.title;
                                    this.notImg = true;
                                }
                                this.hideLoading()
                            });
//
//                        }
//                    });

                    //请求换车型数据
                    this.getData(this.ajaxUrl() + '/index.php?r=weex/product/get-product-picture-change-list&subId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.ProductId + '&version=20171110a',(ele) => {
						if(ele.ok){
                            //换车型列表数据
                            this.switchModelData.priceList = ele.data.priceList;
                            //换车型标题数据
                            this.switchModelData.attrList = ele.data.attrList
                            //当前显示的是哪一个
                            if(ele.data.paramName){
                                this.switchModelData.paramName = ele.data.paramName;
                            }else{
                                if(ele.data.priceList && ele.data.priceList.length){
                                    //判断哪一个的length最长显示哪一个
                                    let paramName = '';
                                    let has = true;
                                    ele.data.priceList.forEach((res,index) => {
                                        if (has) {
                                            has = false;
                                            paramName = ele.data.attrList[index];
                                            ele.data.priceList.forEach((r,i) => {
                                                if (ele.data.priceList[index].list.length < ele.data.priceList[i].list.length) {
                                                    paramName = ele.data.attrList[i];
                                                }
                                            })
                                            // 有PriceList 无AttrList
                                            if (paramName === undefined) {
                                                paramName = 'none'
                                            }
                                        }
                                    })
                                    this.$set(this.switchModelData, 'paramName', paramName);
                                }else{
                                    //换车型列表为空
                                    this.emptyList = true;
                                }
                            }
                        }
                    })
                }
            });

        },
        methods: {
			shareCallBack (data) {
                // 分享成功
                if (data.status === '0') {
                    const platformList = ['微信好友', '微信朋友圈', 'QQ好友', 'QQ空间', '新浪微博', '复制链接']
                    const platform = platformList[data.platform]
                    this.eventGa(weex.config.deviceId, '分享产品库成功', this.el, platform)
                }
			},
			// 分享弹层显示
            shareShow () {
                this.showShare = true
            },
            //请求图片详细分类
            detailed(typeId){
                //如果有车型id，删除车型id
                storage.setItem('ProductId',this.backProductId)

                //选中的选项
                this.photoData.typeId = typeId;
                //重置页数
                this.photoData.page = 2;
                //请求图片页信息
                this.getData(this.ajaxUrl() + '/index.php?r=api/getweekpicturelist&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&typeId=' + typeId + '&productId=' + this.ProductId + '&special=1', ele => {
					if (ele.ok && ele.data.info == 'ok') {
						//分享数据
						let shareData = ele.data.share
						this.shareData = {
							title: shareData.h1,
							desc: shareData.title,
							link: shareData.url,
							imgUrl: shareData.img,
						}
                        //标题
                        this.titleName = ele.data.title;

                        //车型名称
                        if(ele.data.proName != ''){
                            this.proName = ele.data.proName;
                        }else{
                            this.proName = '全部车型'
                        }

                        //详细车型内容选项
                        this.photoData.options = ele.data.data.tab;
                        //详细车型图片内容
                        this.photoData.content = ele.data.data.list;

                        //存储图片页面的tab标题
                        storage.setItem('PhotoTabName',JSON.stringify(this.photoData.options))
                    }
                })
            },
            //换车型弹框
            switchModelShow(){
                this.switchModelPop = !this.switchModelPop;
            },
            //滚动加载更多图片
            fetch(){
                let el = this.$refs['list'];
                el.resetLoadmore();
                if(this.photoData.typeId == 0) return ;

                if(this.loadimg){
                    //loading状态显示
                    this.loadingShow = true;
                    this.loadimg = false;
                    this.getData(this.ajaxUrl() + '/index.php?r=m/ajax/series/ajaxgetseriesimgmore&ajaxurl=%2Findex.php%3Fr%3Dm%2Fajax%2Fseries%2Fajaxgetseriesimgmore&seriesid=' + this.seriesInfo.F_SeriesId + '&subcateid=' + this.seriesInfo.F_SubCategoryId + '&typeid=' + this.photoData.typeId + '&productid=' + this.ProductId + '&page=' + this.photoData.page,(ele) => {
					   if(ele.ok && ele.data.status == 1){
                           //数组合并
                           let arr = this.photoData.content[0].imgList.concat(ele.data.data);
                           //设置更新数据
                           this.$set(this.photoData.content[0], 'imgList', arr);
                           //loading状态隐藏
                           this.loadingShow = false;
                           //页数++
                           this.photoData.page++
                           this.loadimg = true;
                       }else{
                           //loading状态隐藏
                           this.loadingShow = false;
                           this.loadimg = true;
                       }
                    })
                }
            },
            //点击换车型弹层车型列表
            goSwitchModel(ProductId){
                //切换车型id
                this.ProductId = ProductId;
                this.footerInfo.ProductId = ProductId;

                //关闭换车型弹层
                this.switchModelPop = false;
                //重置页数
                this.photoData.page = 2;

                //请求图片页信息
                this.detailed(this.photoData.typeId)
            },
            //选择全部车型
            allProduct(){
                this.ProductId = '';

                //获取询底价信息
                storage.getItem('seriesFooterInfo',ele => {
                    if(ele.result == 'success'){
                        this.footerInfo.ProductId = JSON.parse(ele.data).ProductId
                    }
                })

                //关闭换车型弹层
                this.switchModelPop = false;
                //重置页数
                this.photoData.page = 2;

                //请求图片页信息
                this.detailed(this.photoData.typeId)
            }
        },
    }
</script>

<style scoped>
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .series-photo{
        padding-bottom:100px;
    }
    /*车型名字 && 换车型*/
    .model-name {
        height: 90px;
        padding-left: 30px;
        padding-right: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #eee;
    }

    .model-name-text {
        color: #333;
        font-size: 28px;
        flex: 1;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }

    .switch-model-button {
        width: 120px;
        height: 90px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .switch-model-button:active{
        background-color: rgba(0,0,0,.3);
    }
    .switch-model-text {
        color: #586C94;
        font-size: 28px;
        margin-right: 10px;
    }
    .not-img{
        flex: 1;
        /*padding-top: 200px;*/
        justify-content: center;
        align-items: center;
    }
    .not-img-text{
        color: #999;
        font-size: 28px;
        margin-top: 30px;
    }
</style>
