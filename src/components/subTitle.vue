<template>
    <div class="subtitle">
        <div class="title-name">
            <text class="subtitle-text">{{subTitleName}}</text>
            <text v-if="annotation" class="annotation">{{annotation}}</text>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['subTitleName','annotation']
    }
</script>

<style scoped>
    .subtitle{
        height:100px;
        flex-direction:row;
        justify-content: space-between;
        align-items: center;
        padding-left:30px;
        padding-right:30px;
        border-top-width:20px;
        border-top-style: solid;
        border-top-color:#f5f5f5;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#e5e5e5;
    }
    .subtitle-text{
        color:#333;
        font-size:32px;
        font-weight: bold;
    }
    .title-name{
        flex-direction: row;
        align-items: center;
    }
    .annotation{
        color:#999;
        font-size:24px;
        margin-left:20px;
    }

</style>