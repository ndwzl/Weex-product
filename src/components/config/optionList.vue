<template>
    <div class="option-list">
        <div v-for="(paraminfo,number) in paramList" v-if="number < 1">
            <div v-for="(ele,i) in paraminfo" class="model">
                <div class="title">
                    <text class="title-text">{{ele.F_ParameterTypeName}}</text>
                </div>
                <div v-for="(item,index) in ele.list" class="options">
                    <!--v-if="item.value!='' || (paramList[1] && paramList[1][i] && paramList[1][i].list && paramList[1][i].list[index] && paramList[1][i].list[index].value != '')"-->
                    <div class="caption">
                        <text class="caption-text">{{item.F_ParameterName}}</text>
                    </div>
                    <div class="content">
                        <text class="content-text">{{item.value}}</text>
                    </div>
                    <div class="content">
                       <text class="content-text">{{paramList[1] && paramList[1][i] && paramList[1][i].list && paramList[1][i].list[index] && paramList[1][i].list[index].value}}</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['paramList']
    }
</script>

<style scoped>
    .option-list{

    }
    .model{
        border-top-width:20px;
        border-top-style:solid;
        border-top-color:#f5f5f5;
    }
    .title{
        height:90px;
        justify-content: center;
        padding-left:20px;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
    }
    .title-text{
        font-size:32px;
        color:#333;
    }
    .options{
        flex-direction: row;
        flex-wrap: wrap;
        word-wrap: break-word;
        word-break: break-all;
    }
    .caption{
        width:180px;
        padding-top: 20px;
        padding-bottom:20px;
        justify-content: center;
        align-items: center;
        background-color:#f9f9f9;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
    }
    .caption-text{
        color:#666;
        font-size:24px;
    }
    .content{
        width:285px;
        padding-top: 20px;
        padding-bottom:20px;
        padding-right: 20px;
        padding-left: 20px;
        justify-content: center;
        align-items: center;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
        border-left-width:1px;
        border-left-style: solid;
        border-left-color:#eee;
    }
    .content-text{
        font-size: 28px;
        color:#333;
        text-align: center;
    }
</style>