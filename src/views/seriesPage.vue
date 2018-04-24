<template>
    <div class="main">
        <div v-if="iosTop" class="ios-top"></div>
        <!--页面标题-->
        <title :titleName="info.name"></title>
        <!-- 卡车类型 -->
        <div class="type">
            <div class="type-wrapper" :style="{height: typeHeight + 'px'}">
                <type :isThreeColumn="1" :info="info.subList" @changeType="changeType"></type>
            </div>
            <div class="show-more-type" @click="showMoreTypeChange" v-if="maxHeight > minHeight">
                <div class="show-more-type-text-wraper">
                    <text class="show-more-type-text">{{showMoreType}}</text>
                </div>
                <image class="show-more-type-icon" :src="showMoreTypeSrc"></image>
            </div>
        </div>
        
        
        <list @scroll="scroll" loadmoreoffset="88" offset-accuracy="40" ref="list">
            <cell ref="header"></cell>
            <!-- 对应分类的各个详情模块 -->
            <cell v-for="(data, index) in info.seriesList" :ref="`module${index}`" v-if="info.seriesList" :key="`module${index}`">
                <div class="module">
                    <div class="title">
                        <text class="title-text">{{data.name}}</text>
                    </div>
                    <div class="list">
                        <div :class="['item', idx ? '' : 'border-top-none']" v-for="(item, idx) in data.list" v-if="idx < 5" :key="`module${index}_list${idx}`"  @click="$goModel(item)">
                            <image class="item-image" resize="cover" :src="item.img"></image>
                            <div class="item-container">
                                <text class="item-name">{{item.F_ProductName}}</text>
                                <div class="item-footer">
                                    <text class="item-price" v-if="Number(item.F_Price)">{{Number(item.F_Price) + '万元'}}</text>
                                    <text class="item-price" v-else>暂无报价</text>
                                    <div class="footer-price" @click="inquiry(item.F_ProductId)" v-if="item.F_ProductId">
                                        <text class="footer-price-text">询底价</text>
                                        <image :src="`${DefaultImgPath}go-f60.png`" class="footer-price-icon"></image>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="jump" v-if="data.isShow">
                        <div class="jump-item" @click="$goSeries(data.seriesInfo)">
                            <text class="jump-text">进入车系</text>
                        </div>
                        <div class="jump-item" @click="handler(data, 'config')">
                            <text class="jump-text">查看配置</text>
                        </div>
                        <div class="jump-item" @click="handler(data, 'seriesPhoto')">
                            <text class="jump-text">查看图片</text>
                        </div>
                    </div>
                </div>
            </cell>
            <!-- 文章模块 -->
            <cell v-if="info.articleList && info.articleList.length">
                <div class="module">
                    <div class="title">
                        <text class="title-text">文章</text>
                    </div>
                    <div class="list">
                        <div :class="['list-item', index ? '' : 'border-top-none']" v-for="(data, index) in info.articleList" v-if="index < 4" @click="goUrl(data.url)">
                            <text class="list-item-title">{{`[${data.cateName}]`}}</text>
                            <text class="list-item-content">{{data.Title}}</text>
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
    const navigator = weex.requireModule('navigator')

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
                    name: ''
                },
                //苹果头部白条
                iosTop: false,
                // 显示去顶部
                showGoTop: false,
                // 类型模块的高度：n*84+10
                typeHeight: 0,
                showMoreType: '展开',
                showMoreTypeSrc: 'https://s.kcimg.cn/wap/images/detail/productApp/launch.png'
                //统计
                // el: '产品库-子类车系综述页',
            }
        },
        methods:{
            // 更多类型切换
            showMoreTypeChange () {
                if (this.showMoreType === '收起') {
                    this.showMoreType = '展开'
                    this.showMoreTypeSrc = `${this.DefaultImgPath}launch.png`
                    this.typeHeight = this.minHeight
                } else {
                    this.showMoreType = '收起'
                    this.showMoreTypeSrc = `${this.DefaultImgPath}packup.png`
                    this.typeHeight = this.maxHeight
                }
            },
            // 处理跳转
            handler (data, page) {
                const { askNum, askProId, seriesInfo } = data
                storage.setItem('seriesFooterInfo', JSON.stringify({ askNum, askProId }), e => {
                    if (e.result == 'success') {
                        storage.setItem('seriesInfo', JSON.stringify(seriesInfo), e => {
                            if (e.result === 'success') {
                                this.goWeexUrl(`${page}.weex.js`)
                            }
                        })
                    }
                })
            },
            // 询底价
            inquiry (data) {
                this.sendGA('click')
                this.$goFooterPrice(data)
            },
            // 切换类型
            changeType (data, index) {
                let subList = [...this.info.subList]
                subList.forEach((item, idx) => {
                    item.selected = (idx === index) ? 1 : 0
                })
                this.info.subList = subList
                dom.scrollToElement(this.$refs[`module${index}`][0])
            },
            // 获取页面数据
            getSeriesData () {
                this.showLoading()
                // 根据获取筛选结果页面数据
                this.getData(`${this.ajaxUrl()}/index.php?r=api/series/series&id=${this.id}`, res => {
                    if (res.ok && res.data.code) {
                        const data = res.data.data
                        // 定义映射data
                        let { subList } = data
                        if (!subList) {
                            subList = []
                        }
                        this.computeHeight(subList.length)
                        this.typeHeight = this.minHeight
                        // 设置初始数据
                        this.info = data
                        // 发送GA统计
                        this.sendGA()
                        // 发送大数据统计
                        this.sendBigData()
                    }
                    this.hideLoading()
                })
            },
            // 计算类别高度
            computeHeight (length) {
                const lines = Math.ceil(length / 3)
                switch (lines) {
                    case 0:
                        this.maxHeight = this.minHeight = 0
                        break;

                    case 1:
                        this.maxHeight = this.minHeight = lines * 84 + 10
                        break;

                    case 2:
                        this.maxHeight = this.minHeight = lines * 84 + 10
                        break;
                
                    default:
                        this.maxHeight = lines * 84 + 10
                        this.minHeight = 2 * 84 + 10
                        break;
                }
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
                dom.scrollToElement(this.$refs.header, { offset: 0 })
            },
            // 发送GA统计
            sendGA (type = 'load') {
                return;
                if (type === 'load') {
                    this.goUrlGa(weex.config.deviceId, 'product.m.360che.com', this.gaPageName, this.info.h1)
                } else if (type === 'click') {
                    this.eventGa(weex.config.deviceId, '点击询底价按钮', this.gaPageName, '')
                }
            },
            // 发送大数据统计
            sendBigData (typeName) {
                return;
                // &p1=3&p2=0&p4=7&p8=5&ts=x
                const map = new Map([
                    ['牵引车', 66],
                    ['载货车', 64],
                    ['自卸车', 63],
                    ['轻卡', 3],
                    ['中卡', 2],
                    ['重卡', 1],
                ]);
                const param = {
                    p2: 0,
                    p4: 7,
                    p8: map.get(typeName),
                };
                this.collect(param)
            },
        },
        created () {
            //获取初始数据
            storage.getItem('seriesPageId', e => {
				if(e.result == 'success'){
                    this.id = e.data
                    this.getSeriesData()
				}
			})

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack", e => {
                this.goBack()
            })

            this.iosTop = this.isIos()
        }
    }
