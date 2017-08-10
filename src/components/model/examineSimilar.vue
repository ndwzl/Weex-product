<template>
    <div>
        <sub-title subTitleName="相近车型可选配置" annotation="请选择任意条件"></sub-title>
        <!--筛选条件-->
        <div class="option-wrapper">
            <div v-if="examineSimliarData.options" class="options" v-for="(ele,index) in examineSimliarData.options">
                <div :class="['key',optionNumber == 3 ? 'key-long' : '']">
                    <text class="key-text">{{examineSimliarData.gatherKeys[index]}}</text>
                </div>
                <div class="option-list">
                    <div v-for="option in ele" :class="['option',optionNumber == 3 ? 'option-long' : '',optionCondition[examineSimliarData.gatherKeys[index]] == option ? 'selected-option' : '']" @click="selectOption(examineSimliarData.gatherKeys[index],option)">
                        <text :class="['option-text',optionCondition[examineSimliarData.gatherKeys[index]] == option ? 'selected-option-text' : '']">{{option}}</text>
                    </div>
                </div>
            </div>
        </div>
        <!--筛选内容-->
        <div class="content">
            <div v-for="ele in examineSimliarData.content" class="model-list" v-if="ele.show && ele.F_ProductId != ProductId" @click="goRests(ele)">
                <div class="truck-info">
                    <div class="truck-name">
                        <text v-if="ele.hotLocation" class="truck-name-tag">{{ele.hotLocation}}</text>
                        <text class="truck-name-text">{{ele.F_ProductName.replace('一汽解放 J6P重卡 ','')}}</text>
                    </div>
                    <div class="guide-price">
                        <text v-if="ele.priceScope" class="guide-price-text">厂商指导价：{{ele.priceScope}}</text>
                        <text v-else="" class="guide-price-text">厂商指导价：{{ele.F_Price != 0 ? ele.F_Price + '万元' : '暂无'}}</text>
                        <div class="tags">
                            <text v-for="tag in ele.paramDetail" class="tag-text">{{tag}}</text>
                        </div>
                    </div>
                    <div class="action">
                        <div class="">
                            <text class="hot-price">{{ele.hotPrice}}</text>
                        </div>
                        <div class="action-wrapper">
                            <div class="comparison" @click="compare(ele.F_ProductId)">
                                <!--<text v-if="!compareState[ele.F_ProductId]" :style="{fontFamily:'detail',fontSize:'26px',color:'#586c94',marginRight:'5px'}">&#x52a0;</text>-->
                                <image v-if="!compareState[ele.F_ProductId]"  src="https://s.kcimg.cn/wap/images/detail/productApp/add.png" style="width:16px;height:16px;margin-right:5px"></image>
                                <text class="comparison-text">{{compareState[ele.F_ProductId] ? compareState[ele.F_ProductId] : '对比'}}</text>
                            </div>
                            <div class="floor-price" @click="goFooterPrice(ele)">
                                <text class="floor-price-text">询底价</text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import subTitle from '../subTitle.vue'
    let storage = weex.requireModule('storage')
    let animation = weex.requireModule('animation')
    let modal = weex.requireModule('modal')
    let stream = weex.requireModule('stream')
    export default {
        props:['examineSimliarData','optionCondition','seriesId','ProductId','seriesInfo','locationInfo','compareState'],
        components:{subTitle},
        data(){
            return {
                //选项列表选项一行的个数
                optionNumber:4,
                //加入对比状态
//                compareState:{
//
//                },
                //对比要跳转过去的url
                compareUrl:'',
                //对比的数量
                compareNumber:'',
                //存储的对比数据
                compareTask:{},
                //地区热门列表
                hotModelList:[],
            }
        },
        created(){
            //查看屏幕分辨率，判断选项列表一行的个数
            if(weex.config.deviceWidth <= 320){
                this.optionNumber = 3;
            }
            //获取对比存储数据
            storage.getItem('compareTask',(comper) => {
                if(comper.result == 'success'){
                    this.compareTask = JSON.parse(comper.data);
                }
            });

            //循环列表数据
//            this.examineSimliarData.content.forEach((ele,index) => {
//                //获取存储对比数据 && 给元素赋值
//                if (this.compareTask[this.seriesId]) {
//                    //获取对比的数量
//                    this.compareNumber = this.compareTask[this.seriesId].length;
//                    //循环存储的对比数据，渲染数据
//                    this.compareTask[this.seriesId].forEach((res,index) => {
//                        this.$set(this.compareState, res, '已加入')
//                    })
//
//                    //判断现在对比的数量有几个
//                    if (this.compareTask[this.seriesId].length == 2) {
//                        //对比的链接
//                        this.compareUrl = 'http://product.m.360che.com/contrast/' + this.compareTask[this.seriesId][0] + '_' + this.compareTask[this.seriesId][1] + '/';
//                    } else {
//                        //对比的链接
//                        this.compareUrl = 'http://product.m.360che.com/contrast/' + this.compareTask[this.seriesId][0] + '/';
//                    }
//                    console.log(this.compareUrl)
//                }
//            });

            this.getHotModel()

        },
        methods:{
            alert (text) {
                modal.alert({
                    message: text
                })
            },
            //点击对比，跳转对比链接
            goCompare(compareUrl){
                this.compareState = {};
                //对比要跳转过去的url
                this.compareUrl = '';
                //对比的数量
                this.compareNumber = '';
                //存储的对比数据
                this.compareTask = {};


                storage.getItem('compareTask',(ele) => {
                    if(ele.result == 'success'){
                        let compareTask = JSON.parse(ele.data);
                        if(compareTask[this.seriesId]){
                            compareTask[this.seriesId] = [];
                        }
                        storage.setItem('compareTask',JSON.stringify(compareTask),() => {
                            this.goUrl(compareUrl);
                        })
                    }
                })
            },
            //跳转到其他车型
            goRests(ele){
                let arr = [];
                for(let key in this.optionCondition){
                    arr.push(this.optionCondition[key])
                }

                //大数据发送事件类
                this.event({
                    'p3':9,
                    'p4':this.ProductId,
                    'p5':ele.F_ProductId,
                    'p6':encodeURIComponent(arr.join('|'))
                })

                this.$emit('goModel',ele)
//                storage.setItem('ProductId',ele.F_ProductId,(res) => {
//                    this.goWeexUrl('Model.weex.js');
//                })
            },
            goFooterPrice(ele){

                let arr = [];
                for(let key in this.optionCondition){
                    arr.push(this.optionCondition[key])
                }

                //大数据发送事件类
                this.event({
                    'p3':10,
                    'p4':this.ProductId,
                    'p5':ele.F_ProductId,
                    'p6':encodeURIComponent(arr.join('|'))
                })

                storage.setItem('ProductId',ele.F_ProductId,(res) => {
                    this.goWeexUrl('footerPrice.weex.js');
                })
            },
            //点击筛选条件
            selectOption(key,option){
                this.$emit('selectOption',key,option)
            },
            //对比
            compare(id){
                this.$emit('compare',id)
                //查看存储的数据
//                storage.getItem('compareTask',(ele) => {
//                    if(ele.result == 'success'){
//                        let data = JSON.parse(ele.data);
//                        console.log(data[this.seriesId])
//                        if(data[this.seriesId]){
//                            //判断是加入还是取消
//                            if(this.compareState[id]){
//                                //循环已保存的数组 && 删除掉
//                                data[this.seriesId].forEach((ele,index) => {
//                                    if(ele == id){
//                                        data[this.seriesId].splice(index,index + 1)
//                                        //添加对比的数量
//                                        this.compareNumber--;
//
//                                        //如果还剩下一个对比
//                                        if(data[this.seriesId][0]){
//                                            //对比的链接
//                                            this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '/';
//                                        }
//                                    }
//                                });
//                                //再次存储
//                                storage.setItem('compareTask',JSON.stringify(data),() => {
//                                    this.$set(this.compareState,id,'')
//                                })
//                            }else{
//                                if(data[this.seriesId].length >= 2){
//                                    this.alert('只能对比两款车型')
//                                }else{
//                                    data[this.seriesId].push(id);
//                                    //添加对比的数量
//                                    this.compareNumber++;
//
//                                    //判断现在对比的数量有几个
//                                    if(data[this.seriesId].length == 2){
//                                        //对比的链接
//                                        this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '_' + data[this.seriesId][1] + '/';
//                                    }else{
//                                        //对比的链接
//                                        this.compareUrl = 'http://product.m.360che.com/contrast/' + data[this.seriesId][0] + '/';
//                                    }
//
//                                    //再次存储
//                                    storage.setItem('compareTask',JSON.stringify(data),() => {
//                                        this.$set(this.compareState,id,'已加入')
//                                    })
//
//                                }
//                            }
//
//                        }else{
//                            data[this.seriesId] = [];
//                            data[this.seriesId].push(id);
//                            //添加对比的数量
//                            this.compareNumber++;
//                            //加入对比
//                            this.$set(this.compareState,id,'已加入');
//                            //对比的链接
//                            this.compareUrl = 'http://product.m.360che.com/contrast/' + id + '/';
//                            storage.setItem('compareTask',JSON.stringify(data))
//                        }
//                    }else{
//                        //未获取到存储，第一次存储
//                        let compareTask = {};
//                        compareTask[this.seriesId] = [];
//                        compareTask[this.seriesId].push(id);
//
//                        //添加对比的数量
//                        this.compareNumber++;
//
//                        //加入对比
//                        this.$set(this.compareState,id,'已加入')
//                        //对比的链接
//                        this.compareUrl = 'http://product.m.360che.com/contrast/' + id + '/';
//                        storage.setItem('compareTask',JSON.stringify(compareTask))
//                    }
//                });
            },
            //请求数据
            getData(ajaxUrl,callback){
                return stream.fetch({
                    method:'GET',
                    type:'json',
                    url:ajaxUrl
                },callback)
            },
            //请求地区热门车型
            getHotModel(){
                let DEV = 'http://cui.product.kache.com';
                let BUILD = 'http://product-yufabu.360che.com';
                let DBUG = false;
                let ajaxUrl = DBUG ? DEV : BUILD;
                //请求地区热门车型
                this.getData(ajaxUrl + '/index.php?r=app/series/district-price&subCateId=' +  this.seriesInfo.F_SubCategoryId + '&seriesId=' + this.seriesInfo.F_SeriesId + '&proId=' + this.seriesInfo.proid + '&provinceId=' + this.locationInfo.provinceId + '&cityId=' + this.locationInfo.cityId,(res) => {
                    if(res.ok){
                        this.hotModelList = res.data;

                        this.examineSimliarData.content.forEach((ele,index) => {

                            //重置热门地区和报价
                            this.$set(ele, 'hotLocation', '');
                            this.$set(ele, 'hotPrice', '');

                            //循环热门车型报价
                            if (this.hotModelList) {
                                this.hotModelList.forEach((hot, i) => {
                                    //如果id相等
                                    if (ele.F_ProductId == hot.productId) {
                                        //赋值价格
                                        this.$set(ele, 'hotPrice', hot.price);
                                        //是热门
                                        if (hot.hot && hot.hot == 1) {
                                            this.$set(ele, 'hotLocation', '[' + this.locationInfo.cityName.split('市')[0] + '热门]');
                                        }
                                        let hotprice =this.examineSimliarData.content.splice(index, '1')[0];
                                        this.examineSimliarData.content.unshift(hotprice)
                                    }
                                })
                            }
                        });

                        //循环最外层标签
//                        this.modelList.forEach((ele, index) => {
//                            //如果数据的内容不为空
//                            if(this.modelList[index].total > 0){
//                                for(let key in this.modelList[index].list) {
//                                    //循环总列表
//                                    this.modelList[index].list[key].forEach((data,number) => {
//                                        //重置热门地区和报价
//                                        this.$set(this.modelList[index].list[key][number],'hotLocation','');
//                                        this.$set(this.modelList[index].list[key][number],'hotPrice','');
//
//                                        //循环热门车型报价
//                                        if(this.hotModelList){
//                                            this.hotModelList.forEach((hot,i) => {
//                                                //如果id相等
//                                                if(data.F_ProductId == hot.productId){
//                                                    //赋值价格
//                                                    this.$set(this.modelList[index].list[key][number],'hotPrice',hot.price);
//                                                    //是热门
//                                                    if(hot.hot && hot.hot == 1){
//                                                        this.$set(this.modelList[index].list[key][number],'hotLocation','[' + this.locationInfo.cityName + '热门]');
//                                                    }
//                                                    let hotprice = this.modelList[index].list[key].splice(number,'1')[0];
//                                                    this.modelList[index].list[key].unshift(hotprice)
//                                                }
//                                            })
//                                        }
//                                    })
//                                }
//                            }
//                        })
                    }
                });
            }
        },
        watch:{
            //监听 加入 || 取消对比
            compareNumber(){
                let compare = this.$refs.compare;
                if(this.compareNumber == ''){
                    animation.transition(compare,{
                        styles:{
                            transform:'translate(0,0)',
                        },
                        duration:300,
                        timingFunction:'ease'
                    })
                }else{
                    animation.transition(compare,{
                        styles:{
                            transform:'translate(-140px,0)',
                        },
                        duration:300,
                        timingFunction:'ease'
                    })
                }
            },
            //深度监听地区发生变化
            locationInfo:{
                //当地区发生变化的时候 请求调取热门地区
                handler(){
                    this.getHotModel();
                },
                deep: true,
            }
        }
    }
