<template>
    <div class="condition">
        <div v-if="iosTop" class="ios-top"></div>
        <!--页面标题-->
        <title titleName="按工况"></title>
        <!-- 头部 -->
        <div class="header">
            <text class="header-text">{{info.title}}</text>
            <div class="reset-filter" @click="goBack">
                <image class="reset-filter-icon" :src="DefaultImgPath + 'condition-reset.png'"></image>
                <text class="reset-filter-text">重新筛选</text>
            </div>
        </div>
        <list @scroll="scroll" loadmoreoffset="88" offset-accuracy="40" ref="list" class="list" @loadmore="loadMore">
            <cell ref="header">
                <!-- 品牌筛选 -->
                <div class="brand">
                    <text class="brand-title">品牌筛选</text>
                    <div class="brand-list">
                        <div :class="['brand-item', brand.selected ? 'brand-item-selected' : '']" v-for="(brand, index) in info.brandHot" @click="selectBrand(brand.F_BrandId, index)">
                            <text :class="['brand-item-text', brand.selected ? 'brand-item-text-selected' : '']">{{brand.F_BrandName}}</text>
                        </div>
                        <div class="brand-item" @click="brandSidebarChange">
                            <text class="brand-item-text">更多品牌</text>
                        </div>
                    </div>
                </div>
            </cell>
            <cell>
                <div class="result-header">
                    <!-- 共有n款车型 -->
                    <div class="result-title">
                        <text class="result-title-text">共有</text>
                        <text class="result-title-text-count">{{info.totalCount}}</text>
                        <text class="result-title-text">款车型</text>
                    </div>
                    <!-- 热度 价格 -->
                    <div class="filter-operation">
                        <div class="hot-filter" @click="setOrder(0)">
                            <text :class="['filter-text', order === 1 ? 'filter-active' : '']">热度</text>
                            <image class="filter-image" :src="order === 1 ? DefaultImgPath + 'hot-down.png' : DefaultImgPath + 'hot-default.png'"></image>
                        </div>
                        <div class="price-filter" @click="setOrder(1)">
                            <text :class="['filter-text', order > 2 ? 'filter-active' : '']">价格</text>
                            <image class="filter-image" :src="priceIcon"></image>
                        </div>
                    </div>
                </div>
            </cell>
            <cell>
                <div class="model" v-for="(product, index) in info.productList" @click="$goModel(product)">
                    <div class="model-container">
                        <image class="model-pictrue" :placeholder="DefaultImgPath  + 'placeholder.jpg'" :src="product.imgSrc" resize="cover"></image>
                        <div class="model-name">
                            <text class="model-name-text">{{product.F_ProductName}}</text>
                        </div>
                    </div>
                    <div class="model-tags">
                        <div class="model-tags-wrapper" v-for="tagName in product.paramDetail">
                            <text class="model-tags-text">{{tagName}}</text>
                        </div>
                    </div>
                    <div class="model-price">
                        <text class="model-price-text">厂商指导价：</text>
                        <text class="model-price-content" v-if="product.F_Price !== '暂无报价'">{{product.F_Price}}</text>
                        <text class="model-price-text" v-if="product.F_Price !== '暂无报价'">万</text>
                        <text class="model-price-null" v-else>暂无报价</text>
                        <div class="footer-price" @click="$goFooterPrice(product.F_ProductId)">
                            <text class="footer-price-text">询底价</text>
                        </div>
                    </div>
                </div>
                <div class="loading" v-if="showLoadmore">
                    <my-loading></my-loading>
                </div>
            </cell>
        </list>
                
        <!-- 更多品牌侧边栏 -->
        <sidebar
        @brandSidebarChange="brandSidebarChange"
        @selectType="selectType"
        :data="brandListSidebarData"
        :brandUnlimit="brandUnlimit"
        :show="showSidebar"
        ></sidebar>
        <!-- 回到顶部 -->
        <go-top @goTop="goTopHandler" :show="showGoTop"></go-top>
    </div>
