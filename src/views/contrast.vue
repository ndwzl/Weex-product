<template>
    <div class="contrast">
        <div v-if="iosTop" class="ios-top"></div>
        <list style="flex: 1" @scroll="sticky">
            <cell>
                <!--标题-->
                <title titleName="车型对比"></title>
                <!--对比车型名称-->
                <div class="product-name-wrapper">
                    <product-name :products="configData.products" @clear="clear" :compareNumber="compareNumber"  footerPrice="true" @goAddSeries="addSeriesPop"></product-name>
                </div>
                <div v-if="floatTitle && !addSeriesShow" class="float-title">
                    <div v-if="iosTop" class="ios-top"></div>
                    <product-name :products="configData.products" @clear="clear" :compareNumber="compareNumber"  footerPrice="true" @goAddSeries="addSeriesPop"></product-name>
                </div>
            </cell>
            <!--对比车型选项-->
            <cell class="model" ref="车型信息">
                <div class="title">
                    <text class="title-text">车型信息</text>
                </div>
                <div class="options">
                    <div class="caption">
                        <text class="caption-text">厂商指导价</text>
                    </div>
                    <div class="content">
                        <text class="content-text" v-if="configData.products[0] && configData.products[0].F_Price && configData.products[0].F_Price != 0 &&  configData.products[0].F_Price != 'kong'">{{configData.products[0] && configData.products[0].F_Price}}万</text>
                        <text class="content-text" v-if="configData.products[0] && configData.products[0].F_Price == 0 || configData.products[0] && !configData.products[0].F_Price && configData.products[0].F_Price != 'kong'">暂无报价</text>
                    </div>
                    <div class="content">
                        <text class="content-text" v-if="configData.products[1] && configData.products[1].F_Price && configData.products[1].F_Price != 0 && configData.products[1].F_Price != 'kong'">{{configData.products[1] && configData.products[1].F_Price}}万</text>
                        <text class="content-text" v-if="configData.products[1] && configData.products[1].F_Price == 0 || configData.products[1] && !configData.products[1].F_Price && configData.products[1].F_Price != 'kong'">暂无报价</text>
                    </div>
                </div>
                <div class="options">
                    <div class="caption">
                        <text class="caption-text">本地最低报价</text>
                    </div>
                    <div class="content footer-price">
                        <text class="content-text" v-if="configData.lowPrice[0] && configData.lowPrice[0].F_BigPrice && configData.lowPrice[0].F_BigPrice != 0 && configData.lowPrice[0].F_BigPrice != 'kong'">{{configData.lowPrice[0] && configData.lowPrice[0].F_BigPrice}}万</text>
                        <text class="content-text" v-if="configData.lowPrice[0] && !configData.lowPrice[0].F_BigPrice && configData.lowPrice[0].F_BigPrice != 'kong'">暂无报价</text>
                    </div>
                    <div class="content footer-price">
                        <text class="content-text" v-if="configData.lowPrice[1] && configData.lowPrice[1].F_BigPrice && configData.lowPrice[1].F_BigPrice != 0 && configData.lowPrice[1].F_BigPrice != 'kong'">{{configData.lowPrice[1] && configData.lowPrice[1].F_BigPrice}}万</text>
                        <text class="content-text"  v-if="configData.lowPrice[1] && !configData.lowPrice[1].F_BigPrice && configData.lowPrice[1].F_BigPrice != 'kong'">暂无报价</text>
                    </div>
                </div>
            </cell>
            <cell v-for="(ele,i) in configData.paramList[0]" v-if="ele.list.length" class="model" :ref="ele.F_ParameterTypeName">
                <div class="title">
                    <text class="title-text">{{ele.F_ParameterTypeName}}</text>
                </div>
                <div v-for="(item,index) in ele.list" class="options">
                    <!--v-if="configData.products.length > 0 &&  (!(item.value == 0 && configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && configData.paramList[1][i].list[index].value && configData.paramList[1][i].list[index].value == 0)) && ((item.value != '' && configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && configData.paramList[1][i].list[index].value && configData.paramList[1][i].list[index].value != '') || (item.value == '' && configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && configData.paramList[1][i].list[index].value && configData.paramList[1][i].list[index].value != '') || (item.value != '' && configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && configData.paramList[1][i].list[index].value && configData.paramList[1][i].list[index].value == '') || (item.value != '' && !configData.paramList[1]) || (item.value != '' && item.value != 0))"-->
                <!--v-if="item.value!='' || (paramList[1] && paramList[1][i] && paramList[1][i].list && paramList[1][i].list[index] && paramList[1][i].list[index].value != '')"-->
                    <div class="caption">
                        <text class="caption-text">{{item.F_ParameterName}}</text>
                    </div>
                    <div class="content">
                        <text class="content-text">{{item.value + item.unit}}</text>
                    </div>
                    <div class="content">
                        <text class="content-text">{{configData.paramList[1] && configData.paramList[1][i] && configData.paramList[1][i].list && configData.paramList[1][i].list[index] && (configData.paramList[1][i].list[index].value + configData.paramList[1][i].list[index].unit)}}</text>
                    </div>
                </div>
            </cell>
        </list>
        <div class="classify" @click="classifyShow">
            <image src="https://s.kcimg.cn/wap/images/detail/productApp/classify.png" style="width:25px;height:25px"></image>
            <!--<text :style="{fontFamily:'detail'}" class="classify-icon">&#x7c7b;</text>-->
            <text class="classify-text">分类</text>
        </div>
        <div class="classify-content" v-if="classifyPop">
            <div class="classify-info" @click="anchor('车型信息')">
                <text class="classify-info-text">车型信息</text>
            </div>
            <div class="classify-info" v-if="configData.paramList[0].length && configData.paramList[0][index].list.length" v-for="(ele,index) in configData.paramList[0]" @click="anchor(ele.F_ParameterTypeName)">
                <text class="classify-info-text">{{ele.F_ParameterTypeName}}</text>
            </div>
        </div>

        <!--添加车系弹层-->
        <add-series :addSeriesShow="addSeriesShow" :selectProductPop="selectProductPop" @hideAddProduct="goSelectProduct" @goSelectProduct="goSelectProduct" @addSeriesPop="addSeriesPop" @selectModel="selectModel" :selectedProductId="selectedProductId" :compareData="compareData"></add-series>
    </div>
