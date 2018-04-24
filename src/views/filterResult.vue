<template>
    <div class="filter-result">
        <div v-if="iosTop" class="ios-top"></div>
        <list @scroll="scroll" loadmoreoffset="88" offset-accuracy="40" ref="list" @loadmore="loadmore">
            <header ref="header">
                <!--页面标题-->
                <title :titleName="info.h1" :reset="true" @resetFilter="resetFilter"></title>
            </header>
            <!-- 筛选类型 -->
            <cell class="filter-type" v-if="showType">
                <div class="filter-type-container" :style="{ height: filterTypeHeight + 'px' }">
                    <filter-type :list="info.paramList" @showSidebar="showSidebar"></filter-type>
                </div>
                <div class="show-more-type" @click="showMoreTypeChange" v-if="heightMax > heightMin">
                    <div class="show-more-type-text-wraper">
                        <text class="show-more-type-text">{{showMoreType}}</text>
                    </div>
                    <image class="show-more-type-icon" :src="showMoreTypeSrc"></image>
                </div>
            </cell>
            <!-- 筛选结果 -->
            <cell class="result">
                <div class="result-header">
                    <!-- 共有n个车系 -->
                    <div class="result-title">
                        <text class="result-title-text">共有</text>
                        <text class="result-title-text-count">{{info.total}}</text>
                        <text class="result-title-text">{{resultHasSeries ? '个车系' : '款'}}</text>
                    </div>
                    <!-- 热度 价格（最新） -->
                    <div class="filter-operation">
                        <div class="hot-filter" @click="setOrder(0)">
                            <text :class="['filter-text', order ? '' : 'filter-active']">热度</text>
                            <image class="filter-image" :src="order ? 'https://s.kcimg.cn/wap/images/detail/productApp/hot-default.png':'https://s.kcimg.cn/wap/images/detail/productApp/hot-down.png'"></image>
                        </div>
                        <div class="price-filter" @click="setOrder(1)">
                            <text :class="['filter-text', order ? 'filter-active' : '', resultHasSeries ? '' : 'filter-text-last']">{{resultHasSeries ? '价格' : '最新'}}</text>
                            <image v-if="!order && resultHasSeries" class="filter-image" src="https://s.kcimg.cn/wap/images/detail/productApp/power-default.png"></image>
                            <image v-if="order === 5 && resultHasSeries" class="filter-image" src="https://s.kcimg.cn/wap/images/detail/productApp/power-down.png"></image>
                            <image v-if="order === 6 && resultHasSeries" class="filter-image" src="https://s.kcimg.cn/wap/images/detail/productApp/power-up.png"></image>
                        </div>
                    </div>
                </div>
                <div class="result-list">
                    <div :class="['series-item', index ? '' : 'item-first' ]" v-for="(result, index) in info.seriesList" v-if="resultHasSeries" @click="getSeriesSiderbarData(result.subId, result.id)">
                        <image class="result-pictrue" :placeholder="`${DefaultImgPath}placeholder.jpg`" :src="result.src" resize="cover"></image>
                        <div class="result-cont">
                            <div class="result-cont-title">
                                <text class="result-cont-title-text">{{result.name}}</text>
                            </div>
                            <div class="result-cont-price">
                                <text class="result-cont-price-text" v-if="result.price.min && result.price.min === result.price.max">{{result.price.min}}万元</text>
                                <text class="result-cont-price-text" v-else-if="result.price.min">{{result.price.min}}~{{result.price.max}}万元</text>
                                <text class="result-cont-price-text" v-else>暂无报价</text>
                            </div>
                            <div class="result-cont-match">
                                <text class="result-cont-match-text">共</text>
                                <text class="result-cont-match-text-count">{{result.productTotal}}</text>
                                <text class="result-cont-match-text">款车型符合条件</text>
                            </div>
                        </div>
                        <image class="right-icon" src="https://s.kcimg.cn/wap/images/detail/productApp/go-grey.png"></image>
                    </div>

                    <div :class="['series-item', index ? '' : 'item-first' ]" v-for="(result, index) in info.productList" v-if="!resultHasSeries" @click="goModelPage(result.id, result.sId)">
                        <image class="result-pictrue" :placeholder="`${DefaultImgPath}placeholder.jpg`" :src="result.src" resize="cover"></image>
                        <div class="result-cont">
                            <div class="result-cont-title model-title">
                                <text class="result-cont-title-text model-title-text">{{result.name}}</text>
                            </div>
                            <div class="result-cont-price model-price">
                                <text :class="['model-price-text', result.price === '暂无报价' ? 'model-price-text-without' : '']">{{result.price}}</text>
                            </div>
                        </div>
                        <image class="right-icon" src="https://s.kcimg.cn/wap/images/detail/productApp/go-grey.png"></image>
                    </div>
                </div>
                <div class="loading" v-if="loading">
                    <my-loading></my-loading>
                </div>
            </cell>
        </list>
        <!-- 侧边栏 -->
        <sidebar
        v-if="sidebar"
        @subClassChange="subClassChange"
        @selectType="selectType"
        :index="currentTypeIndex"
        :list="sidebarData"
        :isIos="iosTop"
        page="filterResult"></sidebar>
        <!-- 品牌选择侧边栏 -->
        <brand-list-sidebar
        @brandSidebarChange="brandSidebarChange"
        @selectType="selectType"
        :show="brandSidebar"
        :data="brandListSidebarData"
        :brandUnlimit="brandUnlimit"></brand-list-sidebar>
        <!-- 车系侧边栏 -->
        <series-sidebar
        v-if="seriesSidebar"
        @resetOrder="resetOrder"
        @seriesSidebarChange="seriesSidebarChange"
        @updateOrder="updateOrder"
        :orderIcon="seriesSidebarOrderIcon"
        :data="seriesSiderbarData"
        :isIos="iosTop"></series-sidebar>
        <!-- 回到顶部 -->
        <go-top @goTop="goTop" :show="showGoTop"></go-top>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import myLoading from '../components/load.vue'
    import filterType from '../components/filterResult/filterType.vue'
    import sidebar from '../components/filter/sidebar.vue'
    import brandListSidebar from '../components/filterResult/brandListSidebar.vue'
    import seriesSidebar from '../components/filterResult/seriesSidebar.vue'
    import goTop from '../components/goTop.vue'

    // const stream = weex.requireModule('stream')
    // const modal = weex.requireModule('modal')
    // const thaw = weex.requireModule('THAW')
    const storage = weex.requireModule('storage')
    const dom = weex.requireModule('dom')
    const globalEvent = weex.requireModule('globalEvent')
    const animation = weex.requireModule('animation')
    export default {
		components: {
            title,
            filterType,
            sidebar,
            brandListSidebar,
            myLoading,
            seriesSidebar,
            goTop,
        },
        data () {
            return {
                // 页面数据
                info: {
                    paramList: [
                        // {
                        //     fId: "7",
                        //     name: "吨位级别"
                        // },
                    ],
                    seriesList: [
                        // {
                        //     name: "一汽解放J6P牵引车",
                        //     src: "https://img4.kcimg.cn/imgser/0/66/66645.jpg!180",
                        //     price: {
                        //         min: 27,
                        //         max: "38.2"
                        //     },
                        //     productTotal: "58"
                        // },
                    ],
                    productList: [
                        // {
                        //     img: "",
                        //     info: {
                        //         F_PriceUnit: '万元',
                        //         F_ProductName: "跃进 超越 125马力 4X2 冷藏车(南汽-畅达牌)(NJ5041XLCZFDCMZ)",
                        //         F_Price: '0.00'
                        //     }
                        // }
                    ]
                },
                //苹果头部白条
                iosTop: false,
                // 属性选择是否显示
                showType: true,
                // 子类弹层是否显示
                sidebar: false,
                // 品牌弹层是否显示
                brandSidebar: false,
                // 子类弹层数据
                sidebarData: {
                    // fId: "7",
                    // name: "吨位级别",
                    // paramId: null,
                    // isIndex: true,
                    // list: [
                    //     {
                    //         name: '微卡',
                    //         type: '微卡',
                    //         F_SearchId: "37",
                    //         F_SearchName: "微卡",
                    //         F_SearchValue: "微卡",
                    //         FormerSearchId: "28",
                    //         url: "/p728/",
                    //         is_disable: 1,
                    //         selected: 0,
                    //         paramIntroduction: ""
                    //     },
                    // ],
                    // default_url: "/",
                    // noLimit: true
                },
                // 品牌列表子类弹层数据
                brandListSidebarData: [],
                // 品牌选中的
                brandUnlimit: true,
                // 筛选类型的index
                currentTypeIndex: 0,
                // 大类id
                cateId: '',
                // 子类id
                subCateId: '',
                // 品牌id
                brandId: '',
                // 筛选条件展开折叠提示文字
                showMoreType: '展开更多筛选条件',
                // 筛选条件展开折叠提示图片
                showMoreTypeSrc: 'https://s.kcimg.cn/wap/images/detail/productApp/more.png',
                // 筛选折叠部分最小高度
                heightMin: 184,
                // 筛选折叠部分最大高度
                heightMax: 376,
                // 筛选折叠部分高度
                filterTypeHeight: 184,
                // 品牌以外的参数
                notBrandParams: [],
                // 选中的品牌id
                brandId: '',
                // 排序
                order: '',
                // 结果有车系
                resultHasSeries: true,
                // 当前页码
                currentPage: 1,
                // 显示loading
                loading: false,
                // 请求锁
                requestLock: true,
                // 是否需要loading
                needLoading: false,
                // 车系侧边栏数据
                seriesSiderbarData: {},
                // 是否显示车系弹层（侧边栏）
                seriesSidebar: false,
                // 显示去顶部
                showGoTop: false,
                // 是否有用途类别
                hasPurpose: false,
                // 是否有吨位级别
                hasTonnage: false,
                //统计
                // el: '产品库-子类车系综述页',
                // loadmore的节流控制参数 default false 不节流
                throttle: false,
                // 缓存跳转车型页用的cateInfo对象里面的参数
                cateInfo: {},
                // 缓存请求车系侧边栏的排序的参数
                lastSidebarOrderParams: {},
                // 车系侧边栏排序的图片名
                seriesSidebarOrderIcon: 'power-default.png'
            }
        },
        methods:{
            // 车系侧边栏reset排序
            resetOrder () {
                this.seriesSidebarOrderIcon = 'power-default.png'
            },
            // 车系侧边栏更新排序方式
            updateOrder (order, icon) {
                this.seriesSidebarOrderIcon = icon
                this.getSeriesSiderbarData(this.lastSidebarOrderParams.subCateId, this.lastSidebarOrderParams.seriesId, order)
                // 发送ga统计: 车系弹层点击马力
                this.eventGa(weex.config.deviceId, '产品库-筛选结果页', '点击马力', '右侧弹层')
            },
            // 获取筛选结果页面数据
            getFilterResultData () {
                // 读取storage 取出请求参数
                storage.getItem('filterResultId', e => {
                    if (e.result === 'success') {
                        let data = JSON.parse(e.data)
                        switch (data.type) {
                            case 'subCate':
                                // 是子类筛选 设置默认子类id
                                this.subCateId = data.id
                                if (data.num) {
                                    this.notBrandParams.push({
                                        'id': data.num,
                                        //此时用不到index 赋值为-1 仅仅供requestInitApi使用id
                                        'index': -1
                                    })
                                }
                                break;
                            case 'brand':
                                // 品牌筛选 设置默认品牌
                                this.brandId = data.id
                                break;
                            case 'price':
                                // 是价格筛选 添加进非品牌参数数组
                                this.notBrandParams.push({
                                    'id': data.id,
                                    //此时用不到index 赋值为-1 仅仅供requestInitApi使用id
                                    'index': -1
                                })
                                break;
                        }
                        this.requestInitApi()
                    }
                })
            },
            // 请求初次加载页面的数据（或者点击用途类型）
            requestInitApi () {
                this.showLoading()
                // 根据获取筛选结果页面数据
                this.getData(`${this.ajaxUrl()}/index.php?r=weex/list&subCateId=${this.subCateId}&brandId=${this.brandId}&paramId=${this.getParamId()}`, res => {
                    if (res.ok) {
                        // 定义映射data中的参数列表、品牌名、参数名、车系列表、子类id
                        let { pageTotal, cateInfo, paramList, brandName, paramName, seriesList, subCateId } = res.data
                        // 缓存跳转车型页用的cateInfo对象里面的参数
                        this.cateInfo = cateInfo
                        // 设置是否需要loading
                        this.needLoading = this.currentPage === pageTotal ? false : true
                        let brandIndex = 0
                        // 设置大类id 供大数据统计使用
                        this.cateId = cateInfo.F_CateId ? cateInfo.F_CateId : ''
                        if (paramList && paramList.length) {
                            // 如果有selName时候表示是二次请求的requestInitApi 此时需要把之前选的其他参数高亮
                            paramList.forEach(item => {
                                // 如果有吨位级别的 品牌插入的index为0
                                if (item.name === '吨位级别') {
                                    brandIndex = 1
                                    this.hasTonnage = true
                                }
                                if (item.selName) {
                                    item.name = item.selName
                                    item.selected = true
                                }
                            })
                        } else {
                            // 没有属性选择时 不渲染属性选择区域
                            this.showType = false
                        }
                        // 判断是否是品牌筛选
                        if (this.brandId) {
                            paramList.splice(brandIndex, 0, {'name': brandName, 'selected': true})
                        } else {
                            paramList.splice(brandIndex, 0, {'name': '品牌'})
                        }
                        // 如果是价格筛选要设置价格
                        if (this.notBrandParams[0] && this.notBrandParams[0].index < 0) {
                            paramList.forEach((item, index) => {
                                if (item.name === "价格" && paramName) {
                                    item.name = paramName
                                    item.selected = true
                                }
                            })
                        }
                        // 没有子类id时候插用途类别到第一个
                        if (!subCateId) {
                            paramList.splice(0, 0, {'name': '用途类别'})
                            this.hasPurpose = true
                        } else {
                            this.hasPurpose = false
                        }
                        this.resultHasSeries = seriesList.length ? true : false
                        // 渲染时才计算高度
                        this.showType && this.computeTypeHeight(paramList)
                        // 当点击用途类别的时候可能导致原本为展开提示没有发生变化
                        if (this.filterTypeHeight > this.heightMin) {
                            this.showMoreType = '收起'
                            this.showMoreTypeSrc = 'https://s.kcimg.cn/wap/images/detail/productApp/packup.png'
                        }
                        this.info = res.data
                        // 发送GA统计
                        this.sendGA()
                        // 发送大数据统计
                        this.sendBigData()
                    }
                    // 关闭大loading
                    this.hideLoading()
                })
            },
            // 计算选择属性部分的高度
            computeTypeHeight (paramList = []) {
                const length = paramList.length
                let isShowAll = false
                // 如果第三行开始有选中的属性 要展示全部属性
                length && paramList.forEach((item, index) => {
                    if (item.selected & index > 5) {
                        isShowAll = true
                    }
                })
                this.heightMax = 16 + Math.ceil( length / 3 ) * 84
                // 显示全部时候高度等于最大高度
                if (isShowAll) {
                    this.filterTypeHeight = this.heightMax
                // 显示两行时候 如果高度是一行 同步最小高度为一行
                } else if (this.heightMax < this.heightMin) {
                    this.filterTypeHeight = this.heightMax
                    this.heightMin = this.heightMax
                }
            },
            // 子类弹层显示隐藏切换
            subClassChange () {
                this.sidebar = !this.sidebar
            },
            // 品牌弹层显示隐藏切换
            brandSidebarChange () {
                this.brandSidebar = !this.brandSidebar
            },
            // 车系弹层显示隐藏切换
            seriesSidebarChange () {
                this.seriesSidebar = !this.seriesSidebar
            },
            // 显示子类弹层
            showSidebar (fid, index) {
                // 用途类别
                if (this.hasPurpose && !index) {
                    // 请求用途类别数据
                    this.getData(`${this.ajaxUrl()}/index.php?r=weex/list/cate&brandId=${this.brandId}&paramId=${this.getParamId()}`, res => {
                        if (res.ok) {
                            let list = res.data
                            // 添加不限选项
                            list.unshift({
                                'name': '不限',
                                'type': '用途类别',
                                'selected': false,
                                'unlimited': true
                            })
                            // 之前选中的选项设置为selected
                            list.forEach((item, _index) => {
                                item.type = _index ? item.name : item.type
                                item.selected = item.type === this.info.paramList[index].name ? true : false
                            })
                            this.sidebarData = {
                                list: list,
                                name: '用途类别'
                            }
                            // 更新当前类别index
                            this.currentTypeIndex = index
                            this.subClassChange()
                        }
                    })

                    return
                }
                // 品牌index
                let brandIndex = 0
                // 用途>吨位>品牌 所以碰见高优先级的 brandIndex++
                this.hasTonnage && brandIndex++
                this.hasPurpose && brandIndex++

                if (index === brandIndex) {
                    // 请求品牌子类数据
                    this.getData(`${this.ajaxUrl()}/index.php?r=weex/list/brand-filter&subCateId=${this.subCateId}&paramId=${this.getParamId()}`, res => {
                        if (res.ok) {
                            // 默认品牌是不限的
                            this.brandUnlimit = true
                            // 之前选中的选项设置为selected
                            res.data.brandList.forEach(brands => {
                                brands.forEach(brand => {
                                    brand.type = brand.name
                                    // 有和选择一样的设置为非不限
                                    if (brand.type === this.info.paramList[index].name) {
                                        brand.selected = true
                                        this.brandUnlimit = false
                                    }
                                })
                            })
                            this.brandListSidebarData = res.data
                            // 更新当前类别index
                            this.currentTypeIndex = index
                            this.brandSidebarChange()
                        }
                    })
                } else {
                    // 请求其他子类数据
                    this.getData(`${this.ajaxUrl()}/index.php?r=weex/list/param-filter&subCateId=${this.subCateId}&fid=${fid}&paramId=${this.getParamId()}&brandId=${this.brandId}`, res => {
                        if (res.ok) {
                            let { params } = res.data
                            // 添加不限选项
                            params.list.unshift({
                                'name': '不限',
                                'type': params.name,
                                'selected': false,
                                'unlimited': true
                            })
                            // 之前选中的选项设置为selected
                            params.list.forEach((item, _index) => {
                                item.type = _index ? item.name : item.type
                                item.selected = item.type === this.info.paramList[index].name ? true : false
                            })
                            this.sidebarData = params
                            // 更新当前类别index
                            this.currentTypeIndex = index
                            this.subClassChange()
                        }
                    })
                }
            },
            // 重选
            resetFilter () {
                this.goBack()
            },
            // 处理侧边栏选择类别
            selectType (data, index, isBrand = false) {
                // 品牌默认index是0 所以先矫正品牌的index
                if (isBrand) {
                    // 用途>吨位>品牌 所以碰见高优先级的 brandIndex++
                    this.hasTonnage && index++
                    this.hasPurpose && index++
                }
                // 是否请求init接口
                let requestInitApi = false
                // 如果点击的是第一个 判断是否是用途类别
                if (!index) {
                    requestInitApi = this.hasPurpose ? true : false
                }

                // 不限
                if (data.unlimited) {
                    this.info.paramList[index].selected = false
                } else {
                    this.info.paramList[index].selected = true
                }
                this.info.paramList[index].name = data.type

                // 选择品牌
                if (isBrand) {
                    this.brandId = data.id
                } else if (this.hasPurpose && !index) {
                    // 有用途类别的 且点击了用途类别 选择时候要设置subCateId
                    this.subCateId = data.id
                } else {
                    // 其他类别 生成所需参数的数组
                    let notBrandParams = this.notBrandParams
                    let sameRecord = false
                    // 去掉同类别的记录
                    notBrandParams.forEach((item, _index) => {
                        item.index === index && notBrandParams.splice(_index, 1)
                        // 相同id后边不添加记录
                        if (item.id === data.id) sameRecord = true
                    })
                    // 非相同id添加记录
                    !sameRecord && notBrandParams.push({
                        'id': data.id,
                        'index': index
                    })
                }
                // 筛选条件发生变化时 排序初始化成热度
                this.order = ''
                if (requestInitApi) {
                    this.requestInitApi()
                } else {
                    this.updateData()
                }
            },
            // 更新筛选结果 非滚动加载的要重置this.currentPage = 1
            updateData (isLoadmore = false) {
                if (isLoadmore) {
                    this.currentPage++
                } else {
                    this.currentPage = 1
                }
                const url = `${this.ajaxUrl()}/index.php?r=weex/list&isList=1&subCateId=${this.subCateId}&paramId=${this.getParamId()}&brandId=${this.brandId}&order=${this.order}&page=${this.currentPage}`
                this.getData(url, res => {
                    if (res.ok) {
                        const { cateInfo, total, h1, seriesList, productList, pageTotal } = res.data
                        // 缓存跳转车型页用的cateInfo对象里面的参数
                        this.cateInfo = cateInfo
                        // 设置大类id 供大数据统计使用
                        this.cateId = cateInfo.F_CateId ? cateInfo.F_CateId : ''
                        this.info.total = total
                        this.info.h1 = h1
                        // 加载更多的进行数组拼接
                        if (isLoadmore) {
                            this.info.seriesList = [...this.info.seriesList, ...seriesList]
                            this.info.productList = [...this.info.productList, ...productList]
                        } else {
                            this.info.seriesList = seriesList
                            this.info.productList = productList
                            // 发送GA统计
                            this.sendGA()
                        }
                        this.needLoading = this.currentPage === pageTotal ? false : true
                        // 发送大数据统计
                        this.sendBigData()
                    }
                    this.requestLock = true
                    this.loading = false
                })
            },
            // 展开收起
            showMoreTypeChange () {
                if (this.showMoreType === '展开更多筛选条件') {
                    this.showMoreType = '收起'
                    this.showMoreTypeSrc = 'https://s.kcimg.cn/wap/images/detail/productApp/packup.png'
                    this.filterTypeHeight = this.heightMax
                } else {
                    this.showMoreType = '展开更多筛选条件'
                    this.showMoreTypeSrc = 'https://s.kcimg.cn/wap/images/detail/productApp/launch.png'
                    this.filterTypeHeight = this.heightMin
                }
                this.open = !this.open
            },
            // 设置排序参数
            setOrder (type = 0) {
                // this.order = {
                //  6: '价格从低到高',
                //  5: '价格从高到低',
                //  2: '最新 只有车型列表有(无车系结果时渲染车型列表)',
                //  '': '热度',
                // }
                if (type) {
                    // 有车系的 右侧是价格排序
                    if (this.resultHasSeries) {
                        this.order = this.order === 6 ? 5 : 6
                    } else {
                        this.order = 2
                    }
                } else {
                    this.order = ''
                }
                this.updateData()
            },
            // 获取车系弹层所需数据
            getSeriesSiderbarData (subCateId, seriesId, order = '') {
                const originalOrder = order
                if (!order) {
                    this.lastSidebarOrderParams = {subCateId, seriesId}
                }
                this.getData(`${this.ajaxUrl()}/index.php?r=weex/list/product&subId=${subCateId}&seriesId=${seriesId}&paramId=${this.getParamId()}&brandId=${this.brandId}&order=${order}`, res => {
                    if (res.ok) {
                        let priceScope = res.data.info.priceScope
                        for (let key in priceScope) {
                            priceScope[key] = Number(priceScope[key])
                        }
                        // 车系侧边栏的操作不能关闭弹层
                        originalOrder || this.seriesSidebarChange()
                        this.seriesSiderbarData = res.data
                        // 发送大数据统计: 车系弹层
                        this.sendBigData([
                            this.cateId || '',
                            subCateId || '',
                            this.brandId || '',
                            res.data.info.id || ''
                        ])
                    }
                })
            },
            /**
             * @return {string} 返回请求接口所用的paramId 例如：'111-4292-324'
             */
            getParamId () {
                return [...this.notBrandParams].map(x => x.id).join('-')
            },
            // 监听滚动距离（e.contentOffset.y）的大小 从而控制显示、隐藏goTop
            scroll (e) {
                const referenceValue = 1200
                const offsetY = Math.abs(Number(e.contentOffset.y))
                if (!this.showGoTop && offsetY > referenceValue) {
                    this.showGoTop = true
                }
                if (this.showGoTop && offsetY < referenceValue) {
                    this.showGoTop = false
                }
                if (!offsetY) return false
            },
            loadmore () {
                // 重置loadmore
                this.$refs.list.resetLoadmore()
                if (this.throttle) {
                    return
                }
                this.throttle = true
                // 请求锁关闭时候不可以请求
                if (!this.needLoading || !this.requestLock) {
                    return
                }
                this.requestLock = false
                this.loading = true
                this.updateData(true)

                setTimeout(() => {
                    this.throttle = false
                }, 500)
            },
            // 回到顶部
            goTop () {
                dom.scrollToElement(this.$refs.header, { offset: 0 })
            },
            // 去车型页
            goModelPage (ProductId, seriesId) {
                const seriesInfo = Object.assign({
                    F_SubCategoryId: this.subCateId,
                    F_SeriesId: seriesId,
                }, this.cateInfo)
                storage.setItem('seriesInfo', JSON.stringify(seriesInfo), e => {
                    e.result === 'success' && storage.setItem('ProductId', ProductId, e => {
                        e.result === 'success' && this.goWeexUrl('model.weex.js')
                    })
                })
            },
            // 发送GA统计
            sendGA () {
                this.goUrlGa(weex.config.deviceId, 'product.m.360che.com', '产品库-筛选结果页', this.info.h1)
            },
            // 发送大数据统计
            sendBigData (seriesSiderbarData) {
                // p6=0：热度1：价格2：最新
                const orderMap = new Map([
                    ['', 0],
                    [6, 1],
                    [5, 1],
                    [2, 2],
                ])
                let param = {
                    p2: 1,
                    p3: 1,
                    p5: [...this.notBrandParams].map(x => x.id).join('_'),
                    p6: orderMap.get(this.order),
                }
                // 车系弹层
                if (seriesSiderbarData) {
                    param.p4 = seriesSiderbarData.join('_')
                    param.p3 = 2
                } else {
                    let [ big, sub, brand ] = ['', '', '']
                    if (this.cateId) big = this.cateId
                    if (this.subCateId) sub = this.subCateId
                    if (this.brandId) brand = this.brandId
                    param.p4 = [big, sub, brand].join('_')
                    param.f = this.currentPage
                }
                this.collect(param)
            },
        },
        created () {
            //前端监控
            this.weexLogger('筛选结果页')

            //获取筛选数据
            this.getFilterResultData()

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack", e => {
                this.goBack()
            })

            //如果是ios系统的话
            if(this.isIos()){
                //头部的高度
                this.iosTop = true
            }
        },
        mounted () {

        }
    }
