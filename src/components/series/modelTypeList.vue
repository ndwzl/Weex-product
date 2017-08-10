<template>
    <div class="model-type-list">
        <div class="subtitle">
            <div class="title-name">
                <text class="subtitle-text">车型报价</text>
                <div class="sell-state-sum" v-for="(ele,index) in modelList" v-if="sellState == index">
                    <text :style="{fontSize:'24px',color:'#999'}">共</text>
                    <text :style="{fontSize:'24px',color:'#f60',marginLeft:'10px',marginRight:'5px'}">{{ele.total}}</text>
                    <text :style="{fontSize:'24px',color:'#999'}"> 款{{ele.status}}车型</text>
                </div>
            </div>
            <!--在售 || 未发布 || 停售-->
            <div class="sell-state">
                <div :class="['sell-state',sellState == index ? 'sell-state-visible' : '']" v-for="(ele,index) in modelList" v-if="ele.list.length > 0" @click="selectSellState(index)">
                    <keep-alive>
                        <text :class="['sell-state-text',sellState == index ? 'sell-state-text-visible' : '']">{{ele.status}}</text>
                    </keep-alive>
                </div>
            </div>
        </div>
        <!--数据列表-->
        <div v-for="(ele,index) in modelList" class="content" v-if="sellState == index">
            <div class="options">
                <div v-for="(res,number) in ele.list" :class="['option',optionState[index] == ele.attrKey[number] ? 'option-visible' : '',optionNumber == 3 ? 'long-option' : 'short-option']" @click="selectOption(index,number)">
                    <text :class="['option-test',optionState[index] == ele.attrKey[number] ? 'option-test-visible' : '' ]">{{ele.attrKey[number] == 10 ? '底盘' : ele.attrKey[number]}}</text>
                </div>
            </div>
            <div class="wrapper" v-for="(res,key) in ele.list" v-if="optionState[index] == ele.attrKey[key]">
                    <div v-for="(data,index) in res" class="model-list" v-if="index < modelListNumber" @click="goModelInfo(data,'model.weex.js')"><!---->
                        <div class="truck-info">
                            <div class="truck-name">
                                <text v-if="data.hotLocation" class="truck-name-tag">{{data.hotLocation}}</text>
                                <text class="truck-name-text">{{data.speaclProName}}</text>
                            </div>
                            <div class="guide-price">
                                <text v-if="data.priceScope" class="guide-price-text">厂商指导价：{{data.priceScope}}</text>
                                <text v-else="" class="guide-price-text">厂商指导价：{{data.F_Price != 0 ? data.F_Price + data.F_PriceUnit : '暂无'}}</text>
                                <div class="tags">
                                    <text v-for="tag in data.paramDetail" class="tag-text">{{tag}}</text>
                                </div>
                            </div>
                            <div class="action">
                                <div class="" @click="goModelInfo(data,'modelDealer.weex.js')">
                                    <text class="hot-price">{{data.hotPrice}}</text>
                                </div>
                                <div class="action-wrapper">
                                    <div class="comparison" @click="compare(data.F_ProductId)">
                                        <!--<text v-if="!compareState[data.F_ProductId]" :style="{fontFamily:'detail',fontSize:'26px',color:'#586c94',marginRight:'5px'}">&#x52a0;</text>-->
                                        <image v-if="!compareState[data.F_ProductId]" src="https://s.kcimg.cn/wap/images/detail/productApp/add.png" style="width:16px;height:16px;margin-right:5px"></image>
                                        <text class="comparison-text">{{compareState[data.F_ProductId] ? compareState[data.F_ProductId] : '对比'}}</text>
                                    </div>
                                    <div class="floor-price" @click="goModelInfo(data,'footerPrice.weex.js')">
                                        <text class="floor-price-text">询底价</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="load-more" v-if="res.length > modelListNumber" @click="loadMore">
                        <text class="load-more-text">加载更多</text>
                        <!--<text :style="{fontFamily:'detail',fontSize:'28px',color:'#999'}">&#x4e0b;</text>-->
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/more.png" style="width:24px;height:14px"></image>
                    </div>
            </div>
        </div>
        <div :class="['compare',compareNumber == 0 ? 'compare-hide' : '']" ref="compare" @click="goCompare">
            <text class="compare-text">对比  ({{compareNumber}})</text>
        </div>
    </div>
</template>

