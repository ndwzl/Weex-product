<template>
    <div class="sales-model">
        <div class="title">
            <image class="serve-icon" src="https://s.kcimg.cn/wap/images/detail/aircraft.png"></image>   
            <text class="title-text">提交询价将有经销商为您服务</text>
        </div>
        <div class="car-module" @click="switchModelShow">
            <image class="module-icon" v-if="productInfo.ProductSrc" :src="productInfo.ProductSrc"></image>
            <div class="model-info">
                <div>
                    <text class="introduce">{{productInfo.Name}}</text>
                </div>
                <div class="footer-price-number" v-if="footerPriceNum >= 10">
                    <text class="already">已有</text><text class="number">{{footerPriceNum}}人</text><text class="already">询价</text>
                </div>
                <div class="footer-price-number" v-else>
                    <text class="already">已有</text><text class="number">10人+</text><text class="already">询价</text>
                </div>
            </div>
            <div class="go-icon">
                <!--<text :style="{fontFamily:'detail',fontSize:'32px',color:'#999'}" class="icon">去</text>-->
                <image src="https://s.kcimg.cn/wap/images/detail/productApp/footer-go.png" style="width:16px;height:28px;"></image>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['productInfo','footerPriceNum'],
        data(){
            return {
                // 车型列表
                
            }
        },

        // 点击车型显示换车型弹层
        methods:{
            //显示换车型弹层
            switchModelShow(){
                this.$emit('switchModelShow')
            }
        }
    }
</script>

<style scoped>
    .sales-model{
        background-color: #fff;
    }
    .title{
        flex-direction: row;
        height: 40px;
        background-color: #ffa366;
        justify-content: center;
        align-items: center;
    }
    .serve-icon{
        width: 28px;
        height: 24px;
        margin-right: 10px;
    }
    .title-text{
        font-size: 22px; 
        color: #fff;
    }
    .car-module{
        position: relative;
        flex-direction: row;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        border-bottom: solid;
        border-bottom-color: #eee;
        border-bottom-width: 2px;
    }
    .car-module:active{
        background-color: rgba(0,0,0,.3);
    }
    .model-info{
        flex: 1;
        margin-left: 20px;
        justify-content: space-between;
    }
    .module-icon{
        width: 150px;
        height: 100px;
    }
    .introduce{
        height: 72px;
        line-height: 36px;
        font-size: 28px;
        color: #333;
    }
    .footer-price-number{
        flex-direction: row;
        align-items: center;
    }
    .already{
        font-size: 24px;
        color: #999;
    }
    .go-icon{
        width: 60px;
        justify-content: center;
        align-items: flex-end;
        padding-right: 20px;
    }
    .number{
        font-size: 24px;
        color: #f60;
    }
</style>