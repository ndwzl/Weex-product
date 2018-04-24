<template>
    <!-- 询价成功 -->
    <div class="success-page">
        <div v-if="iosTop" class="ios-top"></div>
        <list style="flex:1">
            <header>
                <!-- 标题 -->
                <title :titleName="titleName"></title>
            </header>
            <cell>
                <!-- 询价成功提示 -->
                <div class="success">
                    <div class="success-module">
                        <div class="success-icon">
                            <!--<text :style="{fontFamily:'detail',fontSize:'60px',color:'#f60'}" class="mark">勾</text>-->
                            <image src="https://s.kcimg.cn/wap/images/detail/productApp/mark.png" style="width:64px;height:64px"></image>
                        </div>
                        <div class="success-text">
                            <text class="prosit">恭喜您, 询价成功~</text>
                            <text class="relation">稍后会有经销商与您联系</text>
                        </div>
                    </div>
                </div>
                <!-- 挂车询价 （只有牵引车询价成功才有） -->
                <div class="trailer" v-if="trailerCount">
                    <div class="trailer-header">
                        <text class="trailer-header-text orange">{{trailerCount}}人</text>
                        <text class="trailer-header-text">还对</text>
                        <text class="trailer-header-text orange">挂车</text>
                        <text class="trailer-header-text">进行了询价</text>
                    </div>
                    <div class="trailer-query">
                        <div :class="['trailer-select', selectError ? 'trailer-select-red' : '' ]" @click="subClassChange">
                            <text :class="['trailer-select-text', selectError ? 'trailer-select-red-text' : '' ]">{{trailerType}}</text>
                            <image class="trailer-select-icon" :src="DefaultImgPath + 'enter-red.png'" v-if="selectError"></image>
                            <image class="trailer-select-icon" :src="DefaultImgPath + 'enter-999.png'" v-else></image>
                        </div>
                        <div class="trailer-query-price-success" v-if="querySuccess">
                            <text class="trailer-query-price-success-text">询价成功</text>
                        </div>
                        <div class="trailer-query-price" v-else @click="queryPrice">
                            <text class="trailer-query-price-text">快速询价</text>
                        </div>
                    </div>
                </div>
                <!-- 推荐列表 竞品车型 -->
                <div class="recommend">
                    <div class="head" v-if="restsAttention.length > 0">
                        <text class="attention">询问此车型的人还在关注</text>
                        <div class="change" @click="exchange" v-if="showChange">
                            <!--<text :style="{fontFamily:'detail',fontSize:'20px',color:'#f60'}" class="change-icon">刷</text>-->
                            <image src="https://s.kcimg.cn/wap/images/detail/productApp/switch-model-f60.png" style="width:38px;height: 32px"></image>
                            <text class="change-text">换一批</text>
                        </div>
                    </div>
                    <div class="recommend-list" v-if="restsAttention.length > 0">
                        <div class="car-content" v-for="(ele,index) in restsAttention[index]">
                            <image class="car-icon" :src="ele.img"></image>
                            <div class="detail">
                                <div class="car-info">
                                    <text class="car-text">{{ele.F_ProductName}}</text>
                                </div>
                                <div class="footer">
                                    <div class="number">
                                        <text class="man"> {{ele.F_WeekClickCount}}人</text>
                                        <text class="ask">成功询价</text>
                                    </div>
                                </div>
                            </div>
                            <!-- 一键询价 -->
                            <div :class="['quick',ele.text ? 'quick-selected' : '']" @click="speedyPrice(ele,index)">
                                <text :class="['ask-btn',ele.text ? 'ask-btn-selected' : '']">{{ele.text ? '询价成功' : '一键询价'}}</text>
                            </div>
                        </div>
                    </div>
                </div>
            </cell>
        </list>
        <!-- 侧边栏 -->
        <sidebar @subClassChange="subClassChange" @returnData="getTrailerType" :list="trailerData" :isIos="iosTop" v-if="sidebar"></sidebar>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import sidebar from '../components/filter/sidebar.vue'

    var stream = weex.requireModule('stream');
    var animation = weex.requireModule('animation');
    var storage = weex.requireModule('storage');
    let globalEvent = weex.requireModule('globalEvent');

    export default {
        components: {
            title,
            sidebar
        },
        data(){
            return {
                recommendDate:{

                },
                // 询底价标题
                titleName:'询价成功',
                // 其他人关注的车型
                restsAttention:[],
                //换一批下标
                index:0,
                //发送的数据
                priceData:{},
                batchId:'',
                ProductId:'',
                iosTop:false,
                // 显示换一批
                showChange:true,
                // 多少人对挂车进行了询价
                trailerCount: 0,
                // 挂车类型
                trailerType: '请选择挂车类型',
                // 挂车数据
                trailerData: [],
                // 挂车侧边栏显示隐藏
                sidebar: false,
                // 询价是否成功
                querySuccess: false,
                // 询价前是否选择了挂车类型 未选择显示错误警告红色
                selectError: false,
                // 挂车类型id
				trailerId: 0,
				// 挂车询价默认参数
				defaultParam: {
					accountid: 0,
                    categoryid: 14,
                    isold: 0
				}
            }
        },
        created(){

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });


            this.iosTop = this.isIos()
            //获取保存的询价信息
            storage.getItem('postFooterPrice',ele => {
                if(ele.result == 'success'){
                    let data = JSON.parse(ele.data)
                    // 如果是牵引车 获取挂车询价数量
                    if (data.isTractor) {
                        this.getTrailerData()
                    }
                    // 和询底价页面按钮进行区分
                    // ios的一键询价为28
                    // 安卓的一键询价为27
                    // 挂车的来源
                    data.trailerClueresource = this.isIos() ? 13 : 14
                    if (data.clueresource == 32) {
                        data.clueresource = 33
                        this.goUrlGa(weex.config.deviceId,'product.app.360che.com','产品库APP-询底价成功页','询价成功')
                    } else {
                        data.clueresource = this.isIos() ? 28 : 27
                        this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-询底价成功页','询价成功')
                    }

                    this.priceData = data;
                    this.ProductId = this.priceData.truckid
                    //请求关注推荐数据
                    // isW = {
                    //     1: '3纬数组',
                    //     2: '2纬数组',
                    // }
                    this.getData(`${this.ajaxUrl()}/index.php?r=api/getcompeteproduct&isW=2&productId=${this.priceData.truckid}`,(ele) => {
                        if(ele.ok && ele.data.info == 'ok'){
                            this.restsAttention = ele.data.data
                            this.showChange = ele.data.total < 2 ? false : true
                        }
                    })
                    let p7 = '';
                    if(this.priceData.shopstr.split(',').length){
                        p7 = encodeURIComponent(this.priceData.shopstr.split(',').join('|'))
                    }

                    //发送PV
                    storage.getItem('p4',p4 => {
                        if(p4.result == 'success'){
                            this.p4 = p4.data;
                            storage.getItem('p5',p5 => {
                                if(p5.result == 'success'){
                                    this.p5 = p5.data;
                                    this.collect({
                                        'p3':p4.data,
                                        'p4':6,
                                        'p5':p5.data,
                                        'p6':this.priceData.truckid,
                                        'mpn':this.priceData.tel
                                    })
                                }
                            })
                        }
                    })
                }
            })

            //获取以选择的城市列表信息

            //获取缓存已选择城市
            storage.getItem('selectedLocation',ele => {
                if(ele.result == 'success'){
                    //保存已选择城市信息
                    this.locationInfo = JSON.parse(ele.data);
                }
            });
        },
        methods:{
            checkTrailerType () {
                this.selectError = this.trailerId ? false : true
                return this.trailerId ? true : false
			},
            // 询价 
            queryPrice () {
                if (!this.checkTrailerType()) {
                    return
                }
                let paramData = Object.assign(this.defaultParam, this.priceData)
                paramData.clueresource = paramData.trailerClueresource
                paramData.subcategoryid = this.trailerId
				paramData.relname = encodeURI(paramData.relname)
				paramData.TruckName = encodeURI(paramData.TruckName)
                delete paramData.trailerClueresource
                delete paramData.isTractor
				delete paramData.shopstr
				console.log(paramData)
                this.getData(`http://api.dealer.360che.com/Dealer/submitDealerClues.aspx${this.jsonToUrl(paramData)}`, res => {
					const data = res.data
                    if (data.isok) {
                        // 设置询价成功
                        this.querySuccess = true
                    } else {
                        data.msg && this.alert(data.msg)
                    }
                })
            },
            // 侧边栏切换
            subClassChange () {
                this.sidebar = !this.sidebar
            },
            // 得到挂车类型
            getTrailerType (data) {
                this.trailerId = data.id
                this.trailerType = data.name
                // 重置快速询价成功的状态
                this.querySuccess = false
                this.checkTrailerType()
                this.subClassChange()
            },
            // 获取挂车询价数量
            getTrailerData () {
                this.getData('http://api.dealer.360che.com/Dealer/GetGuaCheSubCluesCount.aspx', res => {
                    if (res.ok) {
                        this.trailerCount = res.data
                    }
                })
                this.getData('https://product.360che.com/index.php?r=weex/index/cate-sub&cate_id=14', res => {
                    if (res.ok) {
                        res.data.name = res.data.cateName
                        res.data.list = [...res.data.subCateList]
                        delete res.data.cateName
                        delete res.data.subCateList
                        this.trailerData = res.data
                    }
                })
            },
            // 点击换一批
            exchange(){
                //p4 发送竞品车型id
                if(this.restsAttention[this.index].length){
                    let arr = [];
                    this.restsAttention[this.index].forEach(ele => {
                        arr.push(ele.F_ProductId)
                    })
                    this.batchId = arr.join('|')
                }


                //发送事件请求
                this.event({
                    'p3' : 2,
                    'p4' : this.ProductId,
                    'p5' : encodeURIComponent(this.batchId),
                })
                //存储询底价数据
//                this.GA(2,this.ProductId,this.batchId)

                this.index++;

                if(this.index == this.restsAttention.length){
                    this.index = 0;
                }

            },

            //快速询底价
            speedyPrice(productInfo,index){
                if(productInfo.text) {
                    return ;
                }

                //p4 发送竞品车型id
                if(this.restsAttention[this.index].length){
                    let arr = [];
                    this.restsAttention[this.index].forEach(ele => {
                        arr.push(ele.F_ProductId)
                    })
                    this.batchId = arr.join('|')
                }

                //大数据发送事件类
                this.event({
                    'p3':11,
                    'p4':this.ProductId,
                    'p5':productInfo.F_ProductId,
                    'p6':encodeURIComponent(this.batchId)
                })

                //请求推荐经销商
                this.getData('https://dealer-api.360che.com/inquiryprice/Dealer/getDealerList.aspx?productid=' + productInfo.F_ProductId + '&provincesn=' + this.locationInfo.provinceId + '&citysn=' + this.locationInfo.cityId  + '&type=1',ele => {
                    if(ele.ok){
                        let arr = [];
                        if(ele.data.length){
                            ele.data.forEach((dealer,index) => {
                                if(index < 3){
                                    arr.push(dealer.ShopId)
                                }
                            })
                        }
                        //重新设置参数
                        this.$set(this.priceData,'shopstr',arr.join(','));
                        this.$set(this.priceData,'truckid',productInfo.F_ProductId);

                        //发送请求
                        let ajaxUrl = 'https://dealer-api.360che.com/inquiryprice/Dealer/submitClues.aspx?relname=' + encodeURI(this.priceData.relname) + '&tel='+ this.priceData.tel +'&truckid='+ this.priceData.truckid +'&provincesn='+ this.priceData.provincesn +'&citysn='+ this.priceData.citysn +'&townsn=&buycount='+ this.priceData.buycount +'&shopstr=' + this.priceData.shopstr + '&clueresource=' + this.priceData.clueresource;
                        this.getData(ajaxUrl,(ele) => {
                            if(ele.ok){
                                //存储询底价数据
//                                this.GA(3,this.priceData.truckid)

                                //p4 发送竞品车型id
//                                if(this.restsAttention[this.index].length){
//                                    let arr = [];
//                                    this.restsAttention[this.index].forEach(ele => {
//                                        arr.push(ele.F_ProductId)
//                                    })
//                                    this.batchId = arr.join(',')
//                                }
//
//                                //存储询底价数据
//                                this.GA(3,this.ProductId,this.batchId,productInfo.F_ProductId)

                                this.eventGa(weex.config.deviceId,'完成询底价','一键询底价','')
                                if(ele.data.isok == 1){
                                    this.$set(this.restsAttention[this.index][index],'text','询价成功')
                                }else{
                                    this.alert(ele.data.msg)
                                }
                            }else{
                                alert('网络不给力阿~')
                            }
                        })
                    }
                })
            },
            // 发送请求
//            getData(url,callback){
//                return stream.fetch({
//                    method:'GET',
//                    type:'json',
//                    url:url
//                },callback)
//            },
            // 请求关注推荐数据
            getRecommendDate(ele){

            }
        },
    }
