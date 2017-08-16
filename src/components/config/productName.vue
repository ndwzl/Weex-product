<template>
    <!--对比车型名称-->
    <div class="product-name">
        <div class="caption">
            <text class="title">车型名称</text>
            <div class="number">
                <text class="existing">{{compareNumber}}</text>
                <text class="total">/2</text>
            </div>
        </div>
        <div class="content">
            <div class="name" v-if="products[0] && products[0].F_ProductName">
                <!--<text @click="clear(0)" class="clear" :style="{fontFamily:'detail'}">&#xd7;</text>-->
                <image @click="clear(0)" class="clear"  src="https://s.kcimg.cn/wap/images/detail/productApp/clear.png" style="width:40px;height:40px"></image>
                <div class="name-wrapper">
                    <text class="name-text">{{products[0].F_ProductName}}</text>
                </div>
                <div v-if="footerPrice" class="footer-price" @click="goFooterPrice(products[0])">
                    <text class="footer-price-text">询底价</text>
                </div>
            </div>
            <div v-else class="add-product" @click="goAddSeries('0')">
                <image class="add-icon" @click="goAddSeries('0')" src="https://s.kcimg.cn/wap/images/detail/productApp/add-product.png" style="width:70px;height:70px"></image>
                <!--<text class="add-icon" :style="{fontFamily:'detail'}" @click="goAddSeries('0')">&#xe604;</text>-->
                <text class="add-text" @click="goAddSeries('0')">添加车型</text>
            </div>
        </div>
        <div class="content">
            <div class="name" v-if="products[1] && products[1].F_ProductName">
                <div class="name-wrapper">
                    <text class="name-text">{{products[1].F_ProductName}}</text>
                </div>
                <!--<text @click="clear(1)" class="clear" :style="{fontFamily:'detail'}">&#xd7;</text>-->
                <image @click="clear(1)" class="clear"  src="https://s.kcimg.cn/wap/images/detail/productApp/clear.png" style="width:40px;height:40px"></image>
                <div v-if="footerPrice" class="footer-price" @click="goFooterPrice(products[1])">
                    <text class="footer-price-text">询底价</text>
                </div>
            </div>
            <div v-else class="add-product" @click="goAddSeries(1)">
                <!--<text class="add-icon" :style="{fontFamily:'detail'}" @click="goAddSeries(1)">&#xe604;</text>-->
                <image class="add-icon" @click="goAddSeries('0')" src="https://s.kcimg.cn/wap/images/detail/productApp/add-product.png" style="width:70px;height:70px"></image>
                <text class="add-text" @click="goAddSeries(1)">添加车型</text>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    let storage = weex.requireModule('storage')

    export default {
        data(){
            return {
                //车系id
                seriesId:'',
            }
        },
        props:['products','compareNumber','price','footerPrice'],
        methods:{
            clear(index){
                this.$emit('clear',index)
            },
            //进入选择车系页面
            goAddSeries(index){
                storage.setItem('compareNumber',index,res => {
                    console.log(res)
                    if(res.result == 'success'){
                        this.$emit('goAddSeries')
//                        this.goWeexUrl('addSeries.weex.js')
                    }
                })
            },
            //跳转到询底价页面
            goFooterPrice(ele){
                this.GA(0,ele.F_ProductId)
                storage.setItem('priceProductId',ele.F_ProductId,res => {
                    if(res.result == 'success'){
                        this.goWeexUrl('footerPrice.weex.js')
                    }
                })
            }
        },
        created(){
            console.log(this.products,'products')
        }
    }
</script>

<style scoped>
    .product-name{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        /*border-top-width:20px;*/
        /*border-top-style:solid;*/
        /*border-top-color:#f5f5f5;*/
        background-color:#fff;
    }
    .caption{
        width: 180px;
        justify-content: center;
        align-items: center;
    }
    .title{
        color:#666;
        font-size:24px;
    }
    .number{
        margin-top: 6px;
        height:40px;
        flex-direction:row;
        justify-content: center;
        align-items: center;
    }
    .existing{
        font-size: 36px;
        color: #333;
    }
    .total{
        font-size: 24px;
        color: #666;
    }
    .content{
        width:285px;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#eee;
    }
    .add-product{
        position:relative;
        padding-top: 40px;
        padding-right:20px;
        padding-bottom:40px;
        padding-left:20px;
        justify-content: center;
        align-items: center;
    }
    .add-icon{
        color:#ccc;
        font-size: 80px;
    }
    .add-text{
        color:#ccc;
        font-size:28px;
    }
    .name{
        position:relative;
        padding-top: 40px;
        padding-right:20px;
        padding-bottom:40px;
        padding-left:20px;
    }
    .clear{
        top:0;
        right:0;
        position:absolute;
        /*top:-40px;*/
        /*right:-20px;*/
        font-size:36px;
        color: #ccc;
    }
    .name-wrapper{
        height:130px;
        justify-content: center;
        align-items: center;
    }
    .name-text{
        color:#333;
        font-size: 28px;
        flex-wrap: wrap;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        overflow: hidden;
        lines: 4;
    }
    .footer-price{
        height:60px;
        margin-top: 10px;
        align-items: center;
        justify-content: center;
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
    .footer-price-text{
        color:#f60;
        font-size:28px;
    }
</style>
