<template>
    <div class="topbar-wrapper">
        <div class="top-bar">
            <div class="home-introduce">
                <text class="home-icon" :style="{fontFamily: 'detail'}">&#x5019;</text>
                <text class="home-type">报价库</text>
            </div>
            <div class="function">
                <div  class="button-wrapper user">
                    <text v-if="!isLoagin" class="user-text" :style="{fontFamily: 'detail'}">&#x767b;</text>
                    <image v-else class="userImg" :src="userImg"></image>
                </div>
                <div class="button-wrapper" @click="isoptionsShow">
                    <text class="more-types" :style="{fontFamily: 'detail'}" >&#x5bfc;</text>
                </div>
            </div>
        </div>
        <transition name="slide-fade">
            <div v-if="optionsShow" class="nav">
                <a href="" class="title">
                    <text class="title-text">首页</text>
                </a>
                <a href="" class="title">
                    <text class="title-text">文章</text>
                </a>
                <div class="title visible">
                    <text class="title-text">报价库</text>
                    <!--<text class="selected-icon" :style="{fontFamily: 'detail'}">&#x9009;</text>-->
                </div>
                <a href="" class="title">
                    <text class="title-text">论坛</text>
                </a>
                <a href="" class="title">
                    <text class="title-text">商城</text>
                </a>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                //判断用户是否登陆
                isLoagin:false,
                //登陆后的用户头像
                userImg:'',
                //选项列表是否显示
                optionsShow:false
            }
        },
        methods:{
            isoptionsShow(){
                this.optionsShow = !this.optionsShow;
            }
        }
    }
</script>

<style scoped>
    .topbar-wrapper{
    }
    /*左侧标题*/
    .top-bar{
        height:88px;
        padding-left:20px;
        padding-right:20px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color:#1571e5;
    }
    .home-introduce{
        flex-direction: row;
        align-items: center;
    }
    .home-icon{
        color:#fff;
        font-size:40px;
    }
    .home-type{
        padding-left:20px;
        margin-left:20px;
        color:#fff;
        font-size:32px;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: rgba(0,0,0,.1);
    }

    /*右侧按钮*/
    .function{
        flex-direction:row;
        justify-content: flex-end;
        align-items:center;
    }
    .button-wrapper{
        width:50px;
        height:50px;
        align-items:center;
        justify-content: center;
        border-top-left-radius:25px;
        border-top-right-radius:25px;
        border-bottom-left-radius:25px;
        border-bottom-right-radius:25px;
        background-color:rgba(0,0,0,.1);
    }
    .user{
        margin-right:30px;
    }
    .user-text{
        color:#fff;
        font-size:28px;
    }
    .userImg{
        width:50px;
        height:50px;
        border-top-left-radius:25px;
        border-top-right-radius:25px;
        border-bottom-left-radius:25px;
        border-bottom-right-radius:25px;
    }
    .more-types{
        color:#fff;
        font-size:28px;
    }

    /*nav导航*/
    .nav{
        height:88px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background-color: #1571e5;
        border-top-width: 1px;
        border-top-style:solid;
        border-top-color:#0D63D0
    }
    .title{
        display: flex;
        flex: 1;
        height:87px;
        flex-direction: row;
        justify-content:center;
        align-items: center;
    }
    .visible{
        position:relative;
        background-color:#0D63D0;
    }
    .title-text{
        color:#fff;
        font-size:32px;
    }
    /*选中的小箭头*/
    /*.selected-icon{*/
        /*position:absolute;*/
        /*bottom: -17px;*/
        /*left:51%;*/
        /*color:#fff;*/
        /*font-size:30px;*/
        /*transform: rotate(-135deg) scale(.6);*/
    /*}*/
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s ease;
    }
    .slide-fade-enter, .slide-fade-leave-active {
        transform: translateY(-10px);
    }
    .slide-fade-enter-active, .slide-fade-leave {
        transform: translateY(0);
    }
</style>