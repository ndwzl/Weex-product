<template>
    <div class="other-concerns" v-if="otherData && otherData.length">
        <div class="subtitle">
            <div class="title-name">
                <text class="subtitle-text">看过该车的人还关注</text>
            </div>
            <div v-if="exchangeButton" class="exchange" @click="exchange">
                <!--<text :style="{fontFamily:'detail',fontSize:'32px',color:'#586c94'}">&#x5237;</text>-->
                <image src="https://s.kcimg.cn/wap/images/detail/productApp/switch-model.png" style="width:38px;height: 32px"></image>
                <text class="exchange-text">换一批</text>
            </div>
        </div>
        <div class="other-content">
            <div v-for="ele in otherData" class="other-list" @click="goSeries(ele)">
                <image :src="ele.img" style="width:180px;height:120px;margin-right:20px"></image>
                <div class="truck-info">
                    <text class="truck-name">{{ele.name ? ele.name : ele.F_ProductName}}</text>
                    <text class="truck-price">{{ele.price ? ele.price : ele.F_Price == 0 ? '暂无报价' : ele.F_Price + '万'}}</text>
                    <div class="footer-price" v-if="ele.askProId || ele.F_ProductId"  @click="goFooterPrice(ele)">
                        <text class="truck-price-text">询底价</text>
                        <!--<text :style="{fontFamily:'detail',fontSize:'24px',color:'#f60'}">&#x53bb;</text>-->
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/go-f60.png" style="width:14px;height:24px;margin-left:10px"></image>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import subTitle from '../components/subTitle.vue';
    let storage = weex.requireModule('storage')

    export default {
        props:['otherData','exchangeButton','el','seriesId','ProductId'],
        components:{subTitle},
        methods:{
            //点击换一批
            exchange(){
                this.$emit('exchange')
            },
            goSeries(ele){
                //跳转到其他车系
                if(ele.info){
                    this.$emit('goSeries',ele)
                }else{
                    this.$emit('goModel',ele,'other')
                }
            },
            //跳转到询底价页面
            goFooterPrice(ele){
                this.eventGa(weex.config.deviceId,'点击询底价按钮',this.el,'看过该车的人还关注')
                //请求车系页面其他数据
                if(ele.info){    //点击车系的询底价

                    //发送事件请求
                    this.event({
                        'p3' : 6,
                        'p4' : this.seriesId,
                        'p5' : ele.info.F_SubCategoryId,
                    })

//                    this.getData(this.ajaxUrl() + '/index.php?r=weex/series/other&subCateId=' +  ele.info.F_SubCategoryId + '&seriesId=' + ele.info.F_SeriesId + '&proId=' + ele.info.proid,(ele) => {
//                        if(ele.ok){
//                            this.GA(0,ele.askProId)
                            storage.setItem('priceProductId',ele.askProId,res => {
                                this.goWeexUrl('footerPrice.weex.js')
                            });
//                        }
//                    });
                }else{

                    //发送事件请求
                    this.event({
                        'p3' : 8,
                        'p4' : this.ProductId,
                        'p5' : ele.F_ProductId,
                    })

                    //点击车型的询底价
//                    this.GA(0,ele.F_ProductId)
                    storage.setItem('priceProductId',ele.F_ProductId,res => {
                        this.goWeexUrl('footerPrice.weex.js')
                    });
                }

            }
        }
    }
</script>

<style scoped>
    .other-content{
        padding-left:30px;
    }
    .other-list{
        padding-top:30px;
        padding-right:30px;
        padding-bottom:30px;
        flex-direction:row;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#e5e5e5;
    }
    .other-list:active{
        background-color:rgba(0,0,0,.2)
    }
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
    }
    .title-name{
        flex-direction: row;
        align-items: center;
    }
    .annotation{
        color:#999;
        font-size:24px;
        margin-left:20px;
    }
    .exchange{
        flex-direction:row;
    }
    .exchange-text{
        color: #586c94;
        font-size: 28px;
        margin-left:10px;
    }
    .truck-info{
        flex: 1;
        height: 120px;
        position:relative;
    }
    .truck-name{
        color:#333;
        font-size:32px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        lines: 2;
    }
    .truck-price{
        margin-top:10px;
        color:#f60;
        font-size:28px;
    }
    .footer-price{
        position:absolute;
        right:0;
        bottom:-10px;
        height:60px;
        width:146px;
        flex-direction: row;
        justify-content: center;
        align-items:center;
    }
    /*.footer-price:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .truck-price-text{
        color:#f60;
        font-size:28px;
    }
</style>