</template>

<script type="text/babel">
    let storage = weex.requireModule('storage')

    import title from '../components/title.vue'
    import nav from '../components/nav.vue'
    import productName from '../components/config/productName.vue'
    import addSeries from '../components/config/addSeries.vue'

    let dom = weex.requireModule('dom');
    let globalEvent = weex.requireModule('globalEvent');

    export default {
        components:{
            title,
            nav,
            productName,
            addSeries
        },
        data(){
            return {
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo:{},
                //是否显示浮层title
                floatTitle:false,
                //对比的数量
                compareNumber:'',
                //配置数据
                configData:{
                    //对比车型
                    products:[],
                    //对比信息
                    paramList:[],
                    //厂商指导价和本地最低报价
                    lowPrice:[]
                },
                //是否显示分类弹层
                classifyPop:false,
                //现在还剩下的车型id
                selectedProductId:'',
                //是否显示addSeries弹窗
                addSeriesShow:false,
                //是否显示选择车型列表弹窗
                selectProductPop:false,
                //已经存储的对比内容
                compareData:[],
                iosTop:false
            }
        },
        created(){
            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });

            if(weex.config.env.platform == 'iOS'){
                this.iosTop = true;
            }

//            if(Stack){
//                this.alert(JSON.stringify(Stack))
//            }else{
//                this.alert(2)
//            }
//            Stack.onmessage = function (event) {
//                this.alert(event.data);
//            };

            //获取车系信息
            storage.getItem('seriesInfo',ele => {
                if(ele.result == 'success'){
                    this.seriesInfo = JSON.parse(ele.data)

                    //获取车型对比信息
                    storage.getItem('compareData',compare => {
                        if(compare.result == 'success'){
                            let data = JSON.parse(compare.data)[this.seriesInfo.F_SubCategoryId];

                            if(data.length){
                                let product;
                                if(data.length == 2){
                                    product = data[0] + '_' + data[1];

                                }else{
                                    product = data[0]
                                }

                                //请求车型对比详细信息
                                this.getData(this.ajaxUrl() + '/index.php?r=weex/product/contrast&proId=' + product, productInfo => {
                                    if (productInfo.ok) {
                                        productInfo.data.data.forEach((list,index) => {
                                            this.$set(this.configData.paramList, index, list.paramList)
                                            this.$set(this.configData.products, index, list.proInfo)
                                            this.$set(this.configData.lowPrice,index,list.lowPrice)
                                        })

                                        //对比的数量
                                        this.compareNumber = ele.data.products.length,

                                        //存储对比记录
                                        storage.getItem('compare_history',history => {
                                            let data = [];
                                            if(history.result == 'success'){
                                                data = JSON.parse(history.data);
                                                this.configData.products.forEach(id => {
                                                    let has = true;
                                                    data.forEach((res,index) => {
                                                        if(res.F_ProductId == id.F_ProductId){
                                                            has = false;
                                                        }
                                                    });
                                                    if(has){
                                                        data.push(id)
                                                    }
                                                })
                                            }else{
                                                this.configData.products.forEach(id => {
                                                    data.push(id)
                                                });
                                            }
                                            //再次存储
                                            storage.setItem('compare_history',JSON.stringify(data))
                                        })

                                        //增加对比pv
                                        if(productInfo.data.data.length == 2){
                                            //发送PV
                                            storage.getItem('p4',p4 => {
                                                if(p4.result == 'success'){
                                                    this.p4 = p4.data;
                                                    storage.getItem('p5',p5 => {
                                                        if(p5.result == 'success'){
                                                            this.p5 = p5.data;
                                                            this.collect({
                                                                'p3':p4.data,
                                                                'p4':4,
                                                                'p5':encodeURIComponent(productInfo.data.data[0].proInfo.F_SeriesId + '|' + productInfo.data.data[0].proInfo.F_ProductId),
                                                                'p6':productInfo.data.data[0].proInfo.F_BrandId + '_' + productInfo.data.data[0].proInfo.F_CateId + '_' + productInfo.data.data[0].proInfo.F_SubCategoryId,
                                                                'p7':encodeURIComponent(productInfo.data.data[1].proInfo.F_SeriesId + '|' + productInfo.data.data[1].proInfo.F_ProductId)
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }


                                        //查看新添加的车型
//                                        storage.getItem('newProductId',newProductId => {
//                                            if(newProductId.result == 'success'){
//                                                let newCompare = {};
//                                                data.forEach((newPro,index) => {
//                                                    if(newPro == newProductId.data){
//                                                        data.splice(index,1)
//                                                    }
//                                                });
//                                                newCompare[this.seriesInfo.F_SubCategoryId] = data;
//
//                                                //删除存储的新添加的车型
//                                                storage.removeItem('newProductId',removeProId => {
//                                                    if(removeProId.result == 'success'){
//                                                        //重新赋值对比信息
//                                                        storage.setItem('compareData',JSON.stringify(newCompare))
//                                                    }
//                                                })
//                                            }
//                                        })
                                    }
                                })

                            }
                        }
                    });
                }
            });
        },
        methods:{
            //清除数据
            clear(index){
                this.configData.products[index].F_ProductName = '';

                this.configData.paramList.forEach((ele,key) => {
                    if(key == index){
                        //清除厂商指导价 && 本地最低报价
                        this.configData.lowPrice[key].F_BigPrice = 'kong';

                        this.configData.products[key].F_Price = 'kong';

                        ele.forEach((res,number) => {
                           res.list.forEach((result,i) => {
                               result.value = '';
                               result.unit = '';
                           })
                        })
                    }
                })

                //清除缓存
                storage.getItem('compareData',ele => {
                    if(ele.result == 'success'){
                        let data = JSON.parse(ele.data);
                        if(data[this.seriesInfo.F_SubCategoryId]){
                            if(data[this.seriesInfo.F_SubCategoryId][index]){
                                data[this.seriesInfo.F_SubCategoryId].splice(index,1)
                            }else{
                                data[this.seriesInfo.F_SubCategoryId].splice(index-1,1)
                            }

                            this.compareData = data[this.seriesInfo.F_SubCategoryId];

                            storage.setItem('compareData',JSON.stringify(data),setCompareData => {
                                if(setCompareData.result == 'success'){
                                    if(data[this.seriesInfo.F_SubCategoryId].length){
                                        this.selectedProductId = data[this.seriesInfo.F_SubCategoryId][0]
                                    }else{
                                        this.selectedProductId = ''
                                    }
                                }
                            })
                        }
                    }
                })

                // 更新对比数量
                this.compareNumber--;
            },
            //是否显示分类内容弹层
            classifyShow(){
                this.classifyPop = !this.classifyPop
            },
            //锚点效果
            anchor(index){
                let ele ;
                if(index == '车型信息'){
                    ele = this.$refs[index];
                }else{
                    ele = this.$refs[index][0]
                }
                dom.scrollToElement(ele, {offset: -280})
                this.classifyPop = false;
            },
            //询底价
            goFooterPirce(proInfo){
//                this.GA(0,proInfo.F_ProductId)
                storage.setItem('priceProductId',proInfo.F_ProductId,ele => {
                    if(ele.result == 'success'){
                        this.goWeexUrl('footerPrice.weex.js')
                    }
                })
            },
            //标题吸顶
            sticky(event){
                //如果分类锚点弹层显示 && 隐藏
                if(this.classifyPop){
                    this.classifyPop = false;
                }

                //标题吸顶
                if(event.contentOffset.y < -110){
                    if(!this.floatTitle){
                        this.floatTitle = true;
                    }
//                    event.contentOffset.y = 0;
                }else{
                    if(this.floatTitle){
                        this.floatTitle = false;
                    }
                }
            },
            //显示选择车系列表弹层 || 隐藏选择车系列表弹层
            addSeriesPop(){
                //显示隐藏选择车系列表
                this.addSeriesShow = !this.addSeriesShow;

                //重新给选中车型赋值
                if(this.compareData.length){
                    this.selectedProductId = this.compareData[0];
                }
            },
            //显示选择车型列表
            goSelectProduct(){
                this.selectProductPop = !this.selectProductPop;
            },
            //选择车型
            selectModel(ele){
                console.log(ele)
                //查看对比缓存
                storage.getItem('compareData',compareData => {
                    if(compareData.result == 'success'){
                        //获取存储的是第几个
                        storage.getItem('compareNumber',compareNumber => {
                            if(compareNumber.result == 'success'){
                                let number = compareNumber.data;
                                let data = JSON.parse(compareData.data);
                                let proId = '';
                                if(data[this.seriesInfo.F_SubCategoryId] && data[this.seriesInfo.F_SubCategoryId].length){
                                    if(number == 1){
                                        proId = data[this.seriesInfo.F_SubCategoryId][0] + '_' + ele.F_ProductId;
                                        data[this.seriesInfo.F_SubCategoryId].push(ele.F_ProductId)
                                    }else{
                                        proId = ele.F_ProductId + '_' + data[this.seriesInfo.F_SubCategoryId][0];
                                        data[this.seriesInfo.F_SubCategoryId].unshift(ele.F_ProductId)
                                    }
                                    console.log(data[this.seriesInfo.F_SubCategoryId])
                                }else{
                                    proId = ele.F_ProductId
                                    data[this.seriesInfo.F_SubCategoryId].push(ele.F_ProductId)
                                }
                                //更新存储的数据
                                this.compareData = data[this.seriesInfo.F_SubCategoryId];

                                //再次存储对比数据
                                storage.setItem('compareData',JSON.stringify(data),setCompareData => {
                                    if(setCompareData.result == 'success'){
                                        //请求对比数据
                                        this.getData(this.ajaxUrl() + '/index.php?r=weex/product/contrast&proId=' + proId,productInfo => {
                                            if (productInfo.ok) {
                                                productInfo.data.data.forEach((list, index) => {
                                                    this.$set(this.configData.paramList, index, list.paramList)
                                                    this.$set(this.configData.products, index, list.proInfo)
                                                    this.$set(this.configData.lowPrice, index, list.lowPrice)
                                                })


                                                //对比的数量
                                                this.compareNumber = productInfo.data.products.length;


                                                //增加对比pv
                                                if(productInfo.data.data.length == 2){
                                                    //发送PV
                                                    storage.getItem('p4',p4 => {
                                                        if(p4.result == 'success'){
                                                            this.p4 = p4.data;
                                                            storage.getItem('p5',p5 => {
                                                                if(p5.result == 'success'){
                                                                    this.p5 = p5.data;
                                                                    this.collect({
                                                                        'p3':p4.data,
                                                                        'p4':4,
                                                                        'p5':encodeURIComponent(productInfo.data.data[0].proInfo.F_SeriesId + '|' + productInfo.data.data[0].proInfo.F_ProductId),
                                                                        'p6':productInfo.data.data[0].proInfo.F_BrandId + '_' + productInfo.data.data[0].proInfo.F_CateId + '_' + productInfo.data.data[0].proInfo.F_SubCategoryId,
                                                                        'p7':encodeURIComponent(productInfo.data.data[1].proInfo.F_SeriesId + '|' + productInfo.data.data[1].proInfo.F_ProductId)
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }

                                                //存储对比记录
                                                storage.getItem('compare_history',history => {
                                                    let data = [];
                                                    if(history.result == 'success'){
                                                        data = JSON.parse(history.data);
                                                        this.configData.products.forEach(id => {
                                                            let has = true;
                                                            data.forEach((res,index) => {
                                                                if(res.F_ProductId == id.F_ProductId){
                                                                    has = false;
                                                                }
                                                            });
                                                            if(has){
                                                                data.push(id)
                                                            }
                                                        })
                                                    }else{
                                                        this.configData.products.forEach(id => {
                                                            data.push(id)
                                                        });
                                                    }
                                                    //再次存储
                                                    storage.setItem('compare_history',JSON.stringify(data),compareHistory => {
                                                        this.addSeriesShow = false;
                                                    })
                                                })
                                            }
                                        })
                                    }
                                })

                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .contrast{
    }
    .classify{
        position:fixed;
        right:0;
        bottom:270px;
        width: 140px;
        height: 70px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 35px;
        border-bottom-left-radius: 35px;
        background-color: rgba(0,0,0,.8);
    }
    .classify-icon{
        color:#fff;
        font-size:20px;
    }
    .classify-text{
        color:#fff;
        font-size:28px;
        margin-left:10px;
    }
    .classify-content{
        position:fixed;
        right:170px;
        bottom: 270px;
        width: 420px;
        flex-wrap: wrap;
        flex-direction: row;
        background-color: rgba(0,0,0,.8);
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .classify-info{
        width:210px;
        height:80px;
        justify-content: center;
        align-items: center;
    }
    .classify-info-text{
        color:#fff;
        font-size:28px;
    }
    /*选项*/
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
        min-height:80px;
        height:100%;
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
        flex: 1;
        width:285px;
        min-height:80px;
        height:100%;
        padding-top: 40px;
        padding-bottom:40px;
        padding-right: 10px;
        padding-left: 10px;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
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
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        overflow: hidden;
    }
    .footer-price{
        flex-direction:row;
    }
    .footer-price-text{
        color:#f60;
        font-size:24px;
        margin-left:10px;
        padding-bottom:5px;
        padding-left:5px;
        padding-right:5px;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#f60;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#f60;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#f60;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#f60;
        border-top-left-radius:4px;
        border-top-right-radius:4px;
        border-bottom-left-radius:4px;
        border-bottom-right-radius:4px;
    }
    .title-wrapper{
        background-color: #f5f5f5;
    }
    .product-name-wrapper{
        margin-top: 20px;
        background-color: #fff;
    }
    .float-title{
        position: fixed;
        left:0;
        top:0;
        background-color: #fff;
    }
</style>
