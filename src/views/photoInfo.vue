<template>
    <div class="photo-info">
        <div v-if="iosTop" class="ios-top"></div>
        <title :titleName="titleName" black="black" :imgInfo="imgInfo" @goback="goback"></title>
        <!--<div class="img-title" v-if="!imgInfo">-->

        <!--</div>-->
        <div class="options" v-if="tagName.length">
            <div v-for="(ele,index) in tagName" class="option" @click="switchTab(ele)" v-if="!imgInfo">
                <text :class="['option-text',ele.id == imgDataList.typeId ?'option-selected-text':'']">{{ele.name}}</text>
            </div>
        </div>
        <!--<div class="options" v-if="!imgInfo">-->

        <!--</div>-->
        <div class="img-list">
            <div class="img-wrapper">
                <img-slider v-if="imgList.data.length" :imgList="imgList.data" :index="index" @slide="slide" @goImgInfo="goImgInfo"></img-slider>
            </div>

            <div class="indicator">
                <text class="current" style="color:#fff;">{{-index + 1}}</text>
                <text class='between'> / </text>
                <text class="total">{{total}}</text>
            </div>
        </div>
        <div class="footer-bar" v-if="imgList.data.length && !imgInfo">
            <div class="truck-info">
                <text class="truck-name" v-if="imgList.data[-index] && imgList.data[-index].name">{{imgList.data[-index].name}}</text>
                <div class="truck-price">
                    <text class="price-text">厂商指导价：</text>
                    <text class="price-text" v-if="imgList.data[-index] && imgList.data[-index].price">{{imgList.data[-index].price > 0 ? imgList.data[-index].price + '万' : '暂无'}}</text>
                    <text class="price-text" v-else>暂无</text>
                </div>
            </div>
            <div class="footer-price" v-if="imgList.data[-index] && imgList.data[-index].isMake != 4" @click="goFooterPrice(imgList.data[-index].F_ProductId)">
                <text class="footer-price-text">询底价</text>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    let storage = weex.requireModule('storage');
    let globalEvent = weex.requireModule('globalEvent');

    import title from '../components/title.vue'
    import imgSlider from '../components/photo/slider.vue'
    export default {
        data(){
            return {
                //标题名称
                titleName: '',
                //车型id
                productId:'',
                //当前选项的TypeId
                typeId:'',
                tagName:[],
                //图片的详细信息
                imgDataList:{},
                //轮播图的数据
                //暂时存储的轮播图数据
                arr:[],
                imgList:{
                    data:[],
                },
                //图片总数量
                total:0,
                //图片的下标
                index:0,
                //page
                page:1,
                //隐藏其他
                imgInfo:false,
                pageType:'',
                forNum:0,
                open:true,
                //苹果头部白条
                iosTop:false,
            }
        },
        created(){
            //显示加载loading
            this.showLoading();

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });

            //获取图片页面的tab头部标题
            storage.getItem('PhotoTabName',ele => {
                if(ele.result == 'success'){
                    this.tagName = JSON.parse(ele.data);
                }
            });

            //如果是ios系统的话
            if(weex.config.env.platform == 'iOS'){
                //头部的高度
                this.iosTop = true;
            }

            //获取车型id
            storage.getItem('imgProductId',ele => {
                if(ele.result == 'success'){
                    this.productId = ele.data;
                }
                //获取图片详情信息
                storage.getItem('imgDataInfo',ele => {
                    if(ele.result == 'success'){
                        this.imgDataList = JSON.parse(ele.data);

                        //车型id
//                        this.productId = this.imgDataList.F_ProductId;

                        this.index = -this.imgDataList.index;
//                        this.index = this.index == 0 ? -1 : this.index;

                        //如果点开第一张，请求一次
//                        if(this.index == 0){
//                            this.getImgData();
//                            return
//                        }
                        this.forNum = Math.ceil(-this.index/100) == 0 ? 1 : Math.ceil(-this.index/100);

//                        for(var i = 0 ; i < forNum ; i++){
//                            ++this.page;
                            //请求图片数据
                            this.getImgData();
//                        }

                        let time = setTimeout(() => {
                            //发送PV
                            storage.getItem('p4', p4 => {
                                if (p4.result == 'success') {
                                    this.p4 = p4.data;
                                    storage.getItem('p5', p5 => {
                                        if (p5.result == 'success') {
                                            let o = {
                                                'p3': p4.data,
                                                'p4': 2,
                                                'p5': p5.data,
                                                'p7':this.imgDataList.F_ImageId
                                            }
                                            if(this.productId != 0){
                                                o.p6 = this.productId
                                            }

                                            this.p5 = p5.data;
                                            this.collect(o)
                                        }
                                    })
                                    clearTimeout(time)
                                }
                            })
                        },200)

                        //图片数据内容
//                        this.imgList.data = this.arr;
//                        this.alert(this.imgList.data.length)
//                        this.$set(this.imgList,'data',arr);

                    }
                })
            })
        },
        methods:{
            //图片切换
            slide(direction){

                //发送PV
                storage.getItem('p4',p4 => {
                    if(p4.result == 'success'){
                        this.p4 = p4.data;
                        storage.getItem('p5',p5 => {
                            if(p5.result == 'success'){
                                this.p5 = p5.data;
                                let o = {
                                    'p3': p4.data,
                                    'p4': 2,
                                    'p5': p5.data,
                                    'p7':this.imgDataList.F_ImageId
                                }
                                if(this.productId != 0){
                                    o.p6 = this.productId
                                }
                                this.collect(o)
                            }
                        })
                    }
                })

                //向又
                if(direction == 'right'){
                    if(-this.index+1 >= this.imgList.data.length){
                        return ;
                    }else{
                        this.index--;
                    }
                    //如果滑动的图片数量超过length - 50，请求下一批
                    if(-this.index >= this.imgList.data.length-50){
                        if(this.open){
                            this.open = false;
                            this.page++;
                            this.getImgData();
                        }
                    }
//                    this.alert('you')
                }else{
                    if(this.index == 0) return ;
                    ++this.index;
//                    this.alert('zuo')
                }
            },
            //请求图片详情
            getImgData(){
                let ajaxUrl = this.ajaxUrl() + '/index.php?r=api/getweekpicturedetail&imageId=' + this.imgDataList.F_ImageId + '&typeId=' + this.imgDataList.typeId + '&page=' + this.page;
                if(this.productId){
                   ajaxUrl += '&productId=' + this.productId;
                }
                this.getData(ajaxUrl,ele => {
                    if(ele.ok && ele.data.info == 'ok'){

                        //标题
//                        this.alert(this.page)

                        //只有没有标题的时候运行一次
//                        if(!this.titleName){
                            //车型
                            if(ele.data.proName){
                                this.pageType = '产品库-车型图片最终页'
                                this.titleName = ele.data.proName + ele.data.typeName + '图片'
                                //发送GA
                                this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-访问车型图片最终页',this.titleName)
                            }else{//车系
                                this.pageType = '产品库-子类车系图片最终页'
                                this.titleName = ele.data.title;
                                //发送GA
                                this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-子类车系图片最终页',this.titleName)
                            }
//                        }
//                        this.alert(JSON.stringify(ele.data.data))

                        //图片列表详细数据
                        this.imgList.data = this.imgList.data.concat(ele.data.data)

//                        this.alert(JSON.stringify(this.imgList.data[116]))

                        //图片总数量
                        this.total = ele.data.total;

                        if(-this.index >= this.total){
                            this.index = -(this.total-1)
                        }

//                        this.alert(this.forNum)
                        //page++
//                        this.page++;
                        if(this.forNum > 1){
                            this.forNum--;
                            this.page++;
                            this.getImgData();
                        }else{
                            //隐藏加载loading
                            this.hideLoading()
                        }

                        this.open = true;


                    }
                })

            },
            //切换图片tab选项
            switchTab(ele){
                this.imgDataList.typeId = ele.id;
                //重新变成空数组
                this.imgList.data = [];
                this.page = 1;
                this.index = 0;
                this.getImgData();
            },
            //点击询底价
            goFooterPrice(ProductId){
                this.eventGa(weex.config.deviceId,'点击询底价按钮',this.pageType,'底部浮层区块')
                storage.setItem('priceProductId',ProductId,res => {
                    if(res.result == 'success'){
                        this.goWeexUrl('footerPrice.weex.js')
                    }
                })
            },
            //点击图片隐藏其他
            goImgInfo(){
                this.imgInfo = !this.imgInfo
            },
            goback(){
                this.imgList.data = [];
                this.goBack();
            }
        },
        components:{title,imgSlider}
    }
