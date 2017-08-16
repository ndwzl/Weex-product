<template>

    <div class="['location',iosTop ? 'noPadding' : '']">
            <div v-if="iosTop" class="ios-top"></div>
            <list class="location-wrapper"><!-- @scroll="scrollContent" ref="locationWrapper"-->
                <!--头部-->
                <header>
                    <div class="title">
                        <div class="back" @click="selectLocationPop">
                            <!--<text :style="{fontFamily:'detail',fontSize:'32px',color:'#333'}">回</text>-->
                            <image src="https://s.kcimg.cn/wap/images/detail/productApp/back.png" style="width:20px;height:36px"></image>
                        </div>
                        <div class="wrapper">
                            <text class="title-name">选择地区</text>
                        </div>
                    </div>
                </header>

                <!--地区搜索-->
                <cell :class="['search-location',searching?'searching':'']">
                    <div class="search-box">
                        <div class="search-icon">
                            <!--<text :style="{fontFamily:'detail',color:'#d8d8d8'}" class="search-icon-text">&#x641c;</text>-->
                            <image src="https://s.kcimg.cn/wap/images/detail/productApp/search.png" style="width:30px;height:32px"></image>
                        </div>
                        <input type="text" placeholder="请输入城市名称或首字母查询" :value="searchValue" class="search-text" @input="searchLocation" @focus="onSearchFocus" ref="searchBox"/>
                    </div>
                    <div class="cancel-search" v-if="searching" @click="cancelSearch">
                        <text class="cancel-search-text">取消</text>
                    </div>
                </cell>
                <!--定位/常用地区-->
                <!--<div v-if="!searching" class="content">-->
                <cell class="hot-location"  v-if="!searching">
                    <div class="hot-title">
                        <text class="hot-title-text">定位/常用</text>
                    </div>
                    <div class="hot-content">
                        <div v-for="(ele,index) in hotLocation" class="hot-location-list" @click="shortcutSelectLocation(ele)">
                            <image v-if="myRegion && index == 0"  src="https://s.kcimg.cn/wap/images/detail/productApp/location-f60.png" style="width:20px;height:24px;margin-right:10px"></image>
                            <!--<text v-if="myRegion && index == 0" :style="{fontFamily:'detail',color:'#f60',fontSize:'28px',marginRight:'5px'}">&#xe60a;</text>-->
                            <text class="hot-location-text">{{ele.cityName}}</text>
                        </div>
                    </div>
                </cell>
                <cell v-for="(ele,index) in locationData.list"  v-if="!searching">
                    <div class="list-title" :ref="locationData.indexNav[index]">
                        <text class="list-title-text">{{locationData.indexNav[index]}}</text>
                    </div>
                    <div class="location-list">
                        <div v-for="res in ele" class="location-model" @click="selectProvince(res.F_ProvinceName,res.F_ProvinceId)">
                            <text :class="['province-name',res.F_ProvinceName==locationInfo.provinceName?'result-list-text-visible':'']">{{res.F_ProvinceName}}</text>
                        </div>
                    </div>
                </cell>
                    <!--</div>-->
            </list>
            <!--搜索结果列表-->
            <list v-if="searching" class="search-result">
                <cell>
                    <div class="search-result-wrapper">
                        <div v-if="searchResult.length" v-for="ele in searchResult" class="result-list"  @click="shortcutSelectLocation(ele)">
                            <text class="result-list-text">{{ele.cityName}}</text>
                        </div>
                    </div>
                </cell>
            </list>
            <!--索引导航-->
            <div v-if="!searching" class="location-nav">
                <div v-for="(ele,index) in locationData.indexNav" class="index-nav" @click="anchor(index)">
                    <text :class="['index-nav-text',indexNav == ele?'index-nav-visible':'']">{{ele}}</text>
                </div>
            </div>
            <!--侧边栏内容-->
            <div class="['sidebar-content',iosTop ? 'noPadding' : '']" ref="side">
                <div class="ios-top" v-if="iosTop"></div>
                <list style="flex: 1">
                     <cell class="sidebar-header" v-if="showSidebar">
                        <div class="back" @click="sidebarHide">
                            <text class="back-text">关闭</text>
                        </div>
                        <text class="sidebar-header-text">{{locationInfo.provinceName}}</text>
                    </cell>
                    <cell v-if="sidebarContent.length > 0" v-for="(data,index) in sidebarContent" class="sidebar-module" @click="selectCity(data.F_CityName,data.F_Id)">
                        <div class="city-name">
                            <text :class="['city-name-text',locationInfo.cityName==data.F_CityName?'city-name-text-visible':'']">{{data.F_CityName}}</text>
                        </div>
                    </cell>
                    <cell v-if="sidebarContent.length == 0" class="empty-history">
                        <!--<text :style="{fontFamily:'detail',fontSize:'100px',color:'#a1c6f5'}">&#x65e0;</text>-->
                        <image src="https://s.kcimg.cn/wap/images/app_icon/bad.png" style="width:155px;height:100px;"></image>
                        <text class="empty-history-text">很遗憾~ 没有相关内容~</text>
                    </cell>
                </list>

            </div>
    </div>
