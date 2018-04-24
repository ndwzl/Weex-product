<template>
    <div class="brand">
        <div v-if="iosTop" class="ios-top"></div>
        <!--页面标题-->
        <title :titleName="info.brandName"></title>
        <!-- 卡车类型 -->
        <type :isThreeColumn="1" :info="info.subList" @changeType="changeType"></type>
        <list @scroll="scroll" loadmoreoffset="88" offset-accuracy="40">
            <!-- 所有子类的数据 -->
            <cell v-for="(list, index) in info.subCateList" :ref="'subCate'+index">
                <div class="subcate-list">
                    <div class="list-title">
                        <text class="list-title-text">{{info.brandName + list.name}}</text>
                    </div>
                    <div class="list-container">
                        <div :class="['subcate-list-item', _index + 1 === list.list.length ? 'no-border' : '']" v-for="(data, _index) in list.list" @click="goSeriesPage(data)">
                            <image :placeholder="DefaultImgPath + 'placeholder.jpg'" class="subcate-list-item-image" resize="cover" :src="data.imgSrc"></image>
                            <div class="subcate-list-item-right">
                                <text class="subcate-list-item-right-name">{{data.subCateName}}</text>
                                <text class="subcate-list-item-right-price">{{data.priceScope}}</text>
                            </div>
                            <div class="footer-price" @click="inquiry(data.proid)" v-if="data.proid">
                                <text class="footer-price-text">询底价</text>
                                <image :src="DefaultImgPath + 'go-f60.png'" class="footer-price-icon"></image>
                            </div>
                        </div>
                    </div>
                </div>
            </cell>
            <!-- 热门车型图片实拍 -->
            <cell>
                <div class="subcate-list">
                    <div class="list-title">
                        <text class="list-title-text">热门车型图片实拍</text>
                        <div class="another-batch" @click="anotherBatch" v-if="info.brandHotPro && batch < info.brandHotPro.length - 1">
                            <image :src="DefaultImgPath + 'switch-model.png'" class="another-batch-icon"></image>
                            <text class="another-batch-text">换一批</text>
                        </div>
                    </div>
                    <div class="list-container">
                        <div class="subcate-list-item" v-for="data in brandHotList" @click="goModelPhoto(data.seriesInfo)">
                            <image :placeholder="DefaultImgPath + 'placeholder.jpg'" class="subcate-list-item-image" resize="cover" :src="data.imgSrc"></image>
                            <div class="subcate-list-item-right">
                                <text class="subcate-list-item-right-name">{{data.F_ProductName}}</text>
                                <text class="subcate-list-item-right-price">{{data.F_ImagesCount + '张'}}</text>
                            </div>
                        </div>
                    </div>
                </div>
            </cell>
            <!-- 文章 -->
            <cell v-if="info.articleList">
                <div class="other-list">
                    <div class="list-title">
                        <text class="list-title-text">文章</text>
                    </div>
                    <div class="list-container">
                        <div class="other-list-item" v-for="data in info.articleList" @click="goUrl(data.href)">
                            <text class="other-list-item-title">[新闻]</text>
                            <text class="other-list-item-content line1">{{data.Title}}</text>
                        </div>
                    </div>
                </div>
            </cell>
            <!-- 论坛 -->
            <cell v-if="info.postList">
                <div class="other-list">
                    <div class="list-title">
                        <text class="list-title-text">论坛</text>
                    </div>
                    <div class="list-container">
                        <div class="other-list-item" v-for="data in info.postList.list" @click="goUrl(data.link)">
                            <text class="other-list-item-content">{{data.subject}}</text>
                        </div>
                        <!-- 查看更多帖子 -->
                        <div class="other-list-more" @click="goUrl(info.postList.moreUrl)">
                            <text class="other-list-more-text">{{`查看更多${info.brandName}的帖子`}}</text>
                            <image :src="DefaultImgPath + 'go-grey.png'" class="other-list-more-icon"></image>
                        </div>
                    </div>
                </div>
            </cell>
        </list>
        
        <!-- 回到顶部 -->
        <go-top @goTop="goTopHandler" :show="showGoTop"></go-top>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import type from '../components/filter/filterType.vue'
    import goTop from '../components/goTop.vue'

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
            type,
            goTop,
        },
        data () {
            return {
                // 页面数据
                info: {
                    brandName: '',
                    subList: [],
                    postList: {}
                },
                //苹果头部白条
                iosTop: false,
                // 当前第n批热门车型
                batch: 0,
                // 是否显示换一批
                showAnotherBatch: true,
                // 请求锁
                requestLock: true,
                // 显示去顶部
                showGoTop: false,
                //统计
                // el: '产品库-子类车系综述页',
            }
        },
        methods:{
            // 跳转车型图片页s
            goModelPhoto (data) {
                storage.setItem('seriesInfo', JSON.stringify(data), e => {
                    e.result === 'success' && storage.setItem('ProductId', data.F_ProductId, e => {
                        e.result === 'success' && this.goWeexUrl('modelPhoto.weex.js')
                    })
                })
            },
            // 跳转车系页
            goSeriesPage (data) {
                const { F_SeriesId, F_SubCategoryId } = data
                this.$goSeries({F_SeriesId, F_SubCategoryId})
            },
            // 换一批
            anotherBatch () {
                if (this.batch < this.info.brandHotPro.length - 1) {
                    this.batch++
                    this.brandHotList = this.info.brandHotPro[this.batch]
                }
            },
            // 询底价
            inquiry (data) {
                this.sendGA('click')
                this.$goFooterPrice(data)
            },
            changeType (data, index) {
                let subList = [...this.info.subList]
                subList.forEach((item, idx) => {
                    item.selected = (idx === index) ? 1 : 0
                })
                this.info.subList = subList
                dom.scrollToElement(this.$refs[`subCate${index}`][0], {offset: 0})
            },
            getBrandData () {
                this.showLoading()
                // 根据获取筛选结果页面数据
                this.getData(`${this.ajaxUrl()}/index.php?r=api/brand/detail&id=${this.brandId}&ts=${+new Date()}`, res => {
                    if (res.ok && res.data.code) {
                        // 定义data的映射
                        let { subList, subCateList, brandHotPro, brandName, articleList, postList } = res.data.data
                        subList = subList.map(name => {
                            return {name}
                        })
                        // 只有一个分类的时候直接高亮 便于提醒用户
                        if (subList.length === 1) {
                            subList[0].selected = true
                        }
                        // 热门车型默认第一组
                        this.brandHotList = brandHotPro[this.batch]
                        this.info = { subList, subCateList, brandHotPro, brandName, articleList, postList }

                        // 发送GA统计
                        this.sendGA()
                        // 发送大数据统计--未配置
                        this.sendBigData()
                    }
                    this.hideLoading()
                })
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
            // 回到顶部
            goTopHandler () {
                dom.scrollToElement(this.$refs.subCate0[0], { offset: 0 })
            },
            // 发送GA统计
            sendGA (type = 'load') {
                if (type === 'load') {
                    this.goUrlGa(weex.config.deviceId, 'product.m.360che.com', '产品库-品牌页', this.info.brandName)
                } else if (type === 'click') {
                    this.eventGa(weex.config.deviceId, '点击询底价按钮', '产品库-品牌页', '')
                }
            },
            // 发送大数据统计
            sendBigData (typeName) {
                // p1=3&p2=0&p3=品牌id__&p4=8&p7=集团id
                const param = {
                    p2: 0,
                    p3: `${this.brandId}__`,
                    p4: 8,
                    p7: this.groupId,
                }
                this.collect(param)
            },
        },
        created () {

            // 设置brandId
            storage.getItem('brandInfo', res => {
				if (res.result === 'success') {
                    const data = JSON.parse(res.data)
                    this.brandId = data.brandId
                    this.groupId = data.groupId
                    // 获取数据
                    this.getBrandData()
				}
            })

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack", e => {
                this.goBack()
            })

            this.iosTop = this.isIos()
        },
        mounted () {}
    }
