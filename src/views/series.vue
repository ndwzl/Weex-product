<template>
    <div class="series">
        <div v-if="iosTop" class="ios-top"></div>

        <title :shareData="shareData" @shareToggle="shareShow" :titleName="titleName" :seriesId="seriesInfo.F_SeriesId" :el="el"></title>

        <list style="flex: 1">
            <!-- <header ref="goTop"> -->
                <!--标题-->
                <!-- <title :shareData="shareData" @shareToggle="shareShow" :titleName="titleName" :seriesId="seriesInfo.F_SeriesId" :el="el"></title> -->
            <!-- </header> -->
            <cell ref="goTop">
                <!--卡车图片信息-->
                <truck-image :truckImageData="truckImageData" url="seriesPhoto.weex.js"></truck-image>
                <!--nav导航-->
                <nav :navList="navList" :navInfo="navInfo"></nav>
                <!--车型列表-->
                <model-type-list v-if="seriesInfo.F_SubCategoryId" :update="modelTypeListUpdate" :seriesInfo="seriesInfo" :locationInfo="locationInfo" :el="el"></model-type-list>
                <!--经销商-->
                <dealer :seriesId="seriesInfo.F_SeriesId" :locationInfo="locationInfo" :dealerData="dealerData" @selectLocationPop="selectLocationPop" sum="false" :el="el"></dealer>
                <!--文章-->
                <!--<articles v-if="articlesList != null" :articlesList="articlesList" :titleName="titleName" :moreArticleUrl="moreArticleUrl"></articles>-->
                <!--口碑-->
                <!--<reputation :reputation="reputation" :titleName="titleName"></reputation>-->
                <!--论坛-->
                <!--<bbs-list :bbsList="bbsList" :titleName="titleName" :morePostUrl="morePostUrl"></bbs-list>-->
                <!--其他人还关注-->
                <other-concerns v-if="seriesInfo.F_SeriesId && otherData" :otherData="otherData" :el="el" @goSeries="goSeries" :seriesId="seriesInfo.F_SeriesId"></other-concerns>
                <!--二手车推荐-->
                <!--<second-hand v-if="secondHandData.data" :secondHandData="secondHandData"></second-hand>-->
            </cell>
        </list>
        <!--<footer-price></footer-price>-->
        <!--<keep-alive>-->
        <!--底层询底价浮层-->
        <footerInfo :footerInfo="footerInfo" :el="el"></footerInfo>
        <!--选地区弹层-->
        <select-location v-if="LocationPop" :locationData="locationData" @selectLocationPop="selectLocationPop" @getLocationInfo="getLocationInfo"></select-location>
        <!--</keep-alive>-->
        <!--切换地区弹层-->
        <switch-location-pop v-if="switchLocationShow" :cityName="myRegion.cityName" @cancelSwitch="cancelSwitch" @okSwitch="okSwitch"></switch-location-pop>
        <!-- weex分享 -->
        <weexShare :shareParams="shareData" :showShare="showShare" @shareCallBack="shareCallBack" @tapShare="tapShare"></weexShare>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import nav from '../components/nav.vue'
    import truckImage from '../components/truckImage.vue'
    import modelTypeList from '../components/series/modelTypeList.vue'
    import footerPrice from '../components/series/footerPrice.vue'
    import dealer from '../components/dealer.vue'
    import articles from '../components/series/articles.vue'
    import reputation from '../components/series/reputation.vue'
    import bbsList from '../components/series/bbsList.vue'
    import otherConcerns from '../components/otherConcerns.vue'
    import selectLocation from '../components/selectLocation.vue'
    import secondHand from '../components/series/secondHand.vue'
    import footerInfo from '../components/footerInfo.vue'
    import switchLocationPop from '../components/switchLocationPop.vue'

    const domModule = weex.requireModule('dom')
    const stream = weex.requireModule('stream')
    const modal = weex.requireModule('modal')
    const storage = weex.requireModule('storage')
    const thaw = weex.requireModule('THAW')
    const globalEvent = weex.requireModule('globalEvent')
    export default {
        data(){
            return {
                //车系标题名称
                titleName:'',
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo:{},
                //导航列表
                navInfo:'series',
                showShare: false,
                //分享数据
                shareData:{
                    title: "", // 分享标题
                    desc: "", // 分享描述
                    link: "", // 分享链接
                    imgUrl: "" // 分享图标
                },
                navList:[
                    {
                        name: '配置',
                        url: 'config.weex.js',
						icon: 'nav-config.png',
						width: '56px',
						height: '42px'
                    },
                    {
                        name:'图片',
                        url:'seriesPhoto.weex.js',
						icon: 'nav-photo.png',
						width: '54px',
						height: '46px'
                    },
                    {
                        name:'经销商',
                        url:'dealer.weex.js',
						icon: 'nav-dealer.png',
						width: '56px',
						height: '46px'
                    }
                ],
                //卡车图片信息
                truckImageData:{
                    //图片地址
                    imgSrc:'',
                    //图片跳转链接
                    imgUrl:'',
                    //图片总数量
                    imgTotal:'',
                    //价格
                    priceScope:'',
                    //排行
                    rank:''
                },
                //当前定位的城市
                myRegion:{},
                //选择的城市信息
                locationInfo:{
                    provinceName:'全国',
                    provinceId:'',
                    cityName:'',
                    cityId:'',
                },
                //经销商数据
                dealerData:{
                    notDealer: true
                },
                //选择城市弹层显示与隐藏
                LocationPop:false,
                //选择地区列表数据
                locationData:{},

                //文章列表
                articlesList:[],
                //查看更多文章url
                moreArticleUrl:'',
                //口碑数据
                reputation:{

                },
                //论坛数据
                bbsList:[],
                //论坛更多url
                morePostUrl:'',
                //其他人还关注列表
                otherData:[],
                //二手车数据
                secondHandData:{
                    data:[],
                    moreUrl:'',
                },
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
                        {
                            name:'配置',
                            url:'config.weex.js'
                        },
                        {
                            name:'图片',
                            url:'seriesPhoto.weex.js'
                        }
                    ]
                },
                //是否存储
//                isStore:false,
                //是否切换城市
                switchLocationShow:false,
                //苹果头部白条
                iosTop:false,
                //统计
                el:'产品库-子类车系综述页',
                // 更新modelTypeList组件信息
                modelTypeListUpdate: true,
            }
        },
        methods:{
			// 点击分享
			tapShare (platform) {
				this.sendBigData(0, String(platform))
			},
			// 发送大数据统计 
            sendBigData (isSuccess, platform) {
				// ['微信好友', '微信朋友圈', 'QQ好友', 'QQ空间', '新浪微博', '复制链接']
				// p3= 分享对象   1: 微信好友 2: 微信群  3: 朋友圈 4：Q空间   5: QQ好友 6：新浪微博   7:卡友圈   8：复制链接
				const map = new Map([
					['0', 1],
					['1', 3],
					['2', 5],
					['3', 4],
					['4', 6],
					['5', 8],
				])
				let param = {
					p1: 2,
                    p2: this.seriesInfo.F_SeriesId,
					p3: map.get(platform),
					p4: isSuccess,
                }
                this.collect(param)
            },
            shareShow () {
				this.showShare = true
            },
            // 分享的回调
            shareCallBack (data) {
                // 分享成功
                if (data.status === '0') {
                    const platformList = ['微信好友', '微信朋友圈', 'QQ好友', 'QQ空间', '新浪微博', '复制链接']
                    const platform = platformList[data.platform]
					this.eventGa(weex.config.deviceId, '分享产品库成功', this.el, platform)
					this.sendBigData(1, data.platform)
                }
            },
            getSeriesData(){

                //发送PV
                storage.getItem('p4',p4 => {
                    if(p4.result == 'success'){
                        this.p4 = p4.data;
                        storage.getItem('p5',p5 => {
                            if(p5.result == 'success'){
                                this.p5 = p5.data;
                                this.collect({
                                    'p3':p4.data,
                                    'p4':0,
                                    'p5':p5.data
                                })
                            }
                        })
                    }
                })

                //获取车系id & 子类id & 品牌id等信息
                storage.getItem('seriesInfo', (ele) => {
                    if (ele.result == 'success') {
                        this.seriesInfo = JSON.parse(ele.data);

                        //请求标题 && 图片数据
                        this.getData(this.ajaxUrl() + '/index.php?r=weex/series/info&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId, (ele) => {
                            if (ele.ok) {
                                //标题名称
                                this.titleName = ele.data.h1;
                                //卡车图片信息
                                this.truckImageData.imgSrc = ele.data.imgSrc;
                                //如果图片为空
                                if(!this.truckImageData.imgSrc){
                                    this.truckImageData.notImg = true;
                                }
                                this.truckImageData.imgTotal = ele.data.imgTotal;
                                this.truckImageData.priceScope = ele.data.priceScope;
                                this.truckImageData.rank = ele.data.rank;
                                this.truckImageData.imgUrl = ele.data.imgUrl;

                                //分享数据
                                this.shareData.title = ele.data.h1;// 分享标题
                                this.shareData.desc = ele.data.title//分享副标题
                                this.shareData.link = ele.data.url  //分享的url
                                this.shareData.imgUrl = ele.data.imgSrc; //分享的图片url

                                //发送GA
                                this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-子类车系综述页',ele.data.title)

                                this.hideLoading()
                            }
                        });

                        //请求车系页面其他数据
                        this.getData(this.ajaxUrl() + '/index.php?r=weex/series/other&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId, (ele) => {
                            if (ele.ok) {
                                //文章数据
//                                this.articlesList = ele.data.articles;
                                //更多文章url
                                this.moreArticleUrl = 'https://product.m.360che.com' + ele.data.moreArticleUrl;
                                //口碑数据
//                                this.reputation = ele.data.reputation;
                                //论坛数据
//                                this.bbsList = ele.data.postList;
                                //论坛更多url
//                            this.morePostUrl = ele.data.morePostUrl;
                                //其他人还关注列表
                                this.otherData = ele.data.compete;
                                //地区列表
                                this.locationData = ele.data.provinceList;

                                //热门车型id
                                this.footerInfo.ProductId = ele.data.askProId;
                                //车系询底价人数
                                this.footerInfo.askTotal = ele.data.askNum;

                                //存储询底价信息
                                storage.setItem('seriesFooterInfo', JSON.stringify(this.footerInfo))
                            }
                        });

                        //查看是否保存以选择城市信息
                        storage.getItem('selectedLocation', (ele) => {
                            if (ele.result == 'success') {
                                this.locationInfo = JSON.parse(ele.data);
                            }
                            //请求经销商数据
                            this.getDealerData();

                            //请求二手车数据
//                            this.getSecondHandData()
                        });
                    } else {
                        this.alert('网络出错')
                    }
                });
            },
            //选择城市弹层显示与隐藏
            selectLocationPop(){
                this.LocationPop = !this.LocationPop;
                this.navInfo = 'shabi'
            },
            //选择城市后保存已选择城市信息
            getLocationInfo(locationInfo){
                this.locationInfo = locationInfo;
                //请求经销商数据
                this.getDealerData();

                //请求二手车数据
//                this.getSecondHandData();

                //存储已经选择城市信息
                storage.setItem('selectedLocation',JSON.stringify(this.locationInfo));
            },

            //请求二手车数据
