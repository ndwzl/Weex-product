<template>
    <div class="second-hand">
        <sub-title subTitleName="二手车推荐"></sub-title>
        <div class="content">
            <div v-for="(ele,index) in secondHandData.data" class="second-hand-list">
                <image :src="ele.img" style="width:180px;height:120px;"></image>
                <div class="second-hand-info">
                    <text class="title">{{ele.title1}}</text>
                    <text class="subhead">{{ele.title2}}</text>
                    <text class="price">{{ele.price}}</text>
                </div>
            </div>
        </div>
        <div class="load-more" v-if="secondHandData.data.length > 3">
            <text class="load-more-text">查看更多二手车</text>
            <text :style="{fontFamily:'detail',fontSize:'24px',color:'#999'}">&#x53bb;</text>
        </div>
    </div>
</template>

<script type="text/babel">
    import subTitle from '../subTitle.vue'
    export default {
        props:['secondHandData'],
        components:{subTitle}
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
    }
    .content{
        padding-left:30px;
    }
    .second-hand-list{
        padding-top:30px;
        padding-right:30px;
        padding-bottom:30px;
        flex-direction:row;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color: #eee;
    }
    .second-hand-info{
        flex: 1;
        margin-left:20px;
    }
    .title{
        color:#333;
        font-size:32px;
    }
    .subhead{
        margin-top:10px;
        color:#999;
        font-size:24px;
    }
    .price{
        margin-top:10px;
        color:#f60;
        font-size:28px;
    }
    .load-more{
        height:80px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
    }
    .load-more-text{
        color:#999;
        font-size: 28px;
        margin-right:10px;
    }
</style>