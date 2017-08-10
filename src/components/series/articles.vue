<template>
    <div class="articles">
        <sub-title subTitleName="文章"></sub-title>
        <div class="articles-wrapper" >
            <div v-for="ele in articlesList" class="articles-list" @click="goUrl(ele.url)">
                <text class="tag">[{{ele.categorsecondname}}]</text>
                <text class="title-name">{{ele.title}}</text>
            </div>
        </div>
        <div class="load-more" @click="goUrl(moreArticleUrl)">
            <text class="load-more-text">查看更多{{titleName}}文章</text>
            <text :style="{fontFamily:'detail',fontSize:'24px',color:'#999'}">&#x53bb;</text>
        </div>
    </div>
</template>

<script type="text/babel">
    import subTitle from '../subTitle.vue'
    export default {
        props:['articlesList','titleName','moreArticleUrl'],
        components:{subTitle},
        methods:{

        }
    }
</script>

<style scoped>
    .articles-wrapper{
        padding-left:30px;
        padding-right:30px;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#e5e5e5;
    }
    .articles-list{
        height:90px;
        flex-direction:row;
        justify-content:flex-start;
        align-items: center;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#e5e5e5;
    }
    .articles-list:active{
        background-color:rgba(0,0,0,.2)
    }
    .tag{
        min-width:130px;
        color: #448dea;
        margin-right: 12px;
        font-size:28px;
    }
    .title-name{
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