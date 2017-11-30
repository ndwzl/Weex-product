<template>
    <div :class="['sidebar-wraper', iosTop ? 'iosTop' : '']">
        <div class="sidebar-mask" @click="closeSiderbar"></div>
        <div class="sidebar" ref="sidebar">
            <list>
                <!-- 标题 -->
                <cell class="header">
                    <div class="header-cont">
                        <text class="header-text">品牌</text>
                    </div>
                    <div class="header-back-wraper" @click="closeSiderbar">
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/back.png" class="header-back"></image>
                    </div>
                </cell>
                <!-- 不限品牌 -->
                <cell class="unlimited" @click="select()">
                    <div class="all">
                        <text class="all-text">ALL</text>
                    </div>
                    <div class="unlimited-cont">
                        <text :class="['unlimited-text', brandUnlimit ? 'brand-selected' : '']">不限</text>
                    </div>
                </cell>
                <!-- 品牌列表 -->
                <cell v-for="(brands, index) in data.brandList" :ref="data.letters[index]" class="brand-list">
                    <!-- 品牌拼音首字母 -->
                    <div class="letter">
                        <text class="letter-text">{{data.letters[index]}}</text>
                    </div>
                    <div v-for="(brand, brandIndex) in brands" :class="['brand-cont', brandIndex ? '' : 'brand-cont-first']" @click="select(brand)">
                        <image :src="brand.src" class="brand-icon"></image>
                        <div class="brand-text-wraper">
                            <text :class="['brand-text', brand.selected ? 'brand-selected' : '']">{{brand.name}}</text>
                        </div>
                    </div>
                </cell>
            </list>
            <!-- 右侧品牌字母导航 -->
            <index-nav :indexNav="data.letters" @anchor="anchor"></index-nav>
        </div>
    </div>
</template>

<script type="text/babel">
    import indexNav from '../../components/brandList/indexNav.vue'
    const dom = weex.requireModule('dom')
    const storage = weex.requireModule('storage')
    const animation = weex.requireModule('animation')
    export default {
        components: {indexNav},
        props: ['data', 'brandUnlimit'],
        data () {
            return {
                iosTop: false
            }
        },
        methods: {
            select (data) {
                // 选择不限
                if (!data) {
                    data = {
                        unlimited: true,
                        type: '品牌',
                        id: ''
                    }
                }
                this.$emit('selectType', data, 0, true)
                this.closeSiderbar()
            },
            closeSiderbar () {
                this.change('600px', () => {
                    this.$emit('brandSidebarChange')
                })
            },
            // 按字母选择品牌
            anchor (letter) {
                dom.scrollToElement(this.$refs[letter][0], { offset: 0 })
            },
            // 开启关闭侧边栏
            change (translateX = 0, callback) {
                animation.transition(this.$refs.sidebar, {
                    styles: {
                        transform: `translateX(${translateX})`,
                    },
                    duration: 300, //ms
                    timingFunction: 'ease-out',
                    delay: 0 //ms
                }, () => {
                    callback && callback()
                })
            }
        },
        created () {
            if (this.isIos()) {
                this.iosTop = true
            }
        },
        mounted () {
            this.change()
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
.unlimited {
    height: 88px;
    background-color: #fff;
    flex-direction: row;
    align-items: center;
}
.all {
    width: 90px;
    height: 60px;
    border-top-color: rgb(238, 238, 238);
    border-top-style: solid;
    border-top-width: 1px;
    border-right-color: rgb(238, 238, 238);
    border-right-style: solid;
    border-right-width: 1px;
    border-bottom-color: rgb(238, 238, 238);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-left-color: rgb(238, 238, 238);
    border-left-style: solid;
    border-left-width: 1px;
    margin-left: 30px;
    margin-right: 30px;
}
.all-text {
    line-height: 60px;
    font-size: 32px;
    color: #d8d8d8;
    text-align: center;
}

.brand-list {
    background-color: #fff;
}
.letter {
    padding-left: 30px;
    height: 60px;
    background-color: #f5f5f5;
}
.letter-text {
    font-size: 28px;
    color: #666;
    line-height: 60px;
}
.brand-cont {
    margin-left: 30px;
    height: 88px;
    flex-direction: row;
    align-items: center;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(238, 238, 238);
}
.brand-cont-first {
    border-top-width: 0;
}
.brand-icon {
    width: 90px;
    height: 60px;
    margin-right: 30px;
}
.unlimited-text, .brand-text {
    font-size: 32px;
    color: #333;
}
.type-disable {
    color: #bbb;
}
.brand-selected {
    color: #1571e5;
}
/*<!-- 品牌列表 -->
    <div v-for="(brand, brandIndex) in brands" :class="['brand-cont', brandIndex ? '' : 'brand-cont-first']" @click="select(brand)">
        <image :src="brand.src" class="brand-icon"></image>
        <div class="brand-text-wraper">
            <text :class="['brand-text', brand.selected ? 'brand-selected' : '']">{{brand.name}}</text>
        </div>
*/
</style>