</template>

<script type="text/babel">
    let modal = weex.requireModule('modal');
    let dom = weex.requireModule('dom');
    let stream = weex.requireModule('stream');
    let animation = weex.requireModule('animation');
    let storage = weex.requireModule('storage');
    export default {
        props:['locationData'],
        data(){
            return {
                //是否搜索中
                searching:false,
                //常用地区列表
                hotLocation:[],
                //是否有定位地区
                myRegion:false,
                //已经选中的nav导航
                indexNav:'',
                //搜索框内容
                searchValue:'',
                //搜索列表结果
                searchResult:[],
                //搜索结果列表的高度
                searchResultHeight:'',
                //sidebar显示与隐藏
                showSidebar: false,
                //sidebar侧边栏内容
                sidebarContent:[],
                //空列表
                emptyList:false,
                locationInfo:{
                    provinceName:'',
                    provinceId:'',
                    cityName:'',
                    cityId:'',
                },
                iosTop:false

            }
        },
        methods:{
            //滚动取消选择城市选择框
//            scrollContent(){
//                let locationWrapper = this.$refs.locationWrapper;
//                this.alert(locationWrapper.scrollTop.reachTop)
////                this.alert(1)
//            },
            //关闭选地区弹层
            selectLocationPop(){
                this.$emit('selectLocationPop')
            },
            //搜索输入框获取焦点
            onSearchFocus(){
                this.searching  =  true;
            },
            //点击取消搜索
            cancelSearch(){
                let searchBox = this.$refs.searchBox;
                //搜索框失去焦点
                searchBox.blur();
                //搜索输入框置空
                this.searchValue = '';
                //搜索结果列表置空
                this.searchResult = [];
                //取消搜索状态
                this.searching = false;
            },
            //点击城市索引导航
            anchor(index){
               console.log(this.$refs)
                this.indexNav = this.locationData.indexNav[index];
                let nav = [this.locationData.indexNav[index]][0];
                dom.scrollToElement(this.$refs[nav][0], {offset: 0})
            },
            //输入框搜索
            searchLocation(event){
                this.searchValue = event.value;
                this.getData(this.ajaxUrl() + '/index.php?r=weex/series/get-search-region&value=' + encodeURIComponent(event.value),(ele) => {
                    if(ele.ok && ele.data.info == 'ok'){
                        this.searchResult = ele.data.data;
//                        this.alert(JSON.stringify(this.searchResult))
//                        ele.data.data.forEach((res,index) => {
//                            this.$set(this.searchResult,index,ele.data.data[index]);
//                        })
                    }
                })
            },
            //点击定位 常用地区列表
            shortcutSelectLocation(ele){
                let searchBox = this.$refs.searchBox;
                //搜索框失去焦点
                searchBox.blur();

                this.locationInfo = ele;
                //将已选择城市数据传递给父元素
                this.getLocationInfo();
                //关闭选地区弹层
                this.selectLocationPop();
            },
            //选择省份
            selectProvince(provinceName,provinceId){
                //显示侧边栏
                this.showSidebar = true;
                //设置当前选择省份数据
                this.locationInfo.provinceName = provinceName;
                this.locationInfo.provinceId = provinceId;
                this.locationInfo.cityName = '';
                this.locationInfo.cityId = '';

                //弹出侧边栏动画
                var side = this.$refs.side;
                animation.transition(side, {
                    styles: {
                        transform: 'translate(0,0)'
                    },
                    duration: 300, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                });

                //请求城市数据
                this.getData(this.ajaxUrl() + '/index.php?r=app/series/city-list&provinceId=' + provinceId,(ele) => {
                   if(ele.ok && ele.data && ele.data.status == 1){
                       this.sidebarContent = ele.data.data;
                   }else{
                       this.sidebarContent = [];
                   }
                });
                //将已选择城市数据传递给父元素
                this.getLocationInfo();
            },
            //选择城市
            selectCity(cityName,cityId){
                console.log(cityId)
                //设置当前选择城市数据
                this.locationInfo.provinceName = this.locationInfo.provinceName;
                this.locationInfo.provinceId = this.locationInfo.provinceId;
                this.locationInfo.cityName = cityName;
                this.locationInfo.cityId = cityId;
                //关闭sidebar
                this.sidebarHide();

                //将已选择城市数据传递给父元素
                this.getLocationInfo();

                //关闭选地区弹层
                this.selectLocationPop();

                //保存已选择城市信息

                //保存常用地理位置
                storage.getItem('hotLocation',(ele) => {
                    if(ele.result == 'success'){
                        let data = JSON.parse(ele.data);
                        let ishave = true;
                        data.forEach((res,index) => {
                            if(res.cityName == cityName && ishave){
                                ishave = false;
                            }
                        });

                        if(ishave){
                            if(data.length > 5){
                                //查看是否打开定位地区，如果打开，从1开始截取
                                if(this.myRegion){
                                    data.splice(1,1)
                                }else{
                                    //如果没有打开定位地区，从0开始截取
                                    data.splice(0,1)
                                }

                            }
                            data.push(this.locationInfo);

                            this.hotLocation = data;

                            storage.setItem('hotLocation',JSON.stringify(data))
                        }
                    }else{
                       let hotLocation = [];
                        hotLocation.push(this.locationInfo);
                        storage.setItem('hotLocation',JSON.stringify(hotLocation))
                    }
                })
            },
            //隐藏sidebar
            sidebarHide(){
                var side = this.$refs.side;
                animation.transition(side, {
                    styles: {
                        transform: 'translate(750px,0)'
                    },
                    duration: 300, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                })
            },
            //发送以选择城市信息
            getLocationInfo(){
                this.$emit('getLocationInfo',this.locationInfo);
            }
        },
        created(){
            if(weex.config.env.platform == 'iOS'){
                this.iosTop = true;
            }

            //获取常用地区列表
            storage.getItem('hotLocation',(ele) => {
                if(ele.result == 'success'){
                    this.hotLocation = JSON.parse(ele.data)
                }

                //获取有没有定位地区
                storage.getItem('myRegion',res => {
                    if(res.result == 'success'){
                        let myRegion = JSON.parse(res.data);
                        //查看常用地区列表第一个是否是定位地区
                        if(this.hotLocation.length){
                            if(this.hotLocation[0].cityName != myRegion.cityName){
                                //把定位放入到常用地区列表
                                this.hotLocation.unshift(myRegion);

                                //重新缓存常用地区列表
                                storage.setItem('hotLocation',JSON.stringify(this.hotLocation))

                            }
                        }else{
                            //把定位放入到常用地区列表
                            this.hotLocation.unshift(myRegion);

                            //重新缓存常用地区列表
                            storage.setItem('hotLocation',JSON.stringify(this.hotLocation))
                        }
                        this.myRegion = true;
                    }
                })
            })
        },
        components:{

        }
    }
