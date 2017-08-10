<template>
    <div class="dealer">
        <!--标题-->
        <div class="subtitle">
            <div class="sum-dealer">
                <text class="subtitle-text">经销商</text>
                <text class="sum-dealer-begin" v-if="!sum && dealerData.list && dealerData.list.length">共</text>
                <text class="dealer-number" v-if="!sum && dealerData.list && dealerData.list.length">{{dealerData.list.length}}</text>
                <text class="sum-dealer-end" v-if="!sum && dealerData.list && dealerData.list.length">家经销商</text>
            </div>
            <div class="location" @click="selectLocationPop">
                <!--<text :style="{fontFamily:'detail',color:'#586c94'}">&#x4f4d;</text>-->
                <image src="https://s.kcimg.cn/wap/images/detail/productApp/location.png" style="width:20px;height:24px"></image>
                <text class="location-text province-name">{{locationInfo.provinceName}}</text>
                <text class="location-text">{{locationInfo.cityName}}</text>
            </div>
        </div>
        <!--内容-->
        <div class="dealer-content">
            <div>
                <div v-if="dealerData && index < dealerNumber" v-for="(ele,index) in dealerData.list" class="dealer-model">
                    <div class="dealer-list" @click="goDealerUrl(ele.dealerUrl)">
                        <!---->
                        <div class="dealer-header">
                            <!--<div class="dealer-name">-->
                                <image v-if="ele.vip" class="dealer-icon" src="https://s.kcimg.cn/wap/images/detail/vip_dealer.png" style="width:28px;height:28px;"></image>
                                <text class="dealer-name-text">{{ele.name}}</text>
                            <!--</div>-->
                            <text class="dealer-price" @click="goUrl(ele.commentPriceUrl)">{{ele.price == '' ? '' : ele.price + '起'}}</text>
                        </div>
                        <text class="dealer-location">{{ele.address}}</text>
                        <div class="function">
                            <div class="tags">
                                <text v-if="ele.tag1 != ''" class="tags-text">{{ele.tag1}}</text>
                                <text v-if="ele.tag2 != ''" class="tags-text">{{ele.tag2}}</text>
                            </div>
                            <div class="action">
                                <div class="phone" @click="onGoCall(ele)" v-if="ele.phone">
                                    <!--<text :style="{marginRight:'10px',fontFamily:'detail',fontSize:'32px',color:'#586c94'}">&#x62e8;</text>-->
                                    <image src="https://s.kcimg.cn/wap/images/detail/productApp/phone.png" style="width: 28px;height:28px;margin-right:10px;"></image>
                                    <text class="phone-text">联系经销商</text>
                                </div>
                                <div class="footer-price" @click="goFooterPrice(ele)">
                                    <text class="footer-price-text">询底价</text>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="activity" v-if="ele.article" @click="goUrl(ele.articleUrl)">
                        <div class="activity-info">
                            <text class="activity-icon">促</text>
                            <text class="activity-text">{{ele.article}}</text>
                        </div>
                    </div>
                </div>
            </div>
            <div class="load-more" v-if="dealerData.list && dealerData.list.length > dealerNumber" @click="loadMore">
                <text class="load-more-text">加载更多</text>
                <!--<text :style="{fontFamily:'detail',fontSize:'28px',color:'#999'}">&#x4e0b;</text>-->
                <image src="https://s.kcimg.cn/wap/images/detail/productApp/more.png" style="width:24px;height:14px"></image>
            </div>

            <div v-if="dealerData.notDealer" class="empty-dealer">
               <text class="empty-dealer-text">当前地区暂无经销商</text>
                <text class="switch-location" @click="selectLocationPop">点击切换</text>
            </div>
        </div>

        <div class="open-phone" v-if="openPhoneShow" @click="clickShade">
            <div class="open-phone-box">
                <text class="open-phone-text">{{phoneNumber}}</text>
                <div class="buttons">
                    <div class="cancel" @click="cancelOpnePhone">
                        <text class="button-text">取消</text>
                    </div>
                    <div class="ok" @click="opnePhone">
                        <text class="button-text">呼叫</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    let stream = weex.requireModule('stream')
    let thaw = weex.requireModule('THAW')
    let storage = weex.requireModule('storage')
    let modal = weex.requireModule('modal')
    export default {
        props:['seriesId','locationInfo','dealerData','sum','el','isProduct'],
        data(){
            return {
                //控制经销商显示数量
                dealerNumber:10,
                //拨打电话弹窗
                openPhoneShow:false,
                //电话号码
                phoneNumber:'',
                //车型id
                ProductId:'',
            }
        },
        methods:{
            alert (text) {
                modal.alert({
                    message: text
                })
            },
            selectLocationPop(){
                this.$emit('selectLocationPop')
            },
            getData(ajaxUrl,callback){
                return stream.fetch({
                    method:'GET',
                    type:'json',
                    url:ajaxUrl
                },callback)
            },
            //跳转到经销商页面
            goDealerUrl(url){
                storage.getItem('seriesInfo',ele => {
                    if(ele.result == 'success'){
                        let data = JSON.parse(ele.data);
                        let gourl = url;
                        if(!this.isProduct){
                            gourl = url + 'price_' + data.F_SubCategoryId + '_' + data.F_SeriesId + '.html';
                        }
                        this.goUrl(gourl)
                    }
                })
            },
            //打开是否拨打电话弹层
            onGoCall(ele){
                this.alert()
                if(this.isProduct){
                    //发送事件请求
                    this.event({
                        'p3' : 4,
                        'p4' : ele.dealerId,
                        'p5' : this.ProductId,
                    })
                }else{
                    //发送事件请求
                    this.event({
                        'p3' : 3,
                        'p4' : ele.dealerId,
                        'p5' : this.seriesId,
                    })
                }


                if(weex.config.env.platform == 'iOS'){
                    thaw.onGoCall(ele.phone)
                }else{
                    this.phoneNumber = ele.phone;
                    this.openPhoneShow = true;
                }
            },
            //点击经销商询底价
            goFooterPrice(ele){
                storage.setItem('priceProductId',ele.askProId,res => {
                    if(res.result == 'success'){
//                        this.GA(0,ele.askProId)
                        this.eventGa(weex.config.deviceId,'点击询底价按钮',this.el,'推荐经销商区块')
                        storage.setItem('dealerId',ele.dealerId,res => {
                            if(res.result == 'success'){
                                this.goWeexUrl('footerPrice.weex.js')
                            }
                        })
                    }
                })
//                this.alert(ele.askProId)
//                storage.getItem('ProductId',ProductId => {
//                    //如果是车型页，直接进入询底价
//                    if(ProductId.result == 'success'){
//                        this.GA(0,ProductId.data)
//                        this.goWeexUrl('footerPrice.weex.js')
//                    }else{
//                        this.alert(1)
//                        //如果是车系页，保存经销商推荐询底价车型进入询底价
//                        storage.setItem('ProductId',ele.askProId,res => {
//                            if(res.result == 'success'){
//                                this.GA(0,ele.askProId)
//                                storage.setItem('dealerInfo',JSON.stringify(ele),res => {
//                                    if(res.result == 'success'){
//                                        this.goWeexUrl('footerPrice.weex.js')
//                                    }
//                                })
//                            }
//                        })
//                    }
//                })
            },
            //显示更多经销商
            loadMore(){
                this.dealerNumber += 10;
            },
            //拨打电话
            opnePhone(){
                thaw.onGoCall(this.phoneNumber)
            },
            //取消拨打电话弹层
            cancelOpnePhone(){
                this.openPhoneShow = false;
            },
            //点击遮罩层 直接return
            clickShade(){
                return
            }
        },
        created(){
            storage.getItem('ProductId',ele => {
                if(ele.result == 'success'){
                    this.ProductId = ele.data;
                }
            })
            storage.getItem('seriesInfo',ele => {
                if(ele.result == 'success'){
                    this.seriesId = ele.F_SeriesId;
                }
            })
        },

    }
