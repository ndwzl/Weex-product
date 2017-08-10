<template>
    <!-- 错误提示 -->
    <div class="dialog">
        <div class="err-prompt">
            <text class="err-text">{{promptText}}</text>
            <div class="close" @click="closeBtn">
                <text class="close-btn">确定</text>
            </div>
                
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['promptText'],
        data(){
            return {
                
            }
        },
        methods:{
            closeBtn(){
                this.$emit('closeBtn')
            }
        }
    }
</script>

<style scoped>
    .dialog{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.5);
    }
    .err-prompt{
        width: 500px;
        padding-left:20px;
        padding-right:20px;
        background-color: #fff;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px; 
    }
    .err-text{
        padding-top: 40px;
        padding-bottom: 40px;
        text-align: center;
        font-size: 28px;
        color: #333;
        border-bottom: solid;
        border-bottom-width: 2px;
        border-bottom-color: #d8d8d8;
    }
    .close{       
        height: 88px;
        justify-content: center;
        align-items: center;
    }
    .close-btn{
        color: #1571e5;
    }
</style>