</template>

<script type="text/babel">
import title from '../components/title.vue'
import goTop from '../components/goTop.vue'
import sidebar from '../components/filterResult/brandListSidebar.vue'
import myLoading from '../components/load.vue'


// const stream = weex.requireModule('stream')
// const modal = weex.requireModule('modal')
// const thaw = weex.requireModule('THAW')
// const animation = weex.requireModule('animation')
const storage = weex.requireModule('storage')
const dom = weex.requireModule('dom')
const globalEvent = weex.requireModule('globalEvent')

export default {
    components: {
        title,
        goTop,
        sidebar,
        myLoading,
    },
    data() {
        return {
            // 页面数据
            //苹果头部白条
            iosTop: false,
            // 请求锁
            requestLock: true,
            // 显示去顶部
            showGoTop: false,
            // 按工况选车页面带过来的固定参数
            defaultParams: '',
            // 当前选择的品牌id
            brandId: '',
            // 排序方式
            order: 1,
            // 分页加载
            page: 0,
            // 页面数据
            info: {},
            // 是否显示分页加载loading
            showLoadmore: false,
            // 禁止分页加载
            forbiddenLoadmore: false,
            // 品牌侧边栏数据
            brandListSidebarData: [],
            // 是否显示品牌侧边栏
            showSidebar: false,
            // 品牌侧边栏是否选中不限
            brandUnlimit: true,
            // 接口返回一共有多少页
            pageCount: 0,
            //统计
            // el: '产品库-子类车系综述页',
        }
    },
    computed: {
        priceIcon: function() {
            let src = this.DefaultImgPath
            switch (this.order) {
                case 3:
                    src += 'power-down.png'
                    break;
                case 4:
                    src += 'power-up.png'
                    break;
                default:
                    src += 'power-default.png'
                    break;
            }
            return src
        }
    },
    methods: {
        // 设置排序参数
        setOrder(type = 0) {
            // this.order = {
            //  1: '热度',
            //  3: '价格降序',
            //  4: '价格升序',
            // }
            // 先升序后降序
            if (type) {
                this.order = this.order === 4 ? 3 : 4
            } else {
                this.order = 1
            }
            this.getResultData()
        },
        // 选择品牌
        selectBrand(brandId, index) {
            this.brandId = brandId
            let cpBrandHot = [...this.info.brandHot]
            cpBrandHot.map(x => x.selected = false)
            cpBrandHot[index].selected = true
            this.info.brandHot = cpBrandHot
            this.updateMoreBrandList({F_BrandId:brandId})
            this.getResultData()
        },
        // 选择更多品牌中的品牌
        selectType (data) {
            this.resetBrandList()
            this.brandId = data.F_BrandId ? data.F_BrandId : ''
            this.updateMoreBrandList(data)
            this.getResultData()
        },
        // 更新更多品牌列表内容
        updateMoreBrandList (data) {
            let brandListSidebarData = Object.assign({}, this.brandListSidebarData)
            brandListSidebarData.brandList.forEach(list => {
                list.forEach(item => {
                    item.selected = item.F_BrandId === data.F_BrandId ? true : false
                })
            })
            this.brandListSidebarData = brandListSidebarData
            this.brandUnlimit = data.unlimited ? true : false
        },
        // 重置品牌列表
        resetBrandList () {
            let cpBrandHot = [...this.info.brandHot]
            cpBrandHot.map(x => x.selected = false)
            this.info.brandHot = cpBrandHot
        },
        // 点击更多品牌
        brandSidebarChange() {
            this.showSidebar = !this.showSidebar
        },
        // 回到顶部
        goTopHandler() {
            dom.scrollToElement(this.$refs.header, { offset: 0 })
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
        },
        // 获取结果数据
        getResultData(isLoadmore = false) {

            if (!this.requestLock) return;
            
            // 关闭请求锁
            this.requestLock = false

            // 非滚动加载要重置页数
            if (!isLoadmore) this.page = 0, this.showLoading()

            // 根据获取筛选结果页面数据
            this.getData(`${this.ajaxUrl()}/index.php?r=api/select/list&brandId=${this.brandId}&order=${this.order}&page=${this.page}${this.defaultParams}`, res => {
                if (res.ok && res.data.code) {
                    let data = res.data.data
                    // 保存pageCount
                    this.pageCount = data.pageCount ? data.pageCount : this.pageCount
                    // 设置是否禁用分页加载
                    this.forbiddenLoadmore = this.page >= this.pageCount - 1 ?  true : false
                    // 请求成功 页数++
                    this.page++
                    if (isLoadmore) {
                        // 分页加载
                        this.info.productList = [...this.info.productList, ...data.productList]
                    } else {
                        // 加载第一页
                        let {title, totalCount, brandHot, productList, letters, brandList,} = data
                        // 有热门品牌数据就不需要后端返回的未选中的数据了
                        brandHot = this.info.brandHot ? this.info.brandHot : brandHot
                        this.info = {title, totalCount, brandHot, productList,}
                        // this.brandListSidebarData = {letters, brandList,}
                    }
                    // 发送GA统计--未配置
                    this.sendGA()
                    // 发送大数据统计--未配置
                    this.sendBigData()
                }
                if (isLoadmore) {
                    // 关闭loadmore
                    this.showLoadmore = false
                } else {
                    this.hideLoading()
                }
                // 打开请求锁
                this.requestLock = true
                // 重置loadmore
                this.$refs.list.resetLoadmore()
            })
        },
        loadMore () {
            if (this.forbiddenLoadmore) return;
            this.showLoadmore = true
            this.getResultData(true)
        },
        // 发送GA统计
        sendGA(type = 'load') {
            return;
            if (type === 'load') {
                this.goUrlGa(weex.config.deviceId, 'product.m.360che.com', this.gaPageName, this.info.h1)
            } else if (type === 'click') {
                this.eventGa(weex.config.deviceId, '点击询底价按钮', this.gaPageName, '')
            }
        },
        // 发送大数据统计
        sendBigData(seriesSiderbarData) {
            return;
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
                let [big, sub, brand] = ['', '', '']
                if (this.cateId) big = this.cateId
                if (this.subCateId) sub = this.subCateId
                if (this.brandId) brand = this.brandId
                param.p4 = [big, sub, brand].join('_')
                param.f = this.currentPage
            }
            this.collect(param)
        },
    },
    created() {
        //前端监控
        this.weexLogger('按工况结果页')

        // 获取首次渲染所需数据
        storage.getItem('conditionData', res => {
            if (res.result === 'success') {
                const data = JSON.parse(res.data)
                for (const key in data) {
                    this[key] = data[key]
                }
            }
        })

        this.iosTop = this.isIos()

        //监听用户点击安卓物理返回键
        globalEvent && globalEvent.addEventListener("onRespondNativeBack", e => {
            this.goBack()
        })
    },
    mounted() { }
}
</script>