</script>

<style scoped>
    .subtitle{
        height:100px;
        flex-direction:row;
        justify-content: space-between;
        align-items: center;
        padding-left:30px;
        padding-right:30px;
        border-top-width:20px;
        border-top-style: solid;
        border-top-color:#f5f5f5;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#e5e5e5;
    }
    .subtitle-text{
        color:#333;
        font-size:32px;
        font-weight: bold;
        line-height: 0;
    }
    .sum-dealer{
        height:100px;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }
    .sum-dealer-begin{
        margin-left:20px;
        font-size:24px;
        color:#999;
    }
    .dealer-number{
        color: #f60;
        font-size:24px;
        margin-left:10px;
        margin-right:10px;
    }
    .sum-dealer-end{
        font-size:24px;
        color:#999;
    }
    .subtitle{
        flex-direction: row;
        justify-content: space-between;

    }
    .location{
        height:80px;
        flex-direction: row;
        align-items: center;
    }
    .location:active{
        background-color: rgba(0,0,0,.3);
    }
    .province-name{
        margin-left:8px;
        margin-right: 10px;
    }
    .location-text{
        color:#586c94;
        font-size:28px;
    }
    .dealer-content{
        padding-left:30px;
        padding-right:30px;
    }
    .empty-dealer{
        height:200px;
        align-items: center;
        justify-content: center;
    }
    .empty-dealer-text{
        color:#999;
        font-size:28px;
    }
    .switch-location{
        padding-top:20px;
        padding-right:20px;
        padding-bottom:20px;
        padding-left:20px;
        color:#586c94;
        font-size:28px;
    }
    .dealer-model{
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
    }
    .dealer-list{
        padding-top:30px;
        padding-bottom:30px;
    }
    .dealer-list:active{
        background-color:rgba(0,0,0,.2)
    }
    .dealer-header{
        position:relative;
        padding-left:40px;
        flex-direction: row;
        justify-content:space-between;
        align-items:center;
    }
    .dealer-icon{
        position:absolute;
        left: 5px;
        top:5px;
    }
    .dealer-name-text{
        flex: 1;
        color:#333;
        font-size:28px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }
    .dealer-price{
        color:#f60;
        font-size:28px;
        text-align: right;
    }
    .dealer-location{
        margin-top:10px;
        padding-left:40px;
        color:#999;
        font-size:24px;
    }
    .function{
        padding-left:40px;
        margin-top:20px;
        flex-direction:row;
        justify-content:space-between;
    }
    .tags{
        justify-content: center;
        flex-direction:row;
        align-items: center;
    }
    .tags-text{
        margin-right:16px;
        color:#999;
        font-size:24px;
    }
    .action{
        height:64px;
        flex-direction:row;
        justify-content:flex-start;
        align-items: center;;
    }
    .phone{
        height:64px;
        flex-direction:row;
        align-items:center;
        padding-left:30px;
        padding-right:30px;
    }
    /*.phone:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .phone-text{
        color:#586c94;
        font-size:28px;
    }
    .footer-price{
        height:64px;
        padding-left:30px;
        padding-right:30px;
        justify-content: center;
        border-top-width:1px;
        border-top-style: solid;
        border-top-color:#586c94;
        border-right-width:1px;
        border-right-style: solid;
        border-right-color:#586c94;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#586c94;
        border-left-width:1px;
        border-left-style: solid;
        border-left-color:#586c94;
        border-top-left-radius:8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    /*.footer-price:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .footer-price-text{
        color:#586c94;
        font-size:28px;
    }
    .activity{
        height:80px;
        padding-left:40px;
        padding-right:40px;
    }
    .activity:active{
        background-color: rgba(0,0,0,.2);
    }
    .activity-info{
        flex: 1;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#eee;
        flex-direction:row;
        align-items: center;
        justify-content: flex-start;
    }
    .activity-icon{
        padding-left:4px;
        padding-right:4px;
        /*padding-bottom:2px;*/
        margin-right:10px;
        color:#f60;
        font-size:24px;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#f60;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#f60;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#f60;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#f60;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    .activity-text{
        color:#333;
        font-size:28px;
    }
    .load-more{
        height:80px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
    }
    .load-more-text{
        color:#999;
        font-size: 28px;
        margin-right:10px;
    }
    .open-phone{
        position:fixed;
        left:0;
        top:0;
        right:0;
        bottom:0;
        align-items: center;
        justify-content: center;
        background-color: rgba(0,0,0,.6);
    }
    .open-phone-box{
        width:560px;
        height:260px;
        padding-top:30px;
        align-items: center;
        justify-content: flex-end;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        background-color:#fff;
    }
    .open-phone-text{
        color:#333;
        font-size:36px;
    }
    .buttons{
        width:560px;
        height:80px;
        margin-top:72px;
        flex-direction: row;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#eee;
    }
    .ok{
        flex:1;
        align-items: center;
        justify-content: center;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#eee;
    }
    .ok-text{
        color:#333;
        font-size:32px;
    }
    .cancel{
        flex: 1;
        align-items: center;
        justify-content: center;
    }
    .button-text{
        color:#448dea;
        font-weight: bold;
        font-size:32px;
    }
</style>