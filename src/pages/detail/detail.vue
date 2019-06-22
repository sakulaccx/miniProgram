<template>
  <div class="content">
    <notice-bar @showTimeBox="showTimeFilter" />
    <div class="detail-wrap" v-if="hasData">
      <div class="info-wrap">
        <div class="price-show">￥{{flightInfo.lowestPrice}}</div>
        <div class="price-desc">{{flightInfo.dateStr}}机票价格</div>
        <div class="btn buy-btn" @click="gotoList">现在就买</div>
        <div class="favorit-link" v-if="!favoriteStatus" @click="addFavorite">添加关注，提醒我购票</div>
        <div class="favorit-link" v-else @click="gotoFavoriteList">已关注，查看关注列表</div>
      </div>
      <div class="forecast-wrap">
        <div class="forecast-title">{{flightInfo.dateStr}}机票价格</div>
        <div class="suggest-content" :class="suggestion ? 'green-text' : 'red-text'">{{suggestText[suggestion]}}</div>
        <div class="clearfix"></div>
        <div class="suggest-desc">
          {{suggestionDesc}}
          <span :class="suggestion ? 'green-text' : 'red-text'">¥{{priceRange}}</span>
        </div>
      </div>
    </div>
    <div class="bar-chart-wrap" v-if="hasData">
      <mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleInit" ref="echarts" />
    </div>
    <div class="price-trend-wrap" v-if="hasData">
      <div class="trend-title">
        价格分析
        <span>航班起飞{{flightInfo.dateStr}}</span>
      </div>
      <div class="trend-list">
        {{trendText}}
      </div>
    </div>
    <div class="no-data" v-if="!hasData">
      没有查询到数据
    </div>
    <time-dialog :show="showTimeDialog" @selectedTime="confirmTime" @closeTimeBox="closeTimePopup" @updateData="updateData" ref="timeBox"/>
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import timeDialog from '@/components/time-dialog'
import * as echarts from '@/../static/lib/echarts.min.js'
import mpvueEcharts from 'mpvue-echarts'
import Dialog from '@/../static/vant/dialog/dialog'
import {mapState, mapMutations} from 'vuex'

let chart = null