</script>

<style scoped>
    .ios-top {
        height:40px;
        background-color: #fff;
    }
    .filter-result,.filter-type {
        background-color: #f5f5f5;
    }
    .filter-type-container {
        background-color: #fff;
        height: 184px;
        overflow: hidden;
        transition-property: height;
        transition-duration: 0.3s;
        transition-delay: 0s;
        transition-timing-function: ease-out;
    }
    .show-more-type {
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: rgb(229, 229, 229);
        height: 80px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }
    .show-more-type-text {
        font-size: 28px;
        color: #999;
    }
    .show-more-type-icon {
        width: 34px;
        height: 20px;
        margin-left: 6px;
    }
    .result-header {
        height: 80px;
        line-height: 80px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #e5e5e5;

    }
    .result-title {
        margin-left: 30px;
        flex-direction: row;
        align-items: center;
    }
    .result-title-text {
        font-size: 24px;
        color: #999999;
    }
    .result-title-text-count {
        font-size: 24px;
        color: #f60;
        margin-left: 6px;
        margin-right: 6px;
    }
    .filter-operation {
        margin-right: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 186px;
    }
    .price-filter, .hot-filter {
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
    .result {
        background-color: #fff;
        margin-top: 20px;
    }
    .result-list {
        padding-right: 30px;
        padding-left: 30px;
    }
    .series-item {
        height: 180px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: #e5e5e5;
        flex-direction: row;
        align-items: center;
    }
    .item-first {
        border-top-width: 0;
    }
    .result-pictrue {
        width: 180px;
        height: 120px;
        margin-right: 20px;
    }
    .result-cont {
        flex: 1;
        height: 120px;
    }
    .result-cont-title {
        height: 40px;
    }
    .result-cont-title-text {
        line-height: 40px;
        font-size: 32px;
        color: #333;
        lines: 1;
        text-overflow: ellipsis;
    }
    .result-cont-price {
        height: 40px;
        margin-top: 8px;
        margin-bottom: 8px;
    }
    .result-cont-price-text {
        line-height: 40px;
        font-size: 28px;
        color: #f60;
    }
    .model-price-text-without {
        color: #999;
    }
    .result-cont-match {
        height: 24px;
        flex-direction: row;
    }
    .result-cont-match-text {
        line-height: 24px;
        font-size: 24px;
        color: #999;
    }
    .result-cont-match-text-count {
        line-height: 24px;
        font-size: 24px;
        color: #151515;
        margin-left: 6px;
        margin-right: 6px;
    }
    .right-icon {
        width: 32px;
        height: 36px;
    }
    .loading {
        padding-top: 40px;
        padding-bottom: 40px;
    }
    .model-title {
        height: 80px;
    }
    .model-title-text {
        lines: 2;
        text-overflow: ellipsis;
    }
    .model-price {
        margin-top: 16px;
        height: 24px;
        margin-bottom: 0;
    }
    .model-price-text {
        line-height: 24px;
        font-size: 24px;
        color: #f60;
    }
    .filter-text-last {
        padding-right: 26px;
    }
</style>
