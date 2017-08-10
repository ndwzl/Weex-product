<template>
    <div>
        <div>
            <div class="header" v-if="otherBrandShow">
                <text class="header-text">更多品牌</text>
            </div>
            <div  v-if="otherBrandShow" v-for="(data,index) in otherBrandList" class="other-brand-list" @click="SidebarShow(data)">
                <div class="content">
                    <image style="width:120px;height:80px;" :src="data.logo"></image>
                    <text class="brand-name">{{data.F_BrandName}}</text>
                </div>
            </div>
        </div>
        <div class="more-brand">
            <div class="more-brand-button" @click="BrandShow">
                <text class="more-brand-button-text" >{{otherBrandShow?'收起':'展开'}}皮卡、微面品牌</text>
                <image ref="other" src="https://s.kcimg.cn/wap/images/app_icon/down.png" style="width:44px;height:30px;"></image>
                <!--<text ref="other" :style="{fontFamily:'detail',color:'#999',fontSize:'32px',paddingLeft:'20px',paddingRight:'20px'}">&#x4e0b;</text>-->
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    var animation = weex.requireModule('animation');
    export default {
        data(){
            return {
                otherBrandShow:false,
            }
        },
        props:['otherBrandList'],
        methods:{
            BrandShow(){
                this.otherBrandShow = !this.otherBrandShow;
                var other = this.$refs.other;
                let rotate = 180;
                if(this.otherBrandShow){
                    rotate = 180
                }else{
                    rotate = 0
                }
                animation.transition(other, {
                    styles: {
                        transform: 'rotate(' + rotate + 'deg)',
                    },
                    duration: 300, //ms
                    timingFunction: 'ease-out',
                    delay: 0 //ms
                })
            },
            SidebarShow(url){
                this.$emit('SidebarShow',url,'other')
            }
        }
    }
</script>

<style scoped>
    .other-brand-list{
        padding-left: 20px;
    }
    .other-brand-list:active{
        background-color:rgba(0,0,0,.2);
    }
    .header {
        height: 60px;
        padding-left: 20px;
        background-color: #f5f5f5;
        justify-content: center;
    }

    .header-text {
        color: #666;
        font-size: 32px;
    }
    .content{
        padding-top: 10px;
        padding-bottom: 10px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f5f5f5
    }
    .brand-name {
        margin-left: 10px;
        font-size:32px;
    }
    .more-brand{
        padding-top:24px;
        padding-bottom:24px;
        background-color:#f5f5f5;
    }
    .more-brand-button{
        height:88px;
        flex-direction: row;
        background-color:#fff;
        align-items: center;
        justify-content: center;
    }
    .more-brand-button-text{
        color:#333;
        font-size:32px;
        /*margin-left:20px;*/
    }
</style>