</script>

<style scoped>
    .option-wrapper{
        padding-top:10px;
        padding-bottom:10px;
        padding-right:20px;
        padding-left:20px;
    }
    .options{
        flex-direction: row;
        flex-wrap: wrap;
    }
    .key{
        width:142px;
        height:60px;
        margin-top:10px;
        margin-bottom:10px;
        justify-content: center;
        align-items: center;
    }
    .key-text{
        color:#333;
        font-size:24px;
    }
    .key-long{
        width:162px;
    }
    .option-list{
        flex: 1;
        flex-direction: row;
    }
    .option{
        width:126px;
        height:60px;
        margin-left:10px;
        margin-right:10px;
        margin-top:10px;
        margin-bottom:10px;
        justify-content: center;
        align-items: center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#e5e5e5;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#e5e5e5;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#e5e5e5;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    .selected-option{
        border-top-color:#586C94;
        border-right-color:#586C94;
        border-bottom-color:#586C94;
        border-left-color:#586C94;
    }
    .option-text{
        color:#333;
        font-size:24px;
    }
    .selected-option-text{
        color:#586C94;
    }
    .option-long{
        width:162px;
    }
    .model-list{
        padding-left:30px;
        padding-right:30px;
    }
    .model-list:active{
        background-color:rgba(0,0,0,.2)
    }
    .truck-info{
        padding-top:30px;
        padding-bottom:20px;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
    }
    .truck-name{
        flex-direction:row;
        align-items: center;
        justify-content: flex-start;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        lines: 1;
    }
    .truck-name-tag{
        margin-right:20px;
        color:#448dea;
        font-size:24px;
    }
    .truck-name-text{
        color: #333333;
        font-size:28px;
        word-break: break-all;
    }
    .guide-price{
        flex-direction:row;
        justify-content:space-between;
        margin-top:12px;
    }
    .guide-price-text{
        color:#999;
        font-size:24px;
    }
    .tags{
        flex-direction:row;
    }
    .tag-text{
        margin-left:15px;
        color:#999;
        font-size:24px;
    }
    .load-more{
        height:80px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#e5e5e5;
    }
    .load-more-text{
        color:#999;
        font-size: 28px;
        margin-right:10px;
    }
    .action{
        height:64px;
        margin-top:20px;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
    }
    .hot-price{
        color:#f60;
        font-size:28px;
    }
    .action-wrapper{
        flex:1;
        flex-direction:row;
        justify-content:flex-end;
    }
    .comparison{
        height:64px;
        padding-left:30px;
        padding-right:30px;
        flex-direction:row;
        justify-content:center;
        align-items:center;
    }
    .comparison-text{
        color:#586c94;
        font-size:24px;
    }
    .floor-price{
        height:64px;
        padding-left:30px;
        padding-right:30px;
        justify-content:center;
        align-items:center;
        border-top-width:1px;
        border-top-style:solid;
        border-top-color:#586C94;
        border-right-width:1px;
        border-right-style:solid;
        border-right-color:#586C94;
        border-bottom-width:1px;
        border-bottom-style:solid;
        border-bottom-color:#586C94;
        border-left-width:1px;
        border-left-style:solid;
        border-left-color:#586C94;
        border-top-left-radius: 8px;
        border-top-right-radius:8px;
        border-bottom-left-radius:8px;
        border-bottom-right-radius:8px;
    }
    .floor-price-text{
        color:#586C94;
        font-size:28px;
    }
</style>