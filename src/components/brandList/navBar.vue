<template>
    <div class="nav-bar">
        <div class="inner">
            <text class="nav-text selected">品牌</text>
        </div>
        <div class="inner" @click="goUrl('https://product.m.360che.com/price/')">
            <text class="nav-text">筛选</text>

        </div>
        <div class="inner" @click="goUrl('https://product.m.360che.com/sel/')">
            <text class="nav-text">按工况</text>
        </div>
        <div class="inner" @click="goUrl('https://top.m.360che.com/')">
            <text class="nav-text">排行榜</text>
        </div>
        <div class="history" @click="historyShow" >
            <image  @click="historyShow" src="https://s.kcimg.cn/wap/images/app_icon/history.png" style="width:32px;height:32px;"></image>
            <!--<text :style="{fontFamily:'detail',color:'#999',fontSize:'32px'}">&#x53f2;</text>-->
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        methods:{
            historyShow(){
                this.$emit('historyShow')
            }
        }
    }
</script>

<style scoped>
    .nav-bar{
        position:relative;
        height:90px;
        background-color: #fff;
        flex-direction: row;
        align-items:center;
        justify-content: center;
    }
    .inner{
        height:90px;
        justify-content: center;
        padding-left:30px;
        padding-right:30px;
    }
    .inner:active{
        background-color:rgba(0,0,0,.2);
    }
    .nav-text{
        color:#999;
        font-size:32px;
    }
    .selected{
        color:#333;
        font-size:36px;
    }
    .history{
        position:absolute;
        right:0;
        top:0;
        width:100px;
        height:100px;
        justify-content:center;
        align-items:center;
        z-index:15;
    }
</style>