<script type="text/babel">
    import store from '../../store'
    let stream = weex.requireModule('stream');
    let modal = weex.requireModule('modal');
    let storage = weex.requireModule('storage');
    let animation = weex.requireModule('animation');
    export default {
        props:['seriesInfo','locationInfo','el'],
        data(){
            return {
                //车系ID
                seriesId:'',
                //车型列表
                modelList:[],
                //地区热门列表
                hotModelList:[],
                //当前状态 在售 || 未发布 || 停售
                sellState:'',
                //当前状态 4*2 || 6*2 || 6*4
                optionState:['','',''],
                //车型列表选项一行的个数
                optionNumber:4,
                //车型列表显示数量
                modelListNumber:10,
                //加入对比状态
                compareState:{

                },
                //对比的数量
                compareNumber:'',
                //存储的对比数据
                compareTask:{},
            }
        },
        methods:{
            //发送请求
            getData(url,callback){
                return stream.fetch({
                    method:'GET',
                    type:'json',
                    url:url
                },callback)
            },
            selectSellState(index){
                this.sellState = index;
            },
            //选择当前状态 4*2 || 6*2 || 6*4
            selectOption(index,number){
                this.$set(this.optionState,index,this.modelList[index].attrKey[number])
            },
            //点击展开更多车型
            loadMore(){
                this.modelListNumber += 10;
            },
            //对比
            compare(id){
                //查看存储的数据
                storage.getItem('compareTask',(ele) => {
                    if(ele.result == 'success'){
                        let data = JSON.parse(ele.data);
                        if(data[this.seriesId]){
                            //判断是加入还是取消
                            if(this.compareState[id]){  //取消
                                //循环已保存的数组 && 删除掉
                                data[this.seriesId].forEach((ele,index) => {
                                    if(ele == id){
                                        data[this.seriesId].splice(index,index + 1)
                                        //添加对比的数量
                                        this.compareNumber--;

                                        //如果还剩下一个对比
//                                        if(data[this.seriesId][0]){
//                                            //对比的链接
//                                            this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '/';
//                                        }
                                    }
                                });
                                //再次存储
                                storage.setItem('compareTask',JSON.stringify(data),() => {
                                    this.$set(this.compareState,id,'')
                                })
                            }else{//加入
                                if(data[this.seriesId].length >= 2 || this.compareNumber == 2){
                                    this.alert('只能对比两款车型')

                                    //判断当前状态是否只有一个 && 更新当前存储
                                    if(this.compareNumber < 2){
                                        //获取最新缓存
                                        storage.getItem('compareTask',compareTask => {
                                            if(compareTask.result == 'success'){
                                                let compareTaskData = JSON.parse(compareTask.data);
                                                if(compareTaskData[this.seriesId].length){
                                                    compareTaskData[this.seriesId].forEach((e,i) => {
                                                        this.$set(this.compareState,e,'已加入')
                                                    })
                                                }
                                            }
                                        })
                                        this.compareNumber = 2;
                                    }
                                }else{
                                    if(data[this.seriesId].length == 0 && (this.compareNumber == 2 || this.compareNumber == 1)){
                                        this.compareNumber = 0;
                                        this.compareState  = {};
                                        for(let key in this.compareState){
                                            data[this.seriesId].push(key)
                                            this.compareNumber++;
                                        }

                                        //再次存储
                                        storage.setItem('compareTask',JSON.stringify(data),() => {
                                            this.$set(this.compareState,id,'已加入')
                                        })

                                        if(data[this.seriesId].length >= 2){
                                            return
                                            this.alert('只能对比两款车型')
                                        }
                                    }

                                    //若是车型添加对比，返回车系页
                                    if(data[this.seriesId].length == 1 && this.compareNumber == 0){
                                        if(data[this.seriesId][0] == id){
                                            this.$set(this.compareState,id,'已加入')
                                            this.compareNumber = 1;
                                            return;
                                        }else{
                                            data[this.seriesId].push(id);
                                            this.compareNumber = data[this.seriesId].length;

                                            //再次存储
                                            storage.setItem('compareTask',JSON.stringify(data),() => {
                                                this.$set(this.compareState,id,'已加入')
                                            })
                                            data[this.seriesId].forEach((e,i) => {
                                                this.$set(this.compareState,e,'已加入')
                                            })
                                        }
                                    }else{
                                        data[this.seriesId].push(id);
                                        //添加对比的数量
                                        this.compareNumber++;

                                        //再次存储
                                        storage.setItem('compareTask',JSON.stringify(data),() => {
                                            this.$set(this.compareState,id,'已加入')
                                        })

                                        storage.getItem('compareTask',compareTask => {
                                            if(compareTask.result == 'success'){
                                                let compareTaskData = JSON.parse(compareTask.data);
                                                if(compareTaskData[this.seriesId].length != this.this.compareNumber){
                                                    compareTaskData[this.seriesId].forEach((e,i) => {
                                                        this.$set(this.compareState,e,'已加入')
                                                    })
                                                    this.compareNumber = compareTaskData[this.seriesId].length
                                                }
                                            }
                                        })
                                    }
                                }
                            }

                        }else{
                            data[this.seriesId] = [];
                            data[this.seriesId].push(id);
                            //添加对比的数量
                            this.compareNumber++;
                            //加入对比
                            this.$set(this.compareState,id,'已加入');
                            //对比的链接
//                            this.compareUrl = 'http://product.m.360che.com/contrast/' + id + '/';
                            storage.setItem('compareTask',JSON.stringify(data))
                        }
                    }else{
                        //未获取到存储，第一次存储
                        let compareTask = {};
                        compareTask[this.seriesId] = [];
                        compareTask[this.seriesId].push(id);


                        //添加对比的数量
                        this.compareNumber++;

                        //加入对比
                        this.$set(this.compareState,id,'已加入');
                        //对比的链接
//                        this.compareUrl = 'http://product.m.360che.com/contrast/' + id + '/';
                        storage.setItem('compareTask',JSON.stringify(compareTask))
                    }
                });
            },
            //点击车型列表 跳转到车型页面
            //点击车型列表询底价 跳转到车型询底价页面
            //点击车型列表价格  跳转到车型经销商页面
            goModelInfo(ele,url){
                //显示加载loading
//                    this.showLoading();
                if(url == 'footerPrice.weex.js'){
                    //进入询底价页面 && 发送统计事件
//                    this.GA(0,ele.F_ProductId)
                    this.eventGa(weex.config.deviceId,'点击询底价按钮',this.el,'车型区块')
                    storage.setItem('priceProductId',ele.F_ProductId,(ele) => {
                        //跳转
                        this.goWeexUrl(url);
                    });
                }else{
                    storage.setItem('ProductId',ele.F_ProductId,(ele) => {
                        //跳转
                        this.goWeexUrl(url);
                    });
                }

            },
            //点击对比，跳转对比页面
            goCompare(){
                //读取对比信息
                storage.getItem('compareTask',ele => {
                    if(ele.result == 'success'){
                        //缓存对比需要的信息
                        storage.setItem('compareData',ele.data,res => {
                            if(res.result == 'success'){

                                //删除对比信息
                                let data = JSON.parse(ele.data);
                                if(data[this.seriesId]){
                                    data[this.seriesId] = [];
                                }
                                //重置对比信息
                                this.compareState = {};
                                this.compareNumber = 0;

                                //重新缓存
                                storage.setItem('compareTask',JSON.stringify(data),success => {
                                    if(success.result == 'success'){
                                        //成功跳转对比页面
                                        this.goWeexUrl('contrast.weex.js');
                                    }
                                })
                            }
                        })
                    }
                })
//                this.compareState = {};
//                //对比要跳转过去的url
//                this.compareUrl = '';
//                //对比的数量
//                this.compareNumber = '';
//                //存储的对比数据
//                this.compareTask = {};
//                storage.getItem('compareTask',(ele) => {
//                    if(ele.result == 'success'){
//                        let compareTask = JSON.parse(ele.data);
//                        if(compareTask[this.seriesId]){
//                            compareTask[this.seriesId] = [];
//                        }
//                        storage.setItem('compareTask',JSON.stringify(compareTask),() => {
//                            this.goUrl(compareUrl);
//                        })
//                    }
//                })
            },
            //请求地区热门车型
            getHotModel(clear){

                //请求地区热门车型
                this.getData(this.ajaxUrl() + '/index.php?r=weex/series/district-price&subCateId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId,(res) => {
                    if(res.ok){
                        this.hotModelList = res.data;

                        if(clear){
                            //循环最外层标签
                            this.modelList.forEach((ele, index) => {
                                //如果数据的内容不为空
                                if (this.modelList[index].list.length > 0) {
                                    this.modelList[index].list.forEach((key, keyNum) => {
                                        //循环总列表
                                        this.modelList[index].list[keyNum].forEach((data, number) => {
                                            //重置热门地区和报价
                                            this.$set(this.modelList[index].list[keyNum][number], 'hotLocation', '');
                                            this.$set(this.modelList[index].list[keyNum][number], 'hotPrice', '');
                                        })
                                    })
                                }
                            })
                        }

                        //循环热门车型报价
                        if (this.hotModelList) {
                            this.hotModelList.forEach((hot, i) => {
                                //循环最外层标签
                                this.modelList.forEach((ele, index) => {
                                    //如果数据的内容不为空
                                    if (this.modelList[index].list.length > 0) {
                                        this.modelList[index].list.forEach((key, keyNum) => {
                                            //循环总列表
                                            this.modelList[index].list[keyNum].forEach((data, number) => {

                                                //如果id相等
                                                if (data.F_ProductId == hot.productId) {

                                                    let unit = '起';

                                                    if (hot.hot == 1) {
                                                        unit = '';
                                                        //是热门
                                                        this.$set(this.modelList[index].list[keyNum][number], 'hotLocation', '[' + this.locationInfo.cityName.split('市')[0] + '热门]');
                                                    }

                                                    //赋值价格
                                                    this.$set(this.modelList[index].list[keyNum][number], 'hotPrice', hot.price + unit);

                                                    let hotprice = this.modelList[index].list[keyNum].splice(number, '1')[0];

                                                    this.modelList[index].list[keyNum].unshift(hotprice)

                                                }
                                            })
                                        })
                                    }
                                })
                            })
                        }
                    }
                });
            },
            //点击价格跳转到车型经销商
            goModelDealer(ele){
                console.log(ele)
            }
        },
        created(){
            //查看屏幕分辨率，判断车型列表选项一行的个数
            if(weex.config.deviceWidth <= 320){
                this.optionNumber = 3;
            };

            //获取对比存储数据
            storage.getItem('compareTask',(comper) => {
                if(comper.result == 'success'){
                    this.compareTask = JSON.parse(comper.data);
                }
            });

            //请求车型列表数据
            this.getData(this.ajaxUrl() + '/index.php?r=weex/series/price&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid,(ele) => {
                if(ele.ok){
                    //给车型列表赋值
                    this.modelList = ele.data;

                    //请求地区热门车型
                    this.getHotModel();


                    //默认显示状态 在售 || 未上市 || 停售
                    let ishave = true;
                    this.modelList.forEach((ele,index) => {
                        if(this.modelList[index].list.length > 0 && ishave){
                            this.sellState = index;
                            ishave = false;
                        }
                    });

                    //默认显示状态 4*2 || 6*2 || 6*4 ...
                    let islongest = true;
                    let longest = '';
                    //循环最外层标签
                    this.modelList.forEach((ele,index) => {
                        islongest = true;
                        //循环状态下的list
                        this.modelList[index].list.forEach((key, number) => {
                            //定义状态，只循环一次，用第一条数据逐个对比之后的数据
                            if (islongest) {
                                islongest = false;

                                //当车系id为空的时候 获取车系id并赋值
                                if (!this.seriesId) {
                                    this.seriesId = key[0].F_SubCategoryId;
                                }

                                //获取存储对比数据 && 给元素赋值
                                if (this.compareTask[this.seriesId]) {
                                    //获取对比的数量
                                    this.compareNumber = this.compareTask[this.seriesId].length;
                                    //循环存储的对比数据，渲染数据
                                    this.compareTask[this.seriesId].forEach((res, index) => {
                                        this.$set(this.compareState, res, '已加入')
                                    })
                                }

                                //默认取第一条数据的length
                                longest = this.modelList[index].list[number];
                                //默认取第一条数据的key
                                this.$set(this.optionState, index, this.modelList[index].attrKey[number])

                                //二次循环，去一一对比
                                this.modelList[index].list.forEach((k, kNum) => {
                                    //如果小于后面的length
                                    if (this.modelList[index].attrKey[kNum] != 10) {
                                        if (longest.length < this.modelList[index].list[kNum].length) {
                                            //取后面的length比较长的数据
                                            longest = this.modelList[index].list[kNum]
                                            this.$set(this.optionState, index, this.modelList[index].attrKey[kNum])
                                        }
                                    }
                                })
                            }
                        })
                    });
                }
            });
        },
        watch:{
            //监听 加入 || 取消对比
            compareNumber(){
                let compare = this.$refs.compare;
                if(this.compareNumber == ''){
                    animation.transition(compare,{
                        styles:{
                            transform:'translate(0,0)',
                        },
                        duration:300,
                        timingFunction:'ease'
                    })
                }else{
                    animation.transition(compare,{
                        styles:{
                            transform:'translate(-140px,0)',
                        },
                        duration:300,
                        timingFunction:'ease'
                    })
                }
            },
            //深度监听地区发生变化
            locationInfo:{
                //当地区发生变化的时候 请求调取热门地区
                handler(){
                    this.getHotModel(true);
                },
                deep: true,
            }
        }
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
    .title-name{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .subtitle-text{
        color:#333;
        font-size:32px;
        font-weight: bold;
    }
    .sell-state-sum{
        margin-left:10px;
        flex-direction: row;
        align-items: center;
    }
    .sell-state{
        height:78px;
        margin-left:10px;
        flex-direction:row;
        align-items: center;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #fff;
    }
    .sell-state-text{
        font-size:28px;
        color:#999;
        padding-left:10px;
        padding-right:10px;
    }
    .sell-state-visible{
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #f60;
    }
    .sell-state-text-visible{
        color:#f60;
    }
    .options{
        flex-direction:row;
        justify-content:flex-start;
        align-items:center;
        padding-top:10px;
        padding-bottom:10px;
        padding-left:10px;
        padding-right:10px;
        flex-wrap: wrap;
    }
    .option{
        height:60px;
        justify-content:center;
        align-items:center;
        margin-left:10px;
        margin-right:10px;
        margin-top:10px;
        margin-bottom:10px;
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
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }
    .long-option{
        width:223px;
    }
    .short-option{
        width:160px;
    }
    .option-visible{
        border-top-color:#586c94;
        border-right-color:#586c94;
        border-bottom-color:#586c94;
        border-left-color:#586c94;
    }
    .option-test{
        color:#333;
        font-size:24px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }
    .option-test-visible{
        color:#586c94;
    }
    .wrapper{
        border-top-width:20px;
        border-top-style: solid;
        border-top-color:#f5f5f5;
    }
    .model-list{
        padding-left:30px;
        padding-right:30px;
    }
    .model-list:active{
        background-color:rgba(0,0,0,.2)
    }
    .truck-info{
        padding-top:30px;
        padding-bottom:20px;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
    }
    .truck-name{
        flex-direction:row;
        align-items: center;
        justify-content: flex-start;
    }
    .truck-name-tag{
        margin-right:20px;
        color:#448dea;
        font-size:24px;
    }
    .truck-name-text{
        color: #333333;
        font-size:28px;
    }
    .guide-price{
        flex-direction:row;
        justify-content:space-between;
        margin-top:12px;
    }
    .guide-price-text{
        color:#999;
        font-size:24px;
    }
    .tags{
        margin-bottom:-4px;
        flex-direction:row;
        justify-content: center;
        align-items: center;
    }
    .tag-text{
        margin-left:15px;
        color:#999;
        font-size:24px;
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
    .action{
        height:64px;
        margin-top:20px;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
    }
    .hot-price{
        color:#f60;
        font-size:28px;
    }
    .action-wrapper{
        flex:1;
        flex-direction:row;
        justify-content:flex-end;
    }
    .comparison{
        height:64px;
        padding-left:30px;
        padding-right:30px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
    }
    /*.comparison:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .comparison-text{
        color:#586c94;
        font-size:24px;
    }
    .floor-price{
        height:64px;
        padding-left:30px;
        padding-right:30px;
        justify-content:center;
        align-items:center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#586C94;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#586C94;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#586C94;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#586C94;
        border-top-left-radius: 8px;
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;
    }
    /*.floor-price:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .floor-price-text{
        color:#586C94;
        font-size:28px;
    }
    .keep-alive{
        flex-direction:row
    }
    .compare{
        position: fixed;
        left:750px;
        bottom: 270px;
        width: 140px;
        height: 70px;
        justify-content: center;
        align-items: center;
        border-top-left-radius:36px;
        border-bottom-left-radius:36px;
        background-color: rgba(21,113,229,.8);
    }
    .compare-text{
        color:#fff;
        font-size:24px;
    }
</style>