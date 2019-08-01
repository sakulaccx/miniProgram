# whale

> A Mpvue project

## Build Setup

``` bash
# 初始化项目
# 当前已经是完整项目，不需要初始化
vue init mpvue/mpvue-quickstart myproject
cd myproject

# 安装依赖
yarn

#安装完项目后，需要对价格日历进行样式覆盖
将mp-vue-calendar-modify目录下的文件复制到node_modules/mpvue-calndar/src
目录下，覆盖同名文件

# 开发时构建(启动本地开发环境的小程序)
npm dev

# 打包构建(生成测试或生产包，可发布的小程序)
npm build

# 指定平台的开发时构建(微信、百度、头条、支付宝)
npm dev:wx
npm dev:swan
npm dev:tt
npm dev:my

# 指定平台的打包构建
npm build:wx
npm build:swan
npm build:tt
npm build:my

# 生成 bundle 分析报告
npm run build --report

# 目录结构
pages                ---所有页面目录
pages/search         ---目的地、日期选择页
pages/calender       ---价格日历页
pages/destination    ---目的地信息显示页
pages/detail         ---搜索详情页
pages/interest       ---内部关注列表页
pages/follow         ---导航关注列表页
pages/flightList     ---航班列表页
pages/user           ---导航“我的”
pages/notifaction    ---通知列表页
pages/recommend      ---建议填写
pages/showQRCode     ---引导关注页
pages/aboutus        ---关于我们
pages/index          ---闪屏页
src/app.json         ---小程序配置项

#静态资源
static/images        --- 图片资源
static/lib           ---外部插件
static/icon          ---icon字体
static/tab           ---导航图片
static/vant          ---vant的UI控件,只含有部分使用到的UI控件

#外部组件
components/favorite-bar.vue       ---页面顶部关注栏
components/notice-bar.vue         ---页面顶部触发时间、航班列表选择组件
components/time-dialog.vue        ---目的地结果页时间，航班号选择组件
components/time-dialog-detail.vue ---搜搜详情页时间，航班号选择组件
components/time-dialog-flight.vue ---航班列表页时间，航班号选择组件
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

