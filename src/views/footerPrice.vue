<template>
    <div class="enquire">
        <div v-if="iosTop" class="ios-top"></div>
        <list style="flex: 1" show-scrollbar="true" >
            <header>
                <!-- 头部标题 -->
                <title titleName="询底价"></title>
            </header>
            <cell>
                <!-- 车型 -->
                <sales-model :productInfo="productInfo" :footerPriceNum="footerPriceNum" @switchModelShow="switchModelShow"></sales-model>
                <!-- 个人信息 -->
                <div class="message">
                    <div class="name-area">
                        <input type="text" placeholder="请填写您的姓名(1-6个汉字)" class="name" maxlength="6" @focus="focusText('name')" value="" @change="inputChange('name',$event.value)" @input="importText('name',$event.value)" value="" @blur="blurText('name')" :class="[nameFocus?'input-focus':'']" />
                        <div class="icon">
                            <text class="icon-text">*</text>
                        </div>
                    </div>
                    <div class="phone-area">
                        <input type="tel" placeholder="请填写手机号获取底价" class="phone" @focus="focusText('phone')" value="" @change="inputChange('phone',$event.value)" @input="importText('phone',$event.value)" value="" @blur="blurText('phone')" maxlength="11" :class="[phoneFocus?'input-focus':'']" />
                        <div class="icon">
                            <text class="icon-text">*</text>
                        </div>
                    </div>
                </div>
                <!-- 提车地区 -->
                <div class="area" @click="areaPop">
                    <div class="caption">
                        <text class="caption-icon">*</text>
                        <text class="caption-text">提车地区</text>
                    </div>
                    <div class="area-show">
                        <div class="province">
                            <text class="province-text" v-if="locationInfo.provinceName">{{locationInfo.provinceName}}</text>
                        </div>
                        <div class="city">
                            <text class="city-text" v-if="locationInfo.cityName">{{locationInfo.cityName}}</text>
                        </div>
                    </div>
                    <div class="go-area">
                        <image src="https://s.kcimg.cn/wap/images/detail/productApp/footer-go.png" style="width:16px;height:28px;"></image>
                        <!--<text :style="{fontFamily:'detail',fontSize:'32px',color:'#999'}" class="area-icon">去</text>-->
                    </div>
                </div>
                <!-- 购买数量 -->
                <div class="buy-number">
                    <div class="buy">
                        <text class="buy-text">购买数量</text>
                    </div>
                    <div class="number-wrap">
                        <div class="subtract" @click="subtractBtn">
                            <!--<text :style="{fontFamily:'detail',fontSize:'28px'}" class="subtract-icon" :class="[priceData.buycount==1 ? 'disable' : '']">减</text>-->
                            <image src="https://s.kcimg.cn/wap/images/detail/productApp/minus.png" style="width:30px;height:30px;"></image>
                        </div>
                        <div class="quantity">
                            <text class="quantity-num">{{priceData.buycount}}</text>
                        </div>
                        <div class="add" @click="addBtn">
                            <!--<text :style="{fontFamily:'detail',fontSize:'28px'}" class="add-icon" :class="[priceData.buycount==99 ? 'disable' : '']">加</text>-->
                            <image src="https://s.kcimg.cn/wap/images/detail/productApp/plus.png" style="width:30px;height:30px;"></image>
                        </div>
                    </div>
                </div>
                <!-- 推荐经销商 -->
                <dealer :dealerData="dealerData" :dealerSelected="dealerSelected" :notDealer="notDealer" @selectDealer="selectDealer"></dealer>
                <!-- 个人声明 -->
                <div class="personal">
                    <div class="check" @click="selectStatement">
                        <image v-if="statement" src="https://s.kcimg.cn/wap/images/detail/productApp/radius.png" style="width:35px;height:35px;"></image>
                        <text v-else class="check-icon"></text>
                    </div>
                    <div class="agree">
                        <text class="agree-text">我同意</text>
                    </div>
                    <div class="individual">
                        <text class="protect" @click="goWeexUrl('PersonalInfo.weex.js')">《个人信息保护声明》</text>
                    </div>
                </div>
                <!-- 最终提交询底价 -->
                <div class="submit" @click="commitData">
                    <text class="submit-btn">免费获取最低价</text>
                </div>
            </cell>
        </list>
        <!-- 手机号 姓名 选择地区 错误提示 -->
        <prompt v-if="promptShow" :promptText="promptText" @closeBtn="closeBtn"></prompt>
        <!-- 选择地区 -->
        <select-location v-if="LocationPop" :locationData="locationData" @selectLocationPop="selectLocationPop" @getLocationInfo="getLocationInfo"></select-location>

        <!--换车型弹层-->
        <switch-model v-if="switchModelData.paramName" :switchModelPop="switchModelPop" :switchModelData="switchModelData" :ProductId="ProductId" @goSwitchModel="goSwitchModel" @switchModelShow="switchModelShow"></switch-model>
    </div>