export default {
  data () {
    return {
      hasData: false,
      showTimeDialog: false,
      flightInfo: {
        flightNumber: '',
        departureTime: '',
        departureCity: '',
        arrivalCity: '',
        lowestPrice: 0,
        futureLowestPrice: 0,
        actionFlag: 0,
        dateStr: '',
        departureDate: '',
        futureLowestPriceDate: 0
      },
      favoriteStatus: 0,
      echarts,
      dataAxis: [],
      chartOpt: null,
      suggestText: ['建议购买', '建议等等'],
      cvalue: '',
      dataVal: [],
      trendText: ''
    }
  },
  components: {
    noticeBar,
    timeDialog,
    mpvueEcharts
  },
  computed: {
    ...mapState([
      'detail_date',
      'userInfo'
    ]),
    suggestion () {
      return this.flightInfo.actionFlag
    },
    suggestionDesc () {
      if (this.flightInfo.lowestPrice > this.flightInfo.futureLowestPrice) {
        return '价格会下降,' + this.flightInfo.departureCity + '-' + this.flightInfo.arrivalCity + '价格会下降'
      } else {
        return '价格会上升,' + this.flightInfo.departureCity + '-' + this.flightInfo.arrivalCity + '价格会上升'
      }
    },
    priceRange () {
      return Math.abs(this.flightInfo.lowestPrice - this.flightInfo.futureLowestPrice)
    }
  },
  methods: {
    ...mapMutations({
      setDetailDate: 'SET_DETAIL_DATE'
    }),
    gotoList () {
      wx.navigateTo({url: '/pages/flightList/main'})
    },
    initChart (canvas, width, height) {
      let _that = this
      this.chartOpt = {
        grid: {
          left: '12%',
          top: '12%',
          right: '5%',
          bottom: '20%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: _that.dataAxis,
          axisLabel: {
            interval: 0,
            inside: false,
            rotate: 45,
            formatter: function (value, index) {
              var date = new Date(value * 1)
              var month = date.getMonth() + 1
              var day = date.getDate()
              var dateStr = month + '月' + day + '日'
              if ((_that.cvalue * 1) === (value * 1)) {
                return '{c|' + dateStr + '}'
              } else {
                return '{a|' + dateStr + '}'
              }
            },
            rich: {
              a: {
                fontSize: 11,
                fontWeight: 'lighter',
                color: '#CBCBCD'
              },
              c: {
                fontSize: 11,
                fontWeight: 'lighter',
                color: '#ED6823'
              }
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#999CA9',
            fontSize: 11,
            fontWeight: 'lighter'
          }
        },
        dataZoom: [{
          type: 'inside',
          xAxisIndex: [0],
          startValue: 7,
          endValue: 13
        }],
        series: [{
          data: _that.dataVal,
          type: 'line',
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: 'rgb(40, 126, 227)'
            }
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(115, 165, 248, 0.1)' // 0% 处的颜色
              },
              {
                offset: 1, color: 'rgba(115, 165, 248, 1)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          lineStyle: {
            color: 'rgb(40, 126, 227)'
          },
          label: {
            show: false,
            position: 'top',
            distance: 3,
            formatter: '¥{c}',
            fontSize: 11,
            fontWeight: 'lighter',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 4
          }
        }]
      }

      // this.$refs.echarts.init()
    },
    handleInit (canvas, width, height) {
      var _that = this
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      chart.setOption(this.chartOpt)
      chart.on('click', function (params) {
        _that.cvalue = params.name
        let _startValue = 0
        let _endValue = 0
        if (params.dataIndex <= parseInt(_that.dataAxis.length / 2)) {
          _startValue = params.dataIndex - 3 > 0 ? params.dataIndex - 3 : 0
          _endValue = _startValue + 6
        } else {
          _endValue = params.dataIndex + 3 > (_that.dataAxis.length - 1) ? (_that.dataAxis.length - 1) : params.dataIndex + 3
          _startValue = _endValue - 6
        }
        _that.chartOpt.dataZoom[0].startValue = _startValue
        _that.chartOpt.dataZoom[0].endValue = _endValue
        if (_that.dataVal.length > 0) {
          let _tpl = []
          _that.dataVal.forEach(function (v, i) {
            if ((v.value * 1) === (params.value * 1)) {
              _tpl.push({
                value: v.value,
                label: {
                  show: true
                }
              })
            } else {
              _tpl.push({
                value: v.value,
                label: {
                  show: false
                }
              })
            }
          })
          _that.dataVal = _tpl
        }
        _that.chartOpt.series[0].data = _that.dataVal
        chart.setOption(_that.chartOpt, true)
      })
      return chart
    },
    showTimeFilter () {
      if (!chart._disposed) {
        chart.clear()
        chart.dispose()
      }
      this.showTimeDialog = true
    },
    confirmTime (_obj) {
      console.log(_obj.startTime)
      console.log(_obj.endTime)
    },
    closeTimePopup () {
      this.showTimeDialog = false
      setTimeout(() => {
        this.initChart()
        this.$refs.echarts.init()
      }, 100)
    },
    updateData () {
      if (!chart._disposed) {
        chart.clear()
        chart.dispose()
      }
      this.showTimeDialog = false
      this.$fly.all([this.getDetailData()]).then(this.$fly.spread((records, project) => {
        if (this.hasData) {
          this.initChart()
          this.$refs.echarts.init()
        }
      }))
    },
    getDetailData () {
      return this.$fly.post('/flightData/getSearchDetailData', {
        departureCityCode: this.detail_date.departureCityCode,
        arrivalCityCode: this.detail_date.arrivalCityCode,
        departureDate: this.detail_date.departureDate,
        timeSlotList: this.detail_date.timeSlotList,
        companyList: this.detail_date.companyList
      }).then(res => {
        if (res.code === '0') {
          if (res.data && res.data.currentData) {
            this.hasData = true
            // 赋值当前数据
            let currData = res.data.currentData
            let _date = new Date(currData.departureDate)
            let _obj = {
              flightNumber: currData.flightNumber,
              departureTime: currData.departureTime,
              departureCity: currData.departureCity,
              arrivalCity: currData.arrivalCity,
              lowestPrice: (currData.lowestPrice * 1),
              futureLowestPrice: (currData.futureLowestPrice * 1),
              actionFlag: (currData.actionFlag * 1),
              dateStr: `${(_date.getMonth() + 1)}月${_date.getDate()}日`,
              departureDate: currData.departureDate,
              futureLowestPriceDate: (currData.futureLowestPriceDate * 1)
            }
            this.flightInfo = {...this.flightInfo, ..._obj}

            // 设置title
            wx.setNavigationBarTitle({
              title: `${this.flightInfo.departureCity} - ${this.flightInfo.arrivalCity}`
            })

            // 设置趋势分析
            this.setTrend()

            // 匹配关注
            this.checkFavorite()

            // 获取航空公司
            this.$refs.timeBox.getCompanyList()
          }

          if (res.data && res.data.list && res.data.list.length > 0) {
            // 赋值chart
            this.dataAxis = []
            this.dataVal = []
            res.data.list.forEach((v, i) => {
              this.dataAxis.push(new Date(v.departureDate).getTime())
              if (i < res.data.list.length - 1) {
                this.dataVal.push({
                  value: v.lowestPrice,
                  show: false
                })
              } else {
                this.dataVal.push({
                  value: v.lowestPrice,
                  show: true
                })
              }
            })
            this.cvalue = this.dataAxis[(this.dataAxis.length - 1)]
          }

          if (!res.data.currentData || res.data.list.length === 0) {
            this.hasData = false
            wx.showToast({
              title: '没有对应的数据',
              icon: 'none'
            })

            let _obj = {
              flightNumber: '',
              departureTime: '',
              departureCity: '',
              arrivalCity: '',
              lowestPrice: 0,
              futureLowestPrice: 0,
              actionFlag: 0,
              dateStr: `--月--日`,
              departureDate: '',
              futureLowestPriceDate: 0
            }
            this.flightInfo = {...this.flightInfo, ..._obj}

            // 设置趋势分析
            this.setTrend()

            // 设置title
            wx.setNavigationBarTitle({
              title: `${this.flightInfo.departureCity} - ${this.flightInfo.arrivalCity}`
            })
          }
        }
      }).catch(err => {
        console.log(err)
        Dialog.alert({
          title: '',
          message: err
        })
        wx.showToast({
          title: '网络不给力，请稍后再试',
          icon: 'none'
        })
      })
    },
    setTrend () {
      this.trendText = ''
      if (this.hasData) {
        let dateVal = this.flightInfo.departureDate
        let futureDate = this.flightInfo.futureLowestPriceDate
        let _date = new Date(dateVal)
        let _future = new Date(new Date(dateVal).setDate(_date.getDate() + futureDate))
        let _price = this.flightInfo.lowestPrice - this.flightInfo.futureLowestPrice
        let _dateStr = `${_future.getMonth() + 1}月${_future.getDate()}日`
        if (_price < 0) {
          this.trendText += `今天到${_dateStr}，价格逐步上涨，预计${_dateStr}会上涨到${this.flightInfo.futureLowestPrice}左右，比今天贵${Math.abs(_price)}`
        } else if (_price > 0) {
          this.trendText += `今天到${_dateStr}，价格逐步下跌，预计${_dateStr}会下降至${this.flightInfo.futureLowestPrice}左右，比今天省${Math.abs(_price)}`
        } else {
          this.trendText += `今天到${_dateStr}，价格持平`
        }
      } else {
        this.trendText = ''
      }
    },
    checkFavorite () {
      // 查询是否已关注
      this.$fly.post('/attention/isAttention', {
        openid: this.userInfo.openid,
        departureCityCode: this.detail_date.departureCityCode,
        arrivalCityCode: this.detail_date.arrivalCityCode,
        departureTime: this.flightInfo.departureTime,
        flightNumber: this.flightInfo.flightNumber
      }).then(res => {
        if (res.code === '0') {
          this.favoriteStatus = res.data * 1
        }
      }).catch(err => {
        console.log(err)
      })
    },
    gotoFavoriteList () {
      if (this.userInfo.isRegister) {
        wx.navigateTo({url: '/pages/interest/main'})
      } else {
        Dialog.alert({
          title: '',
          message: '检测到您尚未登录，如需要查看关注列表，请先登录'
        }).then(() => {
          wx.navigateTo('/pages/user/main')
        })
      }
    },
    addFavorite () {
      this.$fly.post('/attention/add', {
        openid: this.userInfo.openid,
        departureCityCode: this.detail_date.departureCityCode,
        arrivalCityCode: this.detail_date.arrivalCityCode,
        departureTime: this.flightInfo.departureTime,
        flightNumber: this.flightInfo.flightNumber,
        lowestPrice: this.flightInfo.lowestPrice
      }).then(res => {
        if (res.code === '0') {
          this.favoriteStatus = 1
          this.$fly.get('/attention/updateNotes')
        } else {
          console.log(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    // 清空filter条件
    this.setDetailDate({
      timeSlotList: [],
      companyList: []
    })

    this.$fly.all([this.getDetailData()]).then(this.$fly.spread((records, project) => {
      if (this.hasData) {
        // 初始化chart控件
        this.initChart()
        this.$refs.echarts.init()
      }
    }))
  },
  created () {
    // let app = getApp()
  },
  onPullDownRefresh () {
    wx.showNavigationBarLoading()
    this.$fly.all([this.getDetailData()]).then(this.$fly.spread((records, project) => {
      if (this.hasData) {
        this.initChart()
        this.$refs.echarts.init()
      }
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }))
  }
}
</script>

<style scoped>
.content{
  background: #f5f5f5;
  height: 100%;
}
.detail-wrap{
  width: 100%;
}
.info-wrap{
  width: 90%;
  margin: 20rpx auto 0 auto;
  height: 300rpx;
  background: #fff;
  border-radius: 20rpx;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  
}
.price-show{
  width: 100%;
  text-align: center;
  font-size: 52rpx;
}
.price-desc{
  width: 100%;
  text-align: center;
  font-size: 22rpx;
  color: #66666e;
}
.buy-btn{
  height: 70rpx;
  background: #2065ff;
  color: #fff;
  line-height: 70rpx;
  border-radius: 50rpx;
  width: 50%;
  margin: 20rpx auto 10rpx auto;
  font-size: 30rpx;
}
.favorit-link{
  color: #4680f6;
  font-size: 26rpx;
  text-decoration: underline;
}
.forecast-wrap{
  margin-top: 30rpx;
  background: #fff;
  height: 80rpx;
  padding: 16rpx 40rpx;
}
.forecast-title{
  position: relative;
  float: left;
  padding-left: 30rpx;
  font-size: 30rpx;
  color: #33333e;
}
.forecast-title:before{
  content: " ";
  display: block;
  height: 90%;
  width: 14rpx;
  position: absolute;
  left: 0;
  top: 5rpx;
  background: #5281EE;
}
.suggest-content{
  float: right;
  font-size: 30rpx;
}
.suggest-desc{
  margin-top: 6rpx;
  font-size: 24rpx;
  text-align: right;
  color: #99999E;
}
.red-text{
  color: #ED6400;
}
.green-text{
  color: green;
}
.chart-show{
  width: 100%;
  height: 100%;
}
.bar-chart-wrap{
  width: 100%;
  height: 376rpx;
  background: #fff;
  margin-top: 30rpx;
}
.price-trend-wrap{
  margin-top: 30rpx;
  padding-left: 20rpx;
  background: #fff;
}
.trend-title{
  height: 80rpx;
  line-height: 80rpx;
  color: #33333e;
  font-size: 28rpx;
  border-bottom: 2rpx solid #EAEAEB;
}
.trend-title span{
  font-size: 24rpx;
  color: #808086;
}
.trend-list{
  font-size: 28rpx;
  color: #5F5F64;
  padding: 10rpx 0;
}
.trend-list .list-item{
  height: 50rpx;
  line-height: 50rpx;
}
.no-data{
  margin-top: 30rpx;
  color: #ccc;
  font-size: 30rpx;
  text-align: center;
}
</style>
