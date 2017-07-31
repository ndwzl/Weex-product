<template>
    <div class="pop">
        <div class="content">
            <text class="text">{{errorPopText}}</text>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['errorPopText']
    }
</script>

<style scoped>
    .pop{
        position:fixed;
        left:0;
        top:0;
        bottom:0;
        right:0;
        justify-content: center;
        align-items: center;
    }
    .content{
        width:600px;
        height:80px;
        justify-content: center;
        align-items: center;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        background-color:rgba(0,0,0,.6);
    }
    .text{
        color:#fff;
        font-size:36px;
    }
</style>