</template>

<script type="text/babel">
    import title from '../components/title.vue'
    import SalesModel from '../components/footerPrice/SalesModel.vue'
    import dealer from '../components/footerPrice/dealer.vue'
    import prompt from '../components/footerPrice/prompt.vue'
    import selectLocation from '../components/selectLocation.vue'
    import switchModel from '../components/switchModel.vue'
    import footerInfo from '../components/footerInfo.vue'

    var stream = weex.requireModule('stream');
    var animation = weex.requireModule('animation');
    var storage = weex.requireModule('storage');
    let globalEvent = weex.requireModule('globalEvent');

    export default {
        data(){
            return {
                //车系信息 子类id && 车系id && 品牌id
                seriesInfo:{},
                //车型id
                productId:'',
                //车型信息
                productInfo:{},
                //询底价数量
                footerPriceNum:'',
                priceData:{
                    relname:'',
                    tel:'',
                    // 省份id
                    provincesn:'',
                    // 城市id
                    citysn:'',
                    // 车型id
                    truckid:'16525',
                    // 购买数量
                    buycount:1,

                    //店铺id
                    shopstr:'',

                    //线索来源
                    clueresource:'',
                },
                // 错误弹窗
                promptShow:false,
                // 错误弹窗文案
                promptText:'',
                // 姓名和电话输入框的状态
                nameFocus:true,
                phoneFocus:false,
                // 选择城市弹层显示与隐藏
                LocationPop:false,
                // 选择地区显示列表数据
                locationData:{},
                //保存已选择城市信息
                locationInfo:{},
                //换车型弹层是否显示
                switchModelPop:false,
                //换车型弹层数据
                switchModelData:{
                    //换车型列表数据
                    priceList:[],
                    //换车型标题数据
                    attrList:[],
                    //换车型当前的显示
                    paramName:'',
                },
                //车型id
                ProductId:'',
                //个人声明
                statement:true,
                //推荐经销商数据
                dealerData:[],
                //已选择经销商数据
                dealerSelected:[],
                // 是否显示空的经销商
                notDealer:false,
                iosTop:false,
                //大数据统计
                p4:'',
                p5:'',
                p6:'',
                p7:'',
            }
        },
        created(){

            storage.getItem('priceProductId',ele => {
                if(ele.result == 'success'){
                    this.p6 = ele.data
                }
            })

            storage.getItem('dealerId',ele => {
                if(ele.result != 'undefined'){
                    this.p7 = ele.data;
                }
            })

            let time = setTimeout(() => {
                //发送PV
                storage.getItem('p4',p4 => {
                    if(p4.result == 'success'){
                        this.p4 = p4.data;
                        storage.getItem('p5',p5 => {
                            if(p5.result == 'success'){
                                this.p5 = p5.data;
                                this.collect({
                                    'p3':p4.data,
                                    'p4':5,
                                    'p5':p5.data,
                                    'p6':this.p6,
                                    'p7':this.p7
                                })
                                clearTimeout(time)
                            }
                        })
                    }
                })
            },200)



            //监听用户点击安卓物理返回键
            globalEvent && globalEvent.addEventListener("onRespondNativeBack",(e) => {
                this.goBack();
            });

            if(weex.config.env.platform == 'iOS'){
                this.iosTop = true;
            }

            //发送GA
           this.goUrlGa(weex.config.deviceId,'product.m.360che.com','产品库-询底价页','询底价')

            //获取车系信息
            storage.getItem('seriesInfo',ele => {
                if(ele.result == 'success'){
                    this.seriesInfo = JSON.parse(ele.data);

                    storage.getItem('priceProductId',ProductId => {
                        if(ProductId.result == 'success'){
                            //设置车型id
                            this.$set(this.priceData,'truckid',ProductId.data);

                            //获取车型信息
                            this.getData('http://api.dealer.360che.com/inquiryprice/Dealer/getProductInfo.aspx?productid=' + this.priceData.truckid,res => {
                                if(res.ok){
                                    this.productInfo = res.data;
                                }
                            });

                            //获取询底价数量
                            this.getData('http://api.dealer.360che.com/inquiryprice/Dealer/getProductCluesCount.aspx?productid=' + this.priceData.truckid,res => {
                                if(res.ok){
                                    this.footerPriceNum = res.data.CluesCount;
                                }
                            })

                            //获取缓存已选择城市
                            storage.getItem('selectedLocation',ele => {
                                if(ele.result == 'success'){
                                    //保存已选择城市信息
                                    this.locationInfo = JSON.parse(ele.data);


                                    //保存已选择城市最终数据
                                    this.priceData.provincesn =this.locationInfo.provinceId;
                                    this.priceData.citysn =this.locationInfo.cityId;

                                    this.getDealer(this.locationInfo)
                                }
                            });

                            //请求换车型数据
                            this.getSwitchModel()
                        }
                    })
                }
            });

            //获取城市列表
            this.getData('http://api.dealer.360che.com/inquiryprice/Dealer/getProvinceListAZ.aspx',ele => {
                if(ele.ok){
                    this.locationData = ele.data
                    console.log(ele.data)
                }
            })

            //线索来源
            if(weex.config.env.platform == 'android'){
                this.priceData.clueresource = 21;
            }else if(weex.config.env.platform == 'iOS'){
                this.priceData.clueresource = 22;
            }
        },
        methods:{
            //点击换车型弹层车型列表
            goSwitchModel(ProductId){
                this.showLoading();
                //切换车型id
                storage.setItem('priceProductId',ProductId,ele => {
                    if(ele.result == 'success'){
//                        this.goWeexUrl('footerPrice.weex.js')

                        //设置车型id
                        this.$set(this.priceData,'truckid',ProductId);

                        //获取车型信息
                        this.getData('http://api.dealer.360che.com/inquiryprice/Dealer/getProductInfo.aspx?productid=' + this.priceData.truckid,res => {
                            if(res.ok){
                                this.productInfo = res.data;
                            }
                        });

                        //获取询底价数量
                        this.getData('http://api.dealer.360che.com/inquiryprice/Dealer/getProductCluesCount.aspx?productid=' + this.priceData.truckid,res => {
                            if(res.ok){
                                this.footerPriceNum = res.data.CluesCount;
                            }
                        })

                        //请求经销商数据
                        this.getDealer(this.locationInfo)

                        //请求换车型数据
                        this.getSwitchModel()

                        //关闭换车型弹窗
                        this.switchModelPop = false;
                        //隐藏加载loading
                        this.hideLoading()
                    }
                })
            },
            //选择城市后保存已选择城市信息
            getLocationInfo(locationInfo){
                //保存已选择城市信息
                this.locationInfo = locationInfo;
                console.log(this.locationInfo,'this.locationInfo');

                //保存已选择城市最终数据
                this.priceData.provincesn =this.locationInfo.provinceId;
                this.priceData.citysn =this.locationInfo.cityId;

                //调取推荐经销商
                this.getDealer();

                //存储已经选择城市信息
                storage.setItem('selectedLocation',JSON.stringify(this.locationInfo));
            },
            //获取经销商
            getDealer(){
                //获取经销商信息 是否点击经销商询底价
                storage.getItem('dealerId',ele => {
                    let dealerId;
                    if(ele.result == 'success'){
                        dealerId = ele.data
                    }

                    //获取推荐经销商
                    this.getData('https://dealer-api.360che.com/inquiryprice/Dealer/getDealerList.aspx?productid=' + this.priceData.truckid + '&provincesn=' + this.locationInfo.provinceId + '&citysn=' + this.locationInfo.cityId + '&type=1&dealerid=' + dealerId, res => {
                        if(res.ok){
                            this.dealerData = res.data;

                            //设置已选中的推荐经销商
                            this.dealerSelected = [];
                            this.dealerData.forEach((r,index) => {
                                //查看是否被选中
                                if(r.checked){
                                    this.$set(this.dealerSelected,index,r.ShopId)
                                }
                            })

                            //查看是否显示空经销商列表
                            if(!this.dealerData.length){
                                this.notDealer = true;
                            }else{
                                this.notDealer = false;
                            }
//                            this.alert(this.notDealer)
                            //删除经销商缓存信息
                            if(ele.result == 'success'){
                               storage.removeItem('dealerId')
                            }
                        }
                    })
                })
            },
            //请求换车型数据
            getSwitchModel(){
                this.getData(this.ajaxUrl() + '/index.php?r=weex/product/get-product-change-list&subId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.priceData.truckid,(ele) => {
                    if(ele.ok){
                        //换车型列表数据
                        this.switchModelData.priceList = ele.data.priceList;
                        //换车型标题数据
                        this.switchModelData.attrList = ele.data.attrList
                        //当前显示的是哪一个
                        if(ele.data.paramName){
                            this.switchModelData.paramName = ele.data.paramName;
                        }else{
                            //判断哪一个的length最长显示哪一个
                            let paramName = '';
                            let has = true;
                            ele.data.priceList.forEach((res,index) => {
                                if (has) {
                                    has = false;
                                    paramName = ele.data.attrList[index];
                                    ele.data.priceList.forEach((r,i) => {
                                        if (ele.data.priceList[index].list.length < ele.data.priceList[i].list.length) {
                                            paramName = ele.data.attrList[i];
                                        }
                                    })

                                }
                            })
                            this.$set(this.switchModelData, 'paramName', paramName);
                        }
                    }
                })
            },
            //选择经销商
            selectDealer(index,ShopId){
                if(this.dealerSelected[index]){
                    this.$set(this.dealerSelected,index,'')
                }else{
                    this.$set(this.dealerSelected,index,ShopId)
                }
            },
            focusText(type){
                if(type == 'name'){
                    this.nameFocus = true;
                }else{
                    this.phoneFocus = true
                }
            },
            blurText(type){
                if(type == 'name'){
                    this.nameFocus = false;
                }else{
                    this.phoneFocus = false;
                }
            },
            // 输入框输入
            importText(type,value){
                if(type == 'name'){
                    this.$set(this.priceData,'relname',value)
                }else if(type == 'phone'){
                    this.$set(this.priceData,'tel',value);
                }
            },
            inputChange(type,value){
                if(type == 'name'){
                    this.$set(this.priceData,'relname',value)
                }else if(type == 'phone'){
                    this.$set(this.priceData,'tel',value);
                }
            },

            // 购买数量
            subtractBtn(){
                if(this.priceData.buycount == 1 )return ;
                this.priceData.buycount--
            },
            addBtn(){
                if(this.priceData.buycount == 99 )return ;
                this.priceData.buycount++
            },

            // 关闭弹层按钮
            closeBtn(){
                this.promptShow = false;
            },

            // 提交询底价入口
            commitData(){
                // 如果姓名不对
                let name = /[^\u4e00-\u9fa5]/;
                if(name.test(this.priceData.relname) || this.priceData.relname.length > 6 || this.priceData.relname == ''){
                    this.promptShow = true;
                    this.promptText = '请填写您的姓名(1-6个汉字)';
                    return ;
                }

                // 如果手机号为空 || 手机号不正确
                let phone = /0?(13|14|15|17|18)[0-9]{9}/;
                if(!phone.test(this.priceData.tel) || this.priceData.tel == ''){
                    this.promptShow = true;
                    this.promptText = '请填写正确的手机号码'
                    return ;
                }

                //请选择提车地区
                if(this.priceData.provincesn == '' || this.priceData.citysn == ''){
                    this.promptShow = true;
                    this.promptText = '请选择提车地区';
                    return ;
                }

                //验证省份
                if(!this.priceData.provincesn){
                    this.promptShow = true;
                    this.promptText = '请选择省份';
                    return ;
                }

                //验证城市
                if(!this.priceData.citysn){
                    if(locationInfo.provincesn == 820000 || locationInfo.provincesn == 810000 || locationInfo.provincesn == 710000){

                    }else{
                        this.promptShow = true;
                        this.promptText = '请选择城市';
                        return ;
                    }
                }

                //验证经销商
                if(this.dealerData.length > 0){
                    let arr = [];
                    this.dealerSelected.forEach((ele,index) => {
                        if(ele != ''){
                            arr.push(ele)
                        }
                    });
                    if(arr.length > 3){
                        this.promptShow = true;
                        this.promptText = '最多选择3家经销商';
                        return ;
                    }
                    if(arr.length == 0){
                        this.promptShow = true;
                        this.promptText = '请选择经销商';
                        return ;
                    }

                    //设置店铺id
                    this.$set(this.priceData,'shopstr',arr.join(','))
                }

                //判断是否选择个人信息保护声明

                if(!this.statement){
                    this.promptShow = true;
                    this.promptText = '请勾选《个人信息保护声明》后再提交您的询价信息';
                    return ;
                }

                //发送最终数据
                this.getSubmitData()
            },

            // 选择城市弹层显示与隐藏
            selectLocationPop(){
                this.LocationPop = !this.LocationPop;
            },

            // 点击提车地区显示弹层
            areaPop(){
                this.LocationPop = !this.LocationPop;
            },

            //换车型弹框
            switchModelShow(){
                this.switchModelPop = !this.switchModelPop;
            },

            //选择个人声明
            selectStatement(){
                this.statement = !this.statement;
            },

            // 请求提交数据
            getSubmitData(){
                let ajaxUrl =  'http://api.dealer.360che.com/inquiryprice/Dealer/submitClues.aspx?relname=' + encodeURI(this.priceData.relname) + '&tel='+ this.priceData.tel +'&truckid='+ this.priceData.truckid +'&provincesn='+ this.priceData.provincesn +'&citysn='+ this.priceData.citysn +'&townsn=&buycount='+ this.priceData.buycount +'&shopstr=' + this.priceData.shopstr + '&clueresource=' + this.priceData.clueresource;
//               'http://api.dealer.360che.com/inquiryprice/Dealer/submitClues.aspx?relname='+ this.priceData.relname +'&tel='+ this.priceData.tel +'&truckid='+ this.priceData.truckid +'&provincesn='+ this.priceData.provincesn +'&citysn='+ this.priceData.citysn +'&townsn=&buycount='+ this.priceData.buycount +'&shopstr=' + this.priceData.shopstr
                this.getData(ajaxUrl,(ele) => {
                    if(ele.ok){
                        if(ele.data.isok == 1){
                            //存储询底价数据
//                            this.GA(1,this.priceData.truckid)
                            this.eventGa(weex.config.deviceId,'完成询底价','表单询底价','')
                            storage.setItem('postFooterPrice',JSON.stringify(this.priceData),ele => {
                                if(ele.result == 'success'){
                                    //跳转到成功页
                                    this.goWeexUrl('success.weex.js')
                                }
                            });
                        }else{
                            this.alert(ele.data.msg)
                        }
                    }else{
                        alert('网络不给力阿~')
                    }
                })
            }
        },
        components:{
            title,
            SalesModel,
            dealer,
            prompt,
            selectLocation,
            switchModel,
            footerInfo,
        }
    }
