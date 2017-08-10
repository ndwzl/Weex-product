<template>
    <div class="photo-album">
        <div class="options" v-if="!isRecommend">
            <div  :class="['option',photoData.typeId == 0 ? 'option-selected' : '']" @click="detailed(0)">
                <text :class="['option-text',photoData.typeId == 0 ? 'option-selected-text' : '']">全部</text>
            </div>
            <div v-for="ele in photoData.options" :class="['option',photoData.typeId == ele.id ? 'option-selected' : '']" @click="detailed(ele.id)">
                <text :class="['option-text',photoData.typeId == ele.id ? 'option-selected-text' : '']">{{ele.name}}</text>
            </div>
        </div>
        <div class="photo-content">
            <div v-for="ele in photoData.content" class="photo-model">
                <div class="model-header">
                    <div class="type">
                        <text class="type-name">{{ele.F_TypeName}}</text>
                        <text class="type-number">{{ele.imgCount}} 张</text>
                    </div>
                    <div class="more-photo" v-if="photoData.typeId == 0" @click="detailed(ele.F_TypeId)">
                        <text class="more-photo-text">更多</text>
                        <!--<text :style="{fontFamily:'detail',fontSize:'24px',color:'#586C94'}">&#x53bb;</text>-->
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/go-blue.png" style="width:14px;height:24px;margin-left:10px"></image>
                    </div>
                </div>
                <div class="photo-wrapper">
                    <div v-for="(img,index) in ele.imgList" class="photo-list" @click="clickImgList(img,ele,index,ele.imgList)">
                        <!--<text class="img-text" :style="{fontFamily:'detail'}">&#x5361;</text>-->
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/truck-home.png" style="width:131px;height:48px;"></image>
                        <image class="image" :src="img.url" style="width:223px;height:140px;"></image>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    let stream = weex.requireModule('stream');
    let storage = weex.requireModule('storage');
    export default {
        props:['photoData','isRecommend','ProductId'],
        data(){
            return {
                typeInfo:[]
            }
        },
        created(){
            console.log(this.photoData)
        },
        methods:{
            //请求品牌详细分类
            detailed(typeId){
                this.$emit('detailed',typeId)
            },
            //点击图片列表，进入图片详情页
            clickImgList(img,ele,index,imgList){
                //存储图片详细信息，然后进入图片详情页。
                img.typeId = ele.F_TypeId;
                img.index = index;
                storage.setItem('imgProductId',this.ProductId,res => {
                        storage.setItem('imgDataInfo',JSON.stringify(img),ele => {
                            if(ele.result == 'success'){
                                this.goWeexUrl('photoInfo.weex.js')
                            }
                        })
                })
            }
        }
    }
</script>

<style scoped>
    /*tag标签*/
    .options{
        flex-direction:row;
        padding-top:10px;
        padding-right:10px;
        padding-bottom:10px;
        padding-left:10px;
    }
    .option{
        flex: 1;
        height:60px;
        margin-top:10px;
        margin-right:10px;
        margin-bottom:10px;
        margin-left:10px;
        justify-content: center;
        align-items: center;
        border-top-width:1px;
        border-top-style: solid;
        border-top-color:#eee;
        border-right-width:1px;
        border-right-style: solid;
        border-right-color:#eee;
        border-bottom-width:1px;
        border-bottom-style: solid;
        border-bottom-color:#eee;
        border-left-width:1px;
        border-left-style: solid;
        border-left-color:#eee;
        border-top-left-radius:8px;
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;

    }
    .option-selected{
        border-top-color:#586C94;
        border-right-color:#586C94;
        border-bottom-color:#586C94;
        border-left-color:#586C94;
    }
    .option-text{
        color:#333;
        font-size:24px;
    }
    .option-selected-text{
        color:#586C94;
    }
    /*图片列表*/
    .model-header{
        flex-direction: row;
        padding-left:30px;
        padding-right:30px;
        justify-content: space-between;
    }
    .type{
        height:80px;
        flex-direction: row;
        align-items: center;
    }
    .type-name{
        color: #333;
        font-size:28px;
    }
    .type-number{
        color: #999;
        font-size:24px;
        margin-left:10px;
    }
    .more-photo{
        height:80px;
        flex-direction: row;
        align-items: center;
    }
    .more-photo-text{
        color:#586C94;
        font-size:28px;
        margin-right:10px;
    }
    .photo-wrapper{
        flex-direction: row;
        padding-right:10px;
        padding-bottom:10px;
        padding-left:10px;
        flex-wrap: wrap;
    }
    .photo-list{
        position: relative;
        width:223px;
        height:140px;
        align-items: center;
        justify-content: center;
        margin-top:10px;
        margin-right:10px;
        margin-bottom:10px;
        margin-left:10px;
        background-color:#efefef;
    }
    .img-text{
        color:#d1d1d1;
        font-size:56px;
    }
    .image{
        position:absolute;
        top:0;
        left: 0;
    }
</style>