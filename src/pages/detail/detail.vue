<template>
  <div class="content">
    <notice-bar @showTimeBox="showTimeFilter" />
    <div class="detail-wrap">
      <div class="info-wrap">
        <div class="price-show">￥{{flightInfo.currPrice}}</div>
        <div class="price-desc">{{flightInfo.date}}机票价格</div>
        <div class="btn buy-btn">现在就买</div>
        <div class="favorit-link" v-if="!isfavorited">添加关注，提醒我购票</div>
      </div>
      <div class="forecast-wrap">
        <div class="forecast-title">111</div>
        <div class="suggest-content"></div>
        <div class="clearfix"></div>
        <div class="suggest-desc"></div>
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
let pvalue = ''

export default {
  data () {
    return {
      showTimeDialog: false,
      flightInfo: {
        currPrice: 700,
        date: '4月1日'
      },
      echarts,
      dataAxis: [],
      chartOpt: null
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
    ])
  },
  methods: {
    gotoList () {
      console.log('go to list page')
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
          }
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
    pvalue = '1560096000'
    // this.initChart()
    wx.setNavigationBarTitle({
      title: `${this.depart_date.from_str} - ${this.depart_date.target_str}`
    })
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
  padding: 20rpx 40rpx;
}
.forecast-title{
  position: relative;
  float: left;
  padding-left: 40rpx;
  font-size: 30rpx;
  color: #33333e;
}
.forecast-title:before{
  content: " ";
  display: block;
  height: 90%;
  width: 16rpx;
  position: absolute;
  left: 0;
  top: 5rpx;
  background: #7796E3;
  border-radius: 5rpx;
}
.suggest-content{
  float: right;
}
.chart-show{
  width: 100%;
  height: 100%;
}
</style>