</script>

<style scoped>
    .ios-top{
        height:40px;
        background-color: #fff;
    }
    .enquire{
        flex:1;
        background-color: #f5f5f5;
        overflow: hidden;
        padding-bottom:100px;
    }
    .message{
        position: relative;
        padding-left: 20px;
        padding-right: 20px;
        overflow: hidden;
        padding-top: 30px;
        padding-bottom: 30px;
        background-color: #fff;
    }
    .name-area{
        position: relative;
    }
    .phone-area{
        position: relative;
        margin-top: 30px;
    }
    .name{
        padding-top: 26px;
        padding-bottom: 26px;
        padding-left: 44px;
        background-color: #f5f5f5;
        border: solid;
        border-color: #ddd;
        border-left-width: 2px;
        border-top-width: 2px;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        font-size: 28px;
        color: #333;
    }
    .phone{
        padding-top: 26px;
        padding-bottom: 26px;
        padding-left: 44px;
        background-color: #f5f5f5;
        border: solid;
        border-left-width: 2px;
        border-top-width: 2px;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-color: #ddd;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        font-size: 28px;
        color: #333;
    }
    .icon{
        position: absolute;
        height:88px;
        top: 0;
        left: 20px;
        justify-content: center;
    }
    .icon-text{
        color:#f60;
    }
    .input-focus{
        border-color: #f60;
        background-color:#fff8f4;
    }
    .area{
        position: relative;
        padding-left: 20px;
        height: 88px;
        flex-direction: row;
        border-bottom: solid;
        border-top: solid;
        border-bottom-width: 2px;
        border-bottom-color: #eee;
        border-top-width: 2px;
        border-top-color: #eee;
        background-color: #fff;
    }
    .caption{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 173px;
        height: 88px;
    }
    .caption-text{
        font-size: 28px;
        color: #333;
    }
    .caption-icon{
        color: #f60;
        margin-right:16px;
    }
    .area-show{
        flex: 1;
        height: 88px;
        align-items: center;
        font-size: 28px;
        color: #333;
        overflow: hidden;
        flex-direction: row;
    }
    .go-area{
        width: 60px;
        justify-content: center;
        align-items: flex-end;
        padding-right: 20px;
    }
    .province{
        height: 88px;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
    }
    .province-text{
        font-size: 28px;
        color: #333;
    }
    .city{
        height: 88px;
        align-items: center;
        justify-content: center;
    }
    .city-text{
       font-size: 28px;
       color: #333;
    }
    .submit{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        background-color: #f60;
        align-items: center;
        justify-content: center;
    }
    .submit-btn{
        font-size: 36px;
        color: #fff;
    }
    .buy-number{
        position: relative;
        padding-left: 20px;
        padding-right: 20px;
        height: 88px;
        flex-direction: row;
        border-bottom: solid;
        border-bottom-width: 2px;
        border-bottom-color: #eee;
        background-color: #fff;
    }
    .buy{
        align-items: center;
        justify-content: center;
        width: 150px;
        height: 88px;
   }
   .buy-text{
        font-size: 28px;
        color: #333;
    }
    .number-wrap{
        flex: 1;
        height: 88px;
        overflow: hidden;
        flex-direction: row;
        align-items:center;
    }
    .subtract{
        width: 64px;
        height: 64px;
        justify-content: center;
        align-items: center;
        border: solid;
        border-color: #e5e5e5;
        border-width: 2px;
    }
    .subtract-icon{
        color: #333;
    }
    .quantity{
        width: 136px;
        height: 64px;
        justify-content: center;
        align-items: center;
        border-top: solid;
        border-bottom: solid;
        border-top-color: #e5e5e5;
        border-bottom-color: #e5e5e5;
        border-top-width: 2px;
        border-bottom-width: 2px;
    }
    .quantity-num{
        font-size: 28px;
        color: #333;
    }
    .add{
        width: 64px;
        height: 64px;
        justify-content: center;
        align-items: center;
        border: solid;
        border-color: #e5e5e5;
        border-width: 2px;
    }
    .add-icon{
        color: #333;
    }
    .month{
        height: 88px;
        justify-content: center;
        align-items: center;
        margin-right: 20px;
    }
    .personal{
        position: relative;
        height: 108px;
        padding-right: 20px;
        padding-left: 20px;
        background-color: #fff;
        flex-direction: row;
        align-items: center;
        border-top-width:20px;
        border-top-style:solid;
        border-top-color:#f5f5f5;
    }
    .check{
        width:60px;
        height:40px;
        padding-left:14px;
        padding-right:14px;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
    }
    .check-icon{
        width:32px;
        height: 32px;
        border: solid;
        border-width: 2px;
        border-color: #999;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
    }
    .statement-selected{
        font-size: 32px;
        text-align: center;
        border-top-color:#f60;
        border-right-color:#f60;
        border-bottom-color:#f60;
        border-left-color:#f60;
    }
    .individual{
        height: 88px;
        align-items: center;
        flex: 1;
        flex-direction: row;
        margin-left: 16px;
    }
    .protect{
        font-size: 32px;
        color: #1571e5;
    }
    .agree-text{
        font-size: 32px;
        color: #333;
    }
    .disable{
        color: #999;
    }
    .input-focus{
        border-color: #f60;
    }
</style>
