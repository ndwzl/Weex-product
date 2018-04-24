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
            <div v-if="!photoShare && shareData" class="share" @click="share">
                <text class="share-text">分享</text>
            </div>
            <div v-if="photoShare && !imgInfo" class="photo-share" @click="share">
                <image class="photo-share-icon" :src="DefaultImgPath + 'photo-share.png'"></image>
            </div>
            <div v-if="reset" class="reset" @click="resetCallback">
                <div class="reset-cont">
                    <image class="reset-icon" src="https://s.kcimg.cn/wap/images/detail/productApp/switch-model.png"></image>
                    <div class="reset-text-wraper">
                        <text class="reset-text">重选</text>
                    </div>
                </div>
            </div>
            <div v-if="follow" class="follow" @click="followCallBack">
                <text class="follow-text">关注指数 ？</text>                
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    const thaw = weex.requireModule('THAW')
    const storage = weex.requireModule('storage')
    export default {
        props: ['titleName','black', 'shareData', 'photoShare', 'imgInfo','seriesId','ProductId','reset', 'el', 'follow'],
        data(){
            return {
                iosTop:false
            }
        },
        created(){
            if(this.isIos()){
                this.iosTop = true;
            }
        },
        methods:{
            // 关注指数
            followCallBack () {
                this.$emit('followChange')
            },
            // 重选
            resetCallback () {
                this.$emit('resetFilter')
            },
            share () {
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
                // 大数据统计
                this.event({
                    tag:'act',
                    plat:plat,
                    type:type,
                    tid:tid,
                    flag:2,
                    slot:0
                })
                // ga统计
                this.eventGa(weex.config.deviceId,'点击产品库分享按钮',this.el,'')
                storage.getItem('appType', res => {
                    const appType = res.data
                    if (appType === 'product') {
                        this.$emit('shareToggle')
                    } else {
                        storage.getItem('appVersion', res => {
                            const version = res.data
                            const nVersion = Number(version.replace(/\./g, ''))
                            // app 6.1.6版本以后 分享走weex的
                            if (nVersion >= 616) {
                                this.$emit('shareToggle')
                            } else {
                                thaw.onShowShare(this.shareData)
                            }
                        })
                    }
                })
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
    .photo-share {
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 90px;
        justify-content: center;
        align-items: center;
    }
    .photo-share-icon {
        width: 36px;
        height: 36px;
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
        width:510px;
        height:90px;
        justify-content: center;
        flex-direction: row;
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
    .title-name {
        flex: 1;
        color:#333;
        font-size:36px;
        text-overflow: ellipsis;
        overflow: hidden;
        lines: 1;
        line-height: 90px;
        text-align: center;
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
    .reset,.follow {
        position: absolute;
        right: 0;
        top: 0;
        width: 124px;
        height: 100%;
    }
    .reset-cont {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-right: 30px;
    }
    .reset-icon {
        width: 32px;
        height: 28px;
        margin-right: 10px;
    }
    .reset-text {
        color: #586c94;
        font-size: 28px;
    }
    .follow {
        right: 24px;
        width: 134px;
        height: 90px;
    }
    .follow-text {
        color: #1571e5;
        font-size: 24px;
        line-height: 90px;
        text-align: right;
    }
</style>
