<template>
    <!--索引导航-->
    <div class="index-nav">
        <div v-for="(ele,index) in indexNav" @click="anchor(ele)">
            <text :class="['index-nav-text',indicateText==ele?'visible':'']">{{ele}}</text>
        </div>

        <div v-if="indicateShow" class="scale">
            <text class="indicate-text">{{indicateText}}</text>
        </div>
    </div>
</template>

<script type="text/babel">
    var model = weex.requireModule('model')
    export default {
        data(){
            return {
                //索引导航弹层提示
                indicateShow:false,
                indicateText:'',
            }
        },
        props:['indexNav'],
        methods: {
            move(){
                alert(1)
            },
            anchor(index){
                this.indicateText = index;
                this.indicateShow = true;
                let time = setTimeout(() => {
                    this.indicateShow = false;
                    clearTimeout(time)
                },500);
                this.$emit('anchor',index);
            }
        }
    }
</script>

<style scoped>
    .index-nav {
        position: absolute;
        top: 0;
        right: 0;
        bottom:0;
        flex: 1;
        justify-content: center;
    }
    .index-nav-text{
        padding-left:10px;
        padding-right:10px;
        padding-bottom:5px;
        padding-top:5px;
        color:#666;
        font-size:28px;
    }
    .scale{
        position: fixed;
        left: 295px;
        top: 295px;
        width:160px;
        height:160px;
        background-color:rgba(0,0,0,.6);
        justify-content: center;
        align-items:center;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        justify-content: center;
        align-items:center;
    }
    .indicate-text{
        font-size: 100px;
        color: #fff;

    }
    .visible{
        color:#1571e5;
    }
</style>