<template>
    <div class="nav" v-if="navList.length">
        <scroller scroll-direction="horizontal" show-scrollbar="false" :class="['wrapper',unfold?'wrapper-fold':'']">
            <div :class="['init',unfold?'init-fold':'']">
                <div v-for="ele in navList" class="option" @click="clickNavList(ele)">
                    <text :class="['option-text',ele.selected ? 'visible' : '']">{{ele.name}}</text>
                </div>
            </div>
        </scroller>
        <!--<div class="shade first-shade"></div>-->
        <!--<div class="shade last-shade"></div>-->
        <!--<div :class="['fold',unfold?'unfold':'']" @click="unFold">-->
            <!--<text :style="{fontFamily:'detail',color:'#333',fontSize:'16px'}" ref="unfold">&#xe605;</text>-->
        <!--</div>-->
    </div>
</template>

<script type="text/babel">
    var animation = weex.requireModule('animation');
    var storage = weex.requireModule('storage');

    export default {
        props:['navList','navInfo'],
        data(){
            return {
                unfold: false,
            }
        },
        created(){
        },
        methods: {
            //展开收起导航列表
            unFold(){
                this.unfold = !this.unfold;
                let unfold = this.$refs.unfold;
                let rotate = this.unfold?'180':'0';
                animation.transition(unfold,{
                    styles:{
                        transform:'rotate(' + rotate + 'deg)',
                    },
                    duration:200,
                    timinFunction:'linear',
                    delay:0
                })
            },
            //点击导航列表
            clickNavList(ele){
                if(ele.selected){
                    return ;
                }
                this.goWeexUrl(ele.url)
                //如果是从车系页面进入图片页，
//                if(this.navInfo == 'series' && ele.name == '图片'){
                    //获取有没有车型id
//                    storage.getItem('ProductId',ele => {
//                        if(ele.result == 'success'){
//                            //如果有车型id，那么删掉车型id
//                            storage.removeItem('ProductId',remove => {
//                                if(remove.result == 'success'){
//                                    //进入图片页
//                                    this.goWeexUrl(ele.url)
//                                }
//                            });
//                        }else{
//                            this.goWeexUrl(ele.url)
//                        }
//                    })
//                }
            }
        }
    }
</script>

<style scoped>
    .nav {
        position: relative;
        width: 750px;
        overflow: auto;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #eee;
        background-color: #fff;
    }

    .wrapper {
        height: 80px;
    }

    .wrapper-fold {
        height: 160px;
    }

    .init {
        height: 80px;
        width: 750px;
        /*padding-right:108px;*/
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .init-fold {
        width:750px;
        flex-wrap: wrap;
    }

    .option {
        flex:1;
        /*padding-left: 32px;*/
        /*padding-right: 32px;*/
        height: 80px;
        justify-content: center;
        align-items: center;
        /*background-color:red;*/
        /*margin-bottom: 20px;*/
    }
    .option:active{
        background-color: rgba(0,0,0,.3);
    }
    .option-text {
        color: #333;
        font-size: 28px;
        padding-top: 20px;
        padding-bottom: 19px;
    }

    .visible {
        color: #586c94;
        border-bottom-width: 4px;
        border-bottom-color: #586c94;
        border-bottom-style: solid;
    }

    .shade {
        position: absolute;
        top: 0;
        width: 40px;
        height: 79px;

    }

    .first-shade {
        left: 0;
        width: 0;
        /*background-image: linear-gradient(to left,rgba(255,255,255,.8),rgba(255,255,255,.2));*/
        border-right-width: 10px;
        border-right-color: rgba(255, 255, 255, .8);
        border-right-style: solid;
        border-left-width: 10px;
        border-left-color: rgba(255, 255, 255, .9);
        border-left-style: solid;
    }

    .last-shade {
        right: 108px;
        width: 0;
        border-right-width: 10px;
        border-right-color: rgba(255, 255, 255, .9);
        border-right-style: solid;
        border-left-width: 10px;
        border-left-color: rgba(255, 255, 255, .8);
        border-left-style: solid;
    }

    .fold {
        position: absolute;
        top: 0;
        right: 0;
        width: 108px;
        height: 79px;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }
    .unfold{
        top:80px;
    }
</style>