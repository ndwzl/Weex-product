var navigator = weex.requireModule('navigator')
var thaw = weex.requireModule('THAW')
var dom = weex.requireModule('dom')
var stream = weex.requireModule('stream')
let modal = weex.requireModule('modal')
var globalEvent = weex.requireModule('globalEvent')
let storage = weex.requireModule('storage')

// 前端监控
import WeexLogger from 'alife-logger/weex'

const HOST = require('../../config.js')
export default {
    methods: {
        alert(text) {
            modal.alert({
                message: text
            })
        },
        //返回上一个页面
        goBack() {
            //如果打开选择地区，那么关闭选择地区弹层
            if (this.LocationPop) {
                this.LocationPop = false;
                return
            }
            //如果打开换车型弹层，那么关闭换车型弹层
            if (this.switchModelPop) {
                this.switchModelPop = false;
                return
            }

            //选择车型页面弹层，关闭选车弹层
            if (this.selectProductPop) {
                this.selectProductPop = false;
                return
            }

            //选择车系弹层，关闭选择车系弹层
            if (this.addSeriesShow) {
                this.addSeriesShow = false;
                return;
            }

            //this.alert(this.navInfo)
            navigator.pop();
        },
        //直接跳转m端页面
        goUrl(url) {
            thaw.goUrl(url)
        },
        //跳入到weex页面
        goWeexUrl(url) {
            //如果是苹果 点击的时候显示弹层，之后在去掉
            // if (weex.config.env && weex.config.env.platform == 'iOS') {
            //     this.showLoading()
            // }

            //查看版本号
            storage.getItem('versions', res => {
                if (res.result == 'success') {
                    this.getData("https://s.kcimg.cn/wap/js/appProduct/" + res.data + "/" + url, ele => {
                        if (ele.statusText == 'OK') {
                            navigator.push({
                                url: "https://s.kcimg.cn/wap/js/appProduct/" + res.data + "/" + url,
                                animated: 'true'
                            }, () => {
                                //隐藏加载loading
                                this.hideLoading()
                            })
                        } else {
                            this.alert('网络错误')
                                //隐藏加载loading
                            this.hideLoading()
                        }
                    })
                }
            })

			// 测试地址
			// const TestUrl = `http://${HOST}:8080/dist/${url}`
            // this.getData(TestUrl, ele => {
            //     // this.alert(JSON.stringify(ele))
            //     if (ele.statusText == 'OK') {
            //         navigator.push({
            //             url: TestUrl,
            //             animated: 'true'
            //         }, () => {
            //             //隐藏加载loading
            //             this.hideLoading()
            //         })
            //     } else {
            //         this.alert('网络错误')
            //             //隐藏加载loading
            //         this.hideLoading()
            //     }
            // })
        },
        //get请求数据
        getData(ajaxUrl, callback, type) {

            let dataType = 'json';
            if (type) {
                dataType = type;
            }
            return stream.fetch({
                method: 'GET',
                type: dataType,
                url: ajaxUrl
            }, callback)
        },
        //post请求数据
        postData(ajaxUrl, data, callback) {
            return stream.fetch({
                method: 'GET',
                type: 'text',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: ajaxUrl,
                body: JSON.stringify(data)
            }, callback)
        },
        //请求链接
        ajaxUrl (DEBUG = true) {
            let DEV = 'https://product.360che.com';
            let BUILD = 'http://product-yufabu.360che.com';
            let ajaxUrl = DEBUG ? DEV : BUILD;
            return ajaxUrl;
        },
        //显示加载loading
        showLoading() {
            thaw && thaw.onShowLoading()
        },
        //隐藏加载loading
        hideLoading() {
            thaw && thaw.onHideLoading()
        },
        //发送ga
        GA(p2, p3, p4, p5) {
            //let source = '';
            //let deviceId = ''
            //if (weex.config.env.platform == 'android') {
            //    source = 'and_app';
            //} else if (weex.config.env.platform == 'iOS') {
            //    source = 'ios_app'
            //}
            //
            //let batchId = p4;
            //if(!batchId){
            //    batchId = ''
            //}
            //
            //let productId = p5;
            //if(!productId){
            //    productId = '';
            //}
            //if(weex.config && weex.config.deviceId){
            //    deviceId = weex.config.deviceId;
            //    this.getData('https://stats.360che.com/app_tj.htm?type=click&source=' + source + '&deviceid=' + deviceId + '&p1=3&p2=x' + p2 + '&p3=' + p3 + '&p4=' + batchId + '&p5=' + productId,ele => {
            //        if(ele.ok){
            //            //this.alert('https://stats.360che.com/app_tj.htm?type=click&source=' + source + '&deviceid=' + deviceId + '&p1=3&p2=x' + p2 + '&p3=' + p3 + '&p4=' + batchId + '&p5=' + productId)
            //        }
            //    })
            //}else{
            //    storage.getItem('deviceId',ele => {
            //        if(ele.result == 'success'){
            //            deviceId = ele.data;
            //            this.getData('https://stats.360che.com/app_tj.htm?type=click&source=' + source + '&deviceid=' + deviceId + '&p1=3&p2=x' + p2 + '&p3=' + p3 + '&p4=' + batchId + '&p5=' + productId,ele => {
            //                if(ele.ok){
            //                    //this.alert('https://stats.360che.com/app_tj.htm?type=click&source=' + source + '&deviceid=' + deviceId + '&p1=3&p2=x' + p2 + '&p3=' + p3 + '&p4=' + batchId + '&p5=' + productId)
            //                }
            //            })
            //        }
            //    })
            //}
        },
        //Ga统计
        goUrlGa(cid, dh, dp, dt) {
            let tid = '';
            let cId = cid;
            if (weex.config.env && weex.config.env.platform == 'android') {
                tid = 'UA-64002767-20';
                // + '&dimension2=' + 卡家论坛ID
                let ajaxUrl = 'https://www.google-analytics.com/collect?v=1&tid=' + tid + '&cid=' + cId + '&t=pageview&dh=' + dh + '&dp=' + encodeURI(dp) + '&dt=' + encodeURI(dt) + '&cd1=' + weex.config.deviceId 
                this.getData(ajaxUrl, ele => {
                    //if (ele.ok) {
                    //    this.alert(ajaxUrl)
                    //}else{
                    //    this.alert(ajaxUrl)
                    //    this.alert(JSON.stringify(ele))
                    //}
                }, 'text')
            } else if (weex.config.env && weex.config.env.platform == 'iOS') {
                tid = 'UA-64002767-21';
                storage.getItem('deviceId', res => {
                    if (res.result == 'success') {
                        cId = res.data;
                        // + '&dimension2=' + 卡家论坛ID
                        let ajaxUrl = 'https://www.google-analytics.com/collect?v=1&tid=' + tid + '&cid=' + cId + '&t=pageview&dh=' + dh + '&dp=' + encodeURI(dp) + '&dt=' + encodeURI(dt) + '&cd1=' + cId
                        this.getData(ajaxUrl, ele => {
                            if (ele.ok) {
                                // this.alert('https://www.google-analytics.com/collect?v=1&tid=' + tid + '&cid=' + cId + '&t=pageview&dh=' + dh + '&dp=' + dp + '&dt=' + dt)
                            }
                        }, 'text')
                    }
                })
            }
        },
        //Ga时事件统计
        eventGa(cid, ec, ea, el) {
            let tid = '';
            let cId = cid;

            if (weex.config.env && weex.config.env.platform == 'android') {
                tid = 'UA-64002767-20';
                let ajaxUrl = 'https://www.google-analytics.com/collect?v=1&tid=' + tid + '&cid=' + cId + '&t=event&ec=' + encodeURI(ec) + '&ea=' + encodeURI(ea) + '&el=' + encodeURI(el)
                this.getData(ajaxUrl, ele => {
                    //this.alert(JSON.stringify(ele))
                    if (ele.ok) {
                        //this.alert(ajaxUrl)
                    }
                }, 'text')
            } else if (weex.config.env && weex.config.env.platform == 'iOS') {
                tid = 'UA-64002767-21';
                storage.getItem('deviceId', res => {
                    if (res.result == 'success') {
                        cId = res.data;
                        let ajaxUrl = 'https://www.google-analytics.com/collect?v=1&tid=' + tid + '&cid=' + cId + '&t=event&ec=' + encodeURI(ec) + '&ea=' + encodeURI(ea) + '&el=' + encodeURI(el)
                        this.getData(ajaxUrl, ele => {
                            if (ele.ok) {
                                //this.alert(ajaxUrl)
                                //this.alert('https://www.google-analytics.com/collect?v=1&tid=' + tid + '&cid=' + cId + '&t=event&ec=' + ec + '&ea=' + ea + '&el=' + el)
                            }
                        }, 'text')
                    }
                })
            }
        },

        //大数据统计
        // PV/UV
        collect(o) {
            let userId = '';
            let deviceid = '';

            //如果是安卓
            if (weex.config && weex.config.deviceId) {
                deviceid = weex.config.deviceId;
                userId = weex.config.userId;
            } else {
                // IOS
                storage.getItem('deviceId', ele => {
                    if (ele.result == 'success') {
                        deviceid = ele.data;
                    }
                });

                storage.getItem('userId', ele => {
                    userId = ele.data;
                })
            }

            let platform = ''; // 平台：and_app(android),ios_app(iPhone)

            if (weex.config.env && weex.config.env.platform == 'android') {
                platform = 'and_app';
            } else if (weex.config.env && weex.config.env.platform == 'iOS') {
                platform = 'ios_app'
            }
            // 生成参数数组(p1~p20)
            let pArr = new Array(20);
            for (let i = 0; i < 20; i++) {
                pArr[i] = `p${i+1}`;
            }
            // p1 = 0：开屏, 1:资讯, 2:论坛, 3:选车, 4:我的, 5:卡友圈
			// p2 = 0：品牌 1：筛选 2：按工况 3：排行 4：历史记录
			let p1 = 3;
			if (typeof o.p1 === 'number') {
				p1 = o.p1
			}
            delete o.p1;
            o.p2 = o.p2 || 0;
            let time = setTimeout(() => {

                const timestamp = +new Date();
                let parameter = `type=enter&source=${platform}&deviceid=${deviceid}&uid=${userId || 0}&p1=${p1}`;
                pArr.forEach(item => {
                    if (o.hasOwnProperty(item)) {
                        parameter += `&${item}=${o[item]}`;
                        delete o[item];
                    }
                })
                for (let i in o) {
                    parameter += `&${i}=${o[i]}`;
                }
                parameter += `&ts=${timestamp}`;
                //发送
                this.send(parameter, ele => {
                    if (ele.ok) {
                        clearTimeout(time)
                    }
                })

            }, 300)

        },

        // 大数据统计
        //  事件类
        event(o) {
            var userId = '';
            var deviceid = '';

            //如果是安卓
            if (weex.config && weex.config.deviceId) {
                deviceid = weex.config.deviceId;
                userId = weex.config.userId;
            } else {
                // IOS
                storage.getItem('deviceId', ele => {
                    if (ele.result == 'success') {
                        deviceid = ele.data;
                    }
                });

                storage.getItem('userId', ele => {
                    userId = ele.data;
                })
            }

            var platform = '' // 平台：and_app(android),ios_app(iPhone)



            if (weex.config.env && weex.config.env.platform == 'android') {
                platform = 'and_app';
            } else if (weex.config.env && weex.config.env.platform == 'iOS') {
                platform = 'ios_app'
            }

            var epnonestats = +new Date() + '_' + (Math.floor(Math.random() * 90) + 10) //btoa(+new Date()).substring(0,16)  // 16位随机串

            let p1 = 3;
            let p2 = 0;

            let time = setTimeout(() => {

                let parameter = `type=click&source=${platform}&deviceid=${deviceid}&uid=${userId || 0}&p1=${p1}&p2=${p2}`;
                for (let i in o) {
                    parameter += `&${i}=${o[i]}`
                }
                //发送
                this.send(parameter, ele => {
                    if (ele.ok) {
                        //this.alert(parameter)
                        clearTimeout(time)
                    }
                })
            }, 300)
        },
        //发送
        send(parameter, callback) {
            return stream.fetch({
                method: 'GET',
                type: 'json',
                url: 'https://stats.360che.com/app_tj.htm?' + parameter
            }, callback)
        },
        isIos () {
            if(weex.config.env && weex.config.env.platform && weex.config.env.platform == 'iOS') {
                return true
            } else {
                return false
            }
        },
        preventContinuousClick () {
            if (!this.$lastClickTime) {
                this.$lastClickTime = +new Date()
            } else {
                if ((+new Date()) - this.$lastClickTime < 1000) {
                    throw new Error('Quick Continuous Click !')
                }
            }
        },
        $goFooterPrice (id) {
            storage.setItem('priceProductId', id, e => {
                if (e.result === 'success') {
                    this.goWeexUrl('footerPrice.weex.js')
                }
            })
        },
        $goModel (data) {
            storage.setItem('seriesInfo', JSON.stringify(data), e => {
                e.result === 'success' && storage.setItem('ProductId', data.F_ProductId, e => {
                    e.result === 'success' && this.goWeexUrl('model.weex.js')
                })
            })
        },
        $goSeries (data) {
            storage.setItem('seriesInfo', JSON.stringify(data), e => {
                e.result === 'success' && this.goWeexUrl('series.weex.js')
            })
        },
        jsonToUrl (object) {
            let paramStr = '?'
            for (const key in object) {
                const val = object[key]
                paramStr += `${key}=${val}&`
            }
            paramStr = paramStr.replace(/&$/, '')
            return paramStr
        },
        // 前端监控
        weexLogger(pageName){
            // 前端监控
            WeexLogger.singleton({
                pid: '6fdw9@c187ad8db37108a',
                uid: '10795545', // Login uid, for UV report
                page: pageName, // Initial page name, if passed, SDK will send a PV log after Initialization completed
                imgUrl: 'https://arms-retcode.aliyuncs.com/r.png?' // 设定日志上传地址,新加坡部署可选`https://arms-retcode-sg.aliyuncs.com/r.png?`
            });
        }
    },
    created() {
        //监听用户点击安卓物理返回键
        // globalEvent && globalEvent.addEventListener("onRespondNativeBack", e => {
        //     this.goBack()
		// })
        //iconFont字体
        dom.addRule('fontFace', {
            'fontFamily': 'detail',
            'src': "url(\'https://at.alicdn.com/t/font_9uxuxvowyib5ipb9.woff\')"
        });
        this.DefaultImgPath = 'https://s.kcimg.cn/wap/images/detail/productApp/'
        if (weex.config.env) {
            const {deviceWidth, deviceHeight} = weex.config.env
            this.FullScreenHeight = `${750 / deviceWidth * deviceHeight}px`
        }
    }
}
