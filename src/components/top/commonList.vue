<template>
    <div>
        <div class="charts" @click="go(d)" v-for="(d, index) in d">
            <div class="charts-cont">
                <div class="charts-cont-figure">
                    <image class="charts-cont-image" resize="cover" :src="d.logo"></image>
                    <image v-if="index < 3" class="charts-cont-index-bg" :src="DefaultImgPath + 'hot-charts-red.png'"></image>
                    <image v-else class="charts-cont-index-bg" :src="DefaultImgPath + 'hot-charts-green.png'"></image>
                    <text class="charts-cont-index-text">{{index+1}}</text>
                </div>
                <div class="charts-cont-right">
                    <div class="charts-cont-name-container">
                        <text class="charts-cont-name-text">{{d.sName}}</text>
                        <div class="rankings-change">
                            <div class="change-container" v-if="d.status === '1'">
                                <image class="change-icon" :src="DefaultImgPath + 'top-up.jpg'"></image>
                                <text class="up-text">{{d.statusNum}}</text>
                            </div>
                            <div class="change-container" v-if="d.status === '2'">
                                <image class="change-icon" :src="DefaultImgPath + 'top-down.jpg'"></image>
                                <text class="down-text">{{d.statusNum}}</text>
                            </div>
                            <div class="change-container" v-if="d.status === '3'">
                                <text class="not-change-text">-</text>
                            </div>
                        </div>
                    </div>
                    <text class="charts-cont-focus-text">关注指数：{{d.attentnum}}</text>
                    <div class="charts-cont-focus-line">
                        <div class="current-value" :style="{width: Math.round(d.width/100*170) + 'px'}"></div>
                    </div>
                    <div class="charts-cont-price-container">
                        <text class="charts-cont-price">{{d.price}}</text>
                        <div class="footer-price" @click="inquiry(d.proid)" v-if="d.proid">
                            <text class="footer-price-text">询底价</text>
                            <image :src="DefaultImgPath + 'go-f60.png'" class="footer-price-icon"></image>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    const storage = weex.requireModule('storage')
    export default {
        props: ['d', 'subCateId'],
        data () {
            return {}
        },
        methods: {
            // 根据type字段跳转不同的页面
            go (data) {
                const type = data.type
                switch (type) {
                    // 集团
                    case 1:
                        storage.setItem('groupType', data.tonnage, e => {
                            if (e.result === 'success') {
                                storage.setItem('groupName', data.group, e => {
                                    if (e.result === 'success') {
                                        this.goWeexUrl('group.weex.js')
                                    }
                                })
                            }
                        })
                        break;
                    // 品牌
                    case 2:
                        const brandId = data.id,
                            groupId = '';
                        storage.setItem('brandInfo', JSON.stringify({ brandId, groupId }), res => {
                            if (res.result === 'success') {
                                this.goWeexUrl('brand.weex.js')
                            }
                        })
                        break;
                    // 车系
                    case 3:
                        storage.setItem('seriesPageId', data.id, e => {
                            if (e.result === 'success') {
                                this.goWeexUrl('seriesPage.weex.js')
                            }
                        })
                        break;
                    // 子类车系
                    default:
                        const proid = data.proid,
                            F_SeriesId = data.id,
                            F_SubCategoryId = this.subCateId;
                        this.$goSeries({ proid, F_SeriesId, F_SubCategoryId })
                        break;
                }
            },
            inquiry (id) {
                this.$emit('inquiry', id)
            }
        },
    }
</script>

<style scoped>
    .charts {
        background-color: #fff;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: rgb(229, 229, 229);
        padding-top: 24px;
        padding-bottom: 24px;
    }
    .charts-cont {
        flex-direction: row;
        justify-content: space-between;
        position: relative;        
    }
    .charts-cont-figure {
        width: 224px;
        height: 150px;
        position: relative;
        margin-right: 20px;
    }
    .charts-cont-image {
        width: 224px;
        height: 150px;
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
    .charts-cont-name-container {
        width: 465px;
        height: 44px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .charts-cont-name-text {
        font-size: 28px;
        color: #333;
        width: 400px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .charts-cont-focus-text {
        line-height: 36px;
        font-size: 20px;
        color: #999;
        margin-top: 16px;
    }
    .charts-cont-focus-line {
        margin-top: 10px;
        height: 8px;
        width: 170px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #eee;
        position: relative;
    }
    .current-value {
        position: absolute;
        left: 0;
        top: 0;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #f60;
        height: 8px;
    }
    .charts-cont-price-container {
        width: 465px;
        margin-top: 20px;
        height: 36px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .charts-cont-price {
        color: #f60;
        font-size: 24px;
    }
    .footer-price {
        width: 90px;
        height: 36px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .footer-price-text {
        font-size: 24px;
        color: #f60;
    }
    .footer-price-icon {
        width: 12px;
        height: 20px;
    }
    .rankings-change {
        height: 44px;
    }
    .change-icon {
        width: 12px;
        height: 16px;
        margin-right: 4px;
    }
    .change-container {
        flex-direction: row;
        align-items: center;
    }
    .up-text {
        font-size: 24px;
        color: #f33;
    }
    .down-text {
        font-size: 24px;
        color: #17bb2b;
    }
    .not-change-text {
        font-size: 24px;
        color: rgb(56, 134, 252)
    }
    
</style>