</script>

<style scoped>
    .location{
        /*flex: 1;*/
        position:fixed;
        top:0;
        right:0;
        bottom:-100px;
        left:0;
        /*flex: 1;*/
        background-color:#fff;
    }
    .noPadding{
        bottom:0;
    }
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .location-wrapper{
        flex: 1;
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
    .back{
        position:absolute;
        left:0;
        top:0;
        width:54px;
        height:90px;
        justify-content: center;
        align-items: center;
    }
    .search-location{
        position:relative;
        flex-direction: row;
        padding-top:20px;
        padding-right:30px;
        padding-left:30px;
        background-color:#f5f5f5;
    }
    .searching{
        padding-right:110px;
    }
    .search-box{
        flex: 1;
        flex-direction: row;
        align-items:center;
        justify-content:flex-start;
        background-color:#fff;
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
        border-top-left-radius:8px;
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;
    }
    .search-icon{
        width:70px;
        align-items: center;
        justify-content:center;
    }
    .search-text{
        flex: 1;
        height:70px;
        padding-top:20px;
        padding-bottom:20px;
        font-size:28px;
        border-top-width:0;
        border-right-width:0;
        border-bottom-width:0;
        border-left-width:0;
        background-color:rgba(0,0,0,0);
    }
    .cancel-search{
        position:absolute;
        top:20px;
        right:0;
        width:110px;
        height:70px;
        align-items: center;
        justify-content: center;
    }
    .cancel-search-text{
        color:#999;
        font-size:28px;
    }
    /*.content{*/
        /*flex: 1;*/
    /*}*/
    .search-result{
        position:fixed;
        left:0;
        right:0;
        top:220px;
        bottom:0;
        border-top-width:20px;
        border-top-style:solid;
        border-top-color:#f5f5f5;
    }
    .search-result-wrapper{
        padding-top: 20px;
        padding-left:30px;
        padding-right:30px;
    }
    .result-list{
        height:90px;
        align-items: flex-start;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
    }
    .result-list-text{
        color:#333;
        font-size:32px;
    }
    .result-list-text-visible{
        color:#f60;
    }
    .hot-title{
        height:60px;
        padding-left:30px;
        align-items: flex-start;
        justify-content: center;
        background-color:#f5f5f5;
    }
    .hot-title-text{
        color:#999;
        font-size: 24px;
    }
    .hot-content{
        flex-direction: row;
        flex-wrap:wrap;
        padding-top:20px;
        padding-right:20px;
        padding-bottom:20px;
        padding-left:20px;
    }
    .hot-location-list{
        width:216px;
        height:60px;
        margin-top:10px;
        margin-right:10px;
        margin-bottom:10px;
        margin-left:10px;
        flex-direction: row;
        align-items:center;
        justify-content: center;
        border-top-width:1px;
        border-top-style: solid;
        border-top-color:#ddd;
        border-right-width:1px;
        border-right-style: solid;
        border-right-color:#ddd;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#ddd;
        border-left-width:1px;
        border-left-style: solid;
        border-left-color:#ddd;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    .hot-location-text{
        color:#333;
        font-size:28px;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }
    .list-title{
        height:60px;
        padding-left:30px;
        align-items: flex-start;
        justify-content: center;
        background-color:#f5f5f5;
    }
    .list-title-text{
        color:#999;
        font-size:24px;
    }
    .location-list{
        padding-left:30px;
    }
    .location-model{
        height:90px;
        align-items: flex-start;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
    }
    .province-name{
        color:#333;
        font-size:32px;
    }
    .location-nav{
        position:fixed;
        top:0;
        right:0;
        bottom:0;
        align-items: center;
        justify-content: center;
    }
    .index-nav{
        padding-left:20px;
        padding-right:20px;
        height:44px;
        align-items: center;
        justify-content: center;
    }
    .index-nav-text{
        color:#666;
        font-size:28px;
    }
    .index-nav-visible{
        color:#1571e5;
    }

    .sidebar-content {
        position: fixed;
        width:600px;
        top: 0;
        right: 0;
        bottom: -100px;
        left: 150px;
        transform: translate(750px,0);
        background-color: #fff;
        border-left-color: rgba(0,0,0,.1);
        border-left-width: 4px;
        border-left-style:solid;
    }

    .back {
        position: absolute;
        left: 0;
        top: 0;
        width: 88px;
        height: 90px;
        align-items: center;
        justify-content: center;
    }
    .back-text {
        color:#586C94;
        font-size: 32px;
    }

    .sidebar-header {
        position: relative;
        padding-left: 88px;
        padding-right: 88px;
        height: 90px;
        align-items: center;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
        background-color: #fff;
    }

    .sidebar-header-text {
        color: #333;
        font-size: 36px;
    }
    .sidebar-module{
        padding-left:30px;
        padding-right:30px;
    }
    .city-name{
        height:90px;
        align-items:flex-start;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
    }
    .city-name-text{
        color:#333;
        font-size:32px;
    }
    .city-name-text-visible{
        color:#f60;
    }
    .empty-history{
        padding-top:50px;
        justify-content: center;
        align-items: center;
    }
    .empty-history-text{
        color:#999;
        font-size:32px;
        padding-top:20px;
    }
</style>