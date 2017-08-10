<template>
    <div class="brand-list">
        <div class="title">
            <text class="title-text">{{index}}</text>
        </div>
        <div class="model-list" v-for="(data,number) in brandListInfo">
            <div class="content" v-if="!data.list" @click="SidebarShow(data)">
                <image style="width:120px;height:80px;" :src="data.logo"></image>
                <text class="brand-name">{{data.F_BrandName}}</text>
            </div>
            <div v-else="data.list">
                <div :href="data.url" class="group-name" @click="goUrl(data.url)">
                    <image :src="data.F_BrandGroupImg" style="width:120px;height:80px;"></image>
                    <div class="group-info">
                        <div class="grupu-name-icon">
                            <text class="group-name-text">{{data.F_BrandGroupName}}</text>
                            <text class="group-icon-text">集团</text>
                        </div>
                        <div v-if="data.order" class="number-one">
                            <image src="https://s.kcimg.cn/wap/images/app_icon/first.png" style="width:30px;height:30px"></image>
                            <!--<text :style="{fontFamily:'detail',color:'#f60',fontSize:'26px'}">&#xe603;</text>-->
                            <text class="number-one-text">{{data.order}}No.1</text>
                        </div>
                    </div>
                </div>
                <div class="subclass">
                    <div v-for="(res,i) in data.list" class="subclass-name" @click="SidebarShow(res)">
                        <text class="subclass-name-text">{{res.F_BrandName}}</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props: ['brandListInfo','index'],
        methods:{
            SidebarShow(url){
                this.$emit('SidebarShow',url)
            }
        }
    }
</script>

<style scoped>
    .title {
        height: 60px;
        padding-left: 20px;
        background-color: #f5f5f5;
        justify-content: center;
    }

    .title-text {
        color: #666;
        font-size: 32px;
    }

    .model-list {
        padding-left: 20px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #f5f5f5
    }

    .content {
        padding-top: 10px;
        padding-bottom: 10px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .content:active{
        background-color:rgba(0,0,0,.2);
    }
    .brand-name {
        margin-left: 10px;
        font-size:32px;
    }

    .group-name {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
    .group-name:active{
        background-color:rgba(0,0,0,.2);
    }

    .subclass {
        padding-left: 120px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .subclass-name {
        width: 197px;
        height:72px;
        /*align-items: flex-start;*/
        justify-content: center;
    }
    .subclass-name:active{
        background-color:rgba(0,0,0,.2);
    }
    .subclass-name-text{
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
        font-size:24px;
    }
    .group-info{
        flex: 1;
        flex-direction: row;
        align-items: center;
        padding-top: 19px;
        padding-bottom: 19px;
        border-bottom-width:1px;
        border-bottom-style:dashed;
        border-bottom-color:#eee;
    }
    .grupu-name-icon{
        flex: 1;
        flex-direction: row;
        align-items: center;
    }
    .group-name-text{
        font-size:32px;
    }
    .group-icon-text{
        font-size:20px;
        padding-left:4px;
        padding-right:4px;
        padding-top: 4px;
        padding-bottom:4px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        margin-left:10px;
        color:#fff;
        background-color:#076aff;
    }
    .number-one{
        padding-right:54px;
        flex-direction: row;
        align-items: center;
    }
    .number-one-text{
        color:#f60;
        font-size:24px;
        margin-left:10px;
    }
</style>