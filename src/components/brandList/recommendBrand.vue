<template>
    <div class="recommend">
        <div class="title">
            <text class="title-text">推荐品牌</text>
            <div class="hot-charts" @click="goCharts">
                <image class="hot-charts-icon" :src="DefaultImgPath + 'hot-charts-icon.png'"></image>
                <text class="hot-charts-text">热销排行</text>
                <image class="hot-charts-right" :src="DefaultImgPath + 'hot-charts-right.png'"></image>
            </div>
        </div>
        <div class="content">
            <div class="recommend-list" v-for="(ele,index) in recommendList" @click="SidebarShow(ele)">
                <image :src="ele.img?ele.img:'http://img4.kcimg.cn/imgser/' + ele.F_BrandLogo" style="width:120px;height:80px"></image>
               <div class="recommend-name">
                   <text class="recommend-text">{{ele.name}}</text>
               </div>
            </div>
        </div>
        <div class="title">
            <text class="title-text">新能源选车</text>
        </div>
        <div class="new-rencar">
            <text class="new-texts" @click="newToPg(0)">电动轻卡</text>
            <text class="new-texts" @click="newToPg(1)">电动封闭箱货</text>
            <text class="new-texts" @click="newToPg(2)">LNG牵引车</text>
        </div>
    </div>
</template>

<script type="text/babel">
    const storage = weex.requireModule('storage')
    export default {
        props:['recommendList'],
        methods:{
            SidebarShow(ele){
               this.$emit('SidebarShow',ele)
            },
            goCharts () {
                this.goWeexUrl('hotCharts.weex.js')
            },
            newToPg (num) {
                const data = {
                    type: 'subCate',
                    id: null
                }
                switch (num) {
                    case 0:
                        data.id = '123'
                    break
                    case 1:
                        data.id = '124'
                    break
                    default:
                        data.id = '66'
                        data.num = '703'
                    break
                }
                storage.setItem('filterResultId', JSON.stringify(data), e => {
                    if (e.result === 'success') {
                        this.goWeexUrl('filterResult.weex.js')
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .recommend{
        background-color:#fff;
    }
    .title{
        height:60px;
        padding-left:20px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background-color: #f5f5f5;
    }
    .title-text{
        color:#1571e5;
        font-size:28px;
    }
    .hot-charts {
        height: 60px;
        padding-right: 20px;
        flex-direction: row;
        align-items: center;
    }
    .hot-charts-icon {
        width: 26px;
        height: 28px;
        margin-right: 10px;
    }
    .hot-charts-text {
        font-size: 28px;
        color: #f60;
    }
    .hot-charts-right {
        width: 30px;
        height: 24px;
        margin-left: 4px;
    }
    .content{
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#f5f5f5;
        flex-wrap: wrap;

    }
    .recommend-list{
        width:183px;
        height:154px;
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-left:20px;
        padding-bottom:10px;
        padding-right:20px;
    }
    .recommend-list:active{
        background-color:rgba(0,0,0,.2);
    }
    .recommend-name{
        justify-content: center;
        align-items: center;
        flex-direction: row;
        overflow: hidden;
    }
    .recommend-text{
        /*height:24px;*/
        margin-top:20px;
        color:#333;
        font-size:24px;
        flex-wrap: wrap;
        text-align: center;
    }
    .new-rencar{
        width: 750px;
        height: 100px;
        padding-top: 15px;
        padding-right:44px;
        padding-left:44px;
        background-color: #fff;
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        justify-content: space-between;
    }
    .new-texts{
        display: block;
        width: 200px; height: 68px;
        border-width: 2px;
        border-style: solid;
        border-color: #E9E9E9;
        border-radius: 30px;
        font-size: 28px;
        color: #333;
        text-align: center;
        line-height: 68px;
    }
</style>