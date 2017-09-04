<template>
    <div  class="model">
        <div v-if="iosTop" class="ios-top"></div>
        <list style="flex: 1">
            <header ref="goTop">
                <title :titleName="titleName" :shareData="shareData" :ProductId="ProductId"></title>
            </header>
            <cell>
                <nav :navList="navList"></nav>
                <truck-image :truckImageData="truckImageData" url="modelPhoto.weex.js"></truck-image>
                <div class="model-info">
                    <div class="model-name">
                        <text class="model-name-text">{{simName}}</text>
                        <text class="examine-similar" @click="examineSimilar" v-if="gatherTotal > 1">查看{{gatherTotal - 1}}款相近车型</text>
                    </div>
                    <div class="switch-model-button" @click="switchModelShow">
                        <!--<text :style="{fontFamily:'detail',fontSize:'32px',color:'#586c94'}">&#x5237;</text>-->
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/switch-model.png" style="width:38px;height:32px"></image>
                        <text class="switch-model-button-text">换车型</text>
                    </div>
                </div>
                <div class="quote-wrapper" v-if="areaPrice.length">
                    <div class="dealer-quote" v-for="ele in areaPrice">
                        <text class="quote-text">经销商参考价</text>
                        <text class="quote-price">{{ele.price}}</text>
                    </div>
                </div>
                <!--参数配置-->
                <parameterConfig :parameterData="parameterData" :moreParamUrl="moreParamUrl"></parameterConfig>
            </cell>
            <cell ref="examine">
                <!--相近车型可选配置-->
                <examineSimilar v-if="examineSimliarData.content.length > 0 && gatherTotal > 1" :seriesId="seriesInfo.F_SubCategoryId" :ProductId="ProductId" :seriesInfo="seriesInfo" :examineSimliarData="examineSimliarData" :optionCondition="optionCondition" :locationInfo="locationInfo" :compareState="compareState" @compare="compare" @goModel="goModel" @selectOption="selectOption"></examineSimilar>
                <!--经销商-->
                <dealer :locationInfo="locationInfo" :dealerData="dealerData" @selectLocationPop="selectLocationPop" sum="false" :el="el" isProduct="true"></dealer>
                <!--其他人还关注-->
                <other-concerns :otherData="otherData[otherIndex]" :exchangeButton="exchangeButton" @exchange="exchange" :el="el" @goModel="goModel" :ProductId="ProductId"></other-concerns>
            </cell>
        </list>
        <!--选地区弹层-->
        <selectLocation v-if="LocationPop" :locationData="locationData" @selectLocationPop="selectLocationPop" @getLocationInfo="getLocationInfo"></selectLocation>
        <!--换车型弹层-->
        <switch-model v-if="switchModelData.paramName" :switchModelPop="switchModelPop" :switchModelData="switchModelData" :ProductId="ProductId" @goSwitchModel="goSwitchModel" @switchModelShow="switchModelShow"></switch-model>
        <!--底层询底价浮层-->
        <footerInfo :footerInfo="footerInfo" @compare="compare" :compareState="compareState" :el="el"></footerInfo>
        <!--对比按钮-->
        <div :class="['compare',compareNumber == 0 ? 'compare-hide' : '']" ref="compare" @click="goCompare">
            <text class="compare-text">对比  ({{compareNumber}})</text>
        </div>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import nav from '../components/nav.vue'
    import truckImage from '../components/truckImage.vue'
    import parameterConfig from '../components/model/parameterConfig.vue'
    import examineSimilar from '../components/model/examineSimilar.vue'
    import dealer from '../components/dealer.vue'
    import otherConcerns from '../components/otherConcerns.vue'
    import selectLocation from '../components/selectLocation.vue'
    import switchModel from '../components/switchModel.vue'
    import footerInfo from '../components/footerInfo.vue'

    let stream = weex.requireModule('stream')
    let dom = weex.requireModule('dom')
    let storage = weex.requireModule('storage')
    let modal = weex.requireModule('modal')
    let animation = weex.requireModule('animation')
    let globalEvent = weex.requireModule('globalEvent');
    export default {
        components:{title, nav, truckImage,parameterConfig,examineSimilar,dealer,otherConcerns,selectLocation,switchModel,footerInfo},
        data(){
            return {
                //车系标题名称
                titleName:'',
                //车系ID
                seriesId:'',
                //分享数据
                shareData:{
                    title: "", // 分享标题
                    desc: "", // 分享描述
                    link: "", // 分享链接
                    imgUrl: "" // 分享图标
                },
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo:{},
                //导航列表
                navList:[
                    {
                        name: '综述',
                        url: 'model.weex.js',
                        selected: true
                    },
                    {
                        name: '配置',
                        url: 'modelConfig.weex.js',
                        selected: false
                    },
                    {
                        name: '图片',
                        url: 'modelPhoto.weex.js',
                        selected: false
                    },
                    {
                        name: '经销商',
                        url: 'modelDealer.weex.js',
                        selected: false
                    }
                ],
                //车型id
                ProductId:'',
                //车型简称
                simName:'',
                //类似车型数量
                gatherTotal:'',
                //卡车图片信息
                truckImageData:{
                    //图片路径
                    imgSrc:'',
                    //图片数量
                    imgTotal:'',
                    //图片价格
                    priceScope:{
                        price:''
                    },
                    //排行
                    rank:'',
                    //点击跳转链接
                    imgUrl:''
                },
                //本地经销商参考价
                areaPrice:[],
                //其他人还关注列表
                otherData:[],
                //其他人还关注列表换一批下表
                otherIndex:0,
                //其他人还关注换一批按钮
                exchangeButton:true,
                //换车型弹层是否显示
                switchModelPop:false,
                //换车型弹层数据
                switchModelData:{
                    //换车型列表数据
                    priceList:[],
                    //换车型标题数据
                    attrList:[],
                    //换车型当前的显示
                    paramName:'',
                },
                //参数配置数据
                parameterData:[],
                //查看详细参数配置url
                moreParamUrl:'',
                //相似车型可选配置数据
                examineSimliarData:{
                    options:{},
                    content:[]
                },
                //存储所选的筛选条件
                optionCondition:{

                },
                //选择的城市信息
                locationInfo:{
                    provinceName:'全国',
                    provinceId:'',
                    cityName:'',
                    cityId:'',
                },
                //经销商数据
                dealerData:{},
                //选择城市弹层显示与隐藏
                LocationPop:false,
                //选择地区列表数据
                locationData:{},

                //底层询底价信息
                footerInfo:{
                    //询底价数量
                    askTotal:'',
                    //车系询底价热门车型id
                    ProductId:'',
                    //是否显示加入对比
                    compare:true,
                    //是否显示询底价
                    footerPrice:false,
                    list:[
                        {
                            name:'配置',
                            url:'modelConfig.weex.js'
                        },
                        {
                            name:'图片',
                            url:'modelPhoto.weex.js'
                        }
                    ]
                },
                //加入对比状态
                compareState:{

                },
                //对比要跳转过去的url
//                compareUrl:'',
                //对比的数量
                compareNumber:'',
                //存储的对比数据
                compareTask:{},
                //苹果头部白条
                iosTop:false,
                //统计
                el:'产品库-车型综述页'

            }
        },
        methods:{
            //请求车型数据
            getModelData(){

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
                                    'p5':p5.data,
                                    'p6':this.ProductId
                                })
                            }
                        })
                    }
                })

                //请求车型数据
                this.getData(this.ajaxUrl() + '/index.php?r=weex/product/price/&proId=' + this.ProductId + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId,(ele) => {
                    if(ele.ok){
                        //标题
                        this.titleName = ele.data.proInfo.F_ProductName;

                        //发送GA
                        this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-车型综述页',ele.data.title)
                        //图片数据
                        this.truckImageData.imgSrc = ele.data.proInfo.imgSrc;

                        //如果图片为空
                        if(!this.truckImageData.imgSrc){
                            this.truckImageData.notImg = true;
                        }

                        this.truckImageData.rank = ele.data.rank;
                        this.truckImageData.imgTotal = ele.data.proInfo.F_ImagesCount;
                        this.truckImageData.priceScope.price = ele.data.proInfo.F_Price;
                        this.truckImageData.priceScope.imgUrl = ele.data.proInfo.imgUrl;
                        this.truckImageData.imgUrl = ele.data.proInfo.imgUrl;

                        //判断车型是不是停售
                        if(ele.data.proInfo.F_IsStopMake == 4){
                            this.footerInfo.footerPrice = false;
                        }else{
                            this.footerInfo.footerPrice = true;
                        }
                        //车型简称
                        this.simName = ele.data.proInfo.simName;
                        if(this.simName == ''){
                            this.simName = ele.data.proInfo.F_ProductName
                        }

                        //本地经销商参考价
                        this.areaPrice = ele.data.areaPrice

                        //查看相似车型数量
                        this.gatherTotal = ele.data.gatherTotal;
                        //参数配置数据
                        this.parameterData = ele.data.mainParam;
                        console.log( this.parameterData,' this.parameterData')
                        //查看详细参数配置url
                        this.moreParamUrl = ele.data.moreParamUrl;
                        //相似车型可选配置数据
                        this.examineSimliarData.gatherKeys = ele.data.gatherKeys;
                        this.examineSimliarData.options = ele.data.gatherProParams;
                        this.examineSimliarData.content = ele.data.gatherProList;

                        //选地区数据
                        this.locationData = ele.data.provinceList;


                        //其他人还关注
                        this.otherData.push(ele.data.competeProduct);
                        //请求其他人还关注第二页信息
                        if(this.otherData[0].length){
                            this.getData(this.ajaxUrl() + '/index.php?r=api/getcompeteproduct&productId=' + this.ProductId + '&num=2&size=5&isW=1',ele => {
                                if(ele.ok && ele.data.info == 'ok'){
                                    this.otherData = this.otherData.concat(ele.data.data)

                                    if(this.otherData.length < 2){
                                        this.exchangeButton = false;
                                    }
                                }
                            })
                        }

                        //获取询底价人数信息
                        this.footerInfo.askTotal = ele.data.askNum;

                        //分享数据
                        this.shareData.title = this.titleName;// 分享标题
                        this.shareData.desc = ele.data.title;//分享副标题
                        this.shareData.link = ele.data.indexUrl; //分享的url
                        this.shareData.imgUrl = this.truckImageData.imgSrc; //分享的图片url


                        //缓存询底价信息
                        storage.setItem('modelFooterInfo',JSON.stringify(this.footerInfo))

                        //隐藏加载loading
                        this.hideLoading()
                    }
                });

                //请求换车型数据
                this.getData(this.ajaxUrl() + '/index.php?r=weex/product/get-product-change-list&subId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.ProductId,(ele) => {
                    if(ele.ok){
                        //换车型列表数据
                        this.switchModelData.priceList = ele.data.priceList;
                        //换车型标题数据
                        this.switchModelData.attrList = ele.data.attrList
                        //当前显示的是哪一个
                        if(ele.data.paramName){
                            this.switchModelData.paramName = ele.data.paramName;
                        }else{
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

                                }
                            })
                            this.$set(this.switchModelData, 'paramName', paramName);
                        }

                        //隐藏加载loading
                        this.hideLoading()
                    }
                })

            },
            //选择城市弹层显示与隐藏
            selectLocationPop(){
                this.LocationPop = !this.LocationPop;
            },
            //查看类似车型
            examineSimilar(){
                //锚点跳转到全部相似车型
                let examine = this.$refs['examine'];
                dom.scrollToElement(examine, {offset: -68})
                // dom.scrollToElement(this.$refs['examine'][0], {offset: 0})

                // 遍历删选条件 如果有条件就不显示所有数据
                for(key in this.optionCondition){
                    if(key) return
                }
                //循环所有数据，显示所有数据
                this.examineSimliarData.content.forEach((ele,index) => {
                    this.$set(this.examineSimliarData.content[index],'show',true)
                })
            },
            //换车型弹框
            switchModelShow(){
                this.switchModelPop = !this.switchModelPop;
            },
            //点击换车型弹层车型列表
            goSwitchModel(ProductId){
                this.switchModelPop = false;
                //显示加载loading
                this.showLoading();
                //切换车型id
                this.ProductId = ProductId;
                this.footerInfo.productId = ProductId;

                //存储车型id
                storage.setItem('ProductId',ProductId);

                //存储询底价车型id
                storage.setItem('priceProductId',ProductId);

                //发送PV
//                storage.getItem('p4',p4 => {
//                    if(p4.result == 'success'){
//                        this.p4 = p4.data;
//                        storage.getItem('p5',p5 => {
//                            if(p5.result == 'success'){
//                                this.p5 = p5.data;
//                                this.collect({
//                                    'p3':p4.data,
//                                    'p4':0,
//                                    'p5':p5.data,
//                                    'p6':'#' + this.ProductId
//                                })
//                            }
//                        })
//                    }
//                })


                //请求经销商数据
                this.getDealerData();

                this.getModelData();

                //请求车型数据
//                this.getData(this.ajaxUrl() + '/index.php?r=weex/product/price/&proId=' + this.ProductId + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId,(ele) => {
//                    if(ele.ok){
//                        //标题
//                        this.titleName = ele.data.proInfo.F_ProductName;
//                        //图片数据
//                        this.truckImageData.imgSrc = ele.data.proInfo.imgSrc;
//                        //如果图片为空
//                        if(!this.truckImageData.imgSrc){
//                            this.truckImageData.notImg = true;
//                        }
//                        this.truckImageData.rank = ele.data.rank;
//                        this.truckImageData.imgTotal = ele.data.proInfo.F_ImagesCount;
//                        this.truckImageData.priceScope.price = ele.data.proInfo.F_Price;
//                        this.truckImageData.priceScope.imgUrl = ele.data.proInfo.imgUrl;
//                        this.truckImageData.imgUrl = ele.data.proInfo.imgUrl;
//
//                        //判断车型是不是停售
//                        if(ele.data.proInfo.F_IsStopMake == 4){
//                            this.footerInfo.footerPrice = false;
//                        }else{
//                            this.footerInfo.footerPrice = true;
//                        }
//                        //车型简称
//                        this.simName = ele.data.proInfo.simName;
//                        if(this.simName == ''){
//                            this.simName = ele.data.proInfo.F_ProductName
//                        }
//
//                        //本地经销商参考价
//                        this.areaPrice = ele.data.areaPrice
//
//                        //查看相似车型数量
//                        this.gatherTotal = ele.data.gatherTotal;
//                        //参数配置数据
//                        this.parameterData = ele.data.mainParam;
//                        //查看详细参数配置url
//                        this.moreParamUrl = ele.data.moreParamUrl;
//
//                        //相似车型可选配置数据
//                        this.examineSimliarData.options = ele.data.gatherProParams;
//                        this.examineSimliarData.content = ele.data.gatherProList;
//
//                        //选地区数据
//                        this.locationData = ele.data.provinceList;
//
//                        //其他人还关注
//                        this.otherData.push(ele.data.competeProduct);
//                        //请求其他人还关注第二页信息
//                        if(this.otherData[0].length){
//                            this.getData(this.ajaxUrl() + '/index.php?r=api/getcompeteproduct&productId=' + this.ProductId + '&num=2&size=5&isW=1&noCache=1',ele => {
//                                if(ele.ok && ele.data.info == 'ok'){
//                                    this.otherData = this.otherData.concat(ele.data.data)
//                                    if(this.otherData.length < 2){
//                                        this.exchangeButton = false;
//                                    }
//                                }
//                            })
//                        }
//
//
//                        //获取询底价人数信息
//                        this.footerInfo.askTotal = ele.data.askNum;
//
//                        //分享数据
//                        this.shareData.title = this.titleName;// 分享标题
//                        this.shareData.desc = ele.data.title;//分享副标题
//                        this.shareData.link = ele.data.indexUrl; //分享的url
//                        this.shareData.imgUrl = this.truckImageData.imgSrc; //分享的图片url
//
//                        //缓存询底价信息
//                        storage.setItem('modelFooterInfo',JSON.stringify(this.footerInfo))
//                    }
//                });
//
//                //请求换车型数据
//                this.getData(this.ajaxUrl() + '/index.php?r=weex/product/get-product-change-list&subId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.ProductId,(ele) => {
//                    if(ele.ok){
//                        //换车型列表数据
//                        this.switchModelData.priceList = ele.data.priceList;
//                        //换车型标题数据
//                        this.switchModelData.attrList = ele.data.attrList
//                        //当前显示的是哪一个
//                        if(ele.data.paramName){
//                            this.switchModelData.paramName = ele.data.paramName;
//                        }else{
//                            //判断哪一个的length最长显示哪一个
//                            let paramName = '';
//                            let has = true;
//                            ele.data.priceList.forEach((res,index) => {
//                                if (has) {
//                                    has = false;
//                                    paramName = ele.data.attrList[index];
//                                    ele.data.priceList.forEach((r,i) => {
//                                        if (ele.data.priceList[index].list.length < ele.data.priceList[i].list.length) {
//                                            paramName = ele.data.attrList[i];
//                                        }
//                                    })
//
//                                }
//                            })
//                            this.$set(this.switchModelData, 'paramName', paramName);
//                        }
//
//                        //隐藏加载loading
//                        this.hideLoading()
//                    }
//                })

//                //其他人还关注
//                this.getData(this.ajaxUrl() + '/index.php?r=api/getcompeteproduct&productId=' + this.ProductId + '&num=2&size=5',ele => {
//                    if(ele.ok && ele.data.info == 'ok'){
//                        this.otherData = ele.data.data
////                        console.log(this.otherData,'this.otherData')
//                    }
//                })

                //切换车型id
//                storage.setItem('ProductId',ProductId,ele => {
//                    if(ele.result == 'success'){
//                        this.goWeexUrl('model.weex.js')
//                    }
//                })
            },
            //选择城市后保存已选择城市信息
            getLocationInfo(locationInfo){
                this.locationInfo = locationInfo;
                //请求经销商数据
                this.getDealerData();

                //存储已经选择城市信息
                storage.setItem('selectedLocation',JSON.stringify(this.locationInfo));
            },
            //请求经销商数据
            getDealerData(){
                let proId = this.ProductId;
                this.getData(this.ajaxUrl() + '/index.php?r=weex/series/dealer&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId + '&proId=' + this.ProductId ,(ele) => {
                    if(ele.ok){
//                        this.alert(this.ProductId)
                        this.dealerData = ele.data;

                        if(!this.dealerData.list.length){
                            this.dealerData.notDealer = true;
                        }else{
                            this.dealerData.notDealer = false;
                        }
                    }
                })
            },
            //对比
            compare(id){
                //查看存储的数据
                storage.getItem('compareTask', (ele) => {
                    if (ele.result == 'success') {
                        let data = JSON.parse(ele.data);
                        if (data[this.seriesId]) {
                            //判断是加入还是取消
                            if (this.compareState[id]) {  //取消
                                //循环已保存的数组 && 删除掉
                                data[this.seriesId].forEach((ele, index) => {
                                    if (ele == id) {
                                        data[this.seriesId].splice(index, index + 1)
                                        //添加对比的数量
                                        this.compareNumber--;

                                        //如果还剩下一个对比
//                                        if (data[this.seriesId][0]) {
//                                            //对比的链接
//                                            this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '/';
//                                        }
                                    }
                                });
                                //再次存储
                                storage.setItem('compareTask', JSON.stringify(data), () => {
                                    this.$set(this.compareState, id, '')
                                })
                            } else {//加入
                                if (data[this.seriesId].length >= 2) {
                                    this.alert('只能对比两款车型')
                                } else {
                                    data[this.seriesId].push(id);
                                    //添加对比的数量
                                    this.compareNumber++;

                                    //判断现在对比的数量有几个
//                                    if (data[this.seriesId].length == 2) {
//                                        //对比的链接
//                                        this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '_' + data[this.seriesId][1] + '/';
//                                    } else {
//                                        //对比的链接
//                                        this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '/';
//                                    }
                                    //再次存储
                                    storage.setItem('compareTask', JSON.stringify(data), () => {
                                        this.$set(this.compareState, id, '已加入')
                                    })

                                }
                            }

                        } else {
                            data[this.seriesId] = [];
                            data[this.seriesId].push(id);
                            //添加对比的数量
                            this.compareNumber++;
                            //加入对比
                            this.$set(this.compareState, id, '已加入');
                            //对比的链接
//                            this.compareUrl = 'http://product.m.360che.com/contrast/' + id + '/';
                            storage.setItem('compareTask', JSON.stringify(data))
                        }
                    } else {
                        //未获取到存储，第一次存储
                        let compareTask = {};
                        compareTask[this.seriesId] = [];
                        compareTask[this.seriesId].push(id);


                        //添加对比的数量
                        this.compareNumber++;

                        //加入对比
                        this.$set(this.compareState, id, '已加入');
                        //对比的链接
//                        this.compareUrl = 'http://product.m.360che.com/contrast/' + id + '/';
                        storage.setItem('compareTask', JSON.stringify(compareTask))
                    }
                });
            },
            //点击对比，跳转对比页面
            goCompare(){
                //读取对比信息
                storage.getItem('compareTask',ele => {
                    if(ele.result == 'success'){
                        //缓存对比需要的信息
                        storage.setItem('compareData',ele.data,res => {
                            if(res.result == 'success'){

                                //删除对比信息
                                let data = JSON.parse(ele.data);
                                if(data[this.seriesId]){
                                    data[this.seriesId] = [];
                                }
                                //重置对比信息
                                this.compareState = {};
                                this.compareNumber = 0;
//                                this.alert(JSON.stringify(ele.data))

                                //重新缓存
                                storage.setItem('compareTask',JSON.stringify(data),success => {
                                    if(success.result == 'success'){
//                                        this.alert(JSON.stringify(data))
                                        //成功跳转对比页面
                                        this.goWeexUrl('contrast.weex.js');
                                    }
                                })
                            }
                        })
                    }
                })
            },
            //点击换一批
            exchange(){

                this.otherIndex++;

                let arr = [];
                this.otherData[this.otherIndex].forEach(res => {
                    arr.push(res.F_ProductId)
                })

                //发送事件请求
                this.event({
                    'p3' : 1,
                    'p4' : this.ProductId,
                    'p5' :encodeURIComponent(arr.join('|')),
                })

                if(this.otherIndex == this.otherData.length - 1){
                    this.exchangeButton = false;
                }
            },
            //跳转到其他车型页
            goModel(ele,other){


                //如果点击的是其他人还关注，发送事件，
                if(other){
                    //发送事件请求
                    this.event({
                        'p3' : 7,
                        'p4' : this.ProductId,
                        'p5' : ele.F_ProductId,
                    })
                }

                //跳转到其他车型页面
                this.ProductId = ele.F_ProductId;
                this.optionCondition = {};

//                //发送事件请求
//                storage.getItem('p4',p4 => {
//                    if(p4.result == 'success'){
//                        this.p4 = p4.data;
//                        storage.getItem('p5',p5 => {
//                            if(p5.result == 'success'){
//                                this.p5 = p5.data;
//                                this.event({
//                                    'p3' : 1,
//                                    'p4' : p4.data,
//                                    'p5' : p5.data,
//                                    'p6' :'#' + this.ProductId,
//                                })
//                            }
//                        })
//                    }
//                })

                //返回页面顶部
                let goTop = this.$refs['goTop'];
                dom.scrollToElement(goTop, {offset: 0})

                storage.setItem('ProductId',ele.F_ProductId,res => {
//                    this.goWeexUrl('model.weex.js')
                    //请求车型数据和换车型数据
                    this.getModelData();
                });
            },
            selectOption(key,option){
                //设置存储所选的筛选条件
                this.$set(this.optionCondition,key,option);
                //循环对比数据
                //循环数据
                this.examineSimliarData.content.forEach((data,index) => {
                    //定义条件
                    let isAccord = true;
                    //循环筛选条件
                    for(let ele in this.optionCondition){
                        if(isAccord){
                            if(data[ele] == this.optionCondition[ele]){
                                isAccord = true;
                            }else{
                                isAccord = false;
                            }
                        }
                    }
                    if(isAccord){
                        this.$set(this.examineSimliarData.content[index],'show',true)
                    }else{
                        this.$set(this.examineSimliarData.content[index],'show',false)
                    }
                });
            }
        },
        created(){

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });

            if(weex.config.env.platform == 'iOS'){
                this.iosTop = true;
            }

            //显示加载loading
            this.showLoading();

            //请求车型数据
            //获取车系id & 子类id & 品牌id等信息
            storage.getItem('seriesInfo',(ele) => {
                if(ele.result == 'success'){
                    this.seriesInfo = JSON.parse(ele.data);

                    //车系id
                    this.seriesId = this.seriesInfo.F_SubCategoryId;

                    //查看有没有对比的缓存
                    storage.getItem('compareTask',ele => {
                        if(ele.result == 'success'){
                            let data = JSON.parse(ele.data)[this.seriesId];
                            if(data){
                                data.forEach((res,index) => {
                                    this.$set(this.compareState,res,'已加入')
                                    this.compareNumber++
                                })
                                console.log(JSON.parse(ele.data)[this.seriesId],'ele.data')
                            }
                        }
                    })

                    //查看是否保存以选择城市信息
                    storage.getItem('selectedLocation',(ele) => {
                        if(ele.result == 'success'){
                            this.locationInfo = JSON.parse(ele.data);
                        }
                        storage.getItem('ProductId',(res) => {
                            if(res.result == 'success'){
                                this.ProductId = res.data;
                                this.footerInfo.ProductId = res.data;
                                //请求经销商数据
                                this.getDealerData();
                            }
                        })
                    });


                    //获取车型id
                    storage.getItem('ProductId',(res) => {
                        if(res.result == 'success'){
                            this.footerInfo.ProductId = res.data;
                            //给车型id赋值
                            this.ProductId = res.data;

                            //请求车型数据和换车型数据
                            this.getModelData();
                        }
                    })

                    //隐藏加载loading
                    this.hideLoading()
                }
            });

        },
        watch: {
            //监听 加入 || 取消对比
            compareNumber(){
                let compare = this.$refs.compare;

                if (this.compareNumber == '') {
                    animation.transition(compare, {
                        styles: {
                            transform: 'translate(0,0)',
                        },
                        duration: 300,
                        timingFunction: 'ease'
                    })
                } else {
                    animation.transition(compare, {
                        styles: {
                            transform: 'translate(-140px,0)',
                        },
                        duration: 300,
                        timingFunction: 'ease'
                    })
                }
            }
        }
    }
