<template>
    <div>
        <!--<div v-if="iosTop" class="ios-top"></div>-->
        <div :class="['title',black ? 'black':'']" >
            <div class="back" @click="goback" v-if="!imgInfo">
                <!--<text :style="{fontFamily:'detail',fontSize:'32px'}" :class="['back-text',black?'black-text':'']">回</text>-->
                <image src="https://s.kcimg.cn/wap/images/detail/productApp/back.png" style="width:20px;height:36px"></image>
            </div>
            <div class="wrapper" v-if="!imgInfo">
                <!--<scroller scroll-direction="horizontal" show-scrollbar="false" :class="['init',black ? 'black':'']">-->
                    <!--<div :class="['title-init',black ? 'black':'']">-->
                        <text :class="['title-name',black?'black-text':'']">{{titleName}}</text>
                    <!--</div>-->
                <!--</scroller>-->
            </div>
            <div v-if="shareData" class="share" @click="shade">
                <text class="share-text">分享</text>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    let thaw = weex.requireModule('THAW');
    export default {
        props:['titleName','black','shareData','imgInfo','seriesId','ProductId'],
        data(){
            return {
                iosTop:false
            }
        },
        created(){
            if(weex.config.env.platform == 'iOS'){
                this.iosTop = true;
            }
        },
        methods:{
            shade(){
                let plat = 'and';
                let type = 'ps';
                let tid = this.seriesId;

                if(this.iosTop){
                    plat = 'ios'
                }

                if(this.ProductId){
                    type = 'pp'
                    tid = this.ProductId
                }

                this.event({
                    tag:'act',
                    plat:plat,
                    type:type,
                    tid:tid,
                    flag:2,
                    slot:0
                })

                thaw.onShowShare(this.shareData)
            },
            goback(){
                //图片页 && 发送给父元素事件
                if(this.black){
                    this.$emit('goback')
                }else{
                    this.goBack()
                }
            }
        }
    }
</script>

<style scoped>
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .share{
        position: absolute;
        top:25px;
        right:20px;
        width:80px;
        height:40px;
        justify-content: center;
        align-items: center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color: #586C94;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color: #586C94;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color: #586C94;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color: #586C94;
        border-top-left-radius:8px;
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;
    }
    .share-text{
        color:#586C94;
        font-size:28px;
    }
    .title{
        position:relative;
        width:750px;
        height: 90px;
        justify-content: center;
        align-items: center;
        padding-left:120px;
        padding-right:120px;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
        background-color: #fff;
    }
    .black{
        border-bottom-color:#222;
        background-color:#111;
    }
    .wrapper{
        min-width:510px;
        height:90px;
        justify-content: center;
        align-items: center;
    }
    .init{
        position:relative;
        width:510px;
        height:89px;
        justify-content: center;
        align-items:center;
        flex-direction: row;
        /*padding-left: 100px;*/
        /*padding-right:100px;*/
    }
    .title-init{
        /*width: 800px;*/
        height: 89px;
        justify-content: center;
        align-items: center;
        flex-direction: row;
    }
    .title-name{
        color:#333;
        font-size:36px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }
    .back{
        position:absolute;
        left:0;
        top:0;
        width:108px;
        padding-right:54px;
        height:90px;
        justify-content: center;
        align-items: center;
    }
    .back-text{
        color:#333;
    }
    .black-text{
        color:#fff;
    }
    /*.shade{*/
        /*position:absolute;*/
        /*top:0;*/
        /*width:40px;*/
        /*height:90px;*/

    /*}*/
    /*.first-shade{*/
        /*left:0;*/
        /*width:0;*/
        /*!*background-image: linear-gradient(to left,rgba(255,255,255,.8),rgba(255,255,255,.2));*!*/
        /*border-right-width:10px;*/
        /*border-right-color:rgba(255,255,255,.8);*/
        /*border-right-style: solid;*/
        /*border-left-width:10px;*/
        /*border-left-color:rgba(255,255,255,.9);*/
        /*border-left-style: solid;*/
    /*}*/
    /*.last-shade{*/
        /*right:0;*/
        /*width:0;*/
        /*border-right-width:10px;*/
        /*border-right-color:rgba(255,255,255,.9);*/
        /*border-right-style: solid;*/
        /*border-left-width:10px;*/
        /*border-left-color:rgba(255,255,255,.8);*/
        /*border-left-style: solid;*/
    /*}*/
</style>