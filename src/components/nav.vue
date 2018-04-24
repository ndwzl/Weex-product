<template>
    <div class="nav">
        <div v-for="item in navList" class="option" @click="goWeexUrl(item.url)">
            <image class="option-icon" :src="DefaultImgPath + item.icon" :style="{width: item.width, height: item.height}"></image>
            <text class="option-text">{{item.name}}</text>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props: ['navList','navInfo'],
        data () {
            return {}
        },
    }
</script>

<style scoped>
    .nav {
        width: 750px;
        height: 112px;
        background-color: #fff;
        flex-direction: row;
    }
    .option {
        flex: 1;
        align-items: center;
    }
    .option-icon {
        margin-top: 16px;
        margin-bottom: 8px;
    }
    .option-text {
        line-height: 40px;
        font-size: 24px;
        color: #2E3033;
    }
</style>