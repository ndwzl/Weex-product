<template>
    <div class="bbs">
        <sub-title subTitleName="论坛"></sub-title>
        <div class="bbs-content">
            <div v-for="(ele,index) in bbsList" class="bbs-list" @click="goUrl(ele.url)">
                <text class="bbs-text">{{ele.subject}}</text>
            </div>
        </div>
        <div class="load-more" @click="goUrl(morePostUrl)">
            <text class="load-more-text">查看更多{{titleName}}帖子</text>
            <text :style="{fontFamily:'detail',fontSize:'24px',color:'#999'}">&#x53bb;</text>
        </div>
    </div>
</template>

<script type="text/babel">
    import subTitle from '../subTitle.vue'
    export default {
        props:['bbsList','titleName','morePostUrl'],
        components:{subTitle},
        methosd:{

        }
    }
</script>

<style scoped>
    .bbs-content{
        padding-left:30px;
        padding-right:30px;
    }
    .bbs-list{
        height:90px;
        justify-content: center;
        align-items: flex-start;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .bbs-list:active{
        background-color:rgba(0,0,0,.2)
    }
    .bbs-text{
        color:#333;
        font-size:28px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
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
    .load-more:active{
        background-color:rgba(0,0,0,.2)
    }
    .load-more-text{
        color:#999;
        font-size: 28px;
        margin-right:10px;
    }
</style>