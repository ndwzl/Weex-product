// You can install more packages below to config more as you like:
// eslint
// babel-eslint
// eslint-config-standard
// eslint-loader
// eslint-plugin-html
// eslint-plugin-promise
// eslint-plugin-standard
// postcss-cssnext

var path = require('path')
var webpack = require('webpack')

var bannerPlugin = new webpack.BannerPlugin(
    '// { "framework": "Vue" }\n',
    {raw: true}
)

var optimizePlugin = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  },
  //保留banner
  comments: /{ "framework": "Vue" }/,
  sourceMap: true
})


function getBaseConfig() {
    return {
        entry: {
            //品牌页
            brandList: path.resolve('./build/brandList.js'),
            //车系综述页
            series: path.resolve('./build/series.js'),
            //车型综述页
            model: path.resolve('./build/model.js'),
            //车系图片页
            seriesPhoto: path.resolve('./build/seriesPhoto.js'),
            //车型图片页
            modelPhoto:path.resolve('./build/modelPhoto.js'),
            //车系图片详情页
            photoInfo: path.resolve('./build/photoInfo.js'),
            //车系经销商页
            dealer: path.resolve('./build/dealer.js'),
            //车型经销商页
            modelDealer:path.resolve('./build/modelDealer.js'),
            //车系配置页
            config: path.resolve('./build/config.js'),
            //车型配置页面
            modelConfig:path.resolve('./build/modelConfig.js'),
            //选择车系页
            addSeries:path.resolve('./build/addSeries.js'),
            //选择车型页
            addProduct:path.resolve('./build/addProduct.js'),
            //询底价
            footerPrice:path.resolve('./build/footerPrice.js'),
            //询底价成功页面
            success:path.resolve('./build/success.js'),
            //个人信息声明页
            personalInfo:path.resolve('./build/personalInfo.js'),
            //对比页面
            contrast:path.resolve('./build/contrast.js'),
            //筛选首页
            filter: path.resolve('./build/filter.js'),
            //筛选结果页
            filterResult: path.resolve('./build/filterResult.js'),
        },
        output: {
            path: 'dist',
        },
        module: {
            // // You can use ESLint now!
            // // Please:
            // // 1. npm install {
            // //   babel-eslint
            // //   eslint
            // //   eslint-config-standard
            // //   eslint-loader
            // //   eslint-plugin-html
            // //   eslint-plugin-promise
            // // } --save-dev
            // // 2. set .eslintrc
            // //   take { "extends": "standard" } for example
            // //   so you need: npm install eslint-plugin-standard --save-dev
            // // 3. set the config below
            // preLoaders: [
            //   {
            //     test: /\.vue$/,
            //     loader: 'eslint',
            //     exclude: /node_modules/
            //   },
            //   {
            //     test: /\.js$/,
            //     loader: 'eslint',
            //     exclude: /node_modules/
            //   }
            // ],
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel',
                    exclude: /node_modules/
                }, {
                    test: /\.vue(\?[^?]+)?$/,
                    loaders: []
                }
            ]
        },
        vue: {
            // // You can use PostCSS now!
            // // Take cssnext for example:
            // // 1. npm install postcss-cssnext --save-dev
            // // 2. write `var cssnext = require('postcss-cssnext')` at the top
            // // 3. set the config below
            // postcss: [cssnext({
            //   features: {
            //     autoprefixer: false
            //   }
            // })]
        },
        plugins: [
            bannerPlugin,
            optimizePlugin
        ]
    }
}

var webConfig = getBaseConfig()
webConfig.output.filename = '[name].web.js'
webConfig.module.loaders[1].loaders.push('vue')

var weexConfig = getBaseConfig()
weexConfig.output.filename = '[name].weex.js'
weexConfig.module.loaders[1].loaders.push('weex')

module.exports = [webConfig, weexConfig]
