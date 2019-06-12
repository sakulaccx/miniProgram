<template>
  <div class="content">
    <notice-bar />
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
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import favoriteBar from '@/components/favorite-bar'
import * as echarts from '../../../static/lib/echarts.min.js'
import mpvueEcharts from 'mpvue-echarts'

let chart = null

// function initChart (canvas, width, height) {
//   var option = {
//     grid: {
//       left: '5%',
//       top: '8%',
//       right: '5%',
//       bottom: '20%'
//     },
//     xAxis: {
//       data: dataAxis,
//       axisLabel: {
//         interval: 0,
//         inside: false,
//         textStyle: {
//           color: '#42434D'
//         },
//         formatter: function (value, index) {
//           var currdate = new Date()
//           var timestrip = new Date(currdate.getFullYear(), currdate.getMonth(), currdate.getDate()).getTime() / 1000
//           var date = new Date(value * 1000)
//           var month = date.getMonth() + 1
//           var day = date.getDate()
//           var weekday = weekdays[date.getDay()]
//           var dateStr = month + '月' + day + '日'
//           if (timestrip === value) {
//             return [
//               '{a|' + dateStr + '}',
//               '{b|' + weekday + '}'
//             ].join('\n')
//           } else {
//             return [
//               '{c|' + dateStr + '}',
//               '{d|' + weekday + '}'
//             ].join('\n')
//           }
//         },
//         rich: {
//           a: {
//             fontSize: 11,
//             color: '#EC624C'
//           },
//           b: {
//             fontSize: 12,
//             lineHeight: 18,
//             color: '#EC624C'
//           },
//           c: {
//             fontSize: 11
//           },
//           d: {
//             fontSize: 12,
//             lineHeight: 18
//           }
//         }
//       },
//       axisTick: {
//         show: false
//       },
//       axisLine: {
//         show: false
//       },
//       z: 10
//     },
//     yAxis: {
//       show: false
//     },
//     dataZoom: [{
//       type: 'inside',
//       xAxisIndex: [0],
//       start: 40,
//       end: 90
//     }],
//     series: [
//       { // For shadow
//         type: 'bar',
//         itemStyle: {
//           normal: { color: '#F8F9FC' }
//         },
//         barGap: '-100%',
//         barCategoryGap: '40%',
//         data: dataShadow,
//         animation: false
//       },
//       {
//         type: 'bar',
//         label: {
//           show: true,
//           position: 'top',
//           formatter: function (params) {
//             var date = new Date()
//             var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000
//             return (timestrip === dataAxis[params.dataIndex]) ? '{a|¥' + params.value + '}' : '{b|¥' + params.value + '}'
//           },
//           rich: {
//             a: {
//               color: '#EB5B3E'
//             },
//             b: {
//               color: '#42434D'
//             }
//           }
//         },
//         itemStyle: {
//           normal: {
//             color: function (params) {
//               var date = new Date()
//               var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000
//               return (timestrip === dataAxis[params.dataIndex]) ? 'rgb(58, 111, 246)' : 'rgb(229, 239, 251)'
//             }
//           }
//         },
//         emphasis: {
//           label: {
//             show: true,
//             position: 'top',
//             formatter: '¥{c}',
//             color: '#42434D'
//           },
//           itemStyle: {
//             color: function (params) {
//               var date = new Date()
//               var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000
//               return (timestrip === dataAxis[params.dataIndex]) ? 'rgb(58, 111, 246)' : 'rgb(229, 239, 251)'
//             }
//           }
//         },
//         data: data
//       }
//     ]
//   }

//   chart = echarts.init(canvas, null, {
//     width: width,
//     height: height
//   })
//   canvas.setChart(chart)
//   chart.setOption(option)

//   return chart
// }
export default {
  data () {
    return {
      pagename: '搜索页面',
      flightInfo: {
        currPrice: 700,
        expectPrice: 200,
        date: '4月1日'
      },
      echarts,
      chartOpt: null
    }
  },

  components: {
    noticeBar,
    favoriteBar,
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
      let dataAxis = [1559664000, 1559750400, 1559836800, 1559923200, 1560009600, 1560096000, 1560182400, 1560268800, 1560355200, 1560441600, 1560528000]
      let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 313]
      let yMax = 500
      let dataShadow = []
      let weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

      for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax)
      }

      this.chartOpt = {
        grid: {
          left: '5%',
          top: '8%',
          right: '5%',
          bottom: '20%'
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            interval: 0,
            inside: false,
            textStyle: {
              color: '#42434D'
            },
            formatter: function (value, index) {
              var currdate = new Date()
              var timestrip = new Date(currdate.getFullYear(), currdate.getMonth(), currdate.getDate()).getTime() / 1000
              var date = new Date(value * 1000)
              var month = date.getMonth() + 1
              var day = date.getDate()
              var weekday = weekdays[date.getDay()]
              var dateStr = month + '月' + day + '日'
              if (timestrip === value) {
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
          start: 40,
          end: 90
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
                var date = new Date()
                var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000
                return (timestrip === dataAxis[params.dataIndex]) ? '{a|¥' + params.value + '}' : '{b|¥' + params.value + '}'
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
                  var date = new Date()
                  var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000
                  return (timestrip === dataAxis[params.dataIndex]) ? 'rgb(58, 111, 246)' : 'rgb(229, 239, 251)'
                }
              }
            },
            emphasis: {
              label: {
                show: true,
                position: 'top',
                formatter: '¥{c}',
                color: '#42434D'
              },
              itemStyle: {
                color: function (params) {
                  var date = new Date()
                  var timestrip = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000
                  return (timestrip === dataAxis[params.dataIndex]) ? 'rgb(58, 111, 246)' : 'rgb(229, 239, 251)'
                }
              }
            },
            data: data
          }
        ]
      }

      this.$refs.echarts.init()
      // chart = echarts.init(canvas, null, {
      //   width: width,
      //   height: height
      // })
      // canvas.setChart(chart)
      // chart.setOption(option)

      // return chart
    },
    handleInit (canvas, width, height) {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      chart.setOption(this.chartOpt)
      chart.on('click', function (params) {
        console.log(params)
      })
      return chart
    }
  },
  mounted () {
    this.initChart()
    console.log(this.$refs.echarts)
  },
  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.content{
  background: #f5f5f5;
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
  margin: 30rpx auto 0 auto;
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