</script>

<style scoped>
    .ios-top {
        height:40px;
        background-color: #fff;
    }
    .brand {
        background-color: #f5f5f5;
    }
    .subcate-list, .other-list {
        background-color: #fff;
        margin-top: 20px;
    }
    .list-title {
        position: relative;
        padding-left: 30px;
        height: 80px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(238, 238, 238);
    }
    .list-title-text {
        line-height: 80px;
        font-size: 32px;
        color: #333;
        font-weight: bold;
    }
    .list-container {
        padding-left: 30px;
        padding-right: 30px;
    }
    .subcate-list-item {
        position: relative;
        height: 180px;
        flex-direction: row;
        justify-content: space-between;
        padding-top: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(238, 238, 238);
    }
    .subcate-list-item-image {
        width: 180px;
        height: 120px;
    }
    .subcate-list-item-right {
        width: 460px;
    }
    .subcate-list-item-right-name {
        line-height: 40px;
        font-size: 28px;
        color: #333;
        text-overflow: ellipsis;
        overflow: hidden;
        lines: 2;
    }
    .subcate-list-item-right-price {
        line-height: 28px;
        font-size: 28px;
        color: #ff6600;
        margin-top: 10px;
    }
    .footer-price {
        position: absolute;
        right: 0;
        bottom: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .footer-price-text {
        font-size: 28px;
        color: #f60;
    }
    .footer-price-icon {
        margin-left: 10px;
        width: 15px;
        height: 26px;
    }
    .another-batch {
        position: absolute;
        right: 30px;
        top: 0;
        width: 120px;
        height: 80px;
        flex-direction: row;
        justify-content:space-between;
        align-items: center;
    }
    .another-batch-icon {
        width: 29px;
        height: 26px;
    }
    .another-batch-text {
        font-size: 28px;
        color: #586c94;
    }
    .no-border {
        border-bottom-width: 0;
    }
    .other-list-item {
        width: 690px;
        flex-direction: row;
        align-items: center;
        padding-top: 30px;
        padding-bottom: 30px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: rgb(238, 238, 238);
    }
    .other-list-item-title {
        font-size: 28px;
        color: #448dea;
        margin-right: 10px;
    }
    .other-list-item-content {
        width: 690px;
        font-size: 28px;
        line-height: 40px;
        color: #333;
        text-overflow: ellipsis;
        overflow: hidden;
        lines: 2;
    }
    .other-list-more {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 80px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: rgb(229, 229, 229);
    }
    .other-list-more-text {
        font-size: 28px;
        color: #999;
    }
    .other-list-more-icon {
        width: 22px;
        height: 26px;
        margin-left: 10px;
    }
    .line1 {
        lines: 1;
    }
</style>
