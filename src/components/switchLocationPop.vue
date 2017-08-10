<template>
    <div class="switch-location" @click="clickShade">
        <div class="switch-location-box">
            <div class="present">
                <text class="present-text">您当前所在的城市是</text>
                <text class="present-location-text">{{cityName}}</text>
                <!--myRegion.cityName-->
            </div>
            <text class="present-text">是否切换</text>
            <div class="buttons">
                <div class="cancel" @click="cancelSwitch">
                    <text class="button-text">取消</text>
                </div>
                <div class="ok" @click="okSwitch">
                    <text class="button-text">确定</text>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['cityName'],
        methods:{
            //取消切换城市
            cancelSwitch(){
                this.$emit('cancelSwitch')
            },
            //确定切换城市
            okSwitch(){
                this.$emit('okSwitch')
            },
            //点击遮罩层 直接return
            clickShade(){
                return
            }
        }
    }
</script>

<style scoped>
    .switch-location{
        position:fixed;
        left:0;
        top:0;
        right:0;
        bottom:0;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,.6);
    }
    .switch-location-box{
        width:560px;
        height:260px;
        padding-top:30px;
        align-items: center;
        justify-content: flex-end;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        background-color:#fff;
    }
    .present{
        margin-bottom:20px;
        flex-direction: row;
    }
    .present-text{
        color:#666;
        font-size:32px;
    }
    .present-location-text{
        color:#586C94;
        font-size:32px;
        margin-left:10px;
    }
    .buttons{
        width:560px;
        height:80px;
        margin-top:40px;
        flex-direction: row;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#eee;
    }
    .ok{
        flex:1;
        align-items: center;
        justify-content: center;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#eee;
    }
    .ok-text{
        color:#333;
        font-size:32px;
    }
    .cancel{
        flex: 1;
        align-items: center;
        justify-content: center;
    }
    .button-text{
        color:#448dea;
        font-weight: bold;
        font-size:32px;
    }

</style>