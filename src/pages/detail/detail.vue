<template>
  <div class="content">
    <notice-bar @showTimeBox="showTimeFilter" />
    <div class="detail-wrap">
      <div class="info-wrap">
        <div class="price-show">￥{{flightInfo.currPrice}}</div>
        <div class="price-desc">{{flightInfo.date}}机票价格</div>
        <div class="btn buy-btn" @click="gotoList">现在就买</div>
        <div class="favorit-link" v-if="!isfavorited">添加关注，提醒我购票</div>
      </div>
      <div class="forecast-wrap">
        <div class="forecast-title">{{flightInfo.date}}机票价格</div>
        <div class="suggest-content" :class="suggestion ? 'red-text' : 'green-text'">{{suggestText[suggestion]}}</div>
        <div class="clearfix"></div>
        <div class="suggest-desc">
          {{suggestionDesc}}
          <span :class="suggestion ? 'red-text' : 'green-text'">¥{{priceRange}}</span>
        </div>
      </div>
    </div>
    <div class="bar-chart-wrap">
      <mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleInit" ref="echarts" />
    </div>
    <div class="price-trend-wrap">
      <div class="trend-title">
        价格分析
        <span>航班起飞{{flightInfo.date}}</span>
      </div>
      <div class="trend-list">
        <div class="list-item" v-for="(item, index) in trendList" :key="index">
          {{item.date}} {{item.trend === 'up' ? trendOrder[index] + '价格呈上升趋势, 高至¥' : trendOrder[index] + '价格呈下降趋势, 低至¥'}}{{item.price}};
        </div>
      </div>
    </div>
    <time-dialog :show="showTimeDialog" @selectedTime="confirmTime" @closeTimeBox="closeTimePopup" />
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import timeDialog from '@/components/time-dialog'
import * as echarts from '../../../static/lib/echarts.min.js'
import mpvueEcharts from 'mpvue-echarts'
import {mapState} from 'vuex'

let chart = null

export default {
  data () {
    return {
      showTimeDialog: false,
      flightInfo: {
        currPrice: 700,
        expectPrice: 800,
        date: '4月1日'
      },
      echarts,
      dataAxis: [],
      chartOpt: null,
      suggestText: ['建议等等', '建议购买'],
      cvalue: '',
      dataVal: [],
      trendList: [],
      trendOrder: ['前', '后']
    }
  },

  components: {
    noticeBar,
    timeDialog,
    mpvueEcharts
  },
  computed: {
    ...mapState([
      'search_history',
      'depart_date'
    ]),
    suggestion () {
      if (this.flightInfo.currPrice > this.flightInfo.expectPrice) {
        return 0
      } else {
        return 1
      }
    },
    suggestionDesc () {
      if (this.flightInfo.currPrice > this.flightInfo.expectPrice) {
        return '价格会下降,' + this.depart_date.from_str + '-' + this.depart_date.target_str + '价格会下降'
      } else {
        return '价格会上升,' + this.depart_date.from_str + '-' + this.depart_date.target_str + '价格会上升'
      }
    },
    priceRange () {
      if (this.flightInfo.currPrice > this.flightInfo.expectPrice) {
        return (this.flightInfo.currPrice - this.flightInfo.expectPrice)
      } else {
        return (this.flightInfo.expectPrice - this.flightInfo.currPrice)
      }
    },
    showTrend (o) {
      return function (o) {
        if (o.trend === 'up') {
          // return o.date + '前价格呈上升趋势, 高至¥' + o.price
          return 1
        } else {
          // return o.date + '后价格呈下降趋势, 低至¥' + o.price
          return 2
        }
      }
    }
  },
  methods: {
    gotoList () {
      wx.navigateTo({url: '../flightList/main'})
    },
    initChart (canvas, width, height) {
      let _that = this

      this.dataAxis.forEach(function (v, i) {
        if (i < (_that.dataAxis.length - 1)) {
          _that.dataVal.push({
            value: Math.floor(Math.random() * (3000 - 500 + 1)) + 500,
            label: {
              show: false
            }
          })
        } else {
          _that.dataVal.push({
            value: Math.floor(Math.random() * (3000 - 500 + 1)) + 500,
            label: {
              show: true
            }
          })
        }
      })

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

      this.$refs.echarts.init()
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
      this.showTimeDialog = true
      // chart.clear()
    },
    confirmTime (_obj) {
      console.log(_obj.startTime)
      console.log(_obj.endTime)
    },
    closeTimePopup () {
      this.showTimeDialog = false
      // chart.setOption(this.chartOpt)
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: `${this.depart_date.from_str} - ${this.depart_date.target_str}`
    })

    // 定义假数据
    this.trendList = [
      {
        date: '5-1',
        price: '1000',
        trend: 'up'
      },
      {
        date: '5-11',
        price: '300',
        trend: 'down'
      }
    ]

    // chart数据
    let ff = []
    for (let i = 14; i > 0; i--) {
      let currdate = new Date()
      let before = new Date(currdate.setDate(i))
      ff.push(before.getTime())
    }
    this.dataAxis = ff.reverse()
    this.cvalue = this.dataAxis[(this.dataAxis.length - 1)]

    // 初始化chart
    this.initChart()
  },
  created () {
    // let app = getApp()
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
</style>
