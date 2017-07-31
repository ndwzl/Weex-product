<template>
    <div class="reputation">
        <div class="subtitle">
            <div class="title-name">
                <text class="subtitle-text">口碑</text>
                <div v-if="reputation.total > 0" class="reputation-number">
                    <text class="reputation-number-text">共</text>
                    <text class="reputation-number-sum">{{reputation.total}}</text>
                    <text class="reputation-number-text">条口碑</text>
                </div>
            </div>
        </div>
        <div class="add-reputation" @click="goUrl('https://product.m.360che.com' + reputation.link)">
            <div class="score">
                <text class="score-text">{{reputation.avgScore}}</text>
            </div>
            <div class="star">
                <div v-for="(ele,index) in star">
                    <text v-if="reputation.avgScore >= index+1" :style="{fontFamily:'detail',color:'#f60',marginRight:'5px',fontSize:'36px'}">&#x661f;</text>
                    <div v-else class="gray-star">
                        <text :style="{fontFamily:'detail',color:'#ccc',fontSize:'36px'}">&#x661f;</text>
                        <text v-if="(index - reputation.avgScore) < 1" class="simulate-star" :style="{fontFamily:'detail',width:(1 - (index - reputation.avgScore + 1)) * 38  + 'px'}">&#x661f;</text>
                    </div>
                </div>
            </div>
            <div class="add-button">
                <div class="button" @click="goUrl('https://product.m.360che.com' + reputation.addLink)">
                    <text class="add-button-text">我要发口碑</text>
                </div>
            </div>
            <text class="add-reputation-explain">发口碑得卡路里，精华口碑奖励翻倍</text>
        </div>
        <div class="reputation-info" @click="goUrl('https://product.m.360che.com' + reputation.reputation.link)">
            <div class="user-info-wrapper" v-if="reputation.reputation">
                <div class="head-portrait" style="width:90px;height:90px;">
                    <image :src="reputation.reputation.userInfo?reputation.reputation.userInfo.headpic:'https://i.kcimg.cn/data/avatar/noavatar_big.gif-50x50.jpg'" style="width:90px;height:90px;"></image>
                </div>
                <div class="user-info">
                    <div class="user-name">
                        <text class="user-name-text">{{reputation.reputation.userInfo?reputation.reputation.userInfo.nikename:''}}</text>
                        <div class="elite-icon">
                            <text v-if="reputation.reputation.F_Essence == 1" class="elite-text">精华</text>
                        </div>
                    </div>
                    <text class="configuration">裸车价:{{Math.round(reputation.reputation.F_NakedPrice) == reputation.reputation.F_NakedPrice ? Math.round(reputation.reputation.F_NakedPrice) : reputation.reputation.F_NakedPrice}}万  当前里程：{{Math.round(reputation.reputation.F_Kilomelre) == reputation.reputation.F_Kilomelre ? Math.round(reputation.reputation.F_Kilomelre) : reputation.reputation.F_Kilomelre}}公里  购买城市：{{reputation.reputation.address}}</text>
                </div>
            </div>
            <div class="evaluate"  v-if="reputation.reputation">
                <div v-for="(ele,number) in reputation.reputation.F_Full" v-if="number < 2" class="evaluate-list" ref="text">
                    <text v-for="(res,index) in ele" :class="['evaluate-text',index == 0 ? 'evaluate-title' : 'evaluate-content']">{{index == 0 ?(number == 0 ? res.replace('最','').replace('满','满        ') : res.replace('最','').replace('满','  满  ')): res}}</text>
                </div>
            </div>
            <div class="belong"  v-if="reputation.reputation">
                <text class="belong-text">{{reputation.reputation.proName}}</text>
            </div>
            <div class="energy"  v-if="reputation.reputation">
                <text class="energy-number">{{reputation.reputation.F_Essence == 1 ? '10' : '5'}}</text>
                <image style="width:140px;height:140px;" src="data:image/png;base64,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"></image>
                <text class="energy-text">卡路里</text>
            </div>
        </div>
        <div class="load-more" @click="goUrl('https://product.m.360che.com' + reputation.link)">
            <text class="load-more-text">查看更多{{titleName}}口碑</text>
            <text :style="{fontFamily:'detail',fontSize:'24px',color:'#999'}">&#x53bb;</text>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['reputation','titleName'],
        data(){
            return {
                star:['','','','','']
            }
        },
        created(){
          console.log(this.reputation)
        },
    }
</script>

