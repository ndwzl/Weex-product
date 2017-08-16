<template>
    <div class="switch-model" v-if="switchModelPop">
        <div v-if="iosTop" class="ios-top"></div>
        <list style="flex: 1" >
            <header>
                <div class="title">
                    <div class="back" @click="switchModelShow">
                        <!--<text :style="{fontFamily:'detail',fontSize:'32px',color:'#333'}">回</text>-->
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/back.png" style="width:20px;height:36px"></image>
                    </div>
                    <div class="wrapper" >
                        <text class="title-name">换车型</text>
                    </div>
                    <div v-if="all" class="all-product" @click="allProduct">
                        <text class="all-product-text">全部车型</text>
                    </div>
                </div>
            </header>
            <cell>
                <div class="options" v-if="switchModelData.attrList">
                    <div v-for="(ele,index) in switchModelData.attrList" :class="['option',selected ==  switchModelData.attrList[index] ? 'selected-option' : '']" @click="selectOption(index)">
                        <text :class="['option-text',selected == switchModelData.attrList[index] ? 'selected-option-text' : '']">{{ele}}</text>
                    </div>
                </div>
                <div class="switch-model-content" v-for="(ele,index) in switchModelData.priceList" v-if="selected == switchModelData.attrList[index]">
                    <div v-for="(res,index) in ele.list" class="switch-model-list" @click="goSwitchModel(res.F_ProductId)">
                        <!--<div class="model-name">-->
                            <text :class="['model-name-text',res.F_ProductId == ProductId ? 'selected-model-name' : '']">{{res.specialProName}}</text>
                        <!--</div>-->
                        <div class="tags">
                            <div class="tags-wrapper">
                                <text v-for="tag in res.paramDetail" class="tag">{{tag}}</text>
                            </div>
                            <text class="sell-type">{{res.F_IsStopMake == 1 ? '' : res.F_IsStopMake == 4 ? '停售' : '未上市'}}</text>
                        </div>
                    </div>
                    <div class="empty" v-if="!ele.list.length">
                        <image src="https://s.kcimg.cn/wap/images/app_icon/bad.png" style="width:155px;height:100px;"></image>
                        <text class="empty-text">很遗憾~ 没有相关内容~</text>
                    </div>
                    <!--v-if="switchModelData.attrList[index].length"-->
                </div>
            </cell>
        </list>
    </div>
</template>

<script type="text/babel">
    let modal = weex.requireModule('modal');
    let navigator = weex.requireModule('navigator');
    let storage = weex.requireModule('storage')

    export default {
        props:['switchModelPop','switchModelData','ProductId','imgSwitchModel','all'],
        data(){
            return {
//                //换车型数据
//                switchModelData:{
//                    paramName:'',
//                },
//                //车系信息 子类id && 车系id && 品牌id
//                seriesInfo:{},
//                //车型id
//                ProductId:'',
                selected:'',
                iosTop:false
            }
        },
        methods:{
            alert (text) {
                modal.alert({
                    message: text
                })
            },
            selectOption(index){
               this.selected = this.switchModelData.attrList[index];
            },
            //取消换车型
            switchModelShow(){
                this.$emit('switchModelShow')
            },
            //车系图片页点击全部车型
            allProduct(){
                this.$emit('allProduct')
            },
            //点击换车型
            goSwitchModel(F_ProductId){
                this.$emit('goSwitchModel',F_ProductId)

                //图片页面换车型
//                if(this.imgSwitchModel){
//                    this.$emit('switchModel',F_ProductId)
//                }else{//车型页面换车型
//                    storage.setItem('ProductId',F_ProductId,ele => {
//                        if(ele.result == 'success'){
//                            this.goWeexUrl('model.weex.js')
//                        }
//                    })
//                }
            }
        },
        created(){
            if(weex.config.env.platform == 'iOS'){
                this.iosTop = true;
//                this.alert(this.iosTop)
            }

            this.selected = this.switchModelData.paramName;
//            //获取车系信息
//            storage.getItem('seriesInfo',seriesInfo => {
//                if(seriesInfo.result == 'success'){
//                    //给车系信息赋值
//                    this.seriesInfo = JSON.parse(seriesInfo.data);
//                    //获取车型ID
//                    storage.getItem('ProductId',ProductId => {
//                        if(ProductId.result == 'success'){
//                            //给车型id赋值
//                            this.ProductId = ProductId.data;
//
//                            //请求换车型数据
//                            this.getData('http://product.36oche.com/index.php?r=app/product/get-product-change-list&subId=66&seriesId=64&proId=2550',(ele) => {
//                                if(ele.ok){
//                                    this.switchModelData = ele.data;
//
//                                    //判断哪一个的length最长显示哪一个
//                                    let paramName = '';
//                                    let has = true;
//                                    for(let key in ele.data){
//                                        if(has && ele.data[key]){
//                                            has = false;
//                                            paramName = key;
//                                            for(let k in ele.data){
//                                                if (ele.data[k] && ele.data[k].list && ele.data[key].list.length < ele.data[k].list.length) {
//                                                    paramName = k;
//                                                }
//                                            }
//                                        }
//                                    }
//                                    this.$set(this.switchModelData,'paramName',paramName);
//                                }
//                            })
//                        }
//                    })
//                }
//            });
        }
    }