//            getSecondHandData(){
//                this.getData('https://tao-api.m.360che.com/foreign/truck/relatives?cat_id=' + this.seriesInfo.F_SubCategoryId + '&series_id=' + this.seriesInfo.F_SeriesId + '&prov_id=' + this.locationInfo.provinceId + '&brand_id=' + this.seriesInfo.F_BrandId,(ele) => {
//                    console.log(ele)
//                    if(ele.ok){
//                        this.secondHandData = ele.data
//                    }
//                })
//            },

            //请求经销商数据
            getDealerData(){
                this.getData('https://dealer-api.360che.com/APIDealerToProduct/Product/getdealerlist_multparamJson_app.aspx?subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId + '&' + new Date().getTime(),(ele) => {
                    if(ele.ok){
                        // debug: 服务端未过滤制表符 weex内不识别 替换制表符·（&#183;）
                        ele.data.list.length && ele.data.list.forEach(item => {
                            if (item.article) item.article = item.article.replace(/&#183;/g, '·')
                        })
                        this.dealerData = ele.data;
                        const list = this.dealerData.list
                        if (Array.isArray(list) && list.length) {
                            this.dealerData.notDealer = false;
                        } else {
                            this.dealerData.notDealer = true;
                        }
                    }
                })
            },
            //取消切换城市
            cancelSwitch(){
                this.switchLocationShow = false;
                //如果取消，地理位置不变，只更新时间
                let date = new Date();
                storage.setItem('myDate',date)
            },
            //确定切换城市
            okSwitch(){
                //存储定位城市数据
                this.setMyRegion();
                this.switchLocationShow = false;
            },
            //存储定位城市数据
            setMyRegion(){
                //赋值选择地区为定位地区
                this.locationInfo = this.myRegion;
                //请求经销商数据
                this.getDealerData();
                //存储定位地区 && 选择地区
                storage.setItem('myRegion',JSON.stringify(this.myRegion))
                storage.setItem('selectedLocation',JSON.stringify(this.myRegion))
                //存储定位时间
                let date = new Date();
                storage.setItem('myDate',date)
            },
            //获取定位地区
            getLocation(location){
                this.getData(this.ajaxUrl() + '/index.php?r=m/ajax/location/pos&longitude=' + location.longitude + '&latitude=' + location.latitude,res => {
                    if(res.ok){
                        this.myRegion.provinceName = res.data.province.name;
                        this.myRegion.provinceId = res.data.province.id;

                        this.myRegion.cityName = res.data.city.name;
                        this.myRegion.cityId = res.data.city.id;

                        //获取有没有存储定位时间
                        storage.getItem('myDate',date => {
                            if(date.result == 'success'){
                                let present = new Date();
                                //查看距离上次定位是否超过两个小时
                                if(((present - new Date(date.data)) / 1000 / 60 / 60 >= 2)){
                                    //查看已选择城市
                                    storage.getItem('selectedLocation',location => {
                                        if(location.result == 'success'){
                                            let locationData = JSON.parse(location.data);

                                            //判断定位城市和当前选择的城市是否相同
                                            if(locationData.cityName != this.myRegion.cityName){
                                                //提示用户地址变化，是否需要重新定位
                                                this.switchLocationShow = true;
                                            }
                                        }
                                    })
                                }
                            }else{//如果没有时间存储信息 定位并且存储
                                //赋值选择地区为定位地区   存储定位城市数据
                                this.setMyRegion();
                            }
                        })

                        //是否存储数据
//                            if(this.isStore){
//                                //存储定位地区
//                                storage.setItem('myRegion',JSON.stringify(this.myRegion))
//                                //存储定位时间
//                                let date = new Date();
//                                storage.setItem('myDate',date)
//
//                                //存储完改为fasle
//                                this.isStore = false;
//                            }

                    }
                })
            },
            //进入其他车系页面
            goSeries(ele){

                //发送事件请求
                this.event({
                    'p3' : 5,
                    'p4' : this.seriesInfo.F_SubCategoryId,
                    'p5' : ele.info.F_SubCategoryId,
                })

                let p4 = encodeURIComponent(ele.info.F_BrandId + '_' + ele.info.F_CateId + '_' + ele.info.F_SubCategoryId);
                let p5 = encodeURIComponent(ele.info.F_SeriesId)
                //存储p4
                storage.setItem('p4',p4)
                storage.setItem('p5',p5)

                //改变子类id、车系id、品牌id
                this.seriesInfo = ele.info;
                this.modelTypeListUpdate = !this.modelTypeListUpdate;

                storage.setItem('seriesInfo',JSON.stringify(ele.info),res => {
                    if(res.result == 'success'){
                        //请求车系数据
                        this.getSeriesData();

                        //返回页面顶部
                        let goTop = this.$refs['goTop'];
                        domModule.scrollToElement(goTop, {offset: 0, animated: false})
                    }
                })
            }
        },
        created(){
            //前端监控
            this.weexLogger('子类车系综述页')

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });

            //显示加载loading
            this.showLoading();

            //如果有车型id，删除车型id
            storage.getItem('ProductId',ele => {
                if(ele.result == 'success'){
                    storage.removeItem('ProductId')
                }
            })

            //车型图片id
            storage.getItem('imgProductId',ele => {
                if(ele.result == 'success'){
                    storage.removeItem('imgProductId')
                }
            })

            //请求车系数据
            this.getSeriesData();

            //如果是ios系统的话
            if(weex.config.env && weex.config.env.platform && weex.config.env.platform == 'iOS'){
                //头部的高度
                this.iosTop = true;
                // 获取定位地区的缓存
                storage.getItem('getlocationInfo',ele => {
                    if(ele.result == 'success'){
                        let location = JSON.parse(ele.data);
                        this.getLocation(location)
                    }
                });
            }else{;
                //调取地理位置信息
                thaw && thaw.getLocation()
                //监听事件返回结果
                globalEvent && globalEvent.addEventListener("onSendLocation",(e) => {
                    if(e.state == 'success'){
                        this.getLocation(e)
                    }
                });
            }

        },
        components:{
            title,
            nav,
            truckImage,
            modelTypeList,
            dealer,
            articles,
            reputation,
            bbsList,
            otherConcerns,
            footerPrice,
            selectLocation,
            secondHand,
            footerInfo,
            switchLocationPop,
        },
        mounted(){
        }
    }
</script>

<style scoped>
    .series{
        flex: 1;
        padding-bottom:100px;
        box-sizing: border-box;
    }
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .search-location-keep{
        flex: 1;
    }

</style>
