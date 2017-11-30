<template>
    <div :class="['sidebar-wraper', isIos ? 'iosTop' : '']">
        <div class="sidebar-mask" @click="closeSiderbar"></div>
        <div class="sidebar" ref="sidebar">
            <list>
                <!-- 标题 -->
                <cell class="header">
                    <div class="header-cont">
                        <text class="header-text">{{list.name}}</text>
                    </div>
                    <div class="header-back-wraper" @click="closeSiderbar">
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/back.png" class="header-back"></image>
                    </div>
                </cell>
                <!-- 列表 -->
                <cell v-for="(item, index) in list.list" class="type-list">
                    <div :class="['type-cont', index === 0 ? 'type-cont-first' : '']" @click="switchMethod(item)">
                        <text :class="['type-text', item.is_disable ? 'type-disable' : '', item.selected ? 'type-selected' : '']">{{item.name}}</text>
                    </div>
                </cell>
            </list>
        </div>
    </div>
</template>

<script type="text/babel">
    const storage = weex.requireModule('storage')
    const animation = weex.requireModule('animation')
    export default {
        props: ['list', 'isIos', 'page', 'index', 'type'],
        data () {
            return {}
        },
        methods: {
            switchMethod (data) {
                switch (this.page) {
                    case 'filter':
                        this.filterJump(data)
                        break;
                    case 'filterResult':
                        this.filterResultSelected(data)
                        break;
                }
            },
            filterJump (data) {
                // 跳转前关闭弹层
                this.$emit('subClassChange')
                const oData = {
                    id: data.id,
                    type: this.type
                }
                storage.setItem('filterResultId', JSON.stringify(oData), e => {
                    if (e.result === 'success') {
                        this.goWeexUrl('filterResult.weex.js')
                    }
                })
            },
            filterResultSelected (data) {
                if (data.is_disable) {
                    return
                }
                this.$emit('selectType', data, this.index)
                this.closeSiderbar()
            },
            closeSiderbar () {
                animation.transition(this.$refs.sidebar, {
                    styles: {
                        transform: 'translateX(600px)',
                    },
                    duration: 300, //ms
                    timingFunction: 'ease-out',
                    delay: 0 //ms
                }, () => {
                    this.$emit('subClassChange')
                })
            }
        },
        mounted () {
            animation.transition(this.$refs.sidebar, {
                styles: {
                    transform: 'translateX(0)',
                },
                duration: 300, //ms
                timingFunction: 'ease-out',
                delay: 0 //ms
            })
        },
    }
</script>

<style scoped>
.iosTop {
    margin-top: 40px;
}
.sidebar-wraper {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding-left: 150px;
}
.sidebar-mask {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
}
.sidebar {
    flex: 1;
    background-color: #f5f5f5;
    transform: translateX(600px);
}
.header {
    position: relative;
    height: 88px;
    background-color: #fff;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgb(238, 238, 238);
}
.header-back-wraper {
    position: absolute;
    left: 0;
    top: 0;
    width: 88px;
    height: 100%;
}
.header-back {
    width:20px;
    height:36px;
    margin-left: 34px;
    margin-top: 26px;
}
.header-cont {
    flex: 1;
    height: 100%;
    justify-content: center;
    align-items: center;
}
.header-text {
    font-size: 32px;
    color: #000;
}
.type-list {
    padding-left: 30px;
    background-color: #fff;
}
.type-cont {
    height: 88px;
    justify-content: center;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(238, 238, 238);
}
.type-cont-first {
    border-top-width: 0;
}
.type-text {
    font-size: 28px;
    color: #333;
}
.type-disable {
    color: #bbb;
}
.type-selected {
    color: #1571e5;
}
</style>
