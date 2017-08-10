<template>
    <div class="slider">
        <div class="init" ref="slider" :style="{transform: 'translate(' + (index * 750) + 'px, 0px)',width: imgList.length * 750 + 'px'}" @touchstart="begin" @touchend="slide">
            <div class="img-list" v-for="(img,number) in imgList">
                <!--<text class="img-text" :style="{fontFamily:'detail'}">&#xe602;</text>-->
                <!--<image src="https://s.kcimg.cn/wap/images/detail/productApp/image-icon.png" style="width:58px;height:58px;"></image>-->
                <image class="image" v-if="-index == number || (-index - number) == 1 || (number + index) == 1" style="width: 750px;height:500px" resize="cover" :src="img.url"></image>
             </div>
        </div>
    </div>
</template>

<script type="text/babel">
    let animation = weex.requireModule('animation');
    export default {
        props:['imgList','index'],
        data(){
            return {
                identifier:0,
                direction:'',
            }
        },
        created(){
//            this.alert(JSON.stringify(this.imgList))
        },
        methods:{
            begin(event){
                this.identifier = event.changedTouches[0].screenX;
            },
            slide(event){
//                this.alert(event.changedTouches[0].screenX)
                if(event.changedTouches[0].screenX - this.identifier > -50 && event.changedTouches[0].screenX - this.identifier < 50){
                    this.goImgInfo()
                    return
                }
                if(event.changedTouches[0].screenX - this.identifier > 0){
                    this.direction = 'left'
                }else{
                    this.direction = 'right'
                }
                this.$emit('slide',this.direction);
            },
            //点击隐藏其他
            goImgInfo(){
                this.$emit('goImgInfo')
            }
        },
        watch:{
            index(){
                let slider = this.$refs.slider;
                animation.transition(slider, {
                    styles: {
                        transform: 'translate(' + this.index * 750  + 'px, 0)'
                    },
                    duration: 300, //ms
                    timingFunction: 'ease',
                    delay: 0 //ms
                })
            }
        }
    }
</script>

<style scoped>
    /*.slider{*/
        /*width:750px;*/
        /*height:500px;*/
        /*overflow: hidden;*/
    /*}*/
    .init{
        flex-direction:row;
    }
    .img-list{
        position: relative;
        width:750px;
        height:500px;
        align-items: center;
        justify-content: center;
    }
    .img-text{
        color:#999;
        font-size:100px;
    }
    .image{
        position: absolute;
        left:0;
        top:0;
    }
</style>