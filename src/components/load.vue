<template>
    <div class="loading">
        <div class="loading">
            <!--<text class="loading-ring" ref="load" :style="{fontFamily:'detail',fontSize:'70px',color:'#586c94'}">等</text>-->
            <image src="https://s.kcimg.cn/wap/images/detail/productApp/loading.png" style="width:48px;height:48px;"></image>
            <text class="loading-text"> 正在加载更多...</text>
        </div>
    </div>
</template>

<script type="text/babel">
    const animation = weex.requireModule('animation')
    let modal = weex.requireModule('modal');
    export default {
        data(){
            return {
                rotate:8000,
            }
        },
        methods:{
            alert (text) {
                modal.alert({
                    message: text
                })
            },
            whirl(){
                var load = this.$refs.load;
                animation.transition(load, {
                    styles: {
                        transform: 'rotate(' + this.rotate + 'deg)',
                        transformOrigin: '50%'
                    },
                    duration: 8000, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                })
            }
        },
        mounted(){
            this.whirl();
        }
    }
</script>

<style scoped>
    .loading{
        margin-top: 10px;
        justify-content: center;
        align-items: center;
    }
    .loading-text{
        color:#586c94;
        font-size:24px;
        margin-top:10px;
    }
</style>