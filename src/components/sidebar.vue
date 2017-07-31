<template>
    <div :class="['sidebar',showSidebar?'sidebar-visible':'']">
        <div :class="['shade',shadeShow?'shade-visible':'']" @click="sidebarHide"></div>
        <div style="flex: 1">
            <div class="sidebar-content" ref="side">
                <div class="sidebar-header">
                    <div class="back">
                        <text class="back-text" :style="{fontFamily:'detail'}">&#x56de;</text>
                    </div>
                    <text class="sidebar-title">重汽豪沃(HOWO)</text>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    const animation = weex.requireModule('animation');
    const modal = weex.requireModule('modal');
    export default {
        props: ['showSidebar'],
        data(){
            return {
                //sidebar遮罩层显示和隐藏
                shadeShow:false,
            }
        },
        created(){
            this.$nextTick(function(){
                var side = this.$refs.side;
                animation.transition(side, {
                    styles: {
                        transform: 'translate(0,0)',
                    },
                    duration: 300, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms
                })
            });
        },
        watcher:{
            showSidebar(){
                this.alert()
            }
        },
        methods:{
            alert(name){
                modal.alert({
                    message: name,
                    duration: 0.3
                })
            },
            sidebarHide(){

                this.$emit('sidebarHide')
//                var _this = this;
//                var side = this.$refs.side;
//                event.fromElement.classList.remove('visible');
//                animation.transition(side, {
//                    styles: {
//                        transform: 'translate3d(30px,0,0)',
//                    },
//                    duration: 300, //ms
//                    timingFunction: 'ease',
//                    delay: 0 //ms
//                }, function () {
//                    _this.$emit('sidebarHide')
//                });

            }
        }
    }
</script>

<style scoped>
    .sidebar {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 750px;
        padding-left: 140px;
    }

    .sidebar-visible {
        left: 0;
    }

    .shade {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .6);
        transform: translate(750px,0);
    }
    .shade-visible{
        transform: translate(0,0);
    }

    .sidebar-content {
        flex: 1;
        background-color: #fff;
        transform: translate(750px, 0);
    }

    .sidebar-header {
        position: relative;
        padding-left: 88px;
        height: 90px;
        align-items: center;
        justify-content: center;
    }

    .sidebar-title {
        color: #333;
        font-size: 36px;
    }

    .back {
        position: absolute;
        left: 0;
        top: 0;
        width: 88px;
        height: 90px;
        align-items: center;
        justify-content: center;
    }

    .back-text {
        font-size: 36px;
        color: #1571e5;
    }
</style>