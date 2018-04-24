<template>
    <div class="config">
        <div v-if="iosTop" class="ios-top"></div>
        <!--标题-->
        <title @shareToggle="shareShow" :titleName="titleName" :shareData="shareData" :el="el"></title>
        <!-- 筛选类型 -->
        <div class="filter-type-wrapper" v-if="isTruck && !hideModelFilter" ref="filterTypeWrapper">
            <filter-type :list="filterTypeList"  @showSidebar="showFilterSidebar"></filter-type>
        </div>
        
        <!-- 车型筛选折叠、展开 （3大类才有）-->
        <div class="model-filter" @click="toggleModelFilter" v-if="isTruck">
            <text class="model-filter-text">车型筛选</text>
            <image class="model-filter-icon" :src="DefaultImgPath + 'launch.png'" v-if="hideModelFilter"></image>
            <image class="model-filter-icon" :src="DefaultImgPath + 'packup.png'" v-else></image>
        </div>
        <!--对比车型名称-->
        <div class="product-name-warpper">
            <product-name :footerPrice="1" :products="configData.products" :compareNumber="compareNumber" @clear="clear" @goAddSeries="addSeriesPop"></product-name>
        </div>
        
        <list style="flex:1" @scroll="scroll" offset-accuracy="40">
            <!-- <header>
                
                
            </header> -->
            <!--对比车型选项-->
            <cell class="model" ref="车型信息">
                <div class="title">
                    <text class="title-text">车型信息</text>
                </div>
                <div class="options">
                    <div class="caption">
                        <text class="caption-text">厂商指导价</text>
                    </div>
                    <div class="caption-placeholder"></div>
                    <div class="column-line column-line-left"></div>
                    <div class="content">
                        <text class="content-text" v-if="configData.products[0] && configData.products[0].F_Price && configData.products[0].F_Price != 0 &&  configData.products[0].F_Price != 'kong'">{{configData.products[0] && configData.products[0].F_Price}}万</text>
                        <text class="content-text" v-if="configData.products[0] && configData.products[0].F_Price == 0 || configData.products[0] && !configData.products[0].F_Price && configData.products[0].F_Price != 'kong'">暂无报价</text>
                    </div>
                    <div class="column-line column-line-right"></div>
                    <div class="content">
                        <text class="content-text" v-if="configData.products[1] && configData.products[1].F_Price && configData.products[1].F_Price != 0 && configData.products[1].F_Price != 'kong'">{{configData.products[1] && configData.products[1].F_Price}}万</text>
                        <text class="content-text" v-if="configData.products[1] && configData.products[1].F_Price == 0 || configData.products[1] && !configData.products[1].F_Price && configData.products[1].F_Price != 'kong'">暂无报价</text>
                    </div>
                </div>
                <div class="options">
                    <div class="caption">
                        <text class="caption-text">本地最低报价</text>
                    </div>
                    <div class="caption-placeholder"></div>
                    <div class="column-line column-line-left"></div>
                    <div class="caption-placeholder"></div>
                    <div class="content footer-price">
                        <text class="content-text" v-if="configData.lowPrice[0] && configData.lowPrice[0].F_BigPrice && configData.lowPrice[0].F_BigPrice != 0 && configData.lowPrice[0].F_BigPrice != 'kong'">{{configData.lowPrice[0] && configData.lowPrice[0].F_BigPrice}}万</text>
                        <text class="content-text" v-if="configData.lowPrice[0] && !configData.lowPrice[0].F_BigPrice && configData.lowPrice[0].F_BigPrice != 'kong'">暂无报价</text>
                        <!-- <text class="footer-price-text"  v-if="configData.lowPrice[0] && configData.lowPrice[0].F_BigPrice != 'kong'" @click="goFooterPirce(configData.products[0])">询价</text> -->
                    </div>
                    <div class="column-line column-line-right"></div>
                    <div class="content footer-price">
                        <text class="content-text" v-if="configData.lowPrice[1] && configData.lowPrice[1].F_BigPrice && configData.lowPrice[1].F_BigPrice != 0 && configData.lowPrice[1].F_BigPrice != 'kong'">{{configData.lowPrice[1] && configData.lowPrice[1].F_BigPrice}}万</text>
                        <text class="content-text"  v-if="configData.lowPrice[1] && !configData.lowPrice[1].F_BigPrice && configData.lowPrice[1].F_BigPrice != 'kong'">暂无报价</text>
                        <!-- <text class="footer-price-text" v-if="configData.lowPrice[1] && configData.lowPrice[1].F_BigPrice != 'kong'" @click="goFooterPirce(configData.products[1])">询价</text> -->
                    </div>
                </div>
            </cell>
            <cell v-for="(ele,i) in configData.paramList[0]" v-if="ele.list.length"  class="model" :ref="ele.F_ParameterTypeName">
                <!---->
                <div class="title">
                    <text class="title-text">{{ele.F_ParameterTypeName}}</text>
                </div>
                <div v-for="(item,index) in ele.list" class="options">
                    <!--v-if="configData.products.length > 0 &&  (!(item.value == 0 && configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && configData.paramList[1][i].list[index].value && configData.paramList[1][i].list[index].value == 0)) && ((item.value != '' && configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && configData.paramList[1][i].list[index].value && configData.paramList[1][i].list[index].value != '') || (item.value == '' && configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && configData.paramList[1][i].list[index].value && configData.paramList[1][i].list[index].value != '') || (item.value != '' && configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && configData.paramList[1][i].list[index].value && configData.paramList[1][i].list[index].value == '') || (item.value != '' && !configData.paramList[1]) || (item.value != '' && item.value != 0))"-->
                    <!--v-if="item.value!='' || (paramList[1] && paramList[1][i] && paramList[1][i].list && paramList[1][i].list[index] && paramList[1][i].list[index].value != '')"-->
                    <div class="caption">
                        <text class="caption-text">{{item.F_ParameterName}}</text>
                    </div>
                    <div class="caption-placeholder"></div>
                    <div class="column-line column-line-left"></div>
                    <div class="content">
                        <text class="content-text" v-if="item.F_ParameterName !== '公告型号' && item.value != 0">{{item.value + item.unit}}</text>
                        <!-- <text class="content-empty-text" v-if="item.value == 0">空</text> -->
                        <text class="content-text blues" v-if="item.F_ParameterName === '公告型号'" @click="toWeb(item.value)">{{item.value}}</text>
                    </div>
                    <div class="column-line column-line-right"></div>
                    <div class="content">
                        <text class="content-text" v-if="configData['paramList'][1] && configData['paramList'][1][i] && configData['paramList'][1][i]['list'] && configData['paramList'][1][i]['list'][index] && configData['paramList'][1][i]['list'][index]['F_ParameterName'] !== '公告型号'">{{configData.paramList[1][i]['list'][index].value + configData.paramList[1][i]['list'][index].unit}}</text>
                        <!-- <text class="content-empty-text" v-if="configData.paramList[1][i]['list'][index].value == 0">空</text> -->
                        <text class="content-text blues" v-if="configData['paramList'][1] && configData['paramList'][1][i] && configData['paramList'][1][i]['list'] && configData['paramList'][1][i]['list'][index] && configData['paramList'][1][i]['list'][index]['F_ParameterName'] === '公告型号'" @click="toWeb(configData.paramList[1][i]['list'][index].value)">{{configData.paramList[1][i]['list'][index].value}}</text>
                    </div>
                </div>
            </cell>
            <cell>
                <text style="font-size: 24px;padding: 10px;color: #999;background-color: #fafafa;">注：不符合中华人民共和国法规的，例如国三/国四车型，国内已经不能上牌，仅供出口，或国内非公路内部转运等不上牌地区使用。此参数仅供参考，实际车型配置以店内实车为准。</text>
            </cell>
        </list>
        <!--分类框-->
        <div class="classify" @click="classifyShow">
            <image src="https://s.kcimg.cn/wap/images/detail/productApp/classify.png" style="width:25px;height:25px"></image>
            <!--<text :style="{fontFamily:'detail'}" class="classify-icon">&#x7c7b;</text>-->
            <text class="classify-text">分类</text>
        </div>
        <div class="classify-content" v-if="classifyPop">
            <div class="classify-info" @click="anchor('车型信息')">
                <text class="classify-info-text">车型信息</text>
            </div>
            <div class="classify-info" v-if="configData.paramList[0].length && configData.paramList[0][index].list.length" v-for="(ele,index) in configData.paramList[0]" @click="anchor(ele.F_ParameterTypeName)">
                <text class="classify-info-text">{{ele.F_ParameterTypeName}}</text>
            </div>
        </div>
        <!--底层询底价浮层-->
        <footerInfo :footerInfo="footerInfo" :el="el"></footerInfo>
        <!-- 车型筛选侧边栏 （3大类才有） -->
        <sidebar :index="typeIndex" @subClassChange="subClassChange" @selectModelType="selectModelType" :list="sidebarData" page="config" type="subCate" v-if="showSidebar"></sidebar>
        <!--添加车系弹层-->
        <add-series :addSeriesShow="addSeriesShow" :selectProductPop="selectProductPop" @hideAddProduct="goSelectProduct" @goSelectProduct="goSelectProduct" @addSeriesPop="addSeriesPop" @selectModel="selectModel" :selectedProductId="selectedProductId" :compareData="compareData"></add-series>
		<!-- weex分享 -->
        <weexShare :shareParams="shareData" :showShare="showShare" @shareCallBack="shareCallBack"></weexShare>
	</div>
