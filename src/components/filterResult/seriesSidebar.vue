<template>
    <div :class="['sidebar-wraper', iosTop ? 'iosTop' : '']">
        <div class="sidebar-mask" @click="closeSiderbar"></div>
        <div class="sidebar" ref="sidebar">
            <list>
                <cell class="header">
                    <div class="header-title">
                        <text class="header-title-text">{{data.info.name}}</text>
                    </div>
                    <div class="header-cont" @click="goSeries">
                        <image :src="data.info.img" resize="cover" class="header-cont-pictrue"></image>
                        <div class="header-cont-right">
                            <div class="header-cont-price" v-if="data.info.priceScope.min && data.info.priceScope.max">
                                <text class="header-cont-price-text">{{data.info.priceScope.min}}~{{data.info.priceScope.max}}</text>
                                <text class="header-cont-price-unit-text">万元</text>
                            </div>
                            <div class="header-cont-price" v-if="!data.info.priceScope.min">
                                <text class="header-cont-price-unit-text">暂无报价</text>
                            </div>
                            <div class="header-cont-go-series">
                                <text class="header-cont-go-series-text">进入车系</text>
                            </div>
                        </div>
                    </div>
                </cell>

                <cell class="type-wraper" v-for="(item, index) in data.list">
                    <div class="type">
                        <text class="type-text">{{data.attrList[index]}}</text>
                    </div>
                    <div class="type-list">
                        <div :class="['type-item', modelIndex ? '' : 'item-first']" v-for="(model, modelIndex) in item" v-if="modelIndex < listLoadmore[index]" @click="goModel(model.id)">
                            <text class="model-title-text">{{model.name}}</text>
                            <div class="model-attrs">
                                <div class="model-attr" v-for="attr in model.paramDetail">
                                    <text class="model-attr-text">{{attr}}</text>
                                </div>
                            </div>
                            <div class="model-footer">
                                <div class="model-price">
                                    <text class="model-price-text" v-if="model.price">{{model.price}}</text>
                                    <text class="model-price-unit-text" v-if="model.price">万元</text>
                                    <text class="model-price-without-text" v-else>暂无报价</text>
                                </div>
                                <div class="consult-floor-price" @click="goConsultFloorPrice(model.id)">
                                    <text class="consult-floor-price-text">询底价</text>
                                    <image src="https://s.kcimg.cn/wap/images/detail/productApp/go-f60.png" class="consult-floor-price-icon"></image>
                                </div>
                            </div>
                        </div>
                        <div class="load-more" v-if="listLoadmore[index] <  data.list[index].length" @click="addShowLength(index)">
                            <text class="load-more-text">点击加载更多车型</text>
                            <image src="https://s.kcimg.cn/wap/images/detail/productApp/launch.png" class="load-more-icon"></image>
                        </div>
                    </div>
                </cell>
            </list>
        </div>
    </div>
</template>

<script type="text/babel">
    import indexNav from '../../components/brandList/indexNav.vue'
    const dom = weex.requireModule('dom')
    const storage = weex.requireModule('storage')
    const animation = weex.requireModule('animation')
    export default {
        components: {indexNav},
        props: ['data'],
        data () {
            return {
                cacheStorage: false,
                // 控制每组显示多少的数组
                listLoadmore: [],
                iosTop: false
            }
        },
        methods: {
            goSeries () {
                this.goWeexUrl('series.weex.js')
            },
            goModel (id) {
                storage.setItem('ProductId', id, e => {
                    if (e.result === 'success') {
                        this.goWeexUrl('model.weex.js')
                    }
                })
            },
            goConsultFloorPrice (id) {
                // GA：筛选结果页事件统计
                this.eventGa(weex.config.deviceId, '点击询底价按钮', '产品库-筛选结果页', '右侧弹层')
                storage.setItem('priceProductId', id, e => {
                    if (e.result === 'success') {
                        this.goWeexUrl('footerPrice.weex.js')
                    }
                })
            },
            closeSiderbar () {
                this.change('600px', () => {
                    this.$emit('seriesSidebarChange')
                })
            },
            // 开启关闭侧边栏
            change (translateX = 0, callback) {
                animation.transition(this.$refs.sidebar, {
                    styles: {
                        transform: `translateX(${translateX})`,
                    },
                    duration: 300, //ms
                    timingFunction: 'ease-out',
                    delay: 0 //ms
                }, () => {
                    callback && callback()
                })
            },
            addShowLength (index) {
                let backup = [...this.listLoadmore]
                backup[index] += 5
                this.listLoadmore = backup
            }
        },
        created () {
            if (this.isIos()) {
                this.iosTop = true
            }
            // 默认显示前5个
            this.data.list.forEach(arr => {
                this.listLoadmore.push(5)
            })
            const seriesInfo = {
                F_SubCategoryId: this.data.info.subId,
                F_SeriesId: this.data.info.id,
            }
            storage.setItem('seriesInfo', JSON.stringify(seriesInfo))
        },
        mounted () {
            this.change()
        },
    }
