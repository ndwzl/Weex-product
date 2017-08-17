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
                <!-- 推荐列表 -->
                <div class="recommend">
                    <div class="head" v-if="restsAttention.length > 0">
                        <text class="attention">询问此车型的人还在关注</text>
                        <div class="change" @click="exchange">
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
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    var stream = weex.requireModule('stream');
    var animation = weex.requireModule('animation');
    var storage = weex.requireModule('storage');
    let globalEvent = weex.requireModule('globalEvent');

    export default {
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
                iosTop:false
            }
        },
        created(){

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });

            //发送GA
            this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-询底价成功页','询价成功')

            if(weex.config.env.platform == 'iOS'){
                this.iosTop = true;
            }
            //获取保存的询价信息
            storage.getItem('postFooterPrice',ele => {
                if(ele.result == 'success'){
                    this.priceData = JSON.parse(ele.data);
                    this.ProductId = this.priceData.truckid
                    //请求关注推荐数据
                    this.getData('https://product.360che.com/index.php?r=api/getcompeteproduct&productId=' + this.priceData.truckid,(ele) => {
                        if(ele.ok && ele.data.info == 'ok'){
                            this.restsAttention = ele.data.data;
                            console.log(this.restsAttention)
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
                                        'p7':p7
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

                    console.log(this.locationInfo)
                }
            });
        },
        methods:{
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
                        console.log(productInfo.F_ProductId)

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
        components:{
            title,
        }
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
</style>