</script>

<style scoped>
    .ios-top{
        height:40px;
        background-color: #000;
    }
    .img-title{
        height:90px;
    }
    .footer-bar{
        position:fixed;
        left:0;
        right:0;
        bottom:0;
        height:120px;
        padding-right:28px;
        align-items: center;
        flex-direction: row;
        background-color: #111;
    }
    .truck-info{
        flex: 1;
        padding-left:30px;
    }
    .footer-price{
        width: 120px;
        height: 64px;
        font-size: 14px;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background-color: #1571e5;
    }
    .footer-price-text{
        color:#fff;
        font-size:28px;
    }
    .truck-name{
        color: #fff;
        font-size:28px;
    }
    .truck-price{
        margin-top: 10px;
        flex-direction: row;
    }
    .price-text{
        color:#fff;
        font-size:24px;
    }



    .photo-info{
        background-color:#111;
    }
    .options{
        flex-direction: row;
        height:80px;
        justify-content: center;
        align-items: center;
        background-color: #222;
    }
    .option{
        height:80px;
        /*align-items: center;*/
        justify-content: center;
        padding-left:32px;
        padding-right:32px;
    }
    .option-text{
        font-size:28px;
        color:rgba(255,255,255,.5);
    }
    .option-selected-text{
        color:#fff;
    }
    .slider{
        width: 750px;
        height:500px;
    }
    .frame{
        width: 750px;
        height:500px;
        /*background-color:red;*/
    }
    .img-list{
        flex:1;
        justify-content: center;
        background-color: #222;
    }
    .img-wrapper{
        width:750px;
        height:500px;
    }
    .image{
        width:750px;
        height:500px;
    }
    .indicator{
        flex-direction: row;
        margin-top:80px;
        justify-content: center;
        align-items: flex-end;
    }
    .current{
        color:#fff;
        font-size:32px;
        margin-bottom: -4px;
    }
    .between{
        color:#fff;
        font-size:24px;
        margin-left:10px;
        margin-right:10px;
    }
    .total{
        color:#fff;
        font-size:24px;
    }
</style>
