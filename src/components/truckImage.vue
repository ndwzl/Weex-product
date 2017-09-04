<template>
    <div class="truck-image"  @click="goWeex">
        <image v-if="truckImageData.imgSrc" :src="truckImageData.imgSrc" style="width:750px;height: 500px" placeholder="https://s.kcimg.cn/wap/images/detail/productApp/placeholder.jpg"></image>
        <div  v-if="truckImageData.notImg"  class="not-img">
            <text class="not-img-text">很遗憾~没有相关图片</text>
        </div>
        <div class="img-info">
            <div class="price" >
                <text class="guide-text" v-if="truckImageData.priceScope.price > 0 || truckImageData.priceScope.min > 0 ">厂商指导价：</text>
                <div v-if="!truckImageData.priceScope.price && truckImageData.priceScope.min > 0" style="flex-direction:row;" class="price-wrapper">
                    <text class="price-text" v-if="truckImageData.priceScope.min && truckImageData.priceScope.min != truckImageData.priceScope.max">{{truckImageData.priceScope.min == Math.round(truckImageData.priceScope.min)?Math.round(truckImageData.priceScope.min):truckImageData.priceScope.min}}-</text>
                    <text class="price-text" v-if="truckImageData.priceScope.max">{{truckImageData.priceScope.max == Math.round(truckImageData.priceScope.max) ? Math.round(truckImageData.priceScope.max) : truckImageData.priceScope.max}}万</text>
                </div>
                <div v-if="!truckImageData.priceScope.price && truckImageData.priceScope.min == 0">
                    <text class="guide-text">暂无报价</text>
                </div>
                <text v-if="truckImageData.priceScope.price > 0" class="price-text">{{truckImageData.priceScope.price == Math.round(truckImageData.priceScope.price) ? Math.round(truckImageData.priceScope.price) : truckImageData.priceScope.price}}万元</text>
                <text v-if="truckImageData.priceScope.price && truckImageData.priceScope.price == 0" class="guide-text">暂无报价</text>
            </div>
            <text v-if="truckImageData.imgTotal != 0" class="img-total">{{truckImageData.imgTotal}}张图片</text>
        </div>
        <div class="ranking" v-if="truckImageData.rank">
            <image src="https://s.kcimg.cn/wap/images/detail/productApp/rank.png" style="width:60px;height:40px"></image>
            <div :style="{backgroundColor:'#f60',height:'40px',paddingRight:'10px',marginLeft:'-1px',justifyContent:'center',alignItems:'center'}">
                <text :style="{fontSize:'24px',color:'#fff'}">{{truckImageData.rank}}</text>
            </div>
            <!--<text :style="{position:'absolute',left:'0',top:'0',fontFamily:'detail',color:'#ff8533',fontSize:'37px'}">&#x6392;</text>-->
            <!--<text :style="{position:'absolute',left:'25px',top:'5px',fontFamily:'detail',color:'#fff',fontSize:'24px'}">&#xe603;</text>-->
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        data(){
            return{
                //空图片
//                notImg:false
            }
        },
        props:{
            truckImageData:Object,
            url:String
        },
        methods:{
            goWeex(){
                this.goWeexUrl(this.url)
            }
        },
        created(){
//            if(!this.truckImageData.imgSrc){
//                this.notImg = true;
//            }
        }
    }
</script>

<style scoped>
    .truck-image{
        position:relative;
        border-top-width:20px;
        border-top-style:solid;
        border-top-color:#f5f5f5;
    }
    .not-img{
        width:750px;
        height:500px;
        padding-bottom:150px;
        align-items: center;
        justify-content: flex-end;
    }
    .not-img-text{
        color:#666;
        font-size:24px;
    }
    .ranking{
        position:absolute;
        right:0;
        top:0;
        padding-left:45px;
        flex-direction:row;
    }
    .img-info{
        position:absolute;
        left:0;
        right:0;
        bottom:0;
        height:100px;
        padding-right:20px;
        padding-left:26px;
        flex-direction:row;
        justify-content: space-between;
        align-items:center;
        /*background-image:linear-gradient(to bottom,rgba(255, 255, 255, 0) 0,rgba(0, 0, 0, .9)) ;*/
        background-color:rgba(0,0,0,.2);
    }
    .price{
        height:100px;
        flex-direction:row;
        align-items:center;
    }
    .guide-text{
        font-size:24px;
        color:#fff;
    }
    .price-text{
        font-size:32px;
        color:#fff;
    }
    .price-wrapper{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .img-total{
        font-size:24px;
        color:#fff;
    }
</style>
