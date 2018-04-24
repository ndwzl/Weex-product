<template>
    <div class="charts">
        <div v-if="iosTop" class="ios-top"></div>
        <!--页面标题-->
        <title :titleName="info.title" :follow="1" @followChange="followChange"></title>
        <!-- 关注指数 -->
        <div v-if="follow" class="desc">
            <text class="desc-text">卡车之家关注指数，反映了用户对于卡车品牌、车系、车型的关注状况。统计数据基于用户对卡车之家全站资讯、论坛、车型库、图片库的点击行为，包含pc端和移动端的数据，以及品牌影响力、用户询价数据、整个市场环境等综合因素影响。</text>
            <div class="knew" @click="followChange">
                <text class="knew-text">我知道了</text>
                <image class="knew-icon" :src="DefaultImgPath + 'packup.png'"></image>
            </div>
        </div>
        <!-- 卡车类型 -->
        <type :isThreeColumn="1" :info="info.topList" @changeType="changeType"></type>
        
        <list @scroll="scroll" loadmoreoffset="88" offset-accuracy="40" ref="list">
            <cell ref="header"></cell>
            <!-- top5 -->
            <cell v-for="(list, index) in info.list" :key="list.subCateId" v-if="showTop5" :ref="'list'+index">
                <div class="top5">
                    <div class="top5-title">
                        <div class="vertical-line"></div>
                        <text class="top5-title-text">{{list.name}}</text>
                        <div class="complete-chart" @click="goCompleteCharts(index, list.desc)">
                            <text class="complete-chart-text">完整榜单</text>
                            <image class="complete-chart-icon" :src="DefaultImgPath + 'go-grey.png'"></image>
                        </div>
                    </div>
                    <div class="container">
                        <common-list :d="list.data" @inquiry="inquiry"></common-list>
                    </div>
                </div>
            </cell>
            <cell v-if="!showTop5" :keep-scroll-position="false">
                <div class="container top5">
                    <div class="top50-tab-bar">
                        <div class="tab-block" v-for="(data, index) in info.typeList" :key="'tab'+index" @click="tabChang(data.type, index)">
                            <text :class="['tab-text', data.default ? 'tab-active' : '']">{{data.name}}</text>
                            <div class="active-line" v-if="data.default"></div>
                        </div>
                    </div>
                    <model-list v-if="isModel" :d="info.list" @inquiry="inquiry"></model-list>
                    <common-list v-else :d="info.list" :subCateId="info.subCateId" @inquiry="inquiry"></common-list>
                </div>
            </cell>
        </list>
        
        <!-- 回到顶部 -->
        <go-top @goTop="goTopHandler" :show="showGoTop"></go-top>
    </div>
</template>

<script type="text/babel">
import title from "../components/title.vue";
import type from "../components/filter/filterType.vue";
import goTop from "../components/goTop.vue";
import commonList from "../components/top/commonList.vue";
import modelList from "../components/top/modelList.vue";

// const stream = weex.requireModule('stream')
// const modal = weex.requireModule('modal')
// const thaw = weex.requireModule('THAW')
// const animation = weex.requireModule('animation')
// const storage = weex.requireModule("storage");
const dom = weex.requireModule("dom");
const globalEvent = weex.requireModule("globalEvent");