<style scoped>
    .subtitle{
        height:100px;
        flex-direction:row;
        justify-content: space-between;
        align-items: center;
        padding-left:30px;
        padding-right:30px;
        border-top-width:20px;
        border-top-style: solid;
        border-top-color:#f5f5f5;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#e5e5e5;
    }
    .title-name{
        flex-direction: row;
        align-items: center;
    }
    .subtitle-text{
        color:#333;
        font-size:32px;
        font-weight: bold;
        line-height: 0;
    }
    .reputation-number{
        margin-left: 10px;
        flex-direction: row;
        align-items: center;
    }
    .reputation-number-text{
        color:#999;
        font-size:24px;
    }
    .reputation-number-sum{
        color:#f60;
        font-size:24px;
        margin-left:10px;
        margin-right:5px;
    }
    .add-reputation{
        padding-top: 20px;
        padding-bottom:20px;
        align-items:center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#eee;
    }
    .add-reputation:active{
        background-color:rgba(0,0,0,.2)
    }
    .score{
        height:90px;
        justify-content: center;
        align-items:center;
    }
    .score-text{
        text-align: center;
        font-size: 60px;
        color:#f60;
    }
    .star{
        flex-direction:row;
        align-content: center;
        justify-content:center;
    }
    .gray-star{
        position:relative;
    }
    .simulate-star{
        position:absolute;
        left:0;
        top:0;
        width:38px;
        height:40px;
        overflow: hidden;
        color:#f60;
        font-size:36px;
    }
    .add-button{
        height:110px;
        align-items:center;
        justify-content: center;
    }
    .button{
        width:384px;
        height:74px;
        align-items:center;
        justify-content: center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#f60;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#f60;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#f60;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#f60;
        border-top-left-radius: 80px;
        border-top-right-radius:80px;
        border-bottom-left-radius: 80px;
        border-bottom-right-radius:80px;
    }
    /*.button:active{*/
        /*background-color:rgba(0,0,0,.2)*/
    /*}*/
    .add-button-text{
        color:#f60;
        font-size:28px;
    }
    .add-reputation-explain{
        color:#999;
        font-size:24px;
    }
    .reputation-info{
        position:relative;
        padding-top:30px;
        padding-left:30px;
        padding-right:30px;
    }
    .reputation-info:active{
        background-color:rgba(0,0,0,.2)
    }
    .user-info-wrapper{
        flex-direction:row;
    }
    .head-portrait{
        width:90px;
        height:90px;
        overflow: hidden;
        margin-right:20px;
        border-top-left-radius: 45px;
        border-top-right-radius:45px;
        border-bottom-left-radius: 45px;
        border-bottom-right-radius:45px;
    }
    .user-info{
        flex:1;
    }
    .user-name{
        flex-direction:row;
        align-items:center;
    }
    .user-name-text{
        color:#333;
        font-size:28px;
    }
    .elite-icon{
        height:32px;
        align-items: center;
        justify-content: center;
        margin-left:20px;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#f60;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#f60;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#f60;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#f60;
        border-top-left-radius: 4px;
        border-top-right-radius:4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius:4px;
    }
    .elite-text{
        color:#f60;
        font-size:24px;
    }
    .configuration{
        color:#999;
        font-size:24px;
        margin-top:10px;
    }
    .energy{
        position:absolute;
        top:0;
        right:-20px;
        transform: rotate(-15deg);
    }
    .energy-number{
        position: absolute;
        top: 13px;
        left:0;
        right:0;
        font-size:68px;
        color:#f60;
        text-align: center;
    }
    .energy-text{
        position: absolute;
        left:0;
        right:0;
        top: 90px;
        font-size:28px;
        color:#f60;
        text-align: center;
    }
    .evaluate-list{
        flex-direction:row;
        align-items:flex-start;
        margin-top:10px;
        margin-bottom:10px;
    }
    .evaluate-text{
        color:#333;
        font-size:28px;
    }
    .evaluate-title{
        width:102px;
        margin-top:3px;
        margin-right:10px;
        font-size:24px;
        text-align: right;
    }
    .evaluate-content{
        flex: 1;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        lines: 2;
    }
    .belong{
        margin-top:16px;
        margin-bottom:20px;
        padding-left:110px;
    }
    .belong-text{
        color: #586c94;
        font-size:24px;
    }
    .load-more{
        height:80px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
    }
    .load-more:active{
        background-color:rgba(0,0,0,.2)
    }
    .load-more-text{
        color:#999;
        font-size: 28px;
        margin-right:10px;
    }

</style>