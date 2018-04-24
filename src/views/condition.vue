<template>
    <div class="condition" :style="{height: FullScreenHeight}">
        <div v-if="iosTop" class="ios-top"></div>
		<!--页面标题-->
        <title titleName="按工况"></title>
        <!-- 选择进度 -->
		<div class="progress">
            <div :class="['line', selectCarInfo ? '' : 'select-road-bg']"></div>
            <div class="select-car">
                <text class="select-car-text" v-if="selectCarInfo">···</text>
                <text class="select-car-text select-car-text-selected" v-else>√</text>
            </div>
            <div class="select-car-name">
                <text :class="['select-car-name-text', selectCarInfo ? '' : 'small-font']">选择车辆信息</text>
            </div>
            <div :class="['select-road', selectCarInfo ? '' : 'select-road-bg']">
                <text class="select-car-text" v-if="!selectCarInfo">···</text>
            </div>
            <div class="select-road-name">
                <text :class="['select-car-name-text', selectCarInfo ? 'small-font' : '']">选择路况信息</text>
            </div>
		</div>

        <!-- 选择条件 第一步 -->
        <div v-if="selectCarInfo">
            <condition-list index="1" title="请选择用途类别" :info="subList" @select="handler" type="sub"></condition-list>
            <condition-list index="2" title="请选择驱动形式" :info="driveList" @select="handler" type="drive"></condition-list>
            <condition-input index="3" title="请确认车货总重" info="车货总重" :value="weight" unit="吨" @input="handler" type="weight"></condition-input>
            <condition-button :step="0" @next="next"></condition-button>
        </div>
        <!-- 选择条件 第二步 -->
        <div v-else>
            <condition-list index="1" title="请选择驾驶路况" :info="roadList" @select="handler" type="road"></condition-list>
            <condition-input index="2" title="请确认平均坡度" info="平均坡度" :value="slope" unit="%" @input="handler" type="slope" hasPoint="1"></condition-input>
            <condition-input index="3" title="请确认平均经济车速" info="平均经济车速" :value="speed" unit="km/h" @input="handler" type="speed"></condition-input>
            <condition-button :step="1" @changeStep="changeStep" @complete="complete"></condition-button>
        </div>
	
        <!-- 通知栏 -->
        <notification :content="notificationContent" :showNotification="showNotification"></notification>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import conditionInput from '../components/condition/input.vue'
    import conditionList from '../components/condition/list.vue'
    import conditionButton from '../components/condition/button.vue'
    import notification from '../components/condition/notification.vue'

    // const stream = weex.requireModule('stream')
    // const modal = weex.requireModule('modal')
    // const thaw = weex.requireModule('THAW')
    // const animation = weex.requireModule('animation')
    // const dom = weex.requireModule('dom')
    const storage = weex.requireModule('storage')
    const globalEvent = weex.requireModule('globalEvent')
    
    export default {
		components: {
            title,
            conditionInput,
            conditionList,
            conditionButton,
            notification,
        },
        data () {
            return {
                // 页面数据
                //苹果头部白条
                iosTop: false,
                // 请求锁
                requestLock: true,
                // 是否为选择车辆信息
                selectCarInfo: true,
                // 总车重
                weight: '',
                // 平均坡度
                slope: '',
                // 平均车速
                speed: '',
                // 用途类别
                subList: [],
                // 驱动形式
                driveList: [],
                // 路况
                roadList: [],
                // 通知栏内容
                notificationContent: '',
                // 显示通知栏内容 通过++通知子组件显示
                showNotification: 0,
                // 当前子类id
                subId: '',
                // 驱动形式id
                driveId: '',
                // 路况id
                roadId: '',
                // 选车结果请求接口所需默认参数
                defaultParams: '',
                //统计
                // el: '产品库-子类车系综述页',
            }
        },
        methods: {
            // 监听用户选择、输入
            handler ({type, data, index}) {
                // 选择的 (单选)
                if (type === 'sub' || type === 'drive' || type === 'road') {
                    let typeList = [...this[`${type}List`]]
                    typeList.forEach((item, _index) => {
                        item.selected = _index === index ? true : false
                    })
                    this[`${type}List`] = typeList
                }
                switch (type) {
                    case 'sub':
                        this.driveListBackUp[index].forEach(item => {
                            item.selected = false
                        })
                        this.driveList = this.driveListBackUp[index]
                        // 设置当前的子类id
                        this.subId = this.subList[index].subId
                        break;
                    case 'drive':
                        // 没选子类时候不请求服务端
                        if (!this.subId) return;
                        // 更新驱动形式id
                        this.driveId = data.F_SearchId
                        this.queryParam({}).then(res => {
                            this.weight = res.value
                        })
                        break;
                    case 'road':
                        // 设置路况id
                        this.roadId = data.id
                        // 请求默认坡度数据
                        this.queryParam({type: 5, roadId: data.id}).then(res => {
                            this.slope = res.value
                        })
                        // 请求默认坡度数据
                        this.queryParam({type: 7, roadId: data.id}).then(res => {
                            this.speed = res.value
                        })
                        break;
                    default:
                        // 输入的
                        this[type] = data
                        break;
                }
            },
            // 下一步 (需要验证第一步用户的选择、输入)
            next () {
                // 用途类别
                if (!this.subId) {
                    this.showAlert('请选择用途类别')
                    return;
                }
                // 驱动形式
                if (this.unchecked('drive')) {
                    this.showAlert('请选择驱动形式')
                    return;
                }
                // 车重
                if (!(this.weight >= 5 && this.weight <= 150)) {
                    this.showAlert('请输入有效数字（5-150吨）')
                    return;
                }
                this.changeStep()
            },
            // 判断选项是否未选
            unchecked (type) {
                let unSelect = true;
                this[`${type}List`].forEach(item => {
                    if (item.selected) unSelect = false
                })
                return unSelect
            },
            // 完成筛选 (需要验证第二步用户的选择、输入)
            complete () {
                // 路况
                if (this.unchecked('road')) {
                    this.showAlert('请选择驾驶路况')
                    return;
                }
                // 平均坡度
                if (!(this.slope >= 0 && this.slope <= 12)) {
                    this.showAlert('请确认平均坡度（0-12%）')
                    return;
                }
                // 平均经济车速
                if (!(this.speed >= 30 && this.speed <= 120)) {
                    this.showAlert('请确认平均经济车速（30-120km/h）')
                    return;
                }
                this.setDefaultParams()
                this.getResultData()
            },
            // 设置选车结果页所需默认参数
            setDefaultParams () {
                const data = {
                    subId: this.subId,
                    driveId: this.driveId,
                    roadId: this.roadId,
                    weighTotal: this.weight,
                    avgGradient: this.slope,
                    maxEncSpeed: this.speed,
                }
                const { keys, values, entries } = Object
                for (const [key, value] of entries(data)) {
                    this.defaultParams += `&${key}=${value}`
                }
            },
            // 获取选车结果数据
            getResultData(isLoadmore = false) {
                // 请求锁
                if (!this.requestLock) return;
                // 关闭请求锁
                this.requestLock = false

                this.showLoading()

                // 根据获取筛选结果页面数据
                this.getData(`${this.ajaxUrl()}/index.php?r=api/select/list&brandId=&order=1&page=0${this.defaultParams}`, res => {
                    if (res.ok && res.data.code) {
                        let info,
                            brandListSidebarData,
                            forbiddenLoadmore,
                            data = res.data.data;
                        // 加载第一页
                        let {title, totalCount, brandHot, productList, letters, brandList,} = data
                        if (productList.length) {
                            info = {title, totalCount, brandHot, productList,}
                            brandListSidebarData = {letters, brandList,}
                            forbiddenLoadmore = data.pageCount < 2 ?  true : false
                            // 存储选车结果页所需数据
                            this.storageData({info, brandListSidebarData, forbiddenLoadmore,})
                        } else {
                            this.showAlert('抱歉，暂无车型')
                        }
                    }
                    this.hideLoading()
                    // 打开请求锁
                    this.requestLock = true
                })
            },
            // 存储按工况选车结果页所需数据
            storageData ({info, brandListSidebarData, forbiddenLoadmore,}) {
                const data = {
                    defaultParams: this.defaultParams,
                    info,
                    brandListSidebarData,
                    forbiddenLoadmore,
                }
                storage.setItem('conditionData', JSON.stringify(data), res => {
                    if (res.result === 'success') {
                        // 跳转前重置数据
                        this.resetData()
                        this.goWeexUrl('conditionResult.weex.js')
                    }
                })
            },
            // 重置页面数据
            resetData () {
                this.getConditionData()
                this.selectCarInfo = true
                this.weight = this.slope = this.speed = this.subId = this.driveId = this.roadId = ''
                this.subList = this.driveList = this.roadList = []
            },
            // 显示通知
            showAlert (text) {
                this.notificationContent = text
                this.showNotification++
            },
            // 切换步骤
            changeStep () {
                this.selectCarInfo = !this.selectCarInfo
            },
            // 获取按工况数据
            getConditionData () {
                this.showLoading()
                this.getData(`${this.ajaxUrl()}/index.php?r=api/select/index`, res => {
                    if (res.ok && res.data.code) {
                        // 定义映射data中的用途类别、驱动形式、路况
                        let { subList, driveList, roadList } = res.data.data
                        
                        subList.forEach(item => {
                            let imgUrl = '';
                            item.name = item.subName
                            switch (item.name) {
                                case '自卸车':
                                    imgUrl = 'https://s.kcimg.cn/wap/images/detail/zixie.jpg'
                                    break;
                                case '载货车':
                                    imgUrl = 'https://s.kcimg.cn/wap/images/detail/zaihuo.jpg'
                                    break;
                                default:
                                    imgUrl = 'https://s.kcimg.cn/wap/images/detail/qianyin.jpg'
                                    break;
                            }
                            item.imgUrl = imgUrl
                        })
                        driveList.forEach(array => {
                            array.forEach(item => {
                                item.name = item.F_SearchName
                            })
                        })
                        roadList.forEach(item => {
                            let imgName = '';
                            switch (item.name) {
                                case '平原':
                                    imgName = 'condition-plain'
                                    break;
                                case '山地':
                                    imgName = 'condition-mountain'
                                    break;
                                case '丘陵':
                                    imgName = 'condition-hill'
                                    break;
                                default:
                                    imgName = 'condition-multiple'
                                    break;
                            }
                            item.imgUrl = `${this.DefaultImgPath}${imgName}.png`
                            item.activeImgUrl = `${this.DefaultImgPath}${imgName}-active.png`
                        })
                        this.subList = subList
                        this.driveListBackUp = driveList
                        let lengthArray = driveList.map( (arr, index) => {
                            return {
                                length: arr.length,
                                index: index
                            }
                        })
                        lengthArray.sort((a, b) => b.length - a.length)
                        this.driveList = driveList[lengthArray[0].index]
                        console.log(this.driveList)
                        this.roadList = roadList
                        // 发送GA统计--未配置
                        this.sendGA()
                        // 发送大数据统计--未配置
                        this.sendBigData()
                    }
                    this.hideLoading()
                })
            },
            // 根据条件查询参数信息
            queryParam ({type = '1', roadId = '0'}) {
                return new Promise((resolve, reject) => {
                    this.getData(`${this.ajaxUrl()}/index.php?r=api/select/param&subId=${this.subId}&driveId=${this.driveId}&type=${type}&roadId=${roadId}`, res => {
                        if (res.ok && res.data.code) {
                            resolve(res.data.data)
                            // 发送GA统计--未配置
                            this.sendGA()
                            // 发送大数据统计--未配置
                            this.sendBigData()
                        }
                    })
                })
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
            sendBigData (seriesSiderbarData) {
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
            this.weexLogger('按工况')

            //获取默认按工况选车的数据
            this.getConditionData()

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
	.condition {
		background-color: #f5f5f5;
	}
    .progress {
        height: 160px;
        background-color: #fff;
        align-items: center;
        padding-top: 30px;
        position: relative;
    }
    .line {
        width: 462px;
        height: 10px;
        margin-top: 32px;
        background-color: #eee;
        position: relative;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: rgb(203, 203, 203);
    }
    .select-car, .select-road {
        position: absolute;
        top: 52px;
        width: 28px;
        height: 28px;
        border-top-left-radius: 50%;
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
        border-bottom-left-radius: 50%;
        background-color: #eee;
        justify-content: center;
        align-items: center;
    }
    .select-car {
        left: 136px;
        background-color: #1365e2;
    }
    .select-car-text {
        color: #fff;
        font-size: 28px;
        line-height: 30px;
    }
    .select-road {
        right: 136px;
    }
    .select-car-name,.select-road-name {
        width: 200px;
        align-items: center;
        position: absolute;
        top: 80px;
    }
    .select-car-name {
        left: 52px;
    }
    .select-car-name-text {
        color: #1571e5;
        font-size: 28px;
    }
    .select-road-name {
        right: 52px;
    }
    .select-car-name-text {
        color: #1571e5;
        font-size: 32px;
        line-height: 48px;
    }
    .small-font {
        color: #8faacc;
        font-size: 24px;
    }

    .select-road-bg {
        background-color: #1571e5;
    }
    .button-wrapper {
        margin-top: 60px;
        align-items: center;
        flex-direction: row;
        padding-left: 20px;
        padding-right: 20px;
    }
    .select-car-text-selected {
        padding-bottom: 8px;
    }
</style>
