<template>
    <div class="parameter-config" v-if="parameterData.length">
        <sub-title subTitleName="参数配置"></sub-title>
        <div class="content">
            <div v-for="(ele,index) in parameterData" class="parameter-list" v-if="index < 6 && ele.value != '' && ele.value != 0">
                <div class="key">
                    <text class="key-text">{{ele.F_ParameterName}}</text>
                </div>
                <div class="value">
                    <text class="value-text">{{ele.value + ele.unit}}</text>
                </div>
            </div>
        </div>
        <div class="load-more" @click="goWeexUrl('modelConfig.weex.js')">
            <text class="load-more-text">查看详细参数配置</text>
            <image src="https://s.kcimg.cn/wap/images/detail/productApp/footer-go.png" alt="" style="width:16px;height:28px;"></image>
            <!--&lt;!&ndash;<text :style="{fontFamily:'detail',fontSize:'24px',color:'#999'}">&#x53bb;</text>&ndash;&gt;-->
        </div>
    </div>
</template>

<script type="text/babel">
    import subTitle from '../subTitle.vue'
    export default {
        props:['parameterData','moreParamUrl'],
        components:{subTitle}
    }
</script>

<style scoped>
    .parameter-list{
        flex-direction: row;
    }
    .content{
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
    }
    .key{
        width:210px;
        height:80px;
        align-items: center;
        justify-content:center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#e5e5e5;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#e5e5e5;
        background-color:#f9f9f9;
    }
    .key-text{
        color:#333;
        font-size:28px;
    }
    .value{
        flex: 1;
        height:80px;
        padding-left:20px;
        justify-content: center;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#e5e5e5;
    }
    .value-text{
        color: #333;
        font-size:28px;
    }
    .load-more{
        height:80px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
    }
    .load-more:active{
        background-color:rgba(0,0,0,.2)
    }
    .load-more-text{
        color:#999;
        font-size: 28px;
        margin-right:10px;
    }
</style>