<template>
    <div class="nav-bar">
        <div class="inner">
            <text class="nav-text selected">品牌</text>
        </div>
        <div class="inner" @click="jump(0)">
            <text class="nav-text">筛选</text>
        </div>
        <div class="inner" @click="jump(1)">
            <text class="nav-text">按工况</text>
        </div>
        <div class="inner" @click="jump(2)">
            <text class="nav-text">排行榜</text>
        </div>
        <div class="history" @click="historyShow" >
            <image  @click="historyShow" src="https://s.kcimg.cn/wap/images/app_icon/history.png" style="width:32px;height:32px;"></image>
            <!--<text :style="{fontFamily:'detail',color:'#999',fontSize:'32px'}">&#x53f2;</text>-->
        </div>
    </div>
</template>


<script type="text/babel">
    export default {
        props: ['currentVersion'],
        methods:{
            historyShow(){
                this.$emit('historyShow')
            },
            getVersion (type) {
                const matchResult = this.currentVersion.match(/(\d+)\.(\d+)/)
                return type === 'big' ? Number(matchResult[1]) : Number(matchResult[2])
            },
            jump (page) {
                const middleVersion = this.getVersion('middle')
                const bigVersion = this.getVersion('big')
                // 版本预判跳转
                switch (page) {
                    case 0:
                        // 筛选
                        if (bigVersion > 1 || middleVersion >= 1) {
                            this.goWeexUrl('filter.weex.js')
                        } else {
                            this.goUrl('https://product.m.360che.com/price/')
                        }
                        break;
                    case 1:
                        // 按工况
                        if (bigVersion > 1 || middleVersion >= 2) {
                            this.goWeexUrl('condition.weex.js')
                        } else {
                            this.goUrl('https://product.m.360che.com/sel/')
                        }
                        break;
                    case 2:
                        // 排行榜
                        if (bigVersion > 1 || middleVersion >= 3) {
                            this.goWeexUrl('top.weex.js')
                        } else {
                            this.goUrl('https://top.m.360che.com/')
                        }
                        break;
                }
            }
        }
    }
</script>

<style scoped>
    .nav-bar{
        position:relative;
        height:90px;
        background-color: #fff;
        flex-direction: row;
        align-items:center;
        justify-content: center;
    }
    .inner{
        height:90px;
        justify-content: center;
        padding-left:30px;
        padding-right:30px;
    }
    .inner:active{
        background-color:rgba(0,0,0,.2);
    }
    .nav-text{
        color:#999;
        font-size:32px;
    }
    .selected{
        color:#333;
        font-size:36px;
    }
    .history{
        position:absolute;
        right:0;
        top:0;
        width:100px;
        height:100px;
        justify-content:center;
        align-items:center;
        z-index:15;
    }
</style>
