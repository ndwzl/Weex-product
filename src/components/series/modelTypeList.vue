<template>
    <div class="model-type-list">
        <div class="subtitle">
            <div class="title-name">
                <text class="subtitle-text">车型报价</text>
                <div class="sell-state-sum">
                    <text :style="{fontSize:'24px',color:'#999'}">共</text>
                    <text :style="{fontSize:'24px',color:'#f60',marginLeft:'10px',marginRight:'5px'}">{{model.total}}</text>
                    <text :style="{fontSize:'24px',color:'#999'}"> 款{{model.status}}车型</text>
                </div>
            </div>
            <!--在售 || 未发布 || 停售-->
            <div class="sell-state">
                <div :class="['sell-state', index == sellState  ? 'sell-state-visible' : '']" v-for="(status,index) in model.statusAll" @click="selectSellState(index,status)">
                    <keep-alive>
                        <text :class="['sell-state-text', index == sellState ? 'sell-state-text-visible' : '']">{{status}}</text>
                    </keep-alive>
                </div>
            </div>
        </div>
        <!--数据列表-->
        <div class="content">
            <div class="options">
                <div v-for="(type, index) in model.attr" :class="['option', model.defaultAttr == type ? 'option-visible' : '', optionNumber == 3 ? 'long-option' : 'short-option']" @click="selectOption(type)">
                    <text :class="['option-test', model.defaultAttr == type ? 'option-test-visible' : '' ]">{{type}}</text>
                </div>
            </div>
            <div class="wrapper">
                    <div class="model-filter" v-if="isTruck">
                        <div class="model-filter-title">
                            <text class="model-filter-title-text">车型筛选</text>
                        </div>
                        <div class="model-filter-operation">
                            <div class="hot-filter" @click="hotSort">
                                <text :class="['filter-text', hotType ? 'filter-active' : '']">热度</text>
                                <image class="filter-image" :src="hotType === 0 ? 'https://s.kcimg.cn/wap/images/detail/productApp/hot-default.png':'https://s.kcimg.cn/wap/images/detail/productApp/hot-down.png'"></image>
                            </div>
                            <div class="power-filter" @click="powerSort">
                                <text :class="['filter-text', powerType ? 'filter-active' : '']">马力</text>
                                <image v-if="powerType === 0" class="filter-image" src="https://s.kcimg.cn/wap/images/detail/productApp/power-default.png"></image>
                                <image v-if="powerType === 1" class="filter-image" src="https://s.kcimg.cn/wap/images/detail/productApp/power-down.png"></image>
                                <image v-if="powerType === 2" class="filter-image" src="https://s.kcimg.cn/wap/images/detail/productApp/power-up.png"></image>
                            </div>
                        </div>
                    </div>
                    <div v-for="(data, index) in model.list" class="model-list" v-if="index < modelListNumber" @click="goModelInfo(data,'model.weex.js')">
                        <div :class="['truck-info', index ? '': 'bt0']">
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
                                    <div v-if="model.status != '停售'" class="floor-price" @click="goModelInfo(data,'footerPrice.weex.js')">
                                        <text class="floor-price-text">询底价</text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="load-more" v-if="model.list.length > modelListNumber" @click="loadMore">
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
        props:['seriesInfo', 'locationInfo', 'el', 'update'],
        data(){
            return {
                //车系ID
                seriesId:'',
                //车型列表
                model: {
                    //标签
                    attr: [],
                    list: [],
                    defaultAttr: '',
                    status: '',
                    statusAll: [],
                },
                //地区热门列表
                hotModelList:[],
                //当前状态 在售 || 未发布 || 停售
                sellState:'',
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
                // 车型筛选的热度排序
                hotType: 1,
                // 车型筛选的马力排序
                powerType: 0,
                // 是否卡车 不是卡车隐藏筛选功能
                isTruck: false,
            }
        },
        methods:{
            // 更新页面数据
            updateInfo (isSellState) {
                const url = `https://product.360che.com/index.php?r=weex/series/price-list${this.getParams(isSellState)}`
                this.getData(url, res => {
                    this.render(res)
                })
            },
            // 获取请求接口所用参数
            getParams (isSellState) {
                let [status, order, attr] = [1, '', ''];
                // status 1 在售 4 停售 3未上市
                this.model.statusAll.forEach((item, index) => {
                    if (item === this.model.status) {
                        status = this.model.statusKey[index]
                    }
                })
                // order: '' 热度，3 从高到低，4 从低到高
                const hash = new Map([
                    [0, ''],
                    [1, '3'],
                    [2, '4'],
                ]);
                order = hash.get(this.powerType)
                if (!isSellState) {
                    let computeAttr = this.model.defaultAttr === '底盘' ? '10' : this.model.defaultAttr
                    attr = `&attr=${encodeURI(computeAttr)}`
                }
                return `&subId=${this.seriesInfo.F_SubCategoryId}&seriesId=${this.seriesInfo.F_SeriesId}${attr}&status=${status}&order=${order}`
            },
            // 渲染排序接口返回的数据
            render (res) {
                if(res.ok){
                    //替换model 渲染数据
                    if (res.data.list) {
                        this.model = res.data
                    } else {
                        this.model.list = res.data
                    }
                    //请求地区热门车型
                    this.getHotModel()
                }
            },
            // 热度排序
            hotSort () {
                // 设置非马力排序
                [this.hotType, this.powerType] = [1, 0]
                this.updateInfo()
            },
            // 马力排序
            powerSort () {
                // 设置非热度排序
                this.hotType = 0
                // 判断需要请求哪种马力排序
                // powerType：0非马力排序, 1马力从高到低, 2马力从低到高
                this.powerType = this.powerType === 1 ? 2 : 1
                this.updateInfo()
            },
            //发送请求
            getData(url,callback){
                return stream.fetch({
                    method: 'GET',
                    type: 'json',
                    url: url,
                },callback)
            },
            selectSellState(index, status){
                // 初始化排序条件为热度
                [this.hotType, this.powerType, this.sellState, this.model.status] = [1, 0, index, status]
                this.updateInfo(true)
            },
            //选择当前状态 4*2 || 6*2 || 6*4
            selectOption(type) {
                this.model.defaultAttr = type
                this.updateInfo()
            },
            //点击展开更多车型
            loadMore(){
                this.modelListNumber += 10
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
                                        // if(data[this.seriesId][0]){
                                        //     //对比的链接
                                        //     this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '/';
                                        // }
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
                const url = 'https://product.360che.com/index.php?r=weex/series/district-price&subCateId='
                this.getData(url +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId, res => {

                // this.getData(this.ajaxUrl() + '/index.php?r=weex/series/district-price&subCateId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId, res => {
                    if(res.ok){
                        this.hotModelList = res.data
                        //循环总列表
                        this.model.list.forEach((ele, index) => {
                            //如果数据的内容不为空
                            if (Object.keys(ele).length) {
                                this.$set(this.model.list[index], 'hotLocation', '')
                                this.$set(this.model.list[index], 'hotPrice', '')
                            }
                        })
                        //循环热门车型报价
                        if (this.hotModelList) {
                            this.hotModelList.forEach((hot, i) => {
                                //循环最外层标签
                                this.model.list.forEach((ele, index) => {
                                    //如果数据的内容不为空
                                    if (Object.keys(ele).length) {
                                        //如果id相等
                                        if (ele.F_ProductId == hot.productId) {
                                            let unit = '起'
                                            if (hot.hot == 1) {
                                                unit = ''
                                                //是热门
                                                this.$set(this.model.list[index], 'hotLocation', `[${this.locationInfo.cityName.split('市')[0]}热门]`)
                                            }
                                            //赋值价格
                                            this.$set(this.model.list[index], 'hotPrice', `${hot.price}${unit}`)

                                            if (this.hotType) {
                                                let hotprice = this.model.list.splice(index, 1)[0]
                                                this.model.list.unshift(hotprice)
                                            }
                                        }
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
            },
            getDataForInit () {
                this.seriesId = this.seriesInfo.F_SubCategoryId
                //请求默认车型列表数据
                // `${this.ajaxUrl()}/index.php?r=weex/series/price&subCateId=${this.seriesInfo.F_SubCategoryId}&seriesId=${this.seriesInfo.F_SeriesId}`
                this.getData(`https://product.360che.com/index.php?r=weex/series/price-list&subId=${this.seriesInfo.F_SubCategoryId}&seriesId=${this.seriesInfo.F_SeriesId}`, ele => {
                    if (ele.ok) {
                        // 默认是在售状态
                        [this.sellState, this.model, this.isTruck] = [0, ele.data, ele.data.isTruck]
                    }
                })
            },
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
            this.getDataForInit()
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
            //监听是否重新加载车型列表
            update () {
                [this.hotType, this.powerType] = [1, 0]
                this.getDataForInit()
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
    .model-filter {
        height: 80px;
        line-height: 80px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #e5e5e5;
    }
    .model-filter-title {
        margin-left: 30px;
    }
    .model-filter-title-text {
        font-size: 28px;
        color: #999999;
    }
    .model-filter-operation {
        margin-right: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 186px;
    }
    .power-filter, .hot-filter {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 80px;
    }
    .filter-text {
        font-size: 28px;
        color: #999999;
    }
    .filter-image {
        width: 16px;
        height:20px;
        margin-left:6px;
    }
    .filter-active {
        color: #1571E5;
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
    .bt0 {
        border-top-width: 0px;
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