</script>

<style scoped>
    .switch-model{
        flex: 1;
        position:fixed;
        top:0;
        right:0;
        bottom:-100px;
        left:0;
        background-color:#fff;
    }
    .ios-top{
        height:40px;
        background-color: #fff;
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
    .wrapper{
        flex: 1;
        height:90px;
        justify-content: center;
        align-items:center;
    }
    .title-name{
        padding-left:20px;
        padding-right:20px;
        color:#333;
        font-size:36px;
    }
    .all-product{
        position:absolute;
        right:30px;
        top:0;
        height:90px;
        justify-content: center;
        align-items: center;
    }
    .all-product-text{
        color: #586c94;
        font-size: 28px;
    }
    .back{
        position:absolute;
        left:0;
        top:0;
        width:54px;
        height:90px;
        justify-content: center;
        align-items: center;
    }
    .options{
        padding-top:10px;
        padding-right:10px;
        padding-bottom:10px;
        padding-left:10px;
        flex-direction:row;
        flex-wrap:wrap;
    }
    .option{
        width:223px;
        height:60px;
        margin-top:10px;
        margin-right:10px;
        margin-bottom:10px;
        margin-left:10px;
        align-items: center;
        justify-content: center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#eee;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#eee;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#eee;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    .option-text{
        color:#333;
        font-size:24px;
    }
    .selected-option{
        border-top-color:#586c94;
        border-right-color:#586c94;
        border-bottom-color:#586c94;
        border-left-color:#586c94;
    }
    .selected-option-text{
        color:#586c94;
    }
    .switch-model-content{
        padding-left:30px;
        padding-right:30px;
        border-top-width:20px;
        border-top-style:solid;
        border-top-color:#eee;
    }
    .switch-model-list{
        flex: 1;
        justify-content: center;
        align-items: flex-start;
        padding-top:30px;
        padding-right:30px;
        padding-bottom:30px;
        padding-left:30px;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
    }
    .switch-model-list:active{
        background-color: rgba(0,0,0,.3);
    }
    .model-name{
        display: flex;
        flex-direction: row;
        word-wrap: break-word;
        word-break:break-all;
    }
    .model-name-text{
        color: #333;
        font-size: 28px;
        /*-webkit-box-orient: vertical;*/
        /*text-overflow: ellipsis;*/
        /*display: -webkit-box;*/
        /*-webkit-line-clamp: 1;*/
        /*overflow: hidden;*/
        /*lines: 1;*/
        flex-wrap: wrap;
    }
    .selected-model-name{
        color:#586c94;
    }
    .tags{
        width:600px;
        margin-top: 10px;
        flex-direction:row;
        justify-content: space-between;
    }
    .tags-wrapper{
        flex-direction:row;
    }
    .tag{
        color: #999;
        font-size: 24px;
        margin-right: 20px;
    }
    .sell-type{
        color: #f60;
        font-size:24px;
    }
    .empty{
        flex: 1;
        justify-content: center;
        align-items: center;
    }
    .empty-text{
        margin-top: 20px;
        color:#666;
        font-size:28px;
    }
</style>