</script>
<style scoped>
    .model{
        flex:1;
        padding-bottom:100px;
    }
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .model-info{
        padding-top:20px;
        padding-bottom:20px;
        padding-left:30px;
        flex-direction:row;
    }
    .model-name{
      position: relative;
      width:550px;
      height:80px;
      flex: 1;
    }
    .model-name-text{
        color: #333;
        font-size:28px;
        margin-right:20px;
        margin-bottom:10px;
    }
    .examine-similar{
        position:absolute;
        right:30px;
        bottom:4px;
        color:#586C94;
        font-size:28px;
        text-decoration: underline;
    }
    .switch-model-button{
        width:170px;
        height:90px;
        padding-top: 5px;
        padding-bottom:5px;
        align-items: center;
        justify-content:space-between;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#eee;
    }
    .switch-model-button-text{
        color:#586c94;
        font-size:28px;
    }
    .compare{
        position: fixed;
        left:750px;
        bottom: 270px;
        width: 140px;
        height: 70px;
        justify-content: center;
        align-items: center;
        border-top-left-radius:36px;
        border-bottom-left-radius:36px;
        background-color: rgba(21,113,229,.8);
    }
    .compare-text{
        color:#fff;
        font-size:24px;
    }
    .quote-wrapper{
        padding-top: 20px;
        padding-bottom:20px;
        padding-left:30px;
        padding-right:30px;
        border-top-width: 1px;
        border-top-style:solid;
        border-top-color: #eee;
    }
    .dealer-quote{
        flex-direction:row;
        justify-content: flex-start;
        align-items: center;
    }
    .quote-text{
        color:#333;
        font-size: 24px;
    }
    .quote-price{
        font-size: 32px;
        color: #f60;
        margin-left: 10px;
    }
</style>
