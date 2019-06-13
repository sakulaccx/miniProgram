<template>
  <div class="content">
    <notice-bar @showTimeBox="showTimeFilter" />
    <favorite-bar />
    <div class="flight-info-wrap">
      <div class="curr-price">
        <div class="price-show">￥{{flightInfo.currPrice}}</div>
        <div class="date-show">{{flightInfo.date}}机票价格</div>
      </div>
      <div class="middle-line"></div>
      <div class="expect-price">
        <div :class="['price-show', 'iconfont', {'green-price icon-downarrow-after': checkPrice < 0, 'red-price icon-uparrow-after': checkPrice > 0}]">￥{{flightInfo.expectPrice}}</div>
        <div class="expect-text">预计达到价格</div>
      </div>
    </div>
    <div class="bar-chart-wrap">
      <mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleInit" ref="echarts" />
    </div>
    <div class="btn detail-btn" @click="gotoDetail">查看详情</div>
    <time-dialog :show="showTimeDialog" @selectedTime="confirmTime" @closeTimeBox="closeTimePopup" />
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import favoriteBar from '@/components/favorite-bar'
import timeDialog from '@/components/time-dialog'
import * as echarts from '../../../static/lib/echarts.min.js'
import mpvueEcharts from 'mpvue-echarts'

let chart = null
let pvalue = ''

export default {
  data () {
    return {
      pagename: '搜索页面',
      showTimeDialog: false,
      flightInfo: {
        currPrice: 700,
        expectPrice: 200,
        date: '4月1日'
      },
      echarts,
      dataAxis: [],
      chartOpt: null
    }
  },

  components: {
    noticeBar,
    favoriteBar,
    timeDialog,
    mpvueEcharts
  },
  computed: {
    checkPrice () {
      return this.flightInfo.expectPrice - this.flightInfo.currPrice
    }
  },
  methods: {
    gotoDetail () {
      console.log('go to detail page')
    },
    initChart (canvas, width, height) {
      this.dataAxis = [1559664000, 1559750400, 1559836800, 1559923200, 1560009600, 1560096000, 1560182400, 1560268800, 1560355200, 1560441600, 1560528000]
      let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 313]
      let yMax = Math.max(...data)
      let dataShadow = []
      let weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

      for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax + 200)
      }

      this.chartOpt = {
        grid: {
          left: '5%',
          top: '8%',
          right: '5%',
          bottom: '20%'
        },
        xAxis: {
          data: this.dataAxis,
          axisLabel: {
            interval: 0,
            inside: false,
            textStyle: {
              color: '#42434D'
            },
            formatter: function (value, index) {
              var date = new Date(value * 1000)
              var month = date.getMonth() + 1
              var day = date.getDate()
              var weekday = weekdays[date.getDay()]
              var dateStr = month + '月' + day + '日'
              if (pvalue === value) {
                return [
                  '{a|' + dateStr + '}',
                  '{b|' + weekday + '}'
                ].join('\n')
              } else {
                return [
                  '{c|' + dateStr + '}',
                  '{d|' + weekday + '}'
                ].join('\n')
              }
            },
            rich: {
              a: {
                fontSize: 11,
                color: '#EC624C'
              },
              b: {
                fontSize: 12,
                lineHeight: 18,
                color: '#EC624C'
              },
              c: {
                fontSize: 11
              },
              d: {
                fontSize: 12,
                lineHeight: 18
              }
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          show: false
        },
        dataZoom: [{
          type: 'inside',
          xAxisIndex: [0],
          startValue: 2,
          endValue: 8
        }],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              normal: { color: '#F8F9FC' }
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
          },
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                var key = params.name
                if (key === pvalue) {
                  return '{a|¥' + params.value + '}'
                } else {
                  return '{b|¥' + params.value + '}'
                }
              },
              rich: {
                a: {
                  color: '#EB5B3E'
                },
                b: {
                  color: '#42434D'
                }
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var key = params.name
                  if (key === pvalue) {
                    return '#2b6cff'
                  } else {
                    return '#e3effc'
                  }
                }
              }
            },
            markLine: {
              silent: true,
              symbol: 'none',
              data: [
                {
                  yAxis: yMax
                }
              ],
              label: {
                show: false
              },
              lineStyle: {
                color: '#ff6c58'
              }
            },
            data: data
          }
        ]
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
        pvalue = params.name
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
        chart.setOption(_that.chartOpt, true)
      })
      return chart
    },
    showTimeFilter () {
      this.showTimeDialog = true
    },
    confirmTime (_obj) {
      console.log(_obj.startTime)
      console.log(_obj.endTime)
    },
    closeTimePopup () {
      this.showTimeDialog = false
    }
  },
  mounted () {
    pvalue = '1560096000'
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
.flight-info-wrap{
  background: #fff;
  width: 90%;
  height: 240rpx;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  margin: 20rpx auto 0 auto;
}
.curr-price,
.expect-price{
  padding: 30rpx 50rpx;
}
.price-show{
  font-size: 52rpx;
}
.date-show,
.expect-text{
  font-size: 24rpx;
  color: #66666e;
  text-align: center;
}
.green-price{
  color: #07d428;
}
.red-price{
  color: #ff320b;
}
.middle-line{
  height: 42%;
  border-left: 1px solid #f5f5f5;
}
.bar-chart-wrap{
  width: 100%;
  height: 376rpx;
  background: #fff;
  margin-top: 30rpx;
}
.detail-btn{
  margin: 60rpx auto 0 auto;
  background: #2065ff;
  width: 90%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
  border-radius: 44rpx;
  overflow: hidden;
  overflow-x: auto;
}
.chart-show{
  width: 100%;
  height: 100%;
}
</style>
