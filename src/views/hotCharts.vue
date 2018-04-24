<template>
    <div class="hot-charts">
        <div v-if="iosTop" class="ios-top"></div>
        <list @scroll="scroll" loadmoreoffset="88" offset-accuracy="40" ref="list">
            <header ref="header">
                <!--页面标题-->
                <title :titleName="info.h1"></title>
            </header>
            <!-- 卡车类型 -->
            <cell class="filter-type">
                <type :isThreeColumn="1" :info="info.typeList" @changeType="changeType"></type>
            </cell>
            <!-- 此类型的排行数据 -->
            <cell class="charts" v-for="(item, index) in info.list" @click="$goModel(item)">
                <div class="charts-cont">
                    <div class="charts-cont-figure">
                        <image class="charts-cont-image" resize="cover" :src="item.img"></image>
                        <image v-if="index < 3" class="charts-cont-index-bg" :src="DefaultImgPath + 'hot-charts-red.png'"></image>
                        <image v-else class="charts-cont-index-bg" :src="DefaultImgPath + 'hot-charts-green.png'"></image>
                        <text class="charts-cont-index-text">{{index+1}}</text>
                    </div>
                    <div class="charts-cont-right">
                        <text class="charts-cont-name-text">{{item.simName}}</text>
                        <text class="charts-cont-price">{{item.price}}</text>
                    </div>
                </div>
                <div class="charts-footer">
                    <div class="charts-footer-info">
                        <text class="charts-footer-text">最近一周已有</text>
                        <text class="charts-footer-count"> {{item.num}} </text>
                        <text class="charts-footer-text">人询价</text>
                    </div>
                    <div class="charts-footer-inquiry" @click="inquiry(item.F_ProductId)">
                        <text class="inquiry-text">询底价</text>                        
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
                    h1: '牵引车销售排行榜',
                    typeList: [
                        {name: "牵引车", enName: "qych", selected: 1},
                        {name: "载货车", enName: "zhch"},
                        {name: "自卸车", enName: "zxch"},
                        {name: "轻卡", enName: "qk"},
                        {name: "中卡", enName: "zhk"},
                        {name: "重卡", enName: "zhka"},
                    ],
                    list: []
                },
                //苹果头部白条
                iosTop: false,
                // 属性选择是否显示
                showType: true,
                // 品牌选中的
                brandUnlimit: true,
                // 当前类型的index
                currentTypeIndex: 0,
                // 当前类型
                currentType: 'qych',
                // 大类id
                cateId: '',
                // 子类id
                subCateId: '',
                // 品牌id
                brandId: '',
                // 请求锁
                requestLock: true,
                // 显示去顶部
                showGoTop: false,
                //统计
                // el: '产品库-子类车系综述页',
            }
        },
        methods:{
            inquiry (data) {
                this.sendGA('click')
                this.$goFooterPrice(data)
            },
            changeType (data, index) {
                this.currentType = data.enName
                this.currentTypeIndex = index
                let typeList = [...this.info.typeList]
                typeList.forEach((item, idx) => {
                    item.selected = (idx === index) ? 1 : 0
                })
                this.info.typeList = typeList
                this.getDataForType()
            },
            getDataForType () {
                if (!this.requestLock) {
                    return
                }
                this.showLoading()
                // 关闭请求锁
                this.requestLock = false
                // 根据获取筛选结果页面数据
                this.getData(`${this.ajaxUrl()}/index.php?r=weex/top/hot-sale&type=${this.currentType}`, res => {
                    if (res.ok && res.data.code) {
                        // 定义映射data中的类别、结果、请求接口用的type字段、类名
                        let { searchList, list, typeEnName, typeName } = res.data.data
                        searchList[this.currentTypeIndex].selected = 1
                        this.info.typeList = searchList
                        this.info.h1 = `${typeName}销售排行榜`
                        this.gaPageName = `产品库-车型热销排行榜${typeName}页`
                        list.forEach(item => {
                            const nPrice = Number(item.F_Price)
                            const sUnit = item.F_PriceUnit ? item.F_PriceUnit : '万元'
                            item.price = nPrice ? `${nPrice}${sUnit}` : '暂无报价'
                        })
                        this.info.list = list

                        // 发送GA统计
                        this.sendGA()
                        // 发送大数据统计
                        this.sendBigData(typeName)
                    }
                    // 打开请求锁
                    this.requestLock = true
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
                dom.scrollToElement(this.$refs.header, { offset: 0 })
            },
            // 发送GA统计
            sendGA (type = 'load') {
                if (type === 'load') {
                    this.goUrlGa(weex.config.deviceId, 'product.m.360che.com', this.gaPageName, this.info.h1)
                } else if (type === 'click') {
                    this.eventGa(weex.config.deviceId, '点击询底价按钮', this.gaPageName, '')
                }
            },
            // 发送大数据统计
            sendBigData (typeName) {
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
            //前端监控
            this.weexLogger('销售排行榜页')

            //获取数据 默认牵引车
            this.getDataForType()

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
    .hot-charts {
        background-color: #f5f5f5;
    }
    .result {
        background-color: #fff;
        margin-top: 20px;
    }
    .charts {
        margin-top: 20px;
        background-color: #fff;
        padding-left: 30px;
        padding-right: 30px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(216, 216, 216);
    }
    .charts-cont {
        margin-bottom: 20px;
        padding-top: 30px;
        flex-direction: row;
    }
    .charts-cont-figure {
        width: 180px;
        height: 120px;
        position: relative;
        margin-right: 20px;
    }
    .charts-cont-image {
        width: 180px;
        height: 120px;
    }
    .charts-cont-index-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 50px;
    }
    .charts-cont-index-text {
        position: absolute;
        left: 6px;
        top: 1px;
        font-size: 20px;
        color: #fff;
    }
    .charts-cont-right {
        width: 488px;
    }
    .charts-cont-name-text {
        height: 80px;
        line-height: 40px;
        font-size: 28px;
        color: #333;
        text-overflow: ellipsis;
        overflow: hidden;
        lines: 2;
    }
    .charts-cont-price {
        margin-top: 14px;
        line-height: 28px;
        font-size: 28px;
        color: #f60;
    }
    .charts-footer {
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: rgb(238, 238, 238);
        height: 80px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .charts-footer-info {
        flex-direction: row;
        align-items: center;
    }
    .charts-footer-text {
        font-size: 28px;
        color: #999;
    }
    .charts-footer-count {
        font-size: 28px;
        color: #151515;
    }
    .charts-footer-inquiry {
        width: 120px;
        height: 48px;
        border-top-color: rgb(255, 102, 0);
        border-top-style: solid;
        border-top-width: 1px;
        border-right-color: rgb(255, 102, 0);
        border-right-style: solid;
        border-right-width: 1px;
        border-bottom-color: rgb(255, 102, 0);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-left-color: rgb(255, 102, 0);
        border-left-style: solid;
        border-left-width: 1px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
    }
    .inquiry-text {
        color: #f60;
        font-size: 28px;
        line-height: 48px;
        text-align: center;
    }
    /* <div class="charts-footer">
        <div class="charts-footer-inquiry" @click="inquiry">
            <text class="charts-footer-text">询底价</text>                        
        </div>
    </div> */
</style>
