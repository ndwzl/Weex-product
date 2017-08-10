<template>
    <div class="dealer">
        <div v-if="dealerData.length">
            <div class="header">
                <text class="header-text">选择询价经销商（最多可选择3家）</text>
            </div>
            <div class="dealer-list" @click="chooseDealer">
                <div class="choose" v-for="(ele,index) in dealerData">
                    <div class="dealer-icon" @click="selectDealer(index,ele.ShopId)">
                        <image v-if="dealerSelected[index]" src="https://s.kcimg.cn/wap/images/detail/productApp/checkbox.png" style="width:35px;height:35px;"></image>
                        <text v-else class="border"></text>
                    </div>
                    <div class="dealer-item" @click="selectDealer(index,ele.ShopId)">
                        <div class="shop">
                            <text class="shop-name">{{ele.Name}}</text>
                            <image v-if="ele.IsCharge == 1" class="shop-vip" src="https://s.kcimg.cn/wap/images/detail/vip_dealer.png"></image>
                        </div>
                        <text class="address">{{ele.Address}}</text>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="notDealer" class="empty-icon">
            <image src="https://s.kcimg.cn/wap/images/detail/productApp/bad.png" style="width:150px;height:87px"></image>
            <text class="empty-text">提交信息后</text>
            <text class="empty-text">我们将为您推荐合适的经销商</text>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:['dealerData','dealerSelected','notDealer'],
        data (){
            return{
            }
        },
        methods:{
            chooseDealer(){
                
            },
            selectDealer(index,ShopId){
                this.$emit('selectDealer',index,ShopId)
            }
        },
        created(){

        }
    }
</script>

<style scoped>
    .dealer{
        background-color: #fff;
    }
    .header{
        height: 70px;
        justify-content: center;
        background-color: #f5f5f5;
        padding-left: 20px;
        padding-right: 20px;
    }
    .header-text{
        font-size: 28px;
        color: #999; 
    }
    .dealer-list{
        border-bottom: solid;
        border-bottom-width: 2px;
        border-bottom-color: #eee; 
    }
    .choose{
        flex-direction: row;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        padding-right: 20px;
        border-bottom: solid;
        border-bottom-width: 2px;
        border-bottom-color: #eee;
    }
    .dealer-item{
        flex: 1;
    }
    .shop{
        flex-direction: row;
    }
    .shop-name{
        line-height: 44px;
        font-size: 28px;
        color: #333; 
    }
    .shop-vip{
        width: 30px;
        height: 28px;
        margin-left: 10px;
        margin-top: 8px;
    }
    .address{
        line-height: 36px;
        margin-top: 8px;
        font-size: 24px;
        color: #999;
    }
    .dealer-icon{
        width: 60px;
        height:90px;
        padding-left:14px;
        padding-right:14px;
        justify-content: center;
        align-items: center;
    }
    .border{
        width:32px;
        height:32px;
        justify-content: center;
        align-items: center;
        border-style: solid;
        border-width: 2px;
        border-color: #999;
        font-size: 0;
        color: transparent;
    }
    .dealer-selected{
        font-size:32px;
        color:#f60;
        border-top-color:#f60;
        border-right-color:#f60;
        border-bottom-color:#f60;
        border-left-color:#f60;
    }
    .selected{
        background-color: #f60;
        color: #fff;
        width: 26px;
        height: 26px;
        border-color: #f60;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .empty-icon{
        height:384px;
        padding-top: 40px;
        justify-content: center;
        align-items: center;
        background-color:#f5f5f5;
    }
    .empty-icon-text{
        font-size:80px;
        color:#ddd;
    }
    .empty-text{
        margin-top: 10px;
        font-size:28px;
        color:#999;
    }
</style>