<template>
    <div class="filter">
        <div v-if="iosTop" class="ios-top"></div>
        <!--页面标题-->
        <title titleName="筛选"></title>
        <!-- 筛选类型 -->
        <filter-type title="按用途类别选车" :info="info.subCateList" v-if="info.subCateList" @showSidebar="showSidebar" type="subCate"></filter-type>
        <filter-type title="按热门品牌选车" :info="info.hotBrands" v-if="info.subCateList" type="brand"></filter-type>
        <filter-type title="按价格选车" :info="info.priceList" v-if="info.subCateList" type="price"></filter-type>
        <!-- 侧边栏 -->
        <sidebar @subClassChange="subClassChange" :list="sidebarData" :isIos="iosTop" page="filter" type="subCate" v-if="sidebar"></sidebar>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import filterType from '../components/filter/filterType.vue'
    import sidebar from '../components/filter/sidebar.vue'

    const domModule = weex.requireModule('dom')
    const stream = weex.requireModule('stream')
    const modal = weex.requireModule('modal')
    const storage = weex.requireModule('storage')
    const thaw = weex.requireModule('THAW')
    const globalEvent = weex.requireModule('globalEvent')
    export default {
		components: {
            title,
            filterType,
            sidebar
        },
        data () {
            return {
                // 页面数据
                info: {
                    // 按用途类别选车
                    subCateList: [
                        // {
                        //     id: "63",
                        //     name: "自卸车"
                        // },
                        // {
                        //     id: 14,
                        //     name: "挂车",
                        //     isCate: 1
                        // }
                    ],
                    // 按热门品牌选车
                    hotBrands: [
                        // {
                        //     id: "5",
                        //     name: "一汽解放"
                        // },
                    ],
                    // 按价格选车
                    priceList: [
                        // {
                        //     id: "111",
                        //     name: "5万以下"
                        // },
                    ]
                },
                //苹果头部白条
                iosTop: false,
                // 子类弹层是否显示
                sidebar: false,
                // 子类弹层数据
                sidebarData: {
                    // subCateList: [
                    //     {
                    //         id: "61",
                    //         name: "发动机",
                    //     },
                    //     {
                    //         id: "62",
                    //         name: "变速箱",
                    //     },
                    // ],
                    // cateName : "配件"
                }
                //统计
                // el: '产品库-子类车系综述页',
            }
        },
        methods:{
            // 获取筛选页面数据
            getFilterData () {
                // 初始读取缓存 完成页面快速渲染
                storage.getItem('filterData', e => {
                    if (e.result === 'success') {
                        this.info = JSON.parse(e.data)
                    }
                    // 更新缓存
                    this.getData(`${this.ajaxUrl()}/index.php?r=weex/index`, res => {
                        if (res.ok) {
                            let resData = res.data
                            for (let i in resData) {
                                switch (resData[i].length%4) {
                                    case 2:
                                        resData[i].push({isnull:1})
                                        resData[i].push({isnull:1})
                                        break
                                    case 3:
                                        resData[i].push({isnull:1})
                                        break
                                    default:
                                        break
                                }
                            }
                            this.info = resData
                            storage.setItem('filterData', JSON.stringify(res.data))
                        }
                    })
                })
            },
            // 子类弹层显示隐藏切换
            subClassChange () {
                this.sidebar = !this.sidebar
            },
            // 显示子类弹层
            showSidebar (id) {
                const storageKey = `filteSidebarId${id}`
                // 读取缓存
                storage.getItem(storageKey, e => {
                    if (e.result === 'success') {
                        this.sidebarData = JSON.parse(e.data)
                        this.subClassChange()
                    }
                    // 更新缓存
                    this.getData(`${this.ajaxUrl()}/index.php?r=weex/index/cate-sub&cate_id=${id}`, res => {
                        if (res.ok) {
                            res.data.name = res.data.cateName
                            res.data.list = [...res.data.subCateList]
                            delete res.data.cateName
                            delete res.data.subCateList
                            this.sidebarData = res.data
                            this.sidebar = true
                            storage.setItem(storageKey, JSON.stringify(res.data))
                            // 发送大数据统计
                            this.collect({
                                p2: 1,
                                p3: 0,
                                p4: id,
                            })
                        }
                    })
                })
            }
        },
        created () {
            //前端监控
            this.weexLogger('筛选页')
            //获取筛选数据
            this.getFilterData()

            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack()
            })

            //如果是ios系统的话
            if(this.isIos()){
                //头部的高度
                this.iosTop = true
            }
        },
        mounted(){
            // 发送GA统计
            this.goUrlGa(weex.config.deviceId, 'product.m.360che.com', '产品库-筛选首页', '筛选首页')

            // 发送大数据统计
            this.collect({ p2: 1 })
        }
    }
</script>

<style scoped>
    .filter-list {
        flex: 1;
    }
    .ios-top {
        height:40px;
        background-color: #fff;
    }
</style>
