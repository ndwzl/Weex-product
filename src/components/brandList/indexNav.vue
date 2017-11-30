<template>
    <!--索引导航-->
    <div class="index-nav" @panmove="touchmove">
        <div v-for="(ele,index) in indexNav" @click="anchor(ele)" :ref="ele">
            <text :class="['index-nav-text', indicateText == ele ? 'visible' : '']">{{ele}}</text>
        </div>

        <div v-if="indicateShow" class="scale">
            <text class="indicate-text">{{indicateText}}</text>
        </div>
    </div>
</template>

<script type="text/babel">
    const dom = weex.requireModule('dom')
    const model = weex.requireModule('model')
    export default {
        props:['indexNav'],
        data(){
            return {
                //索引导航弹层提示
                indicateShow: false,
                //索引导航弹层内容
                indicateText: '',
                // 锚点区间
                area: [],
                // 上一次触发的字母
                lastLetter: '',
                // 保存touchmove的timeout
                timer: null,
                // 保存click的timeout
                time: null,
            }
        },
        methods: {
            anchor (index) {
                this.indicateText = index
                this.indicateShow = true
                clearTimeout(this.time)
                this.time = setTimeout(() => {
                    this.indicateShow = false
                },500)
                this.$emit('anchor',index)
            },
            jump (index) {
                this.indicateText = index
                this.indicateShow = true
                this.$emit('anchorNoAnimation', index)
            },
            touchmove (e) {
                // 距离文档顶部距离
                const pageY = e.changedTouches[e.changedTouches.length - 1].pageY
                const area = this.area
                for (let i = 0; i < area.length; i++) {
                    // 当距离文档顶部距离 大于等于区间开始且小于区间结束 就是当前需要触发的字母
                    if (pageY >= area[i] && pageY < area[i + 1]) {
                        let letter = this.indexNav[i]
                        // 防止重复触发
                        if (this.lastLetter !== letter) {
                            this.lastLetter = letter
                            this.jump(letter)
                        }
                        // 正序找到后 break 避免浪费性能
                        break
                    }
                }
                // 每次清除上一次的timeout 实现500ms无操作关闭
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.indicateShow = false
                }, 500)
            },
        },
        watch: {
            indexNav: function (now) {
                now.length && this.$nextTick(() => {
                    setTimeout(()=>{
                        now.forEach((letter, index) => {
                            // 获取每个字母距离顶部的位置 生成区域的数组
                            dom.getComponentRect(this.$refs[letter][0], option => {
                                this.area.push(option.size.top)
                                // 在最后面补充最后一个区间的结束点
                                index === now.length - 1 && this.area.push(option.size.top + 44)
                            })
                        })
                    }, 500)
                })
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
        text-align: center;
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