</template>

<script type="text/babel">
    const storage = weex.requireModule('storage')
    const dom = weex.requireModule('dom')
    const globalEvent = weex.requireModule('globalEvent')
    const animation = weex.requireModule('animation')

    import title from '../components/title.vue'
    import filterType from '../components/filterResult/filterType.vue'
    import sidebar from '../components/filter/sidebar.vue'
    import productName from '../components/config/productName.vue'
    import footerInfo from '../components/footerInfo.vue'
    import addSeries from '../components/config/addSeries.vue'

    export default {
        components:{
            title,
            filterType,
            sidebar,
            productName,
            footerInfo,
            addSeries,
        },
        data(){
            return {
                // 是否三大类（卡车）
                isTruck: false,
                // 是否折叠车型筛选
                hideModelFilter: true,
                // 是否显示子类弹层
                showSidebar: false,
                // 筛选列表数据
                filterTypeList: [],
                // 侧边栏数据
                sidebarData: [],
                // 展开折叠动画锁
                animationLock: true,
                // 滚动锁
                scrollLock: true,
                // 分类列表部分的高度
                // typeListHeight: '0',
                // 选择条件param字段, 用-连接成string
                paramsList: [],
                // 筛选类型的index
                typeIndex: 0,
                //标题
                titleName:'',
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo:{},
                //对比的数量
                compareNumber:'',
                //配置数据
                configData:{
                    //对比车型
                    products:[],
                    //对比信息
                    paramList:[],
                    //厂商指导价和本地最低报价
                    lowPrice:[]
                },
                //是否显示分类弹层
                classifyPop:false,
                //底层询底价信息
                footerInfo:{
                    //询底价数量
                    askTotal:'',
                    //车系询底价热门车型id
                    ProductId:'',
                    //是否显示加入对比
                    compare:false,
                    //是否显示询底价
                    footerPrice:true,
                    list:[
//                        {
//                            name:'综述',
//                            url:'series.weex.js'
//                        },
//                        {
//                            name:'图片',
//                            url:'seriesPhoto.weex.js'
//                        }
                    ]
                },
                //现在还剩下的车型id
                selectedProductId:'',
                //是否显示addSeries弹窗
                addSeriesShow:false,
                //是否显示选择车型列表弹窗
                selectProductPop:false,
                //已经存储的对比内容
                compareData:[],
                //苹果头部白条
                iosTop:false,
                //统计
				el:'产品库-子类车系配置页',
				showShare: false,
				// 分享数据
				shareData: {}
            }
        },
        created(){
            //前端监控
            this.weexLogger('子类车系配置页')

            //发送PV
            storage.getItem('p4',p4 => {
                if(p4.result == 'success'){
                    this.p4 = p4.data;
                    storage.getItem('p5',p5 => {
                        if(p5.result == 'success'){
                            this.p5 = p5.data;
                            this.collect({
                                'p3':p4.data,
                                'p4':1,
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

            this.iosTop = this.isIos()

            //如果有车型id，删除车型id
            storage.getItem('ProductId',ele => {
                if(ele.result == 'success'){
                    storage.removeItem('ProductId')
                }
            })

            //获取询底价信息
            storage.getItem('seriesFooterInfo',ele => {
                if(ele.result == 'success'){
                    this.footerInfo.askTotal = JSON.parse(ele.data).askTotal
                    this.footerInfo.ProductId = JSON.parse(ele.data).ProductId
                }
            })

            //获取车系信息
            storage.getItem('seriesInfo',ele => {
                if(ele.result == 'success'){
                    this.seriesInfo = JSON.parse(ele.data)
                    // 获取车系数据
                    this.getSeriesData()
                }
            });
        },
        methods:{
			shareCallBack (data) {
                // 分享成功
                if (data.status === '0') {
                    const platformList = ['微信好友', '微信朋友圈', 'QQ好友', 'QQ空间', '新浪微博', '复制链接']
                    const platform = platformList[data.platform]
                    this.eventGa(weex.config.deviceId, '分享产品库成功', this.el, platform)
                }
            },
            toWeb (num) {
                this.goUrl(`https://product.m.360che.com/gonggao/#/bulletin?v=${num}`)
            },
			// 分享弹层显示
            shareShow () {
                this.showShare = true
            },
            // 返回请求接口所用的param 例如：'111-4292-324'
            getParamId () {
                return [...this.paramsList].map(x => x.id).join('-')
            },
            // 自释放滚动锁
            autoOpenScrollLock () {
                // 锁上滚动锁并500ms后自动释放
                this.scrollLock = false
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.scrollLock = true
                }, 500)
            },
            // 回到顶部
            backTop () {
                // 自释放滚动锁
                this.autoOpenScrollLock()
                dom.scrollToElement(this.$refs['车型信息'], { animated: false })
            },
            // 获取车系数据
            getSeriesData () {
                this.backTop()
                this.showLoading()
                this.getData(`${this.ajaxUrl()}/index.php?r=api/series/param&seriesId=${this.seriesInfo.F_SeriesId}&subId=${this.seriesInfo.F_SubCategoryId}&param=${this.getParamId()}`, ele => {
                    if (ele.ok && ele.data.code) {
						//分享数据
						let shareData = ele.data.share
						this.shareData = {
							title: shareData.h1,
							desc: shareData.title,
							link: shareData.url,
							imgUrl: shareData.img,
						}
                        // 给侧边栏添加不限选项
                        ele.data.data.searchList.forEach(item => {
                            item.selected = item.isSelect
                            item.originName = item.name
                            item.list && item.list.unshift({
                                'name': '不限',
                                'value': '不限',
                                'type': item.name,
                                'selected': false,
                                'unlimited': true
                            })
                            if (item.isSelect) item.name = `${item.isSelectName}${item.unit}`
                            
                            let hasSelected = false
                            item.list.forEach(_item => {
                                _item.selected = _item.is_select
                                if (!item.unit) item.unit = ''
                                // 给非不限的加上单位
                                if (!_item.unlimited) _item.name = `${_item.value}${item.unit}`
                                if (_item.selected) hasSelected = true
                            })
                            item.list[0].selected = !hasSelected
                        })

                        const data = ele.data.data;

                        let { 
                            name,
                            isThreeMains,
                            seriesInfo,
                            searchList,
                            paramList,
                            products,
                            lowPrice,
                            askPriceNum,
                        } = data;

                        // 设置折叠的高度
                        // this.typeListHeight = this.getTypeHeight(searchList)

                        // 设置是否3大类
                        this.isTruck = isThreeMains
                        
                        // 赋值configData
                        this.configData = data

                        //标题
                        this.titleName = name

                        // 筛选列表数据
                        this.filterTypeList = searchList

                        // 更新seriesInfo
                        this.seriesInfo = seriesInfo

                        // 设置对比数量
                        this.compareNumber = products.length

                        //发送GA
                        this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-子类车系配置页',this.titleName)


                        //赋值对比数据
                        storage.getItem('compareData',compareData => {
                            let data = {};
                            //车系id
                            let seriesId = this.seriesInfo.F_SubCategoryId;

                            if(compareData.result == 'success'){
                                data = JSON.parse(compareData.data);
                            }
                            data[seriesId] = [];
                            //循环车型信息，存储车型id
                            this.configData.products.forEach(productId => {
                                data[seriesId].push(productId.F_ProductId);
                            });

                            this.compareData = data[seriesId];

                            storage.setItem('compareData',JSON.stringify(data),ele => {
                                //获取对比信息

                                //对比信息数据
                                this.compare = data;

                                //请求地址
                                let ajaxUrl;
                                //如果有车型id
                                if (data[this.seriesInfo.F_SubCategoryId].length) {
                                    //车型id   默认是第一个
                                    this.ProductId = data[this.seriesInfo.F_SubCategoryId][0];

                                    //如果缓存数据的length == 2  如果有新添加的车型 查看哪个是新添加的
                                    if (data[this.seriesInfo.F_SubCategoryId].length == 2) {
                                        this.ProductId = data[this.seriesInfo.F_SubCategoryId];
                                        //获取缓存  查看有没有新添加的车型
                                        storage.getItem('compareNumber', compareNumber => {
                                            if (compareNumber.result == 'success') {
                                                if (compareNumber.data == 0) {
                                                    this.ProductId = data[this.seriesInfo.F_SubCategoryId][1];
                                                }
                                            }
                                        })
                                    }
                                    ajaxUrl = this.ajaxUrl() + '/index.php?r=weex/series/filtrate&subId=' + this.seriesInfo.F_SubCategoryId + '&productId=' + data[this.seriesInfo.F_SubCategoryId][0] + '&seriesId=' + this.seriesInfo.F_SeriesId + '&brandId=' + this.seriesInfo.F_BrandId
                                } else {
                                    ajaxUrl = this.ajaxUrl() + '/index.php?r=weex/series/filtrate&subId=' + this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&brandId=' + this.seriesInfo.F_BrandId
                                }
                                //获取车系id
                                this.getData(ajaxUrl, res => {
                                    if (res.ok) {
                                        this.listInfo = res.data;
                                        //品牌推荐列表
                                        this.recommendList = res.data.recommend;

                                        //品牌列表
                                        this.brandList = res.data.brands;
                                        //nav导航
                                        this.indexNav = res.data.brandsKey;

                                        //如果没有热门车型列表，默认进去品牌选项
                                        if (!this.listInfo.hot) {
                                            this.selected = 1;
                                            // console.log(this.selected)
                                        }
                                        // console.log(this.listInfo)
                                    }
                                })

                                if (this.configData.products.length === 1) {
                                    this.configData.products.push({
                                        F_BigPrice: 'kong',
                                        F_Price: 'kong',
                                    })
                                }
                            })
                        })

                    }
                    this.hideLoading()
                })
            },
            // 计算属性列表的高度
            // getTypeHeight (typeList = [null]) {
            //     return String(16 + Math.ceil( typeList.length / 3 ) * 84)
            // },
            // 切换（show/hide） 车型筛选
            toggleModelFilter () {
                if (!this.scrollLock) return false
                this.hideModelFilter = !this.hideModelFilter
                // if (!this.animationLock || !this.scrollLock) return false
                // this.animationLock = false
                // const height = this.hideModelFilter ? this.typeListHeight : '0'
                // animation.transition(this.$refs.filterTypeWrapper, {
                //     styles: {
                //         height: height,
                //     },
                //     duration: 300, //ms
                //     timingFunction: 'ease-out',
                //     needLayout: true, // 改变高度要开启布局模式
                //     delay: 0 //ms
                // }, () => {
                //     this.hideModelFilter = !this.hideModelFilter
                //     this.animationLock = true
                // })
            },
            // 子类弹层显示隐藏切换
            subClassChange () {
                this.showSidebar = !this.showSidebar
            },
            // 显示车型筛选侧边栏
            showFilterSidebar (fid, index) {
                // 这里用不到fid fid为undefined
                let data = this.configData
                // 设置筛选类型的index
                this.typeIndex = index
                this.sidebarData = data.searchList[index]
                
                // 子类弹层显示
                this.subClassChange()
            },
            // 弹层里选择了某个属性
            selectModelType (data, index) {
                if (data.unlimited) {
                    // 不限
                    this.filterTypeList[index].name = data.type
                    this.filterTypeList[index].selected = 0

                    this.paramsList.forEach((item, paramIndex) => {
                        if (item.index === index) {
                            // 点击不限的时候 删除这个分类的参数
                            this.paramsList.splice(paramIndex, 1)
                        }
                    })
                } else {
                    // this.filterTypeList[index].name = `${data.value}${data.unit}`
                    this.filterTypeList[index].name = data.name
                    this.filterTypeList[index].selected = 1
                    
                    let hasThis = false,
                        id = encodeURIComponent(data.param);
                    this.paramsList.forEach(item => {
                        // 有相关对象之间修改
                        if (item.index === index) {
                            item.id = id
                            hasThis = true
                        }
                    })
                    // 无相关对象新加一个
                    !hasThis && this.paramsList.push({
                        id: id,
                        index: index,
                    })
                }
                console.log(data)
                this.getSeriesData()
                this.subClassChange()
            },
            //清除数据
            clear(index){
                this.configData.products[index].F_ProductName = ''

                //清除厂商指导价 && 本地最低报价
                this.configData.lowPrice[index].F_BigPrice = 'kong'
                this.configData.products[index].F_Price = 'kong'

                this.configData.paramList[index].forEach((res, number) => {
                    res.list.forEach(result => {
                       result.value = ''
                       result.unit = ''
                    })
                })

                //清除缓存
                storage.getItem('compareData',ele => {
                    if(ele.result == 'success'){
                        let data = JSON.parse(ele.data);
                        if(data[this.seriesInfo.F_SubCategoryId]){
                            if(data[this.seriesInfo.F_SubCategoryId][index]){
                                data[this.seriesInfo.F_SubCategoryId].splice(index,1)
                            }else{
                                data[this.seriesInfo.F_SubCategoryId].splice(index-1,1)
                            }

                            //更新存储的数据
                            this.compareData = data[this.seriesInfo.F_SubCategoryId]

                            storage.setItem('compareData',JSON.stringify(data),setCompareData => {
                                if(setCompareData.result == 'success'){
                                    if(data[this.seriesInfo.F_SubCategoryId].length){
                                        this.selectedProductId = data[this.seriesInfo.F_SubCategoryId][0]
                                    }else{
                                        this.selectedProductId = ''
                                    }
                                }
                            })
                        }
                    }
                })

                //更新对比数量
                this.compareNumber--
            },
            //是否显示分类内容弹层
            classifyShow(){
                this.classifyPop = !this.classifyPop
            },
            //锚点效果
            anchor(index){
                let ele;
                if(index == '车型信息'){
                    ele = this.$refs[index]
                }else{
                    ele = this.$refs[index][0]
                }

                dom.scrollToElement(ele)
                this.classifyPop = false
            },
            //询底价
            goFooterPirce(proInfo){
//                this.GA(0,proInfo.F_ProductId)
                this.eventGa(weex.config.deviceId,'点击询底价按钮','产品库-子类车系配置页','询价按钮')
                storage.setItem('priceProductId',proInfo.F_ProductId,ele => {
                    if(ele.result == 'success'){
                        this.goWeexUrl('footerPrice.weex.js')
                    }
                })
            },
            //标题吸顶
            scroll(event){
                //如果分类锚点弹层显示 && 隐藏
                if(this.classifyPop){
                    this.classifyPop = false;
                }
                // 筛选条件展开时候 用户查看对比信息要收起它
                if (!this.hideModelFilter) {
                    this.toggleModelFilter()
                }
                // 自释放滚动锁
                this.autoOpenScrollLock()
            },
            //显示选择车系列表弹层 || 隐藏选择车系列表弹层
            addSeriesPop(){
                // 隐藏分类弹层
                this.classifyPop = false
                //显示隐藏选择车系列表
                this.addSeriesShow = !this.addSeriesShow;


                //重新给选中车型赋值
                if(this.compareData.length){
                    this.selectedProductId = this.compareData[0];
                }
            },
            //显示选择车型列表
            goSelectProduct(){
                this.selectProductPop = !this.selectProductPop;
            },
            // 重置筛选相关的数据
            resetFilterData () {
                this.filterTypeList.forEach(item => {
                    // 恢复原始分类未选中状态
                    item.selected = 0
                    // 恢复原始分类名字
                    item.name = item.originName
                    // 侧边栏相关数据重置
                    item.list.forEach(_item => {
                        // 选中不限 其余不选中
                        _item.selected = _item.unlimited ? 1 : 0
                        // 解除所有禁用
                        _item.is_disable = 0
                    })
                })
                // 清空筛选数据辅助数组
                this.paramsList = []
            },
            //选择车型
            selectModel(ele){
                // 回到顶部
                this.backTop()
                // 重置筛选相关的数据
                this.resetFilterData()
                // 折叠筛选条件
                this.hideModelFilter = true
                //查看对比缓存
                storage.getItem('compareData',compareData => {
                    if(compareData.result == 'success'){
                        //获取存储的是第几个
                        storage.getItem('compareNumber',compareNumber => {
                            if(compareNumber.result == 'success'){
                                let number = compareNumber.data;
                                let data = JSON.parse(compareData.data);
                                let proId = '';
                                if(data[this.seriesInfo.F_SubCategoryId] && data[this.seriesInfo.F_SubCategoryId].length){
                                    if(number == 1){
                                        proId = data[this.seriesInfo.F_SubCategoryId][0] + '_' + ele.F_ProductId;
                                        data[this.seriesInfo.F_SubCategoryId].push(ele.F_ProductId)
                                    }else{
                                        proId = ele.F_ProductId + '_' + data[this.seriesInfo.F_SubCategoryId][0];
                                        data[this.seriesInfo.F_SubCategoryId].unshift(ele.F_ProductId)
                                    }
                                    // console.log(data[this.seriesInfo.F_SubCategoryId])
                                }else{
                                    proId = ele.F_ProductId
                                    data[this.seriesInfo.F_SubCategoryId].push(ele.F_ProductId)
                                }
                                //更新存储的数据
                                this.compareData = data[this.seriesInfo.F_SubCategoryId];

                                //再次存储对比数据
                                storage.setItem('compareData',JSON.stringify(data),setCompareData => {
                                    if(setCompareData.result == 'success'){
                                        //请求对比数据
                                        this.getData(this.ajaxUrl() + '/index.php?r=weex/product/contrast&proId=' + proId,productInfo => {
                                            if (productInfo.ok) {
                                                productInfo.data.data.forEach((list, index) => {
                                                    this.$set(this.configData.paramList, index, list.paramList)
                                                    this.$set(this.configData.products, index, list.proInfo)
                                                    this.$set(this.configData.lowPrice, index, list.lowPrice)
                                                })

                                                //对比的数量
                                                this.compareNumber = productInfo.data.data.length;

                                                //增加对比pv
                                                if(productInfo.data.data.length == 2){
                                                    //发送PV
                                                    storage.getItem('p4',p4 => {
                                                        if(p4.result == 'success'){
                                                            this.p4 = p4.data;
                                                            storage.getItem('p5',p5 => {
                                                                if(p5.result == 'success'){
                                                                    this.p5 = p5.data;
                                                                    this.collect({
                                                                        'p3':p4.data,
                                                                        'p4':4,
                                                                        'p5':encodeURIComponent(productInfo.data.data[0].proInfo.F_SeriesId + '|' + productInfo.data.data[0].proInfo.F_ProductId),
                                                                        'p6':productInfo.data.data[0].proInfo.F_BrandId + '_' + productInfo.data.data[0].proInfo.F_CateId + '_' + productInfo.data.data[0].proInfo.F_SubCategoryId,
                                                                        'p7':encodeURIComponent(productInfo.data.data[1].proInfo.F_SeriesId + '|' + productInfo.data.data[1].proInfo.F_ProductId)
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }

                                                //存储对比记录对比记录
                                                storage.getItem('compare_history',history => {
                                                    let data = [];
                                                    if(history.result == 'success'){
                                                        data = JSON.parse(history.data);
                                                        this.configData.products.forEach(id => {
                                                            let has = true;
                                                            data.forEach((res,index) => {
                                                                if(res.F_ProductId == id.F_ProductId){
                                                                    has = false;
                                                                }
                                                            });
                                                            if(has){
                                                                data.push(id)
                                                            }
                                                        })
                                                    }else{
                                                        this.configData.products.forEach(id => {
                                                            data.push(id)
                                                        });
                                                    }
                                                    //再次存储
                                                    storage.setItem('compare_history',JSON.stringify(data),compareHistory => {
                                                        this.addSeriesShow = false;
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })

                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .filter-type-wrapper {
        background-color: #fff;
    }
    .model-filter {
        height: 80px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: #FAFAFA;
        border-bottom-width: 20px;
        border-bottom-style: solid;
        border-bottom-color: #f5f5f5;
    }
    .model-filter-text {
        font-size: 24px;
        color: #333;
    }
    .model-filter-icon {
        margin-left: 10px;
        width: 30px;
        height: 18px;
    }
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .config{
        flex:1;
        padding-bottom:100px;
    }
    .classify{
        position:fixed;
        right:0;
        bottom:270px;
        width: 140px;
        height: 70px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 35px;
        border-bottom-left-radius: 35px;
        background-color: rgba(0,0,0,.8);
    }
    .classify-icon{
        color:#fff;
        font-size:20px;
    }
    .classify-text{
        color:#fff;
        font-size:28px;
        margin-left:10px;
    }
    .classify-content{
        position: fixed;
        right:170px;
        bottom: 270px;
        width: 420px;
        flex-wrap: wrap;
        flex-direction: row;
        background-color: rgba(0,0,0,.8);
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .classify-info{
        width:210px;
        height:80px;
        justify-content: center;
        align-items: center;
    }
    .classify-info-text{
        color:#fff;
        font-size:28px;
    }
    /*选项*/
    .option-list{

    }
    .product-name-warpper {
        border-bottom-width:20px;
        border-bottom-style:solid;
        border-bottom-color:#f5f5f5;
    }
    .title{
        height:90px;
        justify-content: center;
        padding-left:20px;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
    }
    .title-text{
        font-size:32px;
        color:#333;
    }
    .options{
        flex-direction: row;
        flex-wrap: wrap;
        word-wrap: break-word;
        word-break: break-all;
        align-items: stretch;

        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
    }
    .column-line {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px; 
        background-color: #eee;
    }
    .column-line-right {
        right: 285px;
    }
    .column-line-left {
        right: 570px;
    }
    .caption-placeholder {
        flex: 1;
    }
    .caption {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 180px; 
        background-color: #f9f9f9;
    }
    .caption-text{
        color:#666;
        font-size:24px;
        padding-top:40px;
        text-align:center;
    }
    .content{
        /*flex: 1;*/
        width:285px;
        /*min-height:80px;*/
        /*height:100%;*/
         padding-top: 33px;
        padding-bottom:32px;
        padding-right: 10px;
        padding-left: 10px;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
    .content-text{
        font-size: 28px;
        color:#333;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        overflow: hidden;
        flex-wrap: wrap;
        word-wrap: break-word;
        word-break: break-all;
    }
    .content-empty-text{
        font-size:28px;
        color:#fff;
    }
    .footer-price{
        padding-top:31px;
        flex-direction:row;
    }
    .footer-price-text{
        color:#f60;
        font-size:24px;
        margin-left:10px;
        padding-top:3px;
        padding-bottom:3px;
        padding-left:5px;
        padding-right:5px;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#f60;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#f60;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#f60;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#f60;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        border-bottom-left-radius:4px;
        border-bottom-right-radius:4px;
    }
    .blues{color:#586c94;}
</style>