</script>

<style scoped>
.iosTop {
    margin-top: 40px;
}
.sidebar-wraper {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding-left: 150px;
}
.sidebar-mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
}
.sidebar {
    flex: 1;
    background-color: #f5f5f5;
    transform: translateX(600px);
}
.header {
    padding-left: 30px;
    padding-top: 20px;
    padding-bottom: 30px;
    background-color: #fff;
}
.header-title {
    height: 48px;
}
.header-title-text {
    line-height: 48px;
    lines: 1;
    text-overflow: ellipsis;
    font-size: 32px;
    font-weight: bold;
}
.header-cont {
    margin-top: 18px;
    flex-direction: row;
    height: 120px;
}
.header-cont-pictrue {
    width: 180px;
    height: 100%;
    margin-right: 30px;
}
.header-cont-right {
    height: 100%;
    justify-content: space-between;
}
.header-cont-price {
    flex-direction: row;
    height: 48px;
}
.header-cont-price-text {
    font-size: 36px;
    font-weight: bold;
    margin-right: 10px;
    color: #f60;
    line-height: 48px;
}
.header-cont-price-unit-text {
    line-height: 58px;
    font-size: 24px;
    color: #f60;
}
.header-cont-go-series {
    width: 150px;
    height: 52px;
    background-color: #1571e5;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
}
.header-cont-go-series-text {
    color: #fff;
    font-size: 28px;
    text-align: center;
    line-height: 52px;
}
.type-wraper {
    background-color: #fff;
}
.type {
    background-color: #f5f5f5;
    height: 60px;
    padding-left: 30px;
}
.type-text {
    color: #999;
    font-size: 24px;
    line-height: 60px;
}
.type-item {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 30px;
    padding-right: 30px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(238, 238, 238);
}
.model-title-text {
    lines: 2;
    text-overflow: ellipsis;
    font-size: 28px;
    color: #333;
    line-height: 42px;
}
.model-attrs {
    flex-direction: row;
}
.model-attr {
    padding-right: 10px;
    padding-left: 10px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border-top-color: rgb(128, 189, 255);
    border-top-style: solid;
    border-top-width: 1px;
    border-right-color: rgb(128, 189, 255);
    border-right-style: solid;
    border-right-width: 1px;
    border-bottom-color: rgb(128, 189, 255);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-left-color: rgb(128, 189, 255);
    border-left-style: solid;
    border-left-width: 1px;
    margin-right: 8px;
}
.model-attr-text {
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    color: #80bdff;
}
.model-footer {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 58px;
    margin-top: 10px;
}
.model-price {
    height: 32px;
    flex-direction: row;
}
.model-price-text {
    color: #f60;
    font-size: 32px;
    font-weight: bold;
    line-height: 32px;
    margin-right: 10px;
}
.model-price-unit-text {
    color: #f60;
    font-size: 24px;
    line-height: 34px;
}
.model-price-without-text {
    color: #999;
    font-size: 24px;
    line-height: 32px;
}
.consult-floor-price {
    width: 120px;
    height: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.consult-floor-price-text {
    font-size: 24px;
    color: #f60;
    line-height: 58px;
}
.consult-floor-price-icon {
    width: 16px;
    height: 24px;
    margin-left: 10px;
}
.load-more {
    flex: 1;
    height: 80px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
    margin-right: 30px;
    margin-bottom: 20px;
    border-top-color: rgb(233, 233, 233);
    border-top-style: solid;
    border-top-width: 1px;
    border-right-color: rgb(233, 233, 233);
    border-right-style: solid;
    border-right-width: 1px;
    border-bottom-color: rgb(233, 233, 233);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-left-color: rgb(233, 233, 233);
    border-left-style: solid;
    border-left-width: 1px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
}
.load-more-text {
    line-height: 80px;
    font-size: 28px;
    color: #999;
}
.load-more-icon {
    width: 32px;
    height: 20px;
    margin-left: 6px;
}
.item-first {
    border-top-width: 0;
}
</style>