export default {
    components: {
        title,
        type,
        goTop,
        commonList,
        modelList,
    },
    data() {
        return {
            // 页面数据
            info: {
                title: '卡车排行榜',
                topList: []
            },
            //苹果头部白条
            iosTop: false,
            // 请求锁
            requestLock: true,
            // 显示去顶部
            showGoTop: false,
            // 是否展示top5
            showTop5: true,
            // 选择类型
            desc: '',
            // 当前列表结果分类
            currentType: 1,
            // 关注指数
            follow: false,
            // 是否为车型列表
            isModel: false,
            // 大数据所用分类
            typeName: '',
            // 滚动锁
            scrollLock: true,
            firstComplete: true
            //统计
            // el: '产品库-子类车系综述页',
        };
    },
    methods: {
        // 自释放滚动锁
        autoOpenScrollLock () {
            // 锁上滚动锁并500ms后自动释放
            this.scrollLock = false
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.scrollLock = true
            }, 500)
        },
        // 关注指数显示隐藏切换
        followChange () {
            if (this.scrollLock) {
                this.follow = !this.follow
            }
        },
        // tab切换
        tabChang (type, idx) {
            let typeList = [...this.info.typeList]
            typeList.map(item => item.default = false)
            typeList[idx].default = true
            this.info.typeList = typeList
            // 设置当前列表分类
            this.currentType = idx
            this.getCompleteData(type, idx)
        },
        // 跳转完整榜单
        goCompleteCharts(index, desc) {
            let topList = [...this.info.topList]
            topList.map(item => item.selected = false)
            topList[index].selected = true
			// 设置大数据所用分类
            this.typeName = topList[index].name
            this.info.topList = topList
            this.desc = desc
            this.getCompleteData()
        },
        // 获取完整榜单数据  1：品牌列表 2：车系列表 3：车型列表 (默认2)
        getCompleteData (type = 2, idx) {
            if (!this.requestLock) {
                return;
            }
            this.requestLock = false
            this.showLoading()
            // 根据获取筛选结果页面数据
            this.getData(`${this.ajaxUrl()}/index.php?r=api/top/detail&desc=${this.desc}&type=${type}&v=0103`, res => {
                if (res.ok && res.data.code) {
                    this.goTopHandler(false)
                    // 定义映射data
                    let { title, typeList, list, subCateId } = res.data.data
                    let listBackUp = []
                    // 首次渲染组件只渲染5条数据 后面的延迟加载
                    if (this.firstComplete) {
                        this.showTop5 = false
                        listBackUp = [...list]
                        list.length = 5
                    }
                    
                    const topList = this.info.topList
                    // 设置初始数据
                    this.info = { topList, title, typeList, list, subCateId }
                    // 首次渲染组件只渲染5条数据 后面的延迟加载
                    if (this.firstComplete) {
                        this.$nextTick(() => {
                            this.goTopHandler(false)
                            setTimeout(() => {
                                this.info.list = listBackUp
                            }, 500)
                        })
                        this.firstComplete = false
                    }
                    
                    // 设置是否为车型top50
                    this.isModel = idx === 2 ? true : false
                    this.sendBigData(true)
                }
                this.requestLock = true
                this.hideLoading()
            })
        },
        inquiry(id) {
            this.sendGA("click")
            this.$goFooterPrice(id)
        },
        // 切换头部分类
        changeType(data, index) {
            let topList = [...this.info.topList]
            topList.map(item => item.selected = false)
            topList[index].selected = true
            // 设置大数据所用分类
            this.typeName = topList[index].name
			// 重置p4
			this.currentType = 1
            this.info.topList = topList
            this.desc = data.desc
            this.getCompleteData()
        },
        // 获取初始时的数据
        getInitData() {
            this.showLoading()
                
            // 根据获取筛选结果页面数据
            this.getData(`${this.ajaxUrl()}/index.php?r=api/top/index`, res => {
                if (res.ok && res.data.code) {
                    // 定义映射data
                    let { topList, list, title } = res.data.data
                    // 设置初始数据
                    this.info = { topList, list, title }
                    // 发送GA统计
                    this.sendGA()
                    // 发送大数据统计
                    this.sendBigData()
                }
                this.hideLoading()
            });
        },
        // 监听滚动距离（e.contentOffset.y）的大小 从而控制显示、隐藏goTop
        scroll(e) {
            const referenceValue = 1200
            const offsetY = Math.abs(Number(e.contentOffset.y))
            if (!this.showGoTop && offsetY > referenceValue) {
                this.showGoTop = true
            }
            if (this.showGoTop && offsetY < referenceValue) {
                this.showGoTop = false
            }
            this.follow = false
            this.autoOpenScrollLock()
        },
        // 回到顶部
        goTopHandler(animated = true) {
            dom.scrollToElement(this.$refs.header, {offset: 0, animated: animated})
        },
        // 发送GA统计
        sendGA(type = "load") {
            if (type === "load") {
                this.goUrlGa(weex.config.deviceId, "product.m.360che.com", '产品库-排行榜页', this.info.title)
            } else if (type === "click") {
                this.eventGa(weex.config.deviceId, "点击询底价按钮", '产品库-排行榜页', "")
            }
        },
        // 发送大数据统计
        sendBigData(isComplete = false) {
            let param = {
                p2: 3
            }
            if (isComplete) {
                const map = new Map([
                    ["牵引车", 66],
                    ["载货车", 64],
                    ["自卸车", 63],
                    ["轻卡", 3],
                    ["中卡", 2],
                    ["重卡", 1]
                ])
				console.log(this.typeName)
                param.p3 = map.get(this.typeName)
                param.p4 = this.currentType
            }
            this.collect(param)
        }
    },
    created() {
        //获取初始数据
        this.getInitData()

        //监听用户点击安卓物理返回键
        globalEvent && globalEvent.addEventListener("onRespondNativeBack", e => {
            this.goBack()
        })

        this.iosTop = this.isIos()
    },
    mounted() {}
};
</script>

<style scoped>
.ios-top {
    height: 40px;
    background-color: #fff;
}
.charts {
    background-color: #f5f5f5;
}
.container {
    background-color: #fff;
    padding-left: 20px;
    padding-right: 20px;
}
.top5 {
    background-color: #fff;
    margin-top: 30px;
}
.top5-title {
    position: relative;
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.vertical-line {
    position: absolute;
    top: 29px;
    left: 0;
    width: 4px;
    height: 42px;
    background-color: #1571e5;
}
.top5-title-text {
    padding-left: 30px;
    color: #222;
    font-size: 32px;
}
.complete-chart {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-right: 24px;
    width: 130px;
}
.complete-chart-text {
    color: #999;
    font-size: 24px;
}
.complete-chart-icon {
    width: 22px;
    height: 26px;
}
.top50-tab-bar {
    flex: 1;
    flex-direction: row;
}
.tab-block {
    justify-content: center;
    width: 237px;
    height: 72px;
    position: relative;
}
.tab-text {
    text-align: center;
    color: #999;
    font-size: 24px;
}
.tab-active {
    color: #1571e5;
}
.active-line {
    position: absolute;
    bottom: 0;
    width: 237px;
    height: 1px;
    background-color: #1571e5;
}
.desc {
    margin-bottom: 24px;
    background-color: #fff;
}
.desc-text {
    padding-top: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    padding-left: 24px;
    color: #999;
    font-size: 24px;
    line-height: 36px;
}
.knew {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(238, 238, 238);
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 96px;
}
.knew-text {
    color: #999;
    font-size: 28px;
}
.knew-icon {
    width: 26px;
    height: 18px;
    margin-left: 8px;
}
</style>