<style scoped>
.ios-top {
    height: 40px;
    background-color: #fff;
}

.condition {
    background-color: #f5f5f5;
    flex: 1;
}
.list {
    flex: 1;
}
.header {
    width: 750px;
    height: 88px;
    padding-right: 30px;
    padding-left: 30px;
    background-color: #fff;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.header-text {
    font-size: 32px;
}
.list {
    width: 750px;
}
.reset-filter {
    width: 130px;
    height: 88px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.reset-filter-icon {
    width: 28px;
    height: 24px;
}

.reset-filter-text {
    color: #999;
    font-size: 24px;
}

.brand {
    width: 750px;
    background-color: #f5f5f5;
}

.brand-title {
    line-height: 36px;
    font-size: 24px;
    margin-top: 20px;
    margin-left: 30px;
    margin-bottom: 10px;
    color: #999;
}

.brand-list {
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
}

.brand-item {
    width: 216px;
    height: 72px;
    background-color: #fff;
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    border-top-color: rgb(238, 238, 238);
    border-top-style: solid;
    border-top-width: 2px;
    border-right-color: rgb(238, 238, 238);
    border-right-style: solid;
    border-right-width: 2px;
    border-bottom-color: rgb(238, 238, 238);
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-left-color: rgb(238, 238, 238);
    border-left-style: solid;
    border-left-width: 2px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
}
.brand-item-selected {
    border-top-color: rgb(21, 113, 229);
    border-right-color: rgb(21, 113, 229);
    border-bottom-color: rgb(21, 113, 229);
    border-left-color: rgb(21, 113, 229);
}
.brand-item-text {
    line-height: 72px;
    text-align: center;
    font-size: 28px;
    color: #333;
    text-overflow: ellipsis;
    lines: 1;
}
.brand-item-text-selected {
    color: rgb(21, 113, 229);
}
.result-header {
    width: 750px;
    height: 80px;
    line-height: 80px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #e5e5e5;
    background-color: #fff;
}

.result-title {
    margin-left: 30px;
    flex-direction: row;
    align-items: center;
}

.result-title-text {
    font-size: 28px;
    color: #999999;
}

.result-title-text-count {
    font-size: 28px;
    color: #1571e5;
    margin-left: 14px;
    margin-right: 14px;
}

.filter-operation {
    margin-right: 30px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 186px;
}

.price-filter,
.hot-filter {
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
    height: 20px;
    margin-left: 6px;
}

.filter-active {
    color: #1571E5;
}
.model {
    width: 750px;
    padding-top: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
    padding-left: 30px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(238, 238, 238);
    background-color: #fff;
}
.model-container {
    flex: 1;
    height: 120px;
    flex-direction: row;
    justify-content: space-between;
}
.model-pictrue {
    width: 180px;
    height: 120px;
}
.model-name {
    width: 490px;
    height: 120px;
}
.model-name-text {
    word-break: break-all;
    color: #333;
    font-size: 32px;
    line-height: 60px;
    text-overflow: ellipsis;
    overflow: hidden;
    lines: 2;
}
.model-tags {
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 24px;
}
.model-tags-wrapper {
    padding-top: 6px;
    padding-right: 10px;
    padding-bottom: 6px;
    padding-left: 10px;
    border-top-color: #80bdff;
    border-top-style: solid;
    border-top-width: 1px;
    border-right-color: #80bdff;
    border-right-style: solid;
    border-right-width: 1px;
    border-bottom-color: #80bdff;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-left-color: #80bdff;
    border-left-style: solid;
    border-left-width: 1px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    margin-right: 10px;
}
.model-tags-text {
    font-size: 24px;
    color: #80bdff;
}
.model-price {
    position: relative;
    height: 48px;
    flex-direction: row;
    align-items: flex-end;
}
.model-price-text,.footer-price-text {
    line-height: 24px;
    font-size: 24px;
    color: #f60;
}
.model-price-content {
    line-height: 32px;
    font-size: 32px;
    color: #f60;
    margin-right: 2px;
}
.model-price-null {
    font-size: 24px;
    color: #666;
}
.footer-price {
    position: absolute;
    right: 0;
    top: 0;
    width: 120px;
    height: 48px;
    justify-content: center;
    align-items: center;
    background-color: #fff5ef;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-color: rgb(255, 184, 137);
    border-top-style: solid;
    border-top-width: 1px;
    border-right-color: rgb(255, 184, 137);
    border-right-style: solid;
    border-right-width: 1px;
    border-bottom-color: rgb(255, 184, 137);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-left-color: rgb(255, 184, 137);
    border-left-style: solid;
    border-left-width: 1px;
}
.loading {
    padding-top: 40px;
    padding-bottom: 40px;
}
</style>