</script>

<style scoped>
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .success-page{
        background-color: #fff;
    }
    .success-module{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .success{
        flex-direction: row;
        padding-top: 50px;
        padding-bottom: 50px;
        padding-left: 30px;
        padding-right: 30px;
        justify-content: center;
        align-items: center;
    }
    .success-text{
        margin-left: 32px;
    }
    .success-icon{
        width: 80px;
        height: 80px;
        justify-content: center;
        align-items: center;
        border-top-right-radius: 40px;
        border-top-left-radius: 40px;
        border-bottom-right-radius: 40px;
        border-bottom-left-radius: 40px;
        border: solid;
        border-color: #f60;
        border-width: 2px;
    }
    .prosit{
        line-height: 32px;
        font-size: 32px;
        color: #f60;
        margin-bottom: 14px;
    }
    .relation{
        line-height: 24px;
        font-size: 24px;
        color: #333;
    }
    .recommend{
        background-color: #fff;
    }
    .head{
        height: 60px;
        padding-left: 30px;
        padding-right: 30px;
        overflow: hidden;
        background-color: #f5f5f5;
        flex-direction: row;
        align-items: center;
    }
    .attention{
        flex: 1;
        color: #999;
        font-size: 24px;
    }
    .change{
        height: 60px;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
    .change-icon{
        margin-right: 10px;
        vertical-align: middle;
    }
    .change-text{
        font-size: 24px;
        color: #f60;
    }
    .car-content{
        flex-direction: row;
        padding-top: 30px;
        padding-right:30px;
        padding-bottom:30px;
        padding-left:30px;
        position: relative;
        border-bottom: solid;
        border-bottom-color: #eee;
        border-bottom-width: 2px;
    }
    .skip{
        flex: 1;
        display: flex;
        flex-direction: row;
        padding-top: 30px;
        padding-bottom: 30px;
        padding-left: 30px;
        padding-right: 30px;
    }
    .quick{
        position: absolute;
        bottom: 24px;
        right: 30px;
        width: 120px;
        height: 44px;
        justify-content: center;
        align-items: center;
        background-color: #f60;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
    }
    .quick-selected{
        background-color:#eee;
    }
    .detail{
        flex: 1;
        margin-left: 20px;
    }
    .car-icon{
        width: 150px;
        height: 100px;
    }
    .car-text{
        height: 72px;
        line-height: 36px;
        font-size: 24px;
        color: #333;
        text-overflow: ellipsis;
        overflow: hidden;
        vertical-align: top;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .footer{
        flex-direction: row;
    }
    .ask{
        font-size: 24px;
        color: #333;
    }
    .man{
        font-size: 24px;
        color: #f60;
    }
    .number{
        flex-direction: row;
        flex: 1;
        height: 36px;
        align-items: center;
        font-size: 24px;
        color: #f60;
    }
    .ask-btn{
        font-size: 24px;
        color: #fff;
    }
    .ask-btn-selected{
        font-size: 24px;
        color:#bbb;
    }
    .trailer {

    }
    .trailer-header {
        background-color: #f5f5f5;
        height: 60px;
        padding-left: 30px;
        flex-direction: row;
        align-items: center;
    }
    .trailer-header-text {
        font-size: 24px;
        color: #999;
    }
    .orange {
        color: #f60;
    }
    .trailer-query {
        height: 104px;
        padding-left: 40px;
        padding-right: 40px;
        background-color: #fff;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .trailer-select {
        width: 510px;
        height: 64px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 20px;
        border-top-color: rgb(238, 238, 238);
        border-top-style: solid;
        border-top-width: 1px;
        border-right-color: rgb(238, 238, 238);
        border-right-style: solid;
        border-right-width: 1px;
        border-bottom-color: rgb(238, 238, 238);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-left-color: rgb(238, 238, 238);
        border-left-style: solid;
        border-left-width: 1px;
    }
    .trailer-select-text {
        font-size: 24px;
        color: #999;
    }
    .trailer-select-icon {
        width: 30px;
        height: 26px;
    }
    .trailer-query-price {
        width: 120px;
        height: 64px;
        border-top-color: rgb(255, 102, 0);
        border-top-style: solid;
        border-top-width: 1px;
        border-right-color: rgb(255, 102, 0);
        border-right-style: solid;
        border-right-width: 1px;
        border-bottom-color: rgb(255, 102, 0);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-left-color: rgb(255, 102, 0);
        border-left-style: solid;
        border-left-width: 1px;
        justify-content: center;
        align-items: center;
    }
    .trailer-query-price-text {
        font-size: 24px;
        color: #f60;
    }
    .trailer-query-price-success {
        width: 120px;
        height: 64px;
        border-top-color: rgb(0, 166, 80);
        border-top-style: solid;
        border-top-width: 1px;
        border-right-color: rgb(0, 166, 80);
        border-right-style: solid;
        border-right-width: 1px;
        border-bottom-color: rgb(0, 166, 80);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-left-color: rgb(0, 166, 80);
        border-left-style: solid;
        border-left-width: 1px;
        justify-content: center;
        align-items: center;
    }
    .trailer-query-price-success-text {
        font-size: 24px;
        color: #00a650;
    }
    .trailer-select-red {
        border-top-color: red;
        border-top-style: solid;
        border-top-width: 1px;
        border-right-color: red;
        border-right-style: solid;
        border-right-width: 1px;
        border-bottom-color: red;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-left-color: red;
        border-left-style: solid;
        border-left-width: 1px;
    }
    .trailer-select-red-text {
        color: red;
    }
</style>
