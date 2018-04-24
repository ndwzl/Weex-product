<template>
    <div class="photo-info">
        <div v-if="iosTop" class="ios-top"></div>
        <title @shareToggle="shareShow" :titleName="titleName" :photoShare="1" :shareData="shareData" black="black" :imgInfo="imgInfo" @goback="goback"></title>
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
            <!-- <div class="indicator" @click="saveImgToLocal"> -->
            <div class="indicator">
                <text class="current" style="color:#fff;">{{-index + 1}}</text>
                <text class='between'> / </text>
                <text class="total">{{total}}</text>
            </div>
            <div class="img-wrapper">
                <img-slider v-if="imgList.data.length" :imgList="imgList.data" :index="index" @slide="slide" @goImgInfo="goImgInfo"></img-slider>
            </div>
            <div class="desc" v-if="imgList.data.length && !imgInfo">
                <div class="truck-info">
                    <text class="truck-name" v-if="imgList.data[-index] && imgList.data[-index].name">{{imgList.data[-index].name}}</text>
                    <div class="truck-price">
                        <text class="price-text">厂商指导价：</text>
                        <text class="price-text" v-if="imgList.data[-index] && imgList.data[-index].price">{{imgList.data[-index].price > 0 ? imgList.data[-index].price + '万' : '暂无'}}</text>
                        <text class="price-text" v-else>暂无</text>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer-price" v-if="imgList.data[-index] && imgList.data[-index].isMake != 4" @click="goFooterPrice(imgList.data[-index].F_ProductId)">
            <text class="footer-price-text">询底价</text>
        </div>
        <!-- weex分享 -->
        <weexShare :shareParams="shareData" :showShare="showShare" @shareCallBack="shareCallBack" :isPhotoInfo="shareStatus"></weexShare>
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
                // ga最后一个参数
                dt: '',
                // 分享显示隐藏控制器
                showShare: false,
                // 分享所需数据
				shareData: {},
				// 分享的状态 0 开始 1 获取到分享数据
				shareStatus: '0',
				// 分享锁
				shareLock: true
            }
        },
        created(){
            //前端监控
            this.weexLogger('图片详情页')

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

            this.iosTop = this.isIos()

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
            shareCallBack (data) {
                // 分享成功
                if (data.status === '0') {
                    const platformList = ['微信好友', '微信朋友圈', 'QQ好友', 'QQ空间', '新浪微博', '复制链接']
					const platform = platformList[data.platform]
					
                    this.eventGa(weex.config.deviceId, '分享产品库成功', '产品库-图片最终页', platform)
                }
            },
            // 分享弹层显示
            shareShow () {
				if (!this.shareLock) {
					return false
				}
				this.shareLock = true
				this.updateShareData().then(() => this.showShare = true)
            },
            // 保存图片到本地--不生效
            saveImgToLocal () {
                const imgId = this.imgList.data[Math.abs(this.index)].F_ImageId
                const image = this.$refs[`img${imgId}`][0]
                // this.alert(`img${imgId}`)
                image.save(result => {
                    // this.alert(JSON.stringify(result))
                })
            },
            //图片切换
            slide(direction){

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
				
                //发送PV
                storage.getItem('p4',p4 => {
                    if(p4.result == 'success'){
                        this.p4 = p4.data;
                        storage.getItem('p5',p5 => {
                            if(p5.result == 'success'){
                                this.p5 = p5.data;
                                const imgId = this.imgList.data[Math.abs(this.index)].F_ImageId
                                let o = {
                                    'p3': p4.data,
                                    'p4': 2,
                                    'p5': p5.data,
                                    'p7': imgId
                                    // 'p7':this.imgDataList.F_ImageId
                                }
                                if(this.productId != 0){
                                    o.p6 = this.productId
                                }
                                this.collect(o)
                            }
                        })
                    }
                })
			},
			// 更新分享所用数据
			updateShareData () {
				return new Promise((resolve, reject) => {
					const imgId = this.imgList.data[Math.abs(this.index)].F_ImageId
					let ajaxUrl = `${this.ajaxUrl()}/index.php?r=api/getweekpicturedetail&imageId=${imgId}&typeId=${this.imgDataList.typeId}&page=${this.page}`
					if(this.productId){
						ajaxUrl += `&productId=${this.productId}`
					}
					this.getData(ajaxUrl, res => {
						this.shareLock = true
						if (res.ok && res.data.info === 'ok') {
							let shareData = res.data.share
							shareData.url += `#p${Math.abs(this.index) + 1}`
							//分享数据
							this.shareData = {
								title: shareData.h1,
								desc: shareData.title,
								link: shareData.url,
								imgUrl: shareData.img,
							}
							resolve()
						}
					})
				})
			},
            //请求图片详情
            getImgData(){
                let ajaxUrl = `${this.ajaxUrl()}/index.php?r=api/getweekpicturedetail&imageId=${this.imgDataList.F_ImageId}&typeId=${this.imgDataList.typeId}&page=${this.page}`
                if(this.productId){
                   ajaxUrl += `&productId=${this.productId}`
                }
                this.getData(ajaxUrl,ele => {
                    if(ele.ok && ele.data.info == 'ok'){
                        //只有没有标题的时候运行一次
//                        if(!this.titleName){
                            //车型
                            if(ele.data.proName){
                                this.pageType = '产品库-车型图片最终页'
                                this.titleName = ele.data.proName + ele.data.typeName + '图片'
                                this.dt = `${ele.data.proName}图片`
                                //发送GA
                                this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-车型图片最终页',this.dt)
                            }else{//车系
                                this.pageType = '产品库-子类车系图片最终页'
                                this.titleName = this.dt = ele.data.title
                                //发送GA
                                this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-子类车系图片最终页',this.dt)
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
    .truck-info{
        flex: 1;
		align-items: center;
    }
    .footer-price{
        position:fixed;
        left:24px;
        right:24px;
        bottom:24px;
        width: 702px;
        height: 100px;
        justify-content: center;
        align-items: center;
        background-color: #FF6600;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
    .footer-price-text{
        color:#fff;
        font-size:32px;
    }
    .truck-name{
        color: #fff;
        font-size:32px;
    }
    .truck-price{
		flex: 1;
        margin-top: 10px;
        flex-direction: row;
        justify-content: center;
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
        margin-top: 83px;
        margin-bottom: 36px;
        height: 40px;
        justify-content: center;
        align-items: flex-end;
    }
    .desc {
        margin-top: 84px;
        align-items: center;
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
