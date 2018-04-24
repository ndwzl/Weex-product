<template>
    <div class="notification" ref="notification" :style="{top: top}">
        <div class="content">
            <text class="content-text">{{content}}</text>
        </div>
        <div class="handler-bar"></div>
    </div>
</template>

<script type="text/babel">
    const animation = weex.requireModule('animation')
    export default {
        props: {
            // 内容
            content: {
                type: String,
                required: true
            },
            // 持续时间
            duration: {
                type: Number,
                default: 2000
            },
            // 动画时间
            animationDuration: {
                type: Number,
                default: 300
            },
            showNotification: {
                type: Number,
                required: 0
            }
        },
        data () {
            return {
                top: '-108px',
                timer: null
            }
        },
        methods: {
            show () {
                const top = this.isIos() ? '188px' : '108px'
                animation.transition(this.$refs.notification, {
                    styles: {
                        transform: `translateY(${top})`,
                    },
                    duration: this.animationDuration,
                    timingFunction: 'ease-out',
                    needLayout:false,
                    delay: 0,
                }, () => {
                    clearTimeout(this.timer)
                    this.timer = setTimeout (() => {
                        this.hide()
                    }, this.duration - this.animationDuration)
                })
            },
            hide () {
                animation.transition(this.$refs.notification, {
                    styles: {
                        transform: 'translateY(0)',
                    },
                    duration: this.animationDuration,
                    timingFunction: 'ease-out',
                    needLayout:false,
                    delay: 0,
                })
            },
        },
        mounted () {
            if (this.isIos()) this.top = '-148px'
        },
        watch: {
            showNotification: function () {
                this.show()
            }
        }
    }
</script>

<style scoped>
    .notification {
        position: fixed;
        left: 0;
        right: 0;
        background-color: rgba(234,67,53,.85);
        align-items: center;
    }
    .content {
        padding-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        padding-bottom: 20px;
    }
    .content-text {
        text-align: center;
        font-size: 32px;
        line-height: 48px;
        color: #fff;
        letter-spacing: 4px;
    }
    .handler-bar {
        width: 60px;
        height: 10px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color: rgba(255, 255, 255, .5);
        margin-top: 5px;
        margin-bottom: 5px;
    }
</style>
