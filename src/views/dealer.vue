<template>
    <div class="series-dealer">
        <div v-if="iosTop" class="ios-top"></div>
        <list style="flex: 1">
            <header>
                <!--标题-->
                <title :titleName="titleName"></title>
            </header>
            <cell>
                <!--经销商-->
                <dealer :seriesId="seriesInfo.F_SeriesId" :locationInfo="locationInfo" :dealerData="dealerData" @selectLocationPop="selectLocationPop" all="1" :el="el"></dealer>
            </cell>
        </list>
        <!--选地区弹层-->
        <select-location v-if="LocationPop" :locationData="locationData" @selectLocationPop="selectLocationPop" @getLocationInfo="getLocationInfo"></select-location>
        <!--底层询底价浮层-->
        <footerInfo :footerInfo="footerInfo" :el="el"></footerInfo>
    </div>
</template>

<script type="text/babel">
    let storage = weex.requireModule('storage')

    import title from '../components/title.vue'
    import nav from '../components/nav.vue'
    import dealer from '../components/dealer.vue'
    import selectLocation from '../components/selectLocation.vue'
    import footerInfo from '../components/footerInfo.vue'
    var globalEvent = weex.requireModule('globalEvent')
    export default {
        components:{
            title,
            nav,
            dealer,
            selectLocation,
            footerInfo
        },
        data(){
            return {
                //标题
                titleName:'',
                //车系信息
                seriesInfo:{},
                //选择的城市信息
                locationInfo:{
                    provinceName:'全国',
                    provinceId:'',
                    cityName:'',
                    cityId:'',
                },
                //经销商数据
                dealerData:{},
                //选择城市弹层显示与隐藏
                LocationPop:false,
                //选择地区列表数据
                locationData:{},
                //底层询底价信息
                footerInfo:{
                    //询底价数量
                    askTotal: '',
                    //车系询底价热门车型id
                    ProductId: '',
                    //是否显示加入对比
                    compare: false,
                    //是否显示询底价
                    footerPrice:true,
                    list: [
//                        {
//                            name: '综述',
//                            url: 'model.weex.js',
//                        },
//                        {
//                            name: '配置',
//                            url: 'modelConfig.weex.js',
//                        },
//                        {
//                            name: '图片',
//                            url: 'modelPhoto.weex.js',
//                        },
                    ]
                },
                //苹果头部白条
                iosTop:false,
                //统计
                el:'产品库-子类车系经销商列表页'
            }
        },
        created(){

            //发送PV
            storage.getItem('p4',p4 => {
                if(p4.result == 'success'){
                    this.p4 = p4.data;
                    storage.getItem('p5',p5 => {
                        if(p5.result == 'success'){
                            this.p5 = p5.data;
                            this.collect({
                                'p3':p4.data,
                                'p4':3,
                                'p5':p5.data
                            })
                        }
                    })
                }
            })

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });

            if(weex.config.env.platform == 'iOS'){
                this.iosTop = true;
            }
            //获取询底价信息
            storage.getItem('seriesFooterInfo',ele => {
                if(ele.result == 'success'){
                    this.footerInfo.askTotal = JSON.parse(ele.data).askTotal
                    this.footerInfo.ProductId = JSON.parse(ele.data).ProductId
                }
            });
            //获取车系信息
            storage.getItem('seriesInfo',(ele) => {
                if(ele.result == 'success'){
                    this.seriesInfo = JSON.parse(ele.data);
//            this.seriesInfo = {"F_SeriesId":"64","F_SeriesName":"解放J6P","F_EnglishName":"J6P","F_IsEnable":"1","F_CreateDateTime":"2013-11-01 10:58:23","F_BrandId":"5","F_WeekClickCount":"597521","F_MonthClickCount":"1119973","F_TotalClickCount":"0","F_IsStopMake":"1","F_OrderNum":"1","F_ShortName":"一汽解放J6P牵引车","F_APv":"0","F_SPv":"0","proid":"19359","F_SeriesExtendId":"72","F_SubCategoryId":"66","F_CateId":"1","F_ProductNum":163,"F_ImagesCount":"8227","F_ImageId":"82788","F_MainImages":"[{\"s\":1,\"id\":434958},{\"s\":2,\"id\":434989},{\"s\":3,\"id\":435047}]","F_ClickCount":"2400381","F_BrandName":"一汽解放","F_SubCategoryName":"牵引车","F_FirstImg":"66645","F_IsFirst":"1","F_FirstImgUrl":"http://product.360che.com/Pic/416330.html#pic","top":2,"tagid":"50","newTop":1}

                    //请求标题 && 图片数据
                    this.getData(this.ajaxUrl() + '/index.php?r=weex/series/info&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId,(ele) => {
                        if(ele.ok){
                            //标题名称
                            this.titleName = ele.data.h1 + '经销商';

                            //发送GA
                            this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-子类车系经销商列表页',this.titleName)
                        }
                    });

                    //请求车系页面其他数据
                    this.getData(this.ajaxUrl() + '/index.php?r=weex/series/other&subCateId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId,(ele) => {
                        if(ele.ok){
                            //地区列表
                            this.locationData = ele.data.provinceList;
                        }
                    });

                    //查看是否保存以选择城市信息
                    storage.getItem('selectedLocation',(ele) => {
                        if(ele.result == 'success'){
                            this.locationInfo = JSON.parse(ele.data);
                        }
                        //请求经销商数据
                        this.getDealerData();
                    });
                }else{
                    this.alert('网络出错')
                }
            });
        },
        methods:{
            //选择城市弹层显示与隐藏
            selectLocationPop(){
                this.LocationPop = !this.LocationPop;
            },
            //选择城市后保存已选择城市信息
            getLocationInfo(locationInfo){
                this.locationInfo = locationInfo;
                //请求经销商数据
                this.getDealerData();

                //存储已经选择城市信息
                storage.setItem('selectedLocation',JSON.stringify(this.locationInfo));
            },
            //请求经销商数据
            getDealerData(){
                this.getData(this.ajaxUrl() + '/index.php?r=weex/series/dealer&subCateId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId + '&all=1',(ele) => {
                    if(ele.ok){
                        this.dealerData = ele.data;

                        if(!this.dealerData.list.length){
                            this.dealerData.notDealer = true;
                        }else{
                            this.dealerData.notDealer = false;
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>
.series-dealer{
    padding-bottom:100px;
}
.ios-top{
    height:40px;
    background-color: #fff;
}
</style>