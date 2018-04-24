<template>
    <div class="group">
        <div v-if="iosTop" class="ios-top"></div>
        <list @scroll="scroll" loadmoreoffset="88" offset-accuracy="40" ref="list">
            <header ref="header">
                <!--页面标题-->
                <title :titleName="info.brandGroupInfo.F_BrandGroupName"></title>
            </header>
            <!-- 品牌集团列表 -->
            <cell class="group-list">
                <div class="group-item" @click="goBrand(brand.F_BrandId)" v-for="brand in info.brandGroupInfo.brandList">
                    <image :placeholder="DefaultImgPath + 'placeholder.jpg'" class="group-item-image" resize="cover" :src="brand.logo"></image>
                    <text class="group-item-text">{{brand.F_BrandName}}</text>
                </div>
            </cell>
            <!-- 集团分类 -->
            <cell>
                <div class="group-type-wrapper">
                    <div class="group-type" v-for="(tonnage, index) in info.tonnageList" @click="changeType(tonnage.value, index)" :style="{'width': typeWidth + 'px'}">
                        <text :class="['group-type-text', tonnage.default ? 'group-type-text-selected' : '']">{{tonnage.name}}</text>
                        <div class="group-type-line" :style="{'left': (typeWidth - 56) / 2 + 'px'}" v-if="tonnage.default"></div>
                    </div>
                </div>
            </cell>
            <!-- 集团结果 -->
            <cell class="group-result-wrapper" v-for="(res, resIndex) in info.brandSeriesList">
                <div class="group-result-header">
                    <text class="group-result-header-text">{{res.name}}</text>
                </div>
                <div class="group-result-list">
                    <div class="group-result" v-for="(series, index) in res.seriesList" v-if="index < res.showLength" @click="$goSeries(series)">
                        <image :placeholder="DefaultImgPath + 'placeholder.jpg'" class="group-result-image" resize="cover" :src="series.imgSrc"></image>
                        <div class="group-result-cont">
                            <text class="group-result-name">{{series.F_ShortName}}</text>
                            <text class="group-result-price">{{series.priceScore}}</text>
                            <div class="group-result-footer">
                                <text class="group-result-footer-text">共</text>
                                <text class="group-result-count-text"> {{series.F_ProductNum}} </text>
                                <text class="group-result-footer-text">款车型</text>
                            </div>
                            <div class="footer-price" @click.stop="inquiry(series.proid)" v-if="series.F_IsStopMake === '1'">
                                <text class="footer-price-text">询底价</text>
                                <image class="footer-price-icon" :src="DefaultImgPath + 'go-f60.png'"></image>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fold" @click="foldToggle(resIndex, res.showLength)" v-if="res.seriesList.length > foldNum">
                    <text class="fold-text" v-if="res.showLength < res.seriesList.length">点击加载更多</text>
                    <text class="fold-text" v-else>点击收起</text>
                    <image class="fold-icon" v-if="res.showLength < res.seriesList.length" :src="DefaultImgPath + 'launch.png'"></image>
                    <image class="fold-icon" v-else :src="DefaultImgPath + 'packup.png'"></image>
                </div>
            </cell>


        </list>
        
        <!-- 回到顶部 -->
        <go-top @goTop="goTopHandler" :show="showGoTop" ></go-top>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
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
            goTop,
        },
        data () {
            return {
                // 页面数据
                info: {
                    brandGroupInfo: {
                        F_BrandGroupName: '',
                        brandList: []
                    },
                    tonnageList: [],
                    brandSeriesList: []
                },
                //苹果头部白条
                iosTop: false,
                // 分类每一项的宽度
                typeWidth: 187,
                // 集团英文名
                groupEnName: '',
                // 分类
                tonnage: 0,
                // 超过多少个折叠
                foldNum: 5,
                // 请求锁
                requestLock: true,
                // 显示去顶部
                showGoTop: false,
                //统计
                // el: '产品库-子类车系综述页',
            }
        },
        methods:{
            // 跳转品牌页
            goBrand (id) {
                const data = {
                    groupId: this.info.brandGroupInfo.F_BrandGroupId,
                    brandId: id
                }
                storage.setItem('brandInfo', JSON.stringify(data), res => {
                    if (res.result === 'success') {
                        this.goWeexUrl('brand.weex.js')
                    }
                })
            },
            // 折叠切换
            foldToggle (index, length) {
                let oFold = this.info.brandSeriesList[index]
                if (length === this.foldNum) {
                    oFold.showLength = oFold.seriesList.length
                } else {
                    oFold.showLength = this.foldNum
                }
            },
            // 监听滚动距离（e.contentOffset.y）的大小 从而控制显示、隐藏goTop
            scroll (e) {
                const referenceValue = 1400
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
            // 询底价
            inquiry (data) {
                this.sendGA('click')
                this.$goFooterPrice(data)
            },
            // 切换分类
            changeType (val, index) {
                this.tonnage = val
                this.getGroupData(index)
            },
            // 获取集团数据
            getGroupData (index = 0) {
                if (!this.requestLock) {
                    return
                }
                this.showLoading()
                // 关闭请求锁
                this.requestLock = false
                // 根据获取筛选结果页面数据
                this.getData(`${this.ajaxUrl()}/index.php?r=api/group/index&group=${this.groupEnName}&tonnage=${this.tonnage}&v=1213`, res => {
                    if (res.ok && res.data.code) {
                        let Data = res.data.data
                        // 定义映射data中的类别、结果、请求接口用的type字段、类名
                        let { brandGroupInfo, tonnageList, brandSeriesList } = Data
                        
                        // 动态计算分类的宽度
                        if (tonnageList.length) {
                            this.typeWidth = Math.floor(750 / tonnageList.length)
                            // 非全部类别设置文章标题
                            if (!tonnageList[0].default) {
                                let type = ''
                                for (let i = 0; i < tonnageList.length; i++) {
                                    const item = tonnageList[i]
                                    if (item.default) {
                                        type = item.name
                                        break
                                    }
                                }
                                if (type) brandGroupInfo.F_BrandGroupName += type
                            }
                        }

                        

                        // 设置显示长度字段
                        // 无图片地址设置为默认图片
                        brandSeriesList.forEach(val => {
                            val.showLength = this.foldNum
                            val.seriesList.forEach(item => {
                                if (item.imgSrc === false || typeof item.imgSrc !== 'string') {
                                    item.imgSrc = `${this.DefaultImgPath}placeholder.jpg`
                                }
                            })
                        })

                        // 更新全部数据到info对象
                        this.info = { brandGroupInfo, tonnageList, brandSeriesList }

                        // 发送GA统计
                        this.sendGA()

                        // 发送大数据统计
                        this.sendBigData(index)
                    }
                    // 打开请求锁
                    this.requestLock = true
                    
                    this.hideLoading()
                })
            },
            // 发送GA统计
            sendGA (type = 'load') {
                if (type === 'load') {
                    this.goUrlGa(weex.config.deviceId, 'product.m.360che.com', '产品库-集团页', this.info.brandGroupInfo.F_BrandGroupName)
                } else if (type === 'click') {
                    this.eventGa(weex.config.deviceId, '点击询底价按钮', '产品库-集团页', '')
                }
            },
            // 发送大数据统计
            sendBigData (index) {
                const map = new Map([
                    [0, 0],
                    [1, 4],
                    [2, 3],
                    [3, 2],
                    [4, 1],
                ])
                // p4=8&p7=集团id&p8=0&ts=x
                const param = {
                    p2: 0,
                    p4: 8,
                    p7: this.info.brandGroupInfo.F_BrandGroupId,
                    p8: map.get(index),
                }
                this.collect(param)
            },
        },
        created () {
            //前端监控
            this.weexLogger('品牌集团列表')

            storage.getItem('groupType', e => {
                if (e.result === 'success') {
                    this.tonnage = e.data
                    storage.removeItem('groupType')
                }
                storage.getItem('groupName', e => {
                    if (e.result === 'success') {
                        this.groupEnName = e.data
                        //获取集团数据
                        this.getGroupData()
                    }
                })
            })
            

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
        mounted () {}
    }
</script>

<style scoped>
    .ios-top {
        height:40px;
        background-color: #fff;
    }
    .group {
        background-color: #f5f5f5;
    }
    .group-list {
        flex-direction: row;
        flex-wrap: wrap;
        background-color: #fff;
    }
    .group-item {
        width: 187px;
        height: 170px;
        align-items: center;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: rgb(238, 238, 238);
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(238, 238, 238);
    }
    .group-item-image {
        width: 148px;
        height: 114px;
        margin-top: 10px;
    }
    .group-item-text {
        width: 148px;
        height: 36px;
        line-height: 36px;
        font-size: 24px;
        text-align: center;
        color: #333;
        text-overflow: ellipsis;
        overflow: hidden;
        lines: 1;
    }
    .group-type-wrapper {
        margin-top: 10px;
        background-color: #fff;
        flex-direction: row;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(238, 238, 238);
    }
    .group-type {
        width: 187px;
        height: 88px;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .group-type-text {
        font-size: 28px;
        color: #333;
        text-align: center;
        font-weight: normal;
    }
    .group-type-text-selected {
        font-weight: bold;
        color: #586C94;
    }
    .group-type-line {
        position: absolute;
        width: 56px;
        height: 4px;
        bottom: 0;
        background-color: #586C94;
    }
    .group-result-wrapper {
        background-color: #fff;
    }
    .group-result-header {
        padding-left: 30px;
        justify-content: center;
        height: 80px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(238, 238, 238);
    }
    .group-result-header-text {
        font-size: 32px;
    }
    .group-result-list {
        padding-right: 20px;
        padding-left: 20px;
    }
    .group-result {
        height: 160px;
        padding-top: 20px;
        padding-bottom: 20px;
        flex-direction: row;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(238, 238, 238);
    }
    .group-result-image {
        width: 180px;
        height: 120px;
    }
    .group-result-cont {
        margin-left: 20px;
        width: 470px;
        position: relative;
    }
    .group-result-name {
        font-size: 28px;
        line-height: 40px;
        color: #333;
        text-overflow: ellipsis;
        overflow: hidden;
        lines: 1;
    }
    .group-result-price {
        margin-top: 8px;
        height: 30px;
        line-height: 30px;
        color: #f60;
        font-size: 28px;
    }
    .group-result-footer {
        margin-top: 10px;
        height: 30px;
        flex-direction: row;
        align-items: center;
    }
    .group-result-footer-text {
        font-size: 24px;
        color: #999;
    }
    .group-result-count-text {
        font-size: 24px;
        color: #333;
    }
    .footer-price {
        position: absolute;
        bottom: 0;
        right: 0;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 28px;
        width: 114px;
    }
    .footer-price-text {
        font-size: 28px;
        color: #f60;
    }
    .footer-price-icon {
        width: 14px;
        height: 28px;
    }
    .fold {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 90px;
    }
    .fold-text {
        color: #999;
        font-size: 28px;
    }
    .fold-icon {
        margin-left: 10px;
        width: 30px;
        height: 16px;
    }
</style>