</script>

<style scoped>
    .ios-top {
        height:40px;
        background-color: #fff;
    }
    .main {
        background-color: #f5f5f5;
    }
    .module {
        margin-top: 20px;
        background-color: #fff;
    }
    .title {
        padding-left: 20px;
        height: 80px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(238, 238, 238);
        justify-content: center;
        background-color: #fff;
    }
    .title-text {
        font-size: 32px;
    }
    .list {
        padding-right: 20px;
        padding-left: 20px;
        background-color: #fff;
    }
    .item {
        flex: 1;
        padding-top: 20px;
        padding-bottom: 20px;
        flex-direction: row;
        justify-content: space-between;
        height: 160px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: rgb(238, 238, 238);
    }
    .item-image {
        width: 180px;
        height: 120px;
    }
    .item-container {
        width: 510px;
        height: 120px;
    }
    .item-name {
        font-size: 28px;
        line-height: 40px;
        height: 80px;
        color: #333;
        lines: 2;
        text-overflow: ellipsis;
    }
    .item-footer {
        margin-top: 6px;
        height: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .item-price,.footer-price-text {
        color: #f60;
        font-size: 28px;
    }
    .footer-price {
        width: 120px;
        height: 30px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .footer-price-icon {
        width: 16px;
        height: 24px;
    }
    .jump {
        width: 750px;
        padding-left: 20px;
        height: 100px;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: rgb(229, 229, 229);
        flex-direction: row;
        align-items: center;
    }
    .jump-item {
        width: 222px;
        height: 70px;
        border-top-color: rgb(88, 108, 148);
        border-top-style: solid;
        border-top-width: 1px;
        border-right-color: rgb(88, 108, 148);
        border-right-style: solid;
        border-right-width: 1px;
        border-bottom-color: rgb(88, 108, 148);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-left-color: rgb(88, 108, 148);
        border-left-style: solid;
        border-left-width: 1px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        border-bottom-left-radius: 6px;
        margin-right: 20px;
        justify-content: center;
        align-items: center;
    }
    .jump-text {
        color: #586c94;
        font-size: 28px;
    }
    .border-top-none {
        border-top-width: 0;
    }
    .list-item {
        height: 100px;
        flex-direction: row;
        align-items: center;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: rgb(238, 238, 238);
    }
    .list-item-title {
        margin-right: 10px;
        color: #1571e5;
        font-size: 28px;
    }
    .list-item-content {
        color: #333;
        font-size: 28px;
        lines: 1;
        text-overflow: ellipsis
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
    .type-wrapper {
        background-color: #fff;
    }
</style>
