<template>
    <div class="slider">
        <slider class="init" @change="change" :index="initIndex">
            <div class="img-list" v-for="img in imgList">
                <image class="image" resize="cover" :src="img.url" @click="goImgInfo"></image>
            </div>
        </slider>
    </div>
</template>

<script type="text/babel">
    const storage = weex.requireModule('storage');
    export default {
        props: ['imgList'],
        data () {
            return {
                trueIndex: 0,
                cpInitIndex: 0,
                isInit: true,
                lastEIndex: 0,
                isCritical: false,
                hasIndex: false,
                initIndex: 5
            }
        },
        created () {
        //    storage.getItem('sliderInitIndex', ele => {
        //         if (ele.result == 'success') {
        //             this.cpInitIndex = this.initIndex = Number(ele.data)
        //             this.hasIndex = true
        //             this.alert('initIndex: ' +this.initIndex)
        //         }
        //     })
        },
        methods: {
            //点击隐藏其他
            goImgInfo(){
                this.$emit('goImgInfo')
            },
            change (e) {
                // 保证初始index正确
                if (!e.index && this.cpInitIndex > -1) {
                    this.cpInitIndex = -1
                    return
                }
                this.alert('e.index: '+e.index)
                // // 上一张
                // if (e.index === this.lastEIndex - 1) {
                //     this.lastEIndex--
                //     this.trueIndex--
                //     this.$emit('sliderChange', this.trueIndex)
                //     return
                // }
                // // 下一张
                // if (e.index === this.lastEIndex + 1) {
                //     this.lastEIndex++
                //     this.trueIndex++
                //     this.$emit('sliderChange', this.trueIndex)
                //     return
                // }
                // // 左侧临界点
                // if (e.index === this.imgList.length - 1) {
                    
                // }
                // this.alert(e.offsetXRatio)
                this.$emit('sliderChange', e.index)
            }
        },
    }
</script>

<style scoped>
    .slider {
        
    }
    .init {
        width: 750px;
        height: 500px;
    }
    .img-list{
        width:750px;
        height:500px;
        position: relative;
    }
    .img-text{
        color:#999;
        font-size:100px;
    }
    .image{
        width: 750px;
        height:500px;
    }